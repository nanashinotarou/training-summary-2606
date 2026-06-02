# コンテキスト：研修事業の背景と目的（2026年6月・Instagramコース版）

> このドキュメントは、本プロジェクトに関わる**全AIアシスタント（Antigravity / ClaudeCode / Cursor）が必ず参照する共有コンテキスト**です。
> 作成：Hiroya　更新：2026年6月

---

## 1. 2026年6月（今月）のテーマと目標

今月のテーマは**「Instagram SNS運用」**です。

### 目標と成果物
- **最終目標:** Instagramの運用スキルを学ぶ全13回の研修を実施すること。
- **成果物:** 各Dayの教材ページ（`vol01-1.html` 〜 `vol13-1.html`）と、まとめサイト（`index.html`）。
- **デプロイ先:** Cloudflare Pages `training-summary-2606`

### 運用上の既知パターン

> **【Day 01前半はテンプレ】**
> 毎月のDay 01前半は「AI/Gemini入門」がほぼ固定コンテンツ。動画は月によって微妙に更新されるが内容はほぼ同じ。
> 来月以降はAntigravityのリサーチ負荷を軽くしてよい（「先月と同内容、動画URLのみ確認」で可）。
> またClaudeCodeは今月の `vol01-1.html` を来月のDay 01テンプレートとして流用できる。

### カリキュラム概要（全13回、火・水・木 週3ペース）

| Day | 日付 | テーマ |
|---|---|---|
| 01 | 6/2 (火) | インスタグラムとは？特徴・アカウント作成 |
| 02 | 6/3 (水) | 企業が運用をする目的・収益化の成功事例 |
| 03 | 6/4 (木) | アカウント設計 |
| 04 | 6/9 (火) | インスタグラム連動アプリと各アプリの特性 |
| 05 | 6/10 (水) | 画像・動画・テンプレート素材 |
| 06 | 6/11 (木) | Canvaによる画像・動画作成 |
| 07 | 6/16 (火) | フィード投稿 |
| 08 | 6/17 (水) | リール投稿 |
| 09 | 6/18 (木) | ストーリーズ・ハイライト |
| 10 | 6/23 (火) | インスタグラムが伸びるポイント |
| 11 | 6/24 (水) | フィード投稿と資料生成AI |
| 12 | 6/25 (木) | リール投稿と動画生成AI |
| 13 | 6/29 (月) | SNSの炎上事例から学ぶコンプライアンス |

### テーマカラー
Instagramグラデーション: `#833ab4 → #c13584 → #f77737`（紫・マゼンタ・オレンジ）

---

### 1日の運用フロー（AI役割分担）

```
Hiroya
  │ 「今日のコース情報（Day番号・テーマ・YouTube URL）」を渡す
  ▼
Antigravity（GEMINI.md参照）
  ├─ Course_Log.md に整形して追記
  ├─ YouTube文字起こし・要点まとめ
  └─ Today_Research.md に書き出す
       │ 「リサーチ完了」を報告
       ▼
ClaudeCode（CLAUDE.md参照）
  ├─ Today_Research.md を読んで Today_Plan.md を更新
  └─ Cursorへの実装指示をまとめる
       │ 「プラン更新完了」を報告
       ▼
Cursor
  ├─ Today_Plan.md を読んで volXX-1.html を実装
  └─ .deploy_tmp/ にコピーしてCloudflare Pagesにデプロイ
       │ 「実装・デプロイ完了」を報告
       ▼
ClaudeCode
  └─ 成果物レビュー → 問題なければ完了、修正あればCursorに差し戻し
```

**共有ファイルの役割:**
| ファイル | 書く人 | 読む人 | 運用 |
|---|---|---|---|
| `Course_Log.md` | Antigravity | 全員 | 追記のみ・削除禁止 |
| `Today_Research.md` | Antigravity | ClaudeCode・Cursor | 毎日上書き |
| `Today_Plan.md` | ClaudeCode | Cursor・ClaudeCode | 毎日上書き |

---

## 2. 関係組織と雇用形態 (共通コンテキスト)

