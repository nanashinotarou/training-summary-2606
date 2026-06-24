# Today_Plan.md — Day 11「フィード投稿と資料生成AI」前半 実装計画

**作成日時**: 2026-06-24  
**対象ファイル**: `vol11-1.html`（新規作成）  
**テンプレート元**: `vol10-1.html`（コピーして全内容を差し替える）  
**実装担当**: Antigravity → **レビュー: Codex（機械チェック）**  
**追加作業**: `vol10-1.html` のまとめタブ「▶ Day 11へ」を実URLに張替え

---

## ⚠ 最重要方針（ユーザー指示）

スライドの貼り付けだけで済ませない。各スライドに対応する本文・手順・補足カードを必ず添える。**縦1列**（`layout-split` 2カラム禁止）。手順・コマンドは `<code>` または `<pre>` で表示。

---

## スライド構成（リネーム）

```powershell
$a = "G:\マイドライブ\研修\【202606】Instagramコース\assets"
1..14 | ForEach-Object { Rename-Item "$a\Magical_AI_Content_Factory_-_Slide_$_.png" "day11_slide$_.png" }
```

| ファイル名 | 枚数 |
|---|---|
| `assets/day11_slide1.png` ～ `day11_slide14.png` | 14枚（前半のみ） |

---

## ① vol10-1.html の修正（最初に行うこと）

まとめタブ末尾 `tab-nav-footer` の「▶ Day 11へ」を実URLへ：

```html
<!-- 変更前 --> <a href="#" class="tool-link-btn">▶ Day 11へ</a>
<!-- 変更後 --> <a href="./vol11-1.html" class="tool-link-btn">▶ Day 11へ</a>
```

→ vol10-1.html の cache-bust を `<!-- cache-bust: 2026-06-24T20:00:00 -->` に更新。

---

## ② vol11-1.html の新規作成

### 基本設定

- `<title>`: `Day 11 フィード投稿と資料生成AI | Instagram運用コース`
- `.day-title`: `Day 11` ／ `.day-subtitle`: `フィード投稿と資料生成AI`
- `header-sub`: `CanvaとChatGPTで投稿を"量産"する時短ワークフロー — Jun 2026`
- `progress-pill`: `Day 11 / 13` ／ `back-link`: `./vol10-1.html`（Day 10へ）
- cache-bust: `<!-- cache-bust: 2026-06-24T20:00:00 -->`
- clock.js: `<script src="./clock.js?v=20260621a"></script>`
- タブラベル：「今日の目標」「前半」「後半」「今日のまとめ」

---

### タブ1: 今日の目標（`id="goal"`）

**カバースライド**: `<img src="assets/day11_slide1.png" alt="Day11 カバー" class="slide-img cover-slide">`

**今日のゴール**:
> CanvaのAI一括作成機能とChatGPTを組み合わせ、投稿コンテンツを「自動化・量産」するワークフローの全体像を理解し、自分のアカウントに使えるCSV設計とデータバインドを1セット試せるようになる。

**ポイントカード（3枚・info-card）**:
1. Canvaの「一括作成（Bulk Create）」機能で、テンプレートに大量データを流し込む仕組みを理解し、サイドバーから有効化できる
2. ChatGPTに「CSV形式で出力して」と指示するだけで、Canvaへ流し込める投稿用データの設計図（見出し・キャプション等）が作れるようになる
3. データバインドの3ステップ（インポート→接続→生成）を踏んで、複数デザインを一括で自動生成できる

**フッター**: `<button class="tool-link-btn" onclick="openTab('first')">前半へ進む <i class="fa-solid fa-arrow-right"></i></button>`

---

### タブ2: 前半（`id="first"`）— Canva×ChatGPT 量産ワークフロー

**見出し**: `前半 ／ CanvaとChatGPTで投稿を"量産"する3ステップ`  
**スライド**: `day11_slide2`〜`day11_slide14` を縦1列で配置。

#### SECTION A: Canva「一括作成（Bulk Create）」とは（要点1）

- **機能概要**：複数のテキスト・画像データをデザインテンプレートに一括で流し込み、数十〜数百枚の投稿画像やリール動画を瞬時に自動生成する機能。毎回手作業でデザインする必要がなくなる「量産エンジン」
- **有効化の手順（step-card）**:
  - Step 1: Canva編集画面の左サイドバー → 「アプリ」を開く
  - Step 2: 検索欄に <code>一括作成</code> と入力 → ツールを有効化
  - Step 3: テンプレートを開いた状態で使用可能になる
- **活用イメージ**: 1つのテンプレート × 50行のCSV = **50枚の投稿が数秒で完成**

#### SECTION B: ChatGPTで「設計図（CSV）」を作る（要点2）

- **なぜCSVか**：Canvaの一括作成はCSV形式のデータを読み込む。ChatGPTに「表形式で出力して」と指示するだけで、そのままCanvaに流し込める設計図が作れる
- **CSVの基本4列構成（info-card）**:
  - `アイデア` — 投稿のテーマ・切り口
  - `見出し` — サムネイル上に表示するキャッチコピー
  - `キャプション` — 本文（1行目にキーワードを入れる三位一体）
  - `画像プロンプト` — Canva AIまたは別の画像生成AIへの指示文
