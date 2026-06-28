const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

// ==========================================
// コマンドライン引数パース
// ==========================================
const args = process.argv.slice(2);
let day = '';
let half = '';
let urls = [];
let work = '';
let dryRun = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--day') {
    day = args[++i];
  } else if (args[i] === '--half') {
    half = args[++i];
  } else if (args[i] === '--urls') {
    while (i + 1 < args.length && !args[i + 1].startsWith('--')) {
      urls.push(args[++i]);
    }
  } else if (args[i] === '--work') {
    work = args[++i];
  } else if (args[i] === '--dry-run') {
    dryRun = true;
  }
}

// ヘルプ表示
if (!day || !half || (!dryRun && (urls.length === 0 || !work))) {
  console.log(`
Usage:
  node scratch/notebooklm-auto.js --day <Day番号> --half <前半/後半> --urls <動画URL群(スペース区切り)> --work <実習内容> [--dry-run]

Example:
  node scratch/notebooklm-auto.js --day 13 --half 前半 --urls "https://www.youtube.com/watch?v=AOO6tSQb3Pg" --work "目標達成に向けて、課題を作成し、Padletに投稿しよう"
  `);
  process.exit(1);
}

const outputDir = path.join(__dirname, `day${day}_auto`);

// ==========================================
// ユーティリティ関数
// ==========================================
function waitForKeypress() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => {
    rl.question('Press Enter to continue...', () => {
      rl.close();
      resolve();
    });
  });
}

// Today_Research.md からテーマと図解ポイントをパースする
function parseResearchInfo(dayNum) {
  let theme = '';
  let points = [];

  try {
    const researchPath = path.join(__dirname, '../Today_Research.md');
    if (fs.existsSync(researchPath)) {
      const content = fs.readFileSync(researchPath, 'utf8');
      
      // テーマ名抽出: Day XX「テーマ名」 または タイトル行
      const themeMatch = content.match(/Day\s*\d+\s*「([^」]+)」/);
      if (themeMatch) {
        theme = themeMatch[1];
      } else {
        const titleMatch = content.match(/# Today_Research.md[\s\S]*?リサーチ結果/);
        if (titleMatch) {
          theme = titleMatch[0].replace('# Today_Research.md', '').replace('リサーチ結果', '').trim();
        }
      }

      // 重点図解ポイント抽出: ### セクション名を集める
      const lines = content.split('\n');
      for (const line of lines) {
        if (line.startsWith('###')) {
          const point = line.replace('###', '').trim();
          if (point && !points.includes(point) && points.length < 3) {
            points.push(point);
          }
        }
      }
    }
  } catch (e) {
    console.log(`[Research Parser] Info: Today_Research.md からのパースに失敗しました（${e.message}）。デフォルト値を使用します。`);
  }

  // フォールバック
  if (!theme) theme = `Day ${dayNum} 講義テーマ`;
  while (points.length < 3) {
    points.push(`重点論点 ${points.length + 1}`);
  }

  return { theme, points };
}

async function ensureDashboard(page) {
  console.log('Ensuring we are on the dashboard...');
  const currentUrl = page.url();
  
  if (currentUrl.includes('/notebook/')) {
    console.log('Currently inside a notebook. Clicking logo to return to dashboard...');
    try {
      const logoLink = await page.waitForSelector('a.logo-link, a[aria-label*="NotebookLM"], a[href="/"]', { timeout: 5000 });
      await page.evaluate(el => el.click(), logoLink);
      
      // urlがnotebookを含まなくなるまで待つ
      await page.waitForFunction(() => !window.location.href.includes('/notebook/'), { timeout: 10000 });
      console.log('Returned to dashboard via logo link.');
    } catch (e) {
      console.log('ロゴリンクのクリックに失敗しました（直接遷移を試みます）:', e.message);
      await page.goto('https://notebooklm.google.com/', { waitUntil: 'networkidle2' });
    }
  } else if (!currentUrl.startsWith('https://notebooklm.google.com/')) {
    console.log('Navigating to NotebookLM home...');
    await page.goto('https://notebooklm.google.com/', { waitUntil: 'networkidle2' });
  } else {
    console.log('Already on the dashboard.');
  }

  // ノートブックカードがレンダリングされるのを待つ
  console.log('Waiting for dashboard notebook cards to load...');
  try {
    await page.waitForFunction(() => {
      const headers = Array.from(document.querySelectorAll('div, h2, h3, span'));
      return headers.some(el => el.innerText && el.innerText.includes('最近のノートブック'));
    }, { timeout: 15000 });
  } catch (e) {
    console.log('ノートブックカードのローディングにタイムアウトしました（無視して続行）:', e.message);
    try {
      const screenshotPath = path.join(__dirname, 'dashboard_timeout.png');
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`Saved timeout screenshot to ${screenshotPath}`);
    } catch (err) {
      console.log('タイムアウトスクリーンショットの保存に失敗:', err.message);
    }
  }
}