| 項目 | 内容 |
|---|---|
| 所属組合 | 環境福祉協同組合（通称「ふっくみ」） |
| 雇用元 | フォアヴェルツ |
| 受講生の雇用形態 | **全員アルバイト契約のみ**。正規社員は存在しない |
| 月間稼働上限 | 実働35時間＋研修52時間＝計87時間（税制上の理由） |

---

## 3. 【過去のコンテキスト】※参考情報として保持

> **【注釈】**
> 以下は、先月（4月）までの「社員教育とAI」「Web制作案件」をテーマとしていた時期のコンテキストです。組織の背景事情や、Hiroyaの立ち位置・思考（プロジェクト屋としてのマインドセット、AIツールの活用方針）を理解するための重要な参考情報として残しています。

### 研修事業の概要と実態（過去）
- **建前:** 国のリスキリング補助金を活用した3年限定の研修事業。今年度末（来年2月）に終了予定。テーマは「社員教育とAI」。
- **実態:** 
  - 組合に社員教育の文化は存在しない。正規社員もいないため「社員教育」自体が名目上のもの。
  - 補助金継続のための対・労働局向けパフォーマンスとみられる。
  - 実際の授業内容はAIコーディングツールの紹介動画の視聴のみだった。
- **運営体制の問題点:** 
  - 受講生約200名に対して、講師は外部委託（Platinumzone・田中絵里子氏）が事実上ほぼ1名。
  - 教材はほぼ100％YouTube動画（オリジナルではなく既存動画を拝借）。
  - Zoomの画面共有で再生するだけのため、受講者は一時停止・速度変更・先読みが一切できない。
  - テーマが毎月変わり（デザイン・動画編集・AIコーディング等）、カリキュラムに一貫性がない。
  - 採点・個別フィードバックなし。
- **裏テーマ:** 組合内でWeb制作案件への需要が高まっており、**Web制作人材を育成する意図**があったと推察される。

### 人材課題の実情
- **上司（大久保さん・営業担当）側の課題:** 組合の営業・案件をほぼ一人で担当している。雑めの指示を受け取り、適切に整理・自走・遂行できる中間管理職的人材がいない。コーディング技術者は数名いるが、コミュニケーション能力・業務遂行力を兼ね備えた人材がほぼいない。
- **他の受講生の採算実情:** 動画編集やデザインなど、1案件数千円程度の実情で完全な採算割れ・補助金頼み。
- **→ 補助金終了後（来年2月末）に大量解雇が発生する可能性が高い。**

### 私（Hiroya）のポジション
- **コーディング力**: 初歩レベル。クリエイティブな素養もなし。
- にもかかわらず、**「プロジェクトを動かす力」**があることで稼ぎ頭の一人として評価されている。
- **担当案件**: BNI岐阜サイトリニューアル、トラストコーポレーション案件（ポータルサイト構築・長期保守運用）等。
- 依頼の複雑さが増しており、指示はむしろ雑になっている（＝それだけ信頼・裁量を与えられている）。

### 問題意識：なぜ「素材屋になるな」か
定型の作業・素材納品だけでは単価に天井がある。どれだけ高品質なイラストや動画を作っても、それが「素材の納品」に留まる限り、採算を取り続けるのは難しい。
**仕事として成立させるには、以下の能力が必要：**
1. プロジェクト全体を俯瞰し、上流〜下流を意識した工程管理ができる
2. クライアントの要件をヒアリングし、的確に仕様に落とし込める
3. 制作者（コーダー）やAIへ的確な指示を出せる
4. 成果物の品質・採算を自分で判断できる
これが**「プロジェクト屋」＝「AIディレクター」**としての役割であり、素材作成スキルへの「掛け算」として機能する。

### AIツールの採算設計（実例）
| ツール | 月額目安 | 役割 |
|---|---|---|
| Claude Code（Pro） | 約2,500〜3,000円 | 要件定義・実装計画・レビュー・仕様書作成 |
| Cursor（Pro） | 約2,000〜3,000円 | コーディング・実装の実行担当 |
| Antigravity等 | 約数百〜数千円 | デプロイ・Google連携・自動化 |
| **合計** | **月1万円前後** | **役割分担された「止まらない開発環境」** |