- **ChatGPTへのプロンプト例（`<pre>` で表示）**:

```
以下の条件で投稿アイデアを10件、CSV形式で作成してください。
列名: アイデア,見出し,キャプション,画像プロンプト
条件: [自分のジャンル・ターゲット・トーン]
```

- **ポイント**: 列名をCanvaのテンプレート変数名と一致させると、接続作業がスムーズになる

#### SECTION C: データバインドで一括生成する（要点3）

- **3ステップ（step-card）**:
  - Step 1: **インポート** — 一括作成パネルから「CSVをアップロード」または「データを手動入力」でデータを読み込む
  - Step 2: **データバインド（接続）** — テンプレート上のテキストボックス・画像フレームを右クリック → 「データの接続」をクリック → CSVの対応する列名を選択して接続
  - Step 3: **一括生成の実行** — 「続行」をクリックすると全データ分のデザインが新しいページとして一瞬で生成される
- **完成後の使い方**: 生成されたデザインを一括でPNG/MP4ダウンロード → Instagramに順次投稿。ネタ切れゼロの「コンテンツ在庫」を作れる

#### 動画セクション（2本）`<div class="video-section">`（`video-section-title`: 📺 授業の元動画（前半））

1. `<details class="video-item">` 【2026年最新】超時短！インスタ投稿・リールを一瞬で自動生成する方法 Canva×ChatGPT（22:35）  
   — embed `https://www.youtube.com/embed/v0ugbT1wq78`
2. `<details class="video-item">` 【ChatGPT×Canva】インスタグラム投稿を自動化で主婦が月10万円稼ぐ！（約18:00）  
   — embed `https://www.youtube.com/embed/60hBVQzVJU0`

**フッター**: `<button class="tool-link-btn secondary" onclick="openTab('second')">後半へ <i class="fa-solid fa-arrow-right"></i></button>`

---

### タブ3: 後半（`id="second"`）— 準備中プレースホルダー

```html
<div class="section-block">
    <p style="text-align:center; color:var(--text-muted, #999); padding:40px 0;">
        後半コンテンツは準備中です。
    </p>
</div>
```

**フッター**: `<button class="tool-link-btn" onclick="openTab('summary')">今日のまとめへ <i class="fa-solid fa-arrow-right"></i></button>`

---

### タブ4: 今日のまとめ（`id="summary"`）

**今日学んだこと（4点・sticky-grid 4枚）**:
1. Canva一括作成はテンプレ＋CSVデータで**数十〜数百枚**の投稿を瞬時に生成できる「量産エンジン」。毎回の手作業が不要になる
2. ChatGPTに「〇〇を表形式でXX行出力して」と指示するだけでCanvaへ流し込めるCSV設計図が作れる。列名をテンプレート変数名と合わせるのがコツ
3. データバインド3ステップ（①CSVインポート ②テキスト/画像フレームを右クリック→データ接続 ③続行で一括生成）
4. 見出し・キャプション・画像プロンプトをCSVの列として設計しておけばコンテンツ在庫をまとめて作れる。ネタ切れゼロのループを回す

**フッター**（Day12未作成のため `href="#"` のまま）:
```html
<div class="tab-nav-footer">
    <a href="#" class="tool-link-btn">▶ Day 12へ</a>
    <a href="./index.html" class="tool-link-btn secondary"><i class="fa-solid fa-house"></i> コース一覧に戻る</a>
</div>
```

---

## ③ Codex機械チェックリスト

```powershell
# ① of化けチェック（0件なら合格）
Select-String -Path vol11-1.html -Pattern " of | in | the " -CaseSensitive

# ② スライド枚数（14件なら合格）
(Select-String -Path vol11-1.html -Pattern "day11_slide" | Measure-Object).Count

# ③ 動画数（2件なら合格）―― class= で絞りCSS行を除外
(Select-String -Path vol11-1.html -Pattern 'class="video-item"' | Measure-Object).Count

# ④ cover-slide 存在（1件なら合格）
Select-String -Path vol11-1.html -Pattern "cover-slide"

# ⑤ cache-bust 形式（2026-06-24T20:00:00 なら合格）
Select-String -Path vol11-1.html -Pattern "cache-bust: 2026-06-24T20:00:00"

# ⑥ vol10のDay11リンク差し替え確認（vol11-1.htmlが含まれていれば合格）
Select-String -Path vol10-1.html -Pattern "vol11-1\.html"
```

---

## ④ Codexへの注意事項（必読）

- **INDEX.mdを更新する場合は既存の「Instagramコース 2606」行を上書き更新すること。新規行を追加しない。テーブルは4列（プロジェクト｜詳細ファイル｜最終更新｜一言概要）を維持すること**
- チェックコマンドの結果が想定外の数値でも、コード側を変更してカウントを合わせないこと。必ず「結果：X件、想定：Y件、原因仮説」の形式で報告すること
- デプロイは行わないこと

---

## ⑤ デプロイ手順（Codex or ClaudeCode担当）

```powershell
Set-Location "G:\マイドライブ\研修\【202606】Instagramコース"
.\deploy.ps1
```

本番確認: `https://training-summary-2606.pages.dev/vol11-1.html`