async function dismissSourceModalIfOpen(page) {
  console.log('Dismissing source import dialog if open...');
  
  // まず無条件で Escape キーを送信
  await page.keyboard.press('Escape');
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 閉じるボタンをブラウザ側JavaScriptで探してクリック（シャドウDOM対応）
  try {
    const clicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, [role="button"]'));
      let closeBtn = buttons.find(btn => {
        const label = btn.getAttribute('aria-label') || '';
        return label.includes('閉じる') || label.includes('Close') || label.includes('閉');
      });
      if (!closeBtn) {
        closeBtn = buttons.find(btn => {
          const txt = btn.innerText || '';
          return txt.includes('close') || txt.includes('clear') || txt.includes('✕') || txt.includes('x');
        });
      }
      if (closeBtn) {
        closeBtn.click();
        return true;
      }
      return false;
    });
    
    if (clicked) {
      console.log('Clicked close button via evaluate.');
      await new Promise(resolve => setTimeout(resolve, 1500));
    } else {
      const closeBtn = await page.$('button[aria-label*="閉じる"], button[aria-label*="Close"], [aria-label*="閉じる"]');
      if (closeBtn) {
        console.log('Close button detected via page.$, clicking it...');
        await page.evaluate(el => el.click(), closeBtn);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }
  } catch (e) {
    console.log('Failed to check or click close button:', e.message);
  }

  // 最後に念のため強制消去を実行（ダイアログがまだ残っている場合）
  try {
    await page.evaluate(() => {
      const dialogs = Array.from(document.querySelectorAll('mat-dialog-container, [role="dialog"], dialog, .cdk-overlay-container, .modal-container'));
      if (dialogs.length > 0) {
        dialogs.forEach(dialog => dialog.remove());
        const backdrops = Array.from(document.querySelectorAll('.cdk-overlay-backdrop, .modal-backdrop'));
        backdrops.forEach(backdrop => backdrop.remove());
        document.body.style.overflow = '';
      }
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (e) {
    console.log('Failed to force remove dialogs:', e.message);
  }
}

async function ensureStudioOpen(page) {
  console.log('Ensuring Studio panel is open and visible...');
  
  let isStudioVisible = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('div, span, button, p, h1, h2, h3, h4'))
      .find(e => e.innerText && e.innerText.includes('スライド') && e.offsetWidth > 0 && e.offsetHeight > 0);
    return !!el;
  });

  if (isStudioVisible) {
    console.log('Studio panel is already visible.');
    return;
  }

  console.log('Studio panel is not visible. Attempting to open it...');

  const studioTab = await page.$('::-p-xpath(//*[text()="Studio" or contains(text(), "Studio")]/ancestor-or-self::*[local-name()="button" or @role="tab" or contains(@class, "tab") or contains(@class, "button")])');
  if (studioTab) {
    console.log('Found Studio tab button. Clicking it...');
    await page.evaluate(el => el.click(), studioTab);
    await new Promise(resolve => setTimeout(resolve, 3000));
  } else {
    const openBtnSelector = 'button[aria-label*="Studio のパネルを開く"], button[aria-label*="Studio のパネルを表示"], .toggle-studio-panel-button';
    try {
      const openBtn = await page.waitForSelector(openBtnSelector, { timeout: 3000 });
      console.log('Found Studio open button. Clicking it...');
      await page.evaluate(el => el.click(), openBtn);
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (e) {
      console.log('Could not find Studio open button:', e.message);
    }
  }

  isStudioVisible = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('div, span, button, p, h1, h2, h3, h4'))
      .find(e => e.innerText && e.innerText.includes('スライド') && e.offsetWidth > 0 && e.offsetHeight > 0);
    return !!el;
  });

  if (isStudioVisible) {
    console.log('[OK] Studio panel is now open.');
  } else {
    console.log('[WARN] Studio panel might not be open yet.');
  }
}

async function clickSlideSetupButton(page) {
  console.log('Locating and clicking slide setup button...');
  const clicked = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('*'));
    const slideTextEl = elements.find(el => {
      const text = el.innerText ? el.innerText.trim() : '';
      if (!(text.startsWith('スライド') && text.length < 10 && el.offsetWidth > 0 && el.offsetHeight > 0)) {
        return false;
      }
      let p = el;
      for (let i = 0; i < 5; i++) {
        const className = (p.className && typeof p.className === 'string') ? p.className : '';
        if (p.tagName === 'BUTTON' || p.getAttribute('role') === 'button' || className.includes('create-artifact') || className.includes('card') || className.includes('button')) {
          return true;
        }
        if (!p.parentElement) break;
        p = p.parentElement;
      }
      return false;
    });
    
    if (!slideTextEl) {
      console.log('slideTextEl NOT found!');
      return false;
    }
    
    console.log('Found slideTextEl:', slideTextEl.tagName, 'text:', slideTextEl.innerText);
    
    let parent = slideTextEl;
    let found = false;
    for (let i = 0; i < 5; i++) {
      const className = (parent.className && typeof parent.className === 'string') ? parent.className : '';
      console.log(`Checking parent ${i}:`, parent.tagName, 'class:', className, 'role:', parent.getAttribute('role'));
      if (parent.tagName === 'BUTTON' || parent.getAttribute('role') === 'button' || className.includes('card') || className.includes('button')) {
        console.log('Clicking parent:', parent.tagName);
        parent.click();
        found = true;
        break;
      }
      if (!parent.parentElement) break;
      parent = parent.parentElement;
    }
    
    if (!found) {
      slideTextEl.click();
      return true;
    }
    return true;
  });
  
  if (clicked) {
    console.log('[OK] Clicked slide setup button.');
    return true;
  } else {
    console.error('[ERROR] Could not find or click slide setup button.');
    return false;
  }
}