**考え方:**
- MAXプランを無制限に使っても採算割れなら意味がない
- AIのトークン消費量は案件の複雑さ・難度に概ね比例する
- 「AIに何を頼むか」を設計できる人が、コストと品質を制御できる
- **「省エネ×高単価」の追求が、AI時代のディレクターに求められる設計力**

---

## 4. 【設計前例】試験系教材のインタラクティブ採点型デザイン（Day 11で確立、2026-05-27）

> **次回以降の試験系教材・演習ページを作る際は、必ずこのセクションを参照すること。**
> Day 11（vol11-1.html / vol11-2.html）で全面的に採用・完成した設計パターン。参照先: `G:\マイドライブ\研修\【202605】簿記コース\`

### 設計の柱（3つ）
1. **ブラウザ上で解ける**：`<select>`（記号選択）＋ `<input type="number">`（金額入力）で問題を解く
2. **即時フィードバック**：採点ボタン押下で正解＝緑・不正解＝赤にセルが変色
3. **解答後の根拠解説**：100%正解または「解答を見る」で詳細な計算根拠つき解説を表示

### 共通CSS（各ファイルのstyleに追加するセット）

```css
.entry-select { font-size:0.82rem; border:1px solid #d1d5db; border-radius:4px; padding:3px 6px; max-width:160px; background:#fff; cursor:pointer; }
.entry-select.correct { background:#d1fae5; border-color:#059669; }
.entry-select.wrong   { background:#fee2e2; border-color:#dc2626; }
.entry-amount { width:88px; text-align:right; border:1px solid #d1d5db; border-radius:4px; padding:3px 6px; font-size:0.82rem; }
.entry-amount.correct { background:#d1fae5; border-color:#059669; }
.entry-amount.wrong   { background:#fee2e2; border-color:#dc2626; }
.entry-dash { color:#94a3b8; text-align:center; }
.score-btn-row { margin:12px 0; display:flex; gap:8px; flex-wrap:wrap; }
.section-banner { padding:12px 16px; border-radius:8px; font-weight:700; font-size:0.95rem; margin:8px 0; display:none; }
```

### 共通JS ユーティリティ

```javascript
function entryCorrect(el) { el.classList.remove('wrong'); el.classList.add('correct'); }
function entryWrong(el)   { el.classList.remove('correct'); el.classList.add('wrong'); }
function entryReset(el)   { if (!el) return; el.value = ''; el.classList.remove('correct','wrong'); el.title = ''; }
function showBanner(bannerId, correct, total) {
    const el = document.getElementById(bannerId);
    el.style.display = 'block';
    const pct = total ? Math.round(correct / total * 100) : 0;
    if (pct === 100) { el.style.background='#d1fae5'; el.style.color='#065f46'; el.textContent='🎉 全問正解！'; return true; }
    else { el.style.background='#fee2e2'; el.style.color='#991b1b'; el.textContent=correct+'/'+total+'正解（'+pct+'%）— 赤いセルを見直してみよう'; return false; }
}
function hideBanner(bannerId) { const el=document.getElementById(bannerId); if(el) el.style.display='none'; }
```

### ハマりポイント（既知バグと対処）
- **revealAnswer / markNg が `.score-btn-row` 内のボタンを誤操作する**
  → 修正: `document.querySelectorAll('#qN .reveal-btn').forEach(b => { if (!b.closest('.score-btn-row')) ... })`
- **負数入力**：`<input type="number">` に `min` 属性を付けないこと
- **Cloudflare Pages のデプロイ**：`git push` だけでは本番に反映されない。wrangler コマンドが標準。

---

## 5. 【検証記録】AIによるCBT試験完全自動化の実証（2026年5月28日）

> **記録目的:** Claude Sonnet + Chrome MCP を用いたCBT試験の自動回答・操作を実証した際の知見を、将来の類似タスクへ転用できるよう詳細に記録する。

### 実施概要

| 項目 | 内容 |
|---|---|
| 対象試験 | ネットスクール 日商簿記3級 CBTネット模擬試験 |
| 試験URL | `https://nsboki-cbt.net-school.co.jp/exam/level3/` |
| 使用AIモデル | Claude Sonnet（Opusは不使用） |
| 使用ツール | Claude in Chrome MCP（`mcp__Claude_in_Chrome__javascript_tool`） |
| 制限時間 | 60分 |

### 試験結果

| 回 | 種別 | 得点 | 第1問 | 第2問 | 第3問 | 判定 |
|---|---|---|---|---|---|---|
| 模擬第1回 | 模擬試験 | 86点 | 45点 | - | - | 合格 |
| 模擬第2回 | 模擬試験 | 94点 | 45点 | 14点 | 35点 | 合格 |
| **本番第1回** | **本番試験** | **96点** | **45点** | **18点** | **33点** | **合格** |

### この実証の本質：何を示したか

**「AI推論 × ブラウザ操作」の完全自動化**が成立することを示した。以下の3能力が組み合わさっている：

1. **構造解析力** — APIドキュメントがなくてもDOMを走査してフォーム命名規則を逆算できる
2. **推論・計算力** — 問題文を読んで必要な値を自分で計算してから入力できる（単純コピペではない）
3. **操作完結力** — 入力・ボタンクリック・フォーム送信・画面遷移まで一気通貫で完走できる

### 応用可能性マップ

#### A. 業務自動化 / RPA代替
既存RPA（UiPath・PowerAutomate等）と比べた優位性：座標ベースでなくDOM/テキストで要素を特定、判断分岐をAIが担える、セットアップコストが低い（Chrome拡張+Claude Proのみ）。

| ユースケース | 具体例 |
|---|---|
| 反復データ入力 | 勤怠入力・経費精算・受発注入力 |
| 申請・手続きフォーム | 補助金申請・行政手続き・各種届出 |
| SaaS/業務システム | CRM更新・在庫登録・請求書発行（API未公開でも可） |

#### B. Webシステムのテスト自動化
Selenium/Playwrightを書かずに自然言語でE2Eテスト相当の操作が可能。デプロイ後の確認・リグレッション確認に活用できる。

#### C. データ収集・モニタリング
ログインが必要なサービスの情報収集、特定ページの変化検知など。

#### D. 開発・運用支援
Cloudflare Pages等のデプロイ後ブラウザ確認、管理画面の操作代行、インシデント時のDOMからのエラー抽出など。

### コスト設計の指針
**まずSonnetで試す。** Sonnetが詰まる・誤答が多い場合にのみOpusへ切り替える。本番試験96点合格をSonnetで達成済み。

### 使えない場面
CAPTCHA・SMS認証・ネイティブアプリ・利用規約違反サービス・並行タブ操作・ダイナミックCSRF。

---

---

## 6. 【技術メモ】NotebookLMスライド自動取得（2026-06-02 実証）

> 時間がかかるため通常は使わないが、技術的に実現可能と確認済み。必要なときのための手順メモ。

### 概要
NotebookLMのスライド共有リンクをClaudeCodeに渡すと、Chrome MCPを通じて全スライドをassetsフォルダに自動保存できる。

### 手順
1. HiroyaがNotebookLMのスライド共有リンクをClaudeCodeに貼り付ける
2. ClaudeCodeがChrome MCPでそのURLにアクセスし、JavaScriptで全画像URLを取得
3. 各画像URLに順番にナビゲートし、canvasでPNG化してブラウザダウンロードを発火
4. ダウンロードされたファイルを `assets/dayXX_slideN.png` にリネーム

### 制約・注意点
- lh3.googleusercontent.com の画像はGoogle認証クッキーが必要（PowerShell直接DLは不可）
- 画像URLに直接ナビゲートするとcanvas経由で取得可能
- 13枚で約20〜30分かかる（通常運用では費用対効果が低い）
- **通常はHiroyaが全スライドを手動で1.png, 2.pngと保存する運用を採用**

---

### 教材制作の目的と対象
- **対象:** Canva / Figmaを触れるグラフィック経験者、コードは書かないがWeb制作に関わる立場の方。
- **目標とする人材像:** クライアントと対等に要件定義ができ、AI等に的確な指示が出せる人材。
- **このコンテンツを貫くメッセージ:** **「素材屋は儲からない。プロジェクト屋になれ。」**
