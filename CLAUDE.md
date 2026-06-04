# プロジェクトルール (CLAUDE.md)

ClaudeCode は本ファイルを必ず読み込むこと。

## 0. 必読：プロジェクト背景コンテキスト

**`CONTEXT.md`** を必ず読むこと。研修事業の背景・目的・ユーザー（Hiroya）のポジション・過去の実績・教材の設計思想が記載されている。

## 1. 禁則事項

### .git/configの変更禁止
以下の設定を.git/configに書き込まないこと。
Antigravityとの干渉が確認されており、Antigravityが完全無反応になる。

```
[extensions]
    worktreeConfig = true
```

worktreeを使う場合も、この設定の自動書き込みは行わないこと。

## 2. 一時ファイルの運用ルール

- **リサーチメモ**: `Today_Research.md` を**上書き更新**して使う。新規ファイルを作らない
- **実装計画**: `Today_Plan.md` を**上書き更新**して使う。新規ファイルを作らない
- **YouTube文字起こし(VTT)**: リサーチ時に一時取得してもよいが、実装完了後は**必ず削除**する
- **スクリプト（.py / .js）**: 使い捨てスクリプトはプロジェクトルートに置かない。必要なら `scratch/` フォルダを作って格納し、不要になったら削除する
- **引き継ぎメモ**: Antigravity/Cursorへの引き継ぎは `Today_Plan.md` に統合する。`handoff_*.txt` 等の別ファイルを作らない

## 3. ClaudeCodeの担当フェーズ（1日の流れ Step 2）

Antigravityがリサーチを完了した後（`Today_Research.md` が更新済み）に呼ばれる。

### Step 2-1：Today_Plan.md の更新
`Today_Research.md` を読み込み、`Today_Plan.md` を以下の内容で**上書き**する。
- 今日作るページ（`volXX-1.html`）の構成案
- 各セクションの見出し・内容の骨格
- Cursorへの具体的な実装指示（どのファイルを、どう作るか）

**画像リネーム（プラン作成前に実行）:**
`assets/` に未リネームのファイルがあれば、Today_Research.md のDay番号を読み取って一括リネームする。

対応する命名パターン：
- NotebookLMのドラッグ保存：`Master_*_Slide_N*.png` → `dayXX_slideN.png`
- 手動連番保存：`1.png`, `2.png`, ... → `dayXX_slide1.png`, `dayXX_slide2.png`, ...

```
例）Day01の場合
Master_Instagram_with_Gemini_AI_-_Slide_1.png → day01_slide1.png
Master_Instagram_with_Gemini_AI_-_Slide_10.png → day01_slide10.png
1.png → day01_slide1.png
```

リネーム後、Today_Plan.md の `[実装メタ情報]` に**使用する**ファイル名を明記する（全部使わなくてよい）。`assets/` に対象ファイルがなければこのステップはスキップ。

### Step 2-2：Cursorへの引き渡し
以下の条件がすべて揃ってから「プラン更新完了、Cursorに渡してください」と報告する。

- [ ] `Today_Research.md` を読み込んだ
- [ ] `assets/dayXX_*.png` の画像を**実際に目視確認**した（全枚数）
- [ ] 各セクションへの画像割り当てを `Today_Plan.md` の `[実装メタ情報]` に明記した
- [ ] `Today_Plan.md` の `cache-bust` 値を当日日時で明記した

**⚠️ 画像が未着の場合は渡さない。** 画像なしで渡すと Cursor が画像配置を判断できず二度手間になる。画像を待ってから渡すこと。

### Step 2-3：成果物レビュー（Cursor実装後）
Cursorが実装・デプロイした後に呼ばれる。
- `volXX-1.html` の内容・表示を確認
- cache-bustタイムスタンプの形式確認
- 修正が必要な場合は指摘事項を `Today_Plan.md` に追記してCursorに差し戻す

---

## 4. 実装ルール