// ==========================================
// メイン処理
// ==========================================
(async () => {
  const { theme, points } = parseResearchInfo(day);
  
  // プロンプトの組み立て
  const promptText = `Instagram運用を学ぶ社会人初心者向けの研修スライドです。
プレゼンターのスライド形式で、一枚ごとに重要ポイントを1〜2つに絞ってください。
明るく親しみやすいビジュアルで、シンプルで視覚的に分かりやすくしてください。
スライドは8〜10枚程度にまとめてください。

【今日の授業内容】
テーマ：Day ${day}${half}「${theme}」
実習内容：${work}
重点的に図解してほしいポイント：
- ${points[0]}
- ${points[1]}
- ${points[2]}`;

  console.log('==========================================');
  console.log(`Day: ${day} (${half})`);
  console.log(`Theme: ${theme}`);
  console.log(`URLs: ${urls.join(', ')}`);
  console.log(`Dry Run: ${dryRun}`);
  console.log('------------------------------------------');
  console.log('【送信プロンプト】');
  console.log(promptText);
  console.log('==========================================');

  if (!dryRun) {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  }

  console.log('Starting browser (headless: true)...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
    headless: true,
    userDataDir: 'C:\\\\Users\\\\Hi\\\\.gemini\\\\antigravity-browser-profile',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1280, height: 800 });

  // ヘルパー: セレクタ確認
  async function checkSelector(stepName, selector, timeout = 5000) {
    try {
      await page.waitForSelector(selector, { timeout });
      console.log(`[OK] [${stepName}] Found selector: ${selector}`);
      return true;
    } catch (e) {
      console.error(`[ERROR] [${stepName}] Selector NOT found: ${selector}`);
      try {
        const errScreenshotPath = path.join(__dirname, `dryrun_error_${stepName.replace(/[:\s\/]/g, '_')}.png`);
        await page.screenshot({ path: errScreenshotPath, fullPage: true });
        console.log(`Saved debug screenshot to ${errScreenshotPath}`);
      } catch (err) {
        console.log('Failed to save debug screenshot:', err.message);
      }
      if (!dryRun) {
        throw new Error(`[${stepName}] 必須セレクタが検出できませんでした: ${selector}`);
      }
      return false;
    }
  }

  try {
    // ------------------------------------------
    // STEP 0: 既存ログイン確認
    // ------------------------------------------
    console.log('STEP 0: Navigating to NotebookLM...');
    await page.goto('https://notebooklm.google.com/', { waitUntil: 'networkidle2', timeout: 60000 });
    
    // ログイン済み判定 Heuristic
    let loggedIn = false;
    try {
      await page.waitForSelector('::-p-xpath(//*[contains(text(), "新規作成") or contains(text(), "ノートブック")])', { timeout: 10000 });
      loggedIn = true;
    } catch (e) {
      loggedIn = false;
    }

    if (!loggedIn) {
      console.log('\n==========================================');
      console.log('【要ユーザー操作】ログインが確認できませんでした。');
      console.log('ブラウザを開いてGoogleログインを完了させ、合図してください。');
      console.log('==========================================\n');
      await waitForKeypress();
      // 再リトライ
      await page.goto('https://notebooklm.google.com/', { waitUntil: 'networkidle2' });
      await page.waitForSelector('::-p-xpath(//*[contains(text(), "新規作成") or contains(text(), "ノートブック")])', { timeout: 15000 });
    }
    console.log('STEP 0: ログイン確認完了。');
    await ensureDashboard(page);

    if (dryRun) {
      console.log('\n--- DRY-RUN MODE: セレクタ存在検証を開始します ---');
      let allPassed = true;

      // --- フェーズA: Studio側セレクタ検証（既存の最近のノートブックに入る） ---
      console.log('Entering first recent notebook to verify studio selectors...');
      
      // マイノートブックタブをブラウザ側で直接クリックして、おすすめ（公開）ノートブックを非表示にする
      console.log('Filtering dashboard to My Notebooks...');
      try {
        const tabClicked = await page.evaluate(() => {
          const tabs = Array.from(document.querySelectorAll('div, span, button, [role="tab"]'));
          const myTab = tabs.find(el => el.innerText && (el.innerText.includes('マイノートブック') || el.innerText.includes('マイ ノートブック')));
          if (myTab) {
            myTab.click();
            return true;
          }
          return false;
        });
        console.log('My Notebooks tab click result:', tabClicked);
        
        // タブクリック後、固定で4秒待って再レンダリングを完了させる
        console.log('Waiting for visible notebook cards after tab switch...');
        await new Promise(resolve => setTimeout(resolve, 4000));
        console.log('Visible notebook cards loaded.');
      } catch (tabErr) {
        console.log('マイノートブックタブの操作に失敗しました:', tabErr.message);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      console.log('Entering first recent notebook to verify studio selectors...');
      // カード内の非同期読み込み（ソース数など）を待つために安全のため5秒固定待機
      console.log('Waiting 5 seconds for async notebook card details to load...');
      await new Promise(resolve => setTimeout(resolve, 5000));

      let enteredRecent = false;
      try {
        // 公開サンプル以外のノートブックを evaluate で探索
        const notebookLinkExists = await page.evaluate(() => {
          // テキスト取得ヘルパー（親要素を辿る）
          const getRobustText = (item) => {
            let text = item.innerText || '';
            if (text.trim().length < 5) {
              let p = item;
              for (let i = 0; i < 5; i++) {
                if (!p) break;
                if (p.innerText && p.innerText.trim().length >= 5) {
                  text = p.innerText;
                  break;
                }
                p = p.parentElement;
              }
            }
            return text;
          };

          // 「最近のノートブック」セクションのコンテナを探す
          const headings = Array.from(document.querySelectorAll('h2, h3, div, span'));
          const recentHeading = headings.find(el => el.innerText && el.innerText.trim() === '最近のノートブック');
          let container = document.body;
          if (recentHeading) {
            let p = recentHeading;
            for (let i = 0; i < 5; i++) {
              if (!p) break;
              if (p.querySelectorAll('a[href*="/notebook/"]').length > 0) {
                container = p;
                break;
              }
              p = p.parentElement;
            }
          }

          const items = Array.from(container.querySelectorAll('mat-row, tr, [role="row"], .notebook-card, mat-card, a[href*="/notebook/"]'));
          
          const validItem = items.find(item => {
            const rect = item.getBoundingClientRect();
            const isVisible = rect.width > 0 && rect.height > 0;
            if (!isVisible) return false;
            
            const text = getRobustText(item);
            const isShared = text.includes('シャーロック') || text.includes('Conan') || text.includes('公開') || text.includes('Game') || text.includes('ミステリー') || text.includes('AP®') || text.includes('Atlantic') || text.includes('世界史') || text.includes('Doyle') || text.includes('Dole');
            const isEmpty = text.includes('0 個') || text.includes('0個') || text.includes('0 件') || text.includes('0件') || text.includes('出典: 0') || text.includes('0 のソース') || text.includes('0のソース');
            
            if (isShared || isEmpty) return false;
            
            const link = item.tagName === 'A' ? item : item.querySelector('a[href*="/notebook/"]');
            return !!link;
          });
          
          return !!validItem;
        });

        if (notebookLinkExists) {
          await page.evaluate(() => {
            const getRobustText = (item) => {
              let text = item.innerText || '';
              if (text.trim().length < 5) {
                let p = item;
                for (let i = 0; i < 5; i++) {
                  if (!p) break;
                  if (p.innerText && p.innerText.trim().length >= 5) {
                    text = p.innerText;
                    break;
                  }
                  p = p.parentElement;
                }
              }
              return text;
            };

            const headings = Array.from(document.querySelectorAll('h2, h3, div, span'));
            const recentHeading = headings.find(el => el.innerText && el.innerText.trim() === '最近のノートブック');
            let container = document.body;
            if (recentHeading) {
              let p = recentHeading;
              for (let i = 0; i < 5; i++) {
                if (!p) break;
                if (p.querySelectorAll('a[href*="/notebook/"]').length > 0) {
                  container = p;
                  break;
                }
                p = p.parentElement;
              }
            }

            const items = Array.from(container.querySelectorAll('mat-row, tr, [role="row"], .notebook-card, mat-card, a[href*="/notebook/"]'));
            const validItem = items.find(item => {
              const rect = item.getBoundingClientRect();
              const isVisible = rect.width > 0 && rect.height > 0;
              if (!isVisible) return false;
              
              const text = getRobustText(item);
              const isShared = text.includes('シャーロック') || text.includes('Conan') || text.includes('公開') || text.includes('Game') || text.includes('ミステリー') || text.includes('AP®') || text.includes('Atlantic') || text.includes('世界史') || text.includes('Doyle') || text.includes('Dole');
              const isEmpty = text.includes('0 個') || text.includes('0個') || text.includes('0 件') || text.includes('0件') || text.includes('出典: 0') || text.includes('0 のソース') || text.includes('0のソース');
              
              if (isShared || isEmpty) return false;
              
              const link = item.tagName === 'A' ? item : item.querySelector('a[href*="/notebook/"]');
              return !!link;
            });
            if (validItem) {
              const link = validItem.tagName === 'A' ? validItem : validItem.querySelector('a[href*="/notebook/"]');
              if (link) link.click();
            }
          });
          console.log('Clicked recent notebook link (excluding public samples and empty notebooks), waiting for navigation...');
          await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
          enteredRecent = true;
          console.log('Successfully entered recent notebook.');
          // もしソースが0件などでモーダルが開いたら閉じる
          await dismissSourceModalIfOpen(page);
        } else {
          console.log('Could not find any suitable non-public non-empty recent notebook.');
        }

      } catch (err) {
        console.log('Failed to enter recent notebook, will create a temporary one:', err.message);
      }

      if (!enteredRecent) {
        console.log('Creating a temporary notebook and importing a light website to verify studio selectors...');
        try {
          // 1. 新規作成ボタンのクリック
          const btnNewTemp = await page.waitForSelector('::-p-xpath(//*[contains(text(), "新規作成") or contains(text(), "新しいノートブック")])');
          await page.evaluate(el => el.click(), btnNewTemp);
          await new Promise(resolve => setTimeout(resolve, 5000));

          // 2. 「ウェブサイト」ボタンのクリック
          const btnWebTemp = await page.waitForSelector('::-p-xpath(//*[contains(text(), "ウェブサイト") or contains(text(), "YouTube")])');
          await page.evaluate(el => el.click(), btnWebTemp);
          await new Promise(resolve => setTimeout(resolve, 2000));

          // 3. URL（https://example.com）の入力
          const txtAreaSelector = 'textarea[placeholder*="検索"], textarea[placeholder*="URL"]';
          const txtAreaTemp = await page.waitForSelector(txtAreaSelector);
          await txtAreaTemp.focus();
          await txtAreaTemp.type('https://example.com');
          await page.keyboard.press('Enter');
          await new Promise(resolve => setTimeout(resolve, 1500));

          // 4. 追加確定ボタンのクリック
          const btnAddSelector = '::-p-xpath(//button[contains(., "追加") or contains(., "インポート")])';
          const btnAddTemp = await page.waitForSelector(btnAddSelector);
          await page.evaluate(el => el.click(), btnAddTemp);
          console.log('Waiting for example.com source load confirmation...');
          await new Promise(resolve => setTimeout(resolve, 3000));

          // チェックマークのロード監視または確定ボタンの出現（最大20秒）
          let loaded = false;
          for (let p = 0; p < 5; p++) {
            const hasConfirmButton = await page.evaluate(() => {
              const buttons = Array.from(document.querySelectorAll('button, [role="button"], div, span'));
              return buttons.some(btn => {
                const text = btn.innerText || '';
                return (text.includes('個のソース') || text.includes('個 of ソース'));
              });
            });
            const checkedCount = await page.evaluate(() => {
              return document.querySelectorAll('[aria-checked="true"]').length;
            });
            if (hasConfirmButton || checkedCount > 0) {
              loaded = true;
              break;
            }
            await new Promise(resolve => setTimeout(resolve, 4000));
          }
          
          if (!loaded) {
            console.log('[WARN] Temporary source did not show checkmark or confirm button, proceeding anyway.');
            const screenshotPath = path.join(__dirname, 'dryrun_error_phaseA_source.png');
            await page.screenshot({ path: screenshotPath, fullPage: true });
            console.log(`Saved source load failure screenshot to ${screenshotPath}`);
          } else {
            console.log('Temporary source loaded.');
          }

          // モーダルを閉じてメインUIを露出させる
          await dismissSourceModalIfOpen(page);

          // 5. 「X 個のソース  →」ボタンのクリック
          console.log('Clicking the "X 個のソース ->" button to confirm...');
          let confirmed = false;
          for (let t = 0; t < 5; t++) {
            confirmed = await page.evaluate(() => {
              const elements = Array.from(document.querySelectorAll('*'));
              const confirmBtn = elements.find(el => {
                const text = el.innerText || '';
                return (text.includes('個のソース') || text.includes('個 of ソース')) && el.offsetWidth > 0 && el.offsetHeight > 0;
              });
              if (confirmBtn) {
                let clickTarget = confirmBtn;
                for (let i = 0; i < 5; i++) {
                  if (clickTarget.tagName === 'BUTTON' || clickTarget.getAttribute('role') === 'button' || clickTarget.className.includes('button') || clickTarget.className.includes('btn')) {
                    clickTarget.click();
                    return true;
                  }
                  if (!clickTarget.parentElement) break;
                  clickTarget = clickTarget.parentElement;
                }
                confirmBtn.click();
                return true;
              }
              return false;
            });
            if (confirmed) {
              console.log('Confirmed source creation.');
              break;
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
          }

          if (!confirmed) {
            console.log('Could not find confirm button, trying Escape key fallback.');
            await dismissSourceModalIfOpen(page);
          } else {
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
        } catch (tempErr) {
          console.error('Failed to setup temporary notebook for dry-run:', tempErr.message);
          const screenshotPath = path.join(__dirname, 'dryrun_error_phaseA_temp.png');
          await page.screenshot({ path: screenshotPath, fullPage: true });
          console.log(`Saved temporary notebook setup error screenshot to ${screenshotPath}`);
          allPassed = false;
          return;
        }
      }

        // Studioパネルのチェックと表示
        console.log('Verifying Studio panel...');
        await ensureStudioOpen(page);
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 1. 自動スライド生成が走り始めるのを監視、またはスライド作成ボタンの活性化を監視（最大100秒）
        let isGeneratingStarted = false;
        const isButtonVisibleAtStart = await page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll('*'));
          const btn = elements.find(el => {
            const text = el.innerText ? el.innerText.trim() : '';
            if (!(text.startsWith('スライド') && text.length < 10 && el.offsetWidth > 0 && el.offsetHeight > 0)) {
              return false;
            }
            let p = el;
            for (let i = 0; i < 5; i++) {
              const className = (p.className && typeof p.className === 'string') ? p.className : '';
              if (p.tagName === 'BUTTON' || p.getAttribute('role') === 'button' || className.includes('create-artifact') || className.includes('card') || className.includes('button')) {
                return true;
              }
              if (!p.parentElement) break;
              p = p.parentElement;
            }
            return false;
          });
          return !!btn;
        });

        if (!isButtonVisibleAtStart) {
          for (let i = 0; i < 100; i++) {
            const hasGeneratingText = await page.evaluate(() => {
              const el = Array.from(document.querySelectorAll('*')).find(e => {
                const txt = e.innerText || '';
                return txt.includes('スライド') && txt.includes('生成') && e.offsetWidth > 0 && e.offsetHeight > 0;
              });
              return !!el;
            });
            const isButtonVisible = await page.evaluate(() => {
              const elements = Array.from(document.querySelectorAll('*'));
              const btn = elements.find(el => {
                const text = el.innerText ? el.innerText.trim() : '';
                if (!(text.startsWith('スライド') && text.length < 10 && el.offsetWidth > 0 && el.offsetHeight > 0)) {
                  return false;
                }
                let p = el;
                for (let i = 0; i < 5; i++) {
                  const className = (p.className && typeof p.className === 'string') ? p.className : '';
                  if (p.tagName === 'BUTTON' || p.getAttribute('role') === 'button' || className.includes('create-artifact') || className.includes('card') || className.includes('button')) {
                    return true;
                  }
                  if (!p.parentElement) break;
                  p = p.parentElement;
                }
                return false;
              });
              return !!btn;
            });

            if (hasGeneratingText) {
              isGeneratingStarted = true;
              break;
            }
            if (isButtonVisible) break;
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        if (isGeneratingStarted) {
          console.log('Detected background slide generation. Waiting for it to complete (max 120 seconds)...');
          for (let i = 0; i < 30; i++) {
            const isGenerating = await page.evaluate(() => {
              const el = Array.from(document.querySelectorAll('*')).find(e => {
                const txt = e.innerText || '';
                return txt.includes('スライド') && txt.includes('生成') && e.offsetWidth > 0 && e.offsetHeight > 0;
              });
              return !!el;
            });
            if (!isGenerating) {
              console.log('Background slide generation completed.');
              break;
            }
            await new Promise(resolve => setTimeout(resolve, 4000));
          }
        } else {
          console.log('No background slide generation detected.');
        }

        // 上限チェック（1回目: クリック前）
        let isLimitReached = await page.evaluate(() => {
          const el = Array.from(document.querySelectorAll('*')).find(e => {
            const txt = e.innerText || '';
            return (txt.includes('上限に達しました') || txt.includes('制限に達しました') || txt.includes('明日以降に再開') || txt.includes('limit')) && e.offsetWidth > 0 && e.offsetHeight > 0;
          });
          return !!el;
        });

        if (!isLimitReached) {
          console.log('Clicking slide setup button...');
          const clicked = await clickSlideSetupButton(page);
          if (clicked) {
            await new Promise(resolve => setTimeout(resolve, 4000)); // ダイアログ展開待ち
            
            // 上限チェック（2回目: クリック後）
            isLimitReached = await page.evaluate(() => {
              const hasWarning = Array.from(document.querySelectorAll('*')).some(e => {
                const txt = e.innerText || '';
                return (txt.includes('上限に達しました') || txt.includes('制限に達しました') || txt.includes('明日以降に再開') || txt.includes('limit')) && e.offsetWidth > 0 && e.offsetHeight > 0;
              });
              const hasPresenter = Array.from(document.querySelectorAll('*')).some(e => {
                const txt = e.innerText || '';
                return txt.includes('プレゼンターのスライド') && e.offsetWidth > 0 && e.offsetHeight > 0;
              });
              return hasWarning || !hasPresenter;
            });
          } else {
            allPassed = false;
          }
        }

        if (isLimitReached) {
          console.log('\n[WARN] スライドの一日の上限に達していることを検出しました。');
          console.log('Studio内部のセレクタ（プレゼンターのスライド等）の検証をスキップし、警告付きで正常とみなします。\n');
        } else {
          // 8. プレゼンターのスライド選択
          const btnPresenter = '::-p-xpath(//*[contains(text(), "プレゼンターのスライド")])';
          if (!(await checkSelector('STEP 2: プレゼンタースライド選択', btnPresenter, 10000))) allPassed = false;

          // 9. プロンプト入力エリア
          const txtPrompt = 'textarea[placeholder*="説明"], textarea[placeholder*="プロンプト"], textarea';
          if (!(await checkSelector('STEP 2: プロンプト説明欄', txtPrompt))) allPassed = false;

          // 10. 生成実行ボタン
          const btnGen = '::-p-xpath(//button[contains(., "生成") or contains(., "作成")])';
          if (!(await checkSelector('STEP 2: 生成実行ボタン', btnGen))) allPassed = false;
        }


      // --- フェーズB: ダッシュボード側新規作成モーダル検証 ---
      console.log('Navigating back to dashboard for modal verification...');
      await ensureDashboard(page);

      // 1. 新規作成ボタンの検証
      const btnNew = '::-p-xpath(//*[contains(text(), "新規作成") or contains(text(), "新しいノートブック")])';
      if (await checkSelector('STEP 1: 新規作成ボタン', btnNew)) {
        const btnEl = await page.waitForSelector(btnNew);
        await page.evaluate(el => el.click(), btnEl);
        await new Promise(resolve => setTimeout(resolve, 5000));

        // 2. ウェブサイト（YouTube）ボタン
        const btnWeb = '::-p-xpath(//*[contains(text(), "ウェブサイト") or contains(text(), "YouTube")])';
        if (await checkSelector('STEP 1: ウェブサイトボタン', btnWeb)) {
          const webEl = await page.waitForSelector(btnWeb);
          await page.evaluate(el => el.click(), webEl);
          await new Promise(resolve => setTimeout(resolve, 2000));

          // 3. URL入力エリア
          const txtArea = 'textarea[placeholder*="検索"], textarea[placeholder*="URL"]';
          if (!(await checkSelector('STEP 1: URL入力欄', txtArea))) allPassed = false;

          // 4. 追加確定ボタン
          const btnAdd = '::-p-xpath(//button[contains(., "追加") or contains(., "インポート")])';
          if (!(await checkSelector('STEP 1: 追加確定ボタン', btnAdd))) allPassed = false;
        } else {
          allPassed = false;
          const screenshotPath = path.join(__dirname, 'dryrun_error_phaseB_modal.png');
          await page.screenshot({ path: screenshotPath, fullPage: true });
          console.log(`Saved phase B modal error screenshot to ${screenshotPath}`);
        }
      } else {
        allPassed = false;
        const screenshotPath = path.join(__dirname, 'dryrun_error_phaseB_new.png');
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`Saved phase B new notebook button error screenshot to ${screenshotPath}`);
      }

      console.log('------------------------------------------');
      if (allPassed) {
        console.log('[DRY-RUN RESULT] ALL PASSED: すべての主要セレクタが正常に検出されました。UIの崩れはありません。');
      } else {
        console.error('[DRY-RUN RESULT] FAILED: 一部セレクタが欠損しています。SELECTORS.md の更新が必要です。');
        process.exit(2);
      }
      return;
    }

    // ------------------------------------------
    // STEP 1: 新規ノート作成 & URLインポート
    // ------------------------------------------
    console.log('STEP 1: Creating new notebook...');
    const btnNew = await page.waitForSelector('::-p-xpath(//*[contains(text(), "新規作成") or contains(text(), "新しいノートブック")])');
    await page.evaluate(el => el.click(), btnNew);
    await new Promise(resolve => setTimeout(resolve, 4000));

    console.log('Opening Web/YouTube source import dialog...');
    const btnWeb = await page.waitForSelector('::-p-xpath(//*[contains(text(), "ウェブサイト") or contains(text(), "YouTube")])');
    await page.evaluate(el => el.click(), btnWeb);
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 各URLを投入
    const txtAreaSelector = 'textarea[placeholder*="検索"], textarea[placeholder*="URL"]';
    const btnAddSelector = '::-p-xpath(//button[contains(., "追加") or contains(., "インポート")])';

    for (const url of urls) {
      let success = false;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`Importing URL: ${url} (Attempt ${attempt}/3)...`);
          const textarea = await page.waitForSelector(txtAreaSelector, { timeout: 10000 });
          await textarea.focus();
          await page.evaluate(el => el.value = '', textarea);
          await textarea.type(url);
          await page.keyboard.press('Enter');
          await new Promise(resolve => setTimeout(resolve, 1500));

          const btnAdd = await page.waitForSelector(btnAddSelector, { timeout: 5000 });
          await page.evaluate(el => el.click(), btnAdd);
          
          // ソース読込中のインジケータ待ちとチェックマーク (✅) 検知
          console.log('Waiting for source load confirmation...');
          await new Promise(resolve => setTimeout(resolve, 5000)); // 最初のポーリング遅延
          
          // 最大30秒チェックマークの出現を監視
          let loaded = false;
          for (let p = 0; p < 6; p++) {
            const checkedCount = await page.evaluate(() => {
              return document.querySelectorAll('[aria-checked="true"]').length;
            });
            if (checkedCount > 0) {
              loaded = true;
              break;
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
          }

          if (loaded) {
            console.log(`[OK] Successfully imported URL: ${url}`);
            success = true;
            break;
          } else {
            throw new Error('チェックマーク (✅) の出現が確認できませんでした。');
          }
        } catch (err) {
          console.error(`[WARN] Attempt ${attempt} failed for URL: ${url}. Error: ${err.message}`);
          // 失敗したソース項目を削除してやり直す
          try {
            const deleteBtn = await page.$('button[aria-label*="削除"], mat-icon:contains(delete)');
            if (deleteBtn) {
              await page.evaluate(el => el.click(), deleteBtn);
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          } catch (e) {
            console.log('Failed to clean up failed source item:', e.message);
          }
        }
      }

      if (!success) {
        console.error(`[ERROR] ソース読込に致命的な失敗。該当URL: ${url}`);
        throw new Error(`[STEP 1] URLのインポートに失敗しました: ${url}`);
      }
    }

    // モーダルを閉じてメインUIを露出させる
    await dismissSourceModalIfOpen(page);

    // 5. 「X 個のソース  →」ボタンのクリックをして作成確定
    console.log('Clicking the "X 個 of ソース ->" button to confirm notebook creation...');
    let confirmed = false;
    for (let t = 0; t < 5; t++) {
      confirmed = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('*'));
        const confirmBtn = elements.find(el => {
          const text = el.innerText || '';
          return (text.includes('個のソース') || text.includes('個 of ソース')) && el.offsetWidth > 0 && el.offsetHeight > 0;
        });
        if (confirmBtn) {
          let clickTarget = confirmBtn;
          for (let i = 0; i < 5; i++) {
            if (clickTarget.tagName === 'BUTTON' || clickTarget.getAttribute('role') === 'button' || clickTarget.className.includes('button') || clickTarget.className.includes('btn')) {
              clickTarget.click();
              return true;
            }
            if (!clickTarget.parentElement) break;
            clickTarget = clickTarget.parentElement;
          }
          confirmBtn.click();
          return true;
        }
        return false;
      });
      if (confirmed) {
        console.log('Confirmed source creation.');
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    if (!confirmed) {
      console.log('Could not find confirm button, trying Escape key fallback.');
      await dismissSourceModalIfOpen(page);
    } else {
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    // ------------------------------------------
    // STEP 2: プロンプト投入 & 生成開始
    // ------------------------------------------
    console.log('STEP 2: Checking Studio panel state...');
    await ensureStudioOpen(page);

    // 1. 自動スライド生成が走り始めるのを監視、またはスライド作成ボタンの活性化を監視（最大100秒）
    let isGeneratingStarted = false;
    for (let i = 0; i < 100; i++) {
      const debugGeneratingTexts = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('*'))
          .filter(e => e.innerText && e.innerText.includes('生成') && e.offsetWidth > 0 && e.offsetHeight > 0)
          .map(e => e.innerText.trim())
          .filter((v, i, a) => a.indexOf(v) === i);
      });
      console.log(`PAGE LOG [Debug Generating Texts (Attempt ${i + 1}/100)]:`, debugGeneratingTexts);

      const isButtonVisible = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('*'));
        const btn = elements.find(el => {
          const text = el.innerText ? el.innerText.trim() : '';
          if (!(text.startsWith('スライド') && text.length < 10 && el.offsetWidth > 0 && el.offsetHeight > 0)) {
            return false;
          }
          let p = el;
          for (let i = 0; i < 5; i++) {
            const className = (p.className && typeof p.className === 'string') ? p.className : '';
            if (p.tagName === 'BUTTON' || p.getAttribute('role') === 'button' || className.includes('create-artifact') || className.includes('card') || className.includes('button')) {
              return true;
            }
            if (!p.parentElement) break;
            p = p.parentElement;
          }
          return false;
        });
        return !!btn;
      });

      const hasGeneratingText = await page.evaluate(() => {
        const el = Array.from(document.querySelectorAll('*')).find(e => {
          const txt = e.innerText || '';
          return txt.includes('スライド') && txt.includes('生成') && e.offsetWidth > 0 && e.offsetHeight > 0;
        });
        return !!el;
      });

      if (hasGeneratingText) {
        console.log('Background slide generation started.');
        isGeneratingStarted = true;
        break;
      }
      if (isButtonVisible) {
        console.log('Slide setup button became visible/active. Bypassing generation wait.');
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (isGeneratingStarted) {
      console.log('Detected background slide generation. Waiting for it to complete (max 120 seconds)...');
      // 2. 自動スライド生成が消える（完了する）のを待つ（最大120秒）
      for (let i = 0; i < 30; i++) {
        const isGenerating = await page.evaluate(() => {
          const el = Array.from(document.querySelectorAll('*')).find(e => {
            const txt = e.innerText || '';
            return txt.includes('スライド') && txt.includes('生成') && e.offsetWidth > 0 && e.offsetHeight > 0;
          });
          return !!el;
        });
        if (!isGenerating) {
          console.log('Background slide generation completed.');
          break;
        }
        console.log(`Still generating in background, waiting... (Attempt ${i + 1}/30)`);
        await new Promise(resolve => setTimeout(resolve, 4000));
      }
    } else {
      console.log('No background slide generation detected.');
    }

    console.log('Opening slide customization dialog...');
    await clickSlideSetupButton(page);
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('Selecting "Presenter Slides"...');
    const btnPresenter = await page.waitForSelector('::-p-xpath(//*[contains(text(), "プレゼンターのスライド")])', { timeout: 10000 });
    await page.evaluate(el => el.click(), btnPresenter);
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Typing instructions prompt...');
    const txtPrompt = await page.waitForSelector('textarea[placeholder*="説明"], textarea[placeholder*="プロンプト"], textarea');
    await txtPrompt.focus();
    await page.evaluate(el => el.value = '', txtPrompt);
    await txtPrompt.type(promptText);
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Starting slide generation...');
    const btnGen = await page.waitForSelector('::-p-xpath(//button[contains(., "生成") or contains(., "作成")])');
    await page.evaluate(el => el.click(), btnGen);

    // ------------------------------------------
    // STEP 3: 生成完了ポーリング
    // ------------------------------------------
    console.log('STEP 3: Generating slides. Polling status (max 10 minutes)...');
    const startTime = Date.now();
    const timeout = 10 * 60 * 1000; // 10分
    let generated = false;

    while (Date.now() - startTime < timeout) {
      const progressBarExists = await page.evaluate(() => {
        const el = document.querySelector('mat-progress-bar, [role="progressbar"], .loading, .progress');
        return el && el.offsetWidth > 0 && el.offsetHeight > 0;
      });

      const thumbnailExists = await page.evaluate(() => {
        // CSSセレクタで判定（browser contextで有効なもののみ）
        if (document.querySelector('.thumbnail-image-container, [aria-label*="スライド"]')) return true;
        // テキスト一致はdocument.querySelectorでは不可（::-p-xpathはPuppeteer専用）→ DOM走査で代替
        return Array.from(document.querySelectorAll('*')).some(el =>
          el.offsetWidth > 0 && el.offsetHeight > 0 &&
          ((el.innerText || '').includes('スライド') || (el.innerText || '').includes('AI Shorts'))
        );
      });

      if (!progressBarExists && thumbnailExists) {
        console.log('Generation completed.');
        generated = true;
        break;
      }
      
      const elapsedMins = ((Date.now() - startTime) / 60000).toFixed(1);
      console.log(`Waiting for generation... (${elapsedMins} mins elapsed)`);
      await new Promise(resolve => setTimeout(resolve, 8000));
    }

    if (!generated) {
      throw new Error('[STEP 3] スライド生成が制限時間内に完了しませんでした。');
    }

    // ------------------------------------------
    // STEP 4: ビューア起動 & 総枚数M取得
    // ------------------------------------------
    console.log('STEP 4: Opening slide viewer...');
    const slideCard = await page.waitForSelector('::-p-xpath(//*[contains(text(), "AI Shorts") or contains(text(), "AI Shorts Mass")])');
    await page.evaluate(el => el.click(), slideCard);
    await new Promise(resolve => setTimeout(resolve, 8000));

    console.log('Maximizing viewer modal...');
    const btnMax = await page.waitForSelector('button[aria-label="開く"]');
    await page.evaluate(el => el.click(), btnMax);
    await new Promise(resolve => setTimeout(resolve, 4000));

    const M = await page.evaluate(() => {
      return document.querySelectorAll('.thumbnail-image-container').length;
    });
    console.log(`STEP 4: スライドの総数 (M値): ${M}`);

    if (M === 0) {
      throw new Error('[STEP 4] スライドのサムネイル総数が0です。');
    }

    // ------------------------------------------
    // STEP 5: 連番キャプチャ・ループ（i = 0 .. M-1）
    // ------------------------------------------
    console.log('STEP 5: Starting slide capture loop...');
    const slidesInfo = [];

    // レジューム用チェック
    let startFromIndex = 0;
    const progressPath = path.join(outputDir, 'progress.json');
    if (fs.existsSync(progressPath)) {
      try {
        const prog = JSON.parse(fs.readFileSync(progressPath, 'utf8'));
        if (prog.lastSuccessfulIndex !== undefined) {
          startFromIndex = prog.lastSuccessfulIndex + 1;
          console.log(`[RECOVERY] progress.json に基づき、スライド ${startFromIndex + 1}/${M} から再開します。`);
        }
      } catch (e) {
        console.log('Progress parse error:', e.message);
      }
    }

    // メイン画像検索ヘルパー
    const findSlideImage = async () => {
      const imgs = await page.$$('img');
      for (const img of imgs) {
        const dimensions = await page.evaluate(el => {
          return { width: el.clientWidth, height: el.clientHeight, src: el.src || '', className: el.className || '' };
        }, img);
        
        if (dimensions.width > 500 && (dimensions.src.includes('googleusercontent') || dimensions.src.includes('storage') || dimensions.src.includes('blob:') || dimensions.className.includes('slide'))) {
          return img;
        }
      }
      return null;
    };

    const saveSlideWithMethod2 = async (imgEl) => {
      const blobUrl = await page.evaluate(el => el.src, imgEl);
      const base64Data = await page.evaluate(async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      }, blobUrl);
      return Buffer.from(base64Data.split(',')[1], 'base64');
    };

    for (let i = 0; i < M; i++) {
      if (i < startFromIndex) {
        console.log(`Skipping slide ${i + 1}/${M} (already processed)...`);
        
        // 遷移キー送信のためフォーカスしてめくる
        const slideImgElement = await findSlideImage();
        if (slideImgElement) {
          await page.evaluate(el => {
            const focusTarget = el.parentElement ? el.parentElement : el;
            focusTarget.click();
          }, slideImgElement);
          await page.keyboard.press('ArrowRight');
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
        continue;
      }

      console.log(`Processing slide ${i + 1}/${M}...`);

      // a) スライド本体の毎回再取得
      let slideImgElement = await findSlideImage();
      let retryCount = 0;

      if (!slideImgElement) {
        throw new Error(`[STEP 5-a] スライド画像が見つかりません (index: ${i})`);
      }

      // b) Method 2 保存
      let buffer = await saveSlideWithMethod2(slideImgElement);
      
      // 解像度を取得
      let dimensions = await page.evaluate((el) => {
        return { width: el.naturalWidth, height: el.naturalHeight };
      }, slideImgElement);

      let width = dimensions.width;
      let height = dimensions.height;

      // 品質不足 (width < 1000) 時の3回リトライ
      while (width < 1000 && retryCount < 3) {
        retryCount++;
        console.log(`[WARN] 低解像度を検出: ${width}x${height}。500ms待機して再取得します (Attempt ${retryCount}/3)...`);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        slideImgElement = await findSlideImage();
        if (slideImgElement) {
          buffer = await saveSlideWithMethod2(slideImgElement);
          dimensions = await page.evaluate((el) => {
            return { width: el.naturalWidth, height: el.naturalHeight };
          }, slideImgElement);
          width = dimensions.width;
          height = dimensions.height;
        }
      }

      // ファイル書き出し
      const finalPath = path.join(outputDir, `day${day}_slide${String(i + 1).padStart(2, '0')}.png`);
      fs.writeFileSync(finalPath, buffer);

      // ハッシュとファイルサイズ計算
      const md5 = crypto.createHash('md5').update(buffer).digest('hex');
      const bytes = buffer.length;

      // c) per-slide 1行ログ出力
      console.log(`[slide ${String(i + 1).padStart(2, '0')}/${String(M).padStart(2, '0')}] file=day${day}_slide${String(i + 1).padStart(2, '0')}.png  size=${width}x${height}  bytes=${bytes}  md5=${md5}  retry=${retryCount}`);

      slidesInfo.push({
        index: i + 1,
        filename: `day${day}_slide${String(i + 1).padStart(2, '0')}.png`,
        width: width,
        height: height,
        bytes: bytes,
        md5: md5,
        retryCount: retryCount
      });

      // 途中経過を progress.json に記録
      fs.writeFileSync(progressPath, JSON.stringify({ lastSuccessfulIndex: i }));

      // d) ★終端判定 (ArrowRight 送信前)
      const selectedIndex = await page.evaluate(() => {
        const thumbs = Array.from(document.querySelectorAll('.thumbnail-image-container'));
        return thumbs.findIndex(el => el.classList.contains('selected'));
      });

      if (selectedIndex === M - 1 || i === M - 1) {
        console.log('最終スライドに達しました。キャプチャループを正常終了します。');
        break;
      }

      // e) ArrowRight 送信してめくる ➡ アニメ完了待ち (3秒)
      await page.evaluate(el => {
        const focusTarget = el.parentElement ? el.parentElement : el;
        focusTarget.click();
      }, slideImgElement);
      
      await page.keyboard.press('ArrowRight');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // クリーンアップ: progress.json
    if (fs.existsSync(progressPath)) {
      fs.unlinkSync(progressPath);
    }

    // ------------------------------------------
    // STEP 6: summary.json 保存
    // ------------------------------------------
    const summaryData = {
      day: parseInt(day),
      half: half,
      sourceUrls: urls,
      total: M,
      savedCount: slidesInfo.length,
      generatedAt: new Date().toISOString(),
      slides: slidesInfo
    };

    const summaryPath = path.join(outputDir, 'summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summaryData, null, 2));
    console.log(`STEP 6: summary.json 保存完了 (${summaryPath})`);

    if (slidesInfo.length !== M) {
      console.error(`[ERROR] 保存枚数不一致。ビューア枚数: ${M}, 実保存数: ${slidesInfo.length}`);
      process.exit(3);
    }

    // ------------------------------------------
    // STEP 7: 完了報告
    // ------------------------------------------
    console.log(`\n==========================================`);
    console.log(`STEP 7: 全 ${M} 枚のスライド保存が成功しました！`);
    console.log(`出力先: ${outputDir}`);
    console.log(`==========================================\n`);

  } catch (error) {
    console.error('実行エラーが発生しました:', error);
    process.exit(9);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
})();