- 新しいDayページ（`volXX-1.html`）を作成する際は、最新のDayファイルをテンプレートとして複製し、内容を差し替える
- テーマカラーはInstagramグラデーション（`#833ab4 → #c13584 → #f77737`）で統一する
- 先月（2605・簿記コース）の `vol*.html` 設計パターンは参考にしてよい（参照先: `G:\マイドライブ\研修\【202605】簿記コース\`）

### 実習セクションのカウントダウンタイマー（必須）

**実習・ワーク・グループワーク系のセクションには必ずカウントダウンタイマーを設置すること。**

#### 時間設計の目安（ClaudeCodeが Today_Plan.md に明記する）

| 実習タイプ | 目安時間 |
|---|---|
| アイデア出し・思考整理・ペルソナ設計など | 10〜15分 |
| ツール操作実習（実際に手を動かす作業） | 20〜30分 |
| 振り返り・記入・フォーム入力など | 5〜10分 |

- 時間は Today_Research.md の動画内容・スライドの指定値を優先する
- 指定がなければ上記目安から ClaudeCode が判断し、**Today_Plan.md の該当セクションに `タイマー: XX分` と明記**すること

#### CSS テンプレート（`</style>` 直前に含めること）

```css
.timer-container { text-align: center; margin: 20px 0 28px; }
.timer-badge {
    display: inline-flex; align-items: center; justify-content: center; gap: 12px;
    background: #1e1035; color: #fff;
    font-family: 'Roboto', sans-serif; font-size: 2.2rem; font-weight: 700;
    padding: 14px 40px; border-radius: 40px; margin: 8px 0;
    min-width: 220px; letter-spacing: 3px;
    transition: background 0.5s ease, box-shadow 0.5s ease;
}
.timer-badge i { font-size: 1.6rem; }
.timer-badge.timer-warning { background: #f59e0b; box-shadow: 0 0 20px rgba(245,158,11,0.4); }
.timer-badge.timer-danger  { background: #ef4444; animation: pulse-timer 0.8s ease-in-out infinite; }
.timer-badge.timer-done    { background: #10b981; letter-spacing: 1px; box-shadow: 0 0 20px rgba(16,185,129,0.4); }
@keyframes pulse-timer {
    0%, 100% { transform: scale(1);    box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
    50%       { transform: scale(1.04); box-shadow: 0 0 0 14px rgba(239,68,68,0); }
}
.timer-controls { display: flex; gap: 12px; justify-content: center; margin-top: 12px; }
.timer-btn {
    border: none; border-radius: 20px; padding: 10px 28px;
    font-family: 'Noto Sans JP', sans-serif; font-size: 0.95rem; font-weight: 700;
    cursor: pointer; transition: 0.2s;
}
.timer-start { background: var(--ig-grad); color: #fff; box-shadow: 0 4px 15px rgba(193,53,132,0.3); }
.timer-start:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(193,53,132,0.4); }
.timer-reset { background: #f1f5f9; color: var(--text-main); border: 1px solid #e2e8f0; }
.timer-reset:hover { background: #e2e8f0; }
```

#### HTML テンプレート（`XX` を分数に置き換える）

```html
<div class="timer-container">
    <div class="timer-badge" id="practiceTimer">
        <i class="fa-solid fa-clock"></i> XX:00
    </div>
    <div class="timer-controls">
        <button class="timer-btn timer-start" id="timerStartBtn" onclick="toggleTimer()">▶ スタート</button>
        <button class="timer-btn timer-reset" onclick="resetTimer()">↺ リセット</button>
    </div>
</div>
```

#### JS テンプレート（`TIMER_MINUTES` を分数に置き換える）

```javascript
let _timerInterval = null;
let _timerSec = TIMER_MINUTES * 60;
const _timerTotal = TIMER_MINUTES * 60;

function toggleTimer() {
    const btn = document.getElementById('timerStartBtn');
    if (_timerInterval) {
        clearInterval(_timerInterval);
        _timerInterval = null;
        btn.textContent = '▶ 再開';
    } else {
        if (_timerSec <= 0) return;
        _timerInterval = setInterval(() => {
            _timerSec--;
            _updateTimerDisplay();
            if (_timerSec <= 0) {
                clearInterval(_timerInterval);
                _timerInterval = null;
                const el = document.getElementById('practiceTimer');
                el.innerHTML = '<i class="fa-solid fa-bell"></i> 終了！';
                el.className = 'timer-badge timer-done';
                btn.textContent = '▶ スタート';
            }
        }, 1000);
        btn.textContent = '⏸ 一時停止';
    }
}

function resetTimer() {
    clearInterval(_timerInterval);
    _timerInterval = null;
    _timerSec = _timerTotal;
    const el = document.getElementById('practiceTimer');
    el.innerHTML = `<i class="fa-solid fa-clock"></i> ${String(Math.floor(_timerTotal/60)).padStart(2,'0')}:00`;
    el.className = 'timer-badge';
    document.getElementById('timerStartBtn').textContent = '▶ スタート';
}

function _updateTimerDisplay() {
    const m = Math.floor(_timerSec / 60);
    const s = _timerSec % 60;
    const el = document.getElementById('practiceTimer');
    el.innerHTML = `<i class="fa-solid fa-clock"></i> ${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    const ratio = _timerSec / _timerTotal;
    if (ratio <= 1/15)      { el.className = 'timer-badge timer-danger'; }   // 残り1分：赤パルス
    else if (ratio <= 5/15) { el.className = 'timer-badge timer-warning'; }  // 残り5分：オレンジ
    else                    { el.className = 'timer-badge'; }
}
```

**⚠️ 1ページに実習が複数ある場合** は、タイマーの `id` と関数名にサフィックスをつけて重複を避けること（例: `practiceTimer2`、`toggleTimer2`）。

### 実習ワークシート（入力・コピー対応）

**思考・記入系の実習には入力可能な付箋カードを使うこと。** ツール操作実習（Canvaで実際に作るなど）には不要。

#### 仕様
- `<textarea>` で自由入力可能
- フォーカス時に枠がオレンジのソリッドボーダーに変化（入力中の視覚フィードバック）
- 各カード右上に個別コピーボタン（`【タイトル】\n内容` 形式）
- グリッド下部に「全項目まとめてコピー」ボタン（全カードを2行空けて連結）
- プレースホルダーに回答例を入れて迷わせない

#### CSSテンプレート

```css
.worksheet-card {
    background: #fffef5; border: 2px dashed #fcd34d;
    border-radius: var(--radius-medium); padding: 16px 16px 12px;
    min-height: 150px; position: relative; transition: border-color 0.2s, box-shadow 0.2s;
}
.worksheet-card:focus-within {
    border-color: #f59e0b; border-style: solid;
    box-shadow: 0 0 0 3px rgba(252,211,77,0.3);
}
.worksheet-card strong { display: block; color: var(--ig-purple); font-size: 0.9rem; margin-bottom: 4px; }
.ws-hint { font-size: 0.78rem; color: #9ca3af; margin-bottom: 8px; line-height: 1.4; }
.worksheet-card textarea {
    width: 100%; min-height: 80px; background: transparent; border: none; outline: none;
    resize: vertical; padding: 2px 0;
    font-family: 'Noto Sans JP', sans-serif; font-size: 0.92rem; color: var(--text-main); line-height: 1.75;
}
.worksheet-card textarea::placeholder { color: #d1d5db; font-size: 0.85rem; }
.ws-copy-btn {
    position: absolute; top: 10px; right: 10px;
    background: none; border: 1px solid #fcd34d; border-radius: 6px;
    padding: 3px 8px; font-size: 0.72rem; color: #a16207;
    cursor: pointer; transition: 0.2s; opacity: 0.6; font-family: 'Noto Sans JP', sans-serif;
}
.ws-copy-btn:hover { background: #fef9c3; opacity: 1; }
.ws-copy-btn.ws-copied { background: #d1fae5; border-color: #10b981; color: #065f46; opacity: 1; }
.ws-copy-all-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; margin-top: 12px; padding: 13px;
    background: #fff; border: 2px solid #fcd34d; border-radius: var(--radius-medium);
    font-family: 'Noto Sans JP', sans-serif; font-size: 0.95rem; font-weight: 700;
    color: #a16207; cursor: pointer; transition: 0.2s;
}
.ws-copy-all-btn:hover { background: #fffbeb; border-color: #f59e0b; }
.ws-copy-all-btn.ws-copied { background: #d1fae5; border-color: #10b981; color: #065f46; }
```

#### HTMLテンプレート

```html
<div class="worksheet-grid">
    <div class="worksheet-card" id="ws-1">
        <button class="ws-copy-btn" onclick="copyCard('ws-1', this)">📋 コピー</button>
        <strong>1. 項目タイトル</strong>
        <div class="ws-hint">問いかけ・ヒント文</div>
        <textarea placeholder="回答例..."></textarea>
    </div>
    <!-- 項目数分繰り返す（id は ws-1, ws-2, ws-3... と連番） -->
</div>
<button class="ws-copy-all-btn" id="wsCopyAllBtn" onclick="copyAllCards()">
    📋 X項目をまとめてコピー
</button>
```

#### JSテンプレート

```javascript
function copyCard(cardId, btn) {
    const card  = document.getElementById(cardId);
    const title = card.querySelector('strong').textContent;
    const text  = card.querySelector('textarea').value.trim() || '（未入力）';
    navigator.clipboard.writeText(`【${title}】\n${text}`).then(() => {
        btn.textContent = '✓ コピー済';
        btn.classList.add('ws-copied');
        setTimeout(() => { btn.textContent = '📋 コピー'; btn.classList.remove('ws-copied'); }, 2000);
    });
}

function copyAllCards() {
    const ids   = ['ws-1','ws-2','ws-3','ws-4']; // 項目数に合わせて変更
    const lines = ids.map(id => {
        const card  = document.getElementById(id);
        const title = card.querySelector('strong').textContent;
        const text  = card.querySelector('textarea').value.trim() || '（未入力）';
        return `【${title}】\n${text}`;
    });
    navigator.clipboard.writeText(lines.join('\n\n')).then(() => {
        const btn = document.getElementById('wsCopyAllBtn');
        btn.textContent = '✓ コピーしました！';
        btn.classList.add('ws-copied');
        setTimeout(() => { btn.textContent = '📋 X項目をまとめてコピー'; btn.classList.remove('ws-copied'); }, 2500);
    });
}
```

**⚠️ 1ページに複数ワークシートがある場合** は、`id`・関数名にサフィックスをつけること（例: `ws-a-1`、`copyCard2`）。

### info-card のアイコン + 見出しレイアウト（必須）

**新規 volXX-1.html で `info-card` を使う場合、アイコンと見出しは必ず横並びにすること。**

```html
<div class="info-card">
    <div class="info-card-header">
        <div class="info-card-icon"><i class="fa-solid fa-..."></i></div>
        <h3>見出し</h3>
    </div>
    <p>説明テキスト</p>
</div>
```

```css
.info-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.info-card-icon { flex-shrink: 0; /* margin-bottom なし */ }
.info-card h3 { margin-bottom: 0; }
.info-card p { font-size: 1rem; color: var(--text-main); font-weight: 500; }
```

- アイコンだけが縦に置かれてその下に見出しというレイアウトは NG（スマホで縦スペースを無駄に使い、見栄えが悪い）
- vol01・vol02 は CSS Grid で対応済み（`grid-template-columns: 44px 1fr`）

### Cursor向け実装禁則（過去の失敗から）

- **タブ名・見出しに英語を混入しない。** Today_Plan.md に「前半」と書いてあれば「前半」のみ。「前半 (First Half)」のような英語サブタイトルを勝手に追加しないこと（Day01で発生した問題）
- **git push前に `git remote -v` で remote を確認すること。** remote が未設定の場合は push を試みず、Today_Plan.md に状況を記載してClaudeCodeに引き継ぐこと
- **cache-bust の値は Today_Plan.md の `[実装メタ情報]` に記載された値をそのまま使うこと。** 自分で推測・変更しない

### 画像素材（NotebookLMスライド）の扱い

- 画像は `assets/` フォルダ（フラット構成）に格納される
- ファイル命名規則: `dayXX_slide1.png`、`dayXX_slide2.png`（総集編は `summary_slide1.png`）
- **HiroyaがNotebookLMの全スライドを `1.png`, `2.png`... で保存 → ClaudeCodeがリネームし、内容を見て使う画像をセクションに割り当てる**
- `assets/dayXX_*.png` が存在する場合、各セクションの内容に合う画像を選んで適切な位置に `<img>` タグで埋め込むこと
- 画像がない場合はテキストのみで実装する（画像待ちで止まらない）
- Today_Plan.md の `[実装メタ情報]` に**使用する**画像ファイル名を明記する（全部使わなくてよい）

## 5. レスポンシブデザイン標準ルール

各 `volXX-1.html` には必ず以下の3段階メディアクエリを含めること。

### コンテナ幅
```css
.container { width: 100%; max-width: 900px; } /* デフォルト（モバイル優先） */

@media (min-width: 769px) {
    .container { max-width: 1050px; }          /* Tablet */
}
@media (min-width: 1200px) {
    .container { max-width: 1240px; }          /* Desktop */
    .tab-content { padding: 50px 70px; }
    .header { padding: 40px 70px 24px; }
}
```

### `.layout-split` クラス（デスクトップ横並びレイアウト）
スライド1枚＋テキストのペアに使う。デスクトップでは左:テキスト / 右:画像の2カラム表示。

```css
/* デフォルト（モバイル）：縦積み */
.layout-split { display: grid; grid-template-columns: 1fr; gap: 20px; margin: 24px 0; align-items: start; }

/* Desktop */
@media (min-width: 1200px) {
    .layout-split { grid-template-columns: 1fr 1fr; gap: 48px; }
    .layout-split .slide-img { margin: 0; }
}
```

HTML構造：
```html
<div class="layout-split">
    <div><!-- テキスト --></div>
    <img src="./assets/dayXX_slideN.png" class="slide-img" alt="...">
</div>
```

## 6. YouTube動画埋め込み標準ルール

各 `volXX-1.html` の前半・後半タブの先頭に、参考動画を `<details>` 折りたたみ形式で埋め込むこと。

### CSS（テンプレートに含めること）
```css
.video-section {
    background: #faf8ff; border: 1px solid #e9d5f5;
    border-radius: var(--radius-medium); padding: 18px 22px; margin-bottom: 36px;
}
.video-section-title { font-size: 0.9rem; font-weight: 700; color: var(--ig-purple); margin-bottom: 12px; }
details.video-item { margin-bottom: 8px; }
details.video-item summary {
    cursor: pointer; font-size: 0.88rem; font-weight: 600; color: var(--text-main);
    padding: 10px 14px; background: #fff; border: 1px solid #ede9f5;
    border-radius: var(--radius-small); list-style: none; display: flex; align-items: center; gap: 8px;
}
details.video-item summary::before { content: '▶'; color: var(--ig-magenta); flex-shrink: 0; }
details.video-item[open] summary::before { content: '▼'; }
details.video-item[open] summary { border-radius: var(--radius-small) var(--radius-small) 0 0; border-bottom: none; }
.video-embed { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border: 1px solid #ede9f5; border-top: none; border-radius: 0 0 var(--radius-small) var(--radius-small); }
.video-embed iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }
```

### HTML構造
```html
<div class="video-section">
    <div class="video-section-title">📺 授業の元動画（前半）</div>
    <details class="video-item">
        <summary>① 動画タイトル（再生時間）</summary>
        <div class="video-embed">
            <iframe src="https://www.youtube.com/embed/VIDEO_ID" allowfullscreen loading="lazy" title="タイトル"></iframe>
        </div>
    </details>
    <!-- 動画数分繰り返す -->
</div>
```

- **VIDEO_IDの取得方法:** YouTubeのURLが `https://youtu.be/XXXXX` なら `XXXXX` がID / `watch?v=XXXXX` なら `XXXXX` がID
- `loading="lazy"` を必ず付けること（パフォーマンス）
- **Today_Plan.md の [実装メタ情報] に各タブのYouTube URLを必ず記載すること**（ClaudeCodeが明示する）
- **「前半・後半共通」とラベルされた動画は両タブに埋め込むこと。** Today_Research.md の要点まとめで `（前半・後半動画N）` と記載されているものは前半・後半の両方の video-section に追加する

## 7. cache-bust フォーマット統一ルール

HTMLファイル末尾の cache-bust コメントは **必ず以下の形式** を使うこと。

```html
<!-- cache-bust: YYYY-MM-DDTHH:MM:SS -->
```

例: `<!-- cache-bust: 2026-06-02T12:00:00 -->`

- `YYYY-MM-DDThh:mm:ss`（ISO 8601形式）に統一する
- ページ固有の文字列を混ぜないこと
- 全 volXX-1.html・.deploy_tmp/ の両ファイルに同じ形式で記入すること

## 8. デプロイ

Cloudflare Pages プロジェクト名: `training-summary-2606`

```
copy index.html .deploy_tmp\  &&  copy vol*.html .deploy_tmp\
git add / commit / push origin master
npx wrangler pages deploy .deploy_tmp --project-name=training-summary-2606
```

## 9. Today_Plan.md フォーマット仕様

Today_Plan.md を上書きする際は、**必ず以下の固定ヘッダーブロックを先頭に置くこと**。Cursorはこのブロックを読んで実装を開始する。

```markdown
# Today_Plan.md

> **Cursor はここから読むこと。固定ヘッダーの指示を最優先で従うこと。**

---

## [実装メタ情報]
- **テンプレートファイル:** volXX-1.html（直前の最新Dayファイルを指定）
- **出力ファイル:** volXX-1.html
- **cache-bust:** YYYY-MM-DDTHH:MM:SS（ClaudeCodeが当日日時で決定・明記する）
- **画像素材:** assets/dayXX_slide1.png、assets/dayXX_slide2.png（なければ「なし」と記載）

---

## [セクション構成]

| # | セクション見出し | 内容概要 |
|---|---|---|
| 1 | 〇〇とは | ... |
| 2 | 〇〇のポイント | ... |
...

---

## [Cursor実装指示]

### 全体方針
- テンプレートを複製し、タイトル・各セクションの内容を差し替える
- テーマカラーはInstagramグラデーション（`#833ab4 → #c13584 → #f77737`）を維持する
- cache-bustコメントを上記の値に更新する

### 各セクション詳細
（セクションごとに見出し・本文・使用する素材・注意点を記載）
```

**運用上のポイント:**
- `cache-bust` の値はClaudeCodeが毎回明示する（Cursorが推測しない）
- `テンプレートファイル` は実在するファイル名を正確に指定する（`vol01-1.html` 等）
- 固定ヘッダーより前に雑多なメモを置かない
