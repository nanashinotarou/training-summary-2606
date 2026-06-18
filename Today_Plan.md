# Today_Plan.md — Day 09「ストーリーズ・ハイライト」実装計画（完全版）

**作成日時**: 2026-06-18
**対象ファイル**: `vol09-1.html`（新規作成）
**テンプレート元**: `vol08-1.html`（コピーして全内容を差し替える）
**実装担当**: Antigravity → **レビュー・デプロイ: ClaudeCode（必須）** ／ 計画作成: ClaudeCode 2026-06-18
**追加作業**: `vol08-1.html` のまとめタブに「▶ Day 09へ」リンクを実URLに張替え

---

## ⚠ 最重要方針（ユーザー指示）
**NotebookLMスライドの貼り付けだけで済ませない。** 各スライドに対応する本文（説明・手順・効果・補足カード）を必ず添え、簡素なレイアウト/デザインにしない。スライドは要点提示、理解は本文で作る。**画像→本文→画像→本文の縦1列**（`layout-split` は `1fr` のみ・2カラム禁止）。

---

## スライド構成（リネーム）
NotebookLM英語名 → `day09_slideN.png` に通し番号でリネーム（カバー目視確認済み：Stories=前半・Engagement=後半）。

```powershell
$a = "G:\マイドライブ\研修\【202606】Instagramコース\assets"
1..15 | ForEach-Object { Rename-Item "$a\Instagram_Stories_Mastery_-_Slide_$_.png"    "day09_slide$_.png" }
1..15 | ForEach-Object { Rename-Item "$a\Instagram_Engagement_Roadmap_-_Slide_$_.png" ("day09_slide" + ($_ + 15) + ".png") }
```

| セット | ファイル名 | 枚数 |
|---|---|---|
| 前半（Stories Mastery） | `assets/day09_slide1.png` ～ `day09_slide15.png` | 15枚 |
| 後半（Engagement Roadmap） | `assets/day09_slide16.png` ～ `day09_slide30.png` | 15枚 |
| **合計** | | **30枚** |

※各セクションのスライド範囲は目安。実装者は中身を見て内容に合うスライドを配置（調整可）。

---

## 【重要】実装上の注意点
- テンプレート（vol08-1.html）の **CSS・ライトボックス・タブJS・clock.js タグ** をそのまま引き継ぐ
- `layout-split` の 2カラム化禁止（`@media(min-width:1200px)` の2カラム指定を足さない）
- スライド画像と説明文は**縦1列**（テキスト→画像 or 画像→テキスト）
- 動画は `<details class="video-item">` アコーディオン（`loading="lazy"` + `title` 必須）
- 設定値・URL・プロンプトは `<code>`／`quote-box`／`<pre>` で表示（Markdownバッククォート禁止）
- **リサーチ `Today_Research.md` の誤変換「最大限 of 幸福」は「最大限の幸福」に直して使う**

---

## ① vol08-1.html の修正（最初に行うこと）
まとめタブ末尾 `tab-nav-footer` の「▶ Day 09へ」を実URLへ：
```html
<!-- 変更前 --> <a href="#" class="tool-link-btn">▶ Day 09へ</a>
<!-- 変更後 --> <a href="./vol09-1.html" class="tool-link-btn">▶ Day 09へ</a>
```
→ vol08-1.html と `.deploy_tmp/vol08-1.html` の cache-bust も `2026-06-18T20:00:00` に更新。

---

## ② vol09-1.html の新規作成

### 基本設定
- `<title>`: `Day 09 ストーリーズ・ハイライト | Instagram運用コース`
- `.day-title`: `Day 09` ／ `.day-subtitle`: `ストーリーズ・ハイライト`
- `header-sub`: `親密度を上げる運用と"心を動かす"導線設計 — Jun 2026`
- `progress-pill`: `Day 09 / 13` ／ `back-link`: `./vol08-1.html`（Day 08へ）
- cache-bust: `<!-- cache-bust: 2026-06-18T20:00:00 -->`
- タブラベル：「今日の目標」「前半」「後半」「今日のまとめ」

---

### タブ1: 今日の目標（`id="goal"`）
**カバースライド**: `<img src="assets/day09_slide1.png" alt="Day09 カバー" class="slide-img cover-slide">`

**今日のゴール**:
> ストーリーズの基本操作とハイライト・アクション機能を習得し、フォロワーとの「親密度」を高める仕掛けと、見た人の"心と行動（DM）"を動かす問いかけを、自分の発信に1つ落とし込めるようになる。

**ポイントカード（3枚・info-card）**:
1. アルゴリズムが評価する「親密度」の仕組み（DM返信が最重要）を理解し、双方向スタンプで反応を取れるようになる
2. 暗めフィルター・右下スタンプ配置・Canvaマジック拡張など、伝わるストーリーズの作り方を身につける
3. 外部リンク直貼りを避けてプロフィール導線に誘導し、「問いかけ（フック）」でDM数を伸ばす運用法を知る

**フッター**: `<button class="tool-link-btn" onclick="openTab('first')">前半へ進む <i class="fa-solid fa-arrow-right"></i></button>`

---

### タブ2: 前半（`id="first"`）— 作り方・親密度・ハイライト
**見出し**: `前半 ／ フォロワーとの「親密度」を爆上げする基本とハック`
**スライド**: `day09_slide2`〜`day09_slide15` を縦1列で配置（各スライドに下記本文）。

#### SECTION A: ストーリーズのアルゴリズムと親密度（要点1）
- **info-card 2枚並べ**:〔高評価＝親密度UP〕①DM返信（最重要）②プロフィール移動 ③スタンプタップ ④長押し滞在 ⑤戻る・見直し ⑥リンクタップ ‖〔低評価＝DOWN〕スワイプ離脱・即離脱・早送り
- **親密度を上げる5つの双方向スタンプ**: <code>アンケート</code> <code>質問</code> <code>クイズ</code> <code>絵文字スライダー</code> <code>お題</code>
- **NG行動**: 文字が小さすぎ／毎回リンクばかり／更新が不規則 → **1日1回以上**投稿でプロフィール枠（周り枠）をアクティブに保つ

#### SECTION B: 作成の基本と便利機能（要点2）
- **step-card（操作手順）**: ①撮影（長押しで動画）or 写真選択 → ②暗めフィルター <code>Now2.0</code> で文字を際立たせる → ③テキスト（上品=明朝体／インパクト=ゴシック体）→ ④**スタンプは画面の右下**へ（右下タップで進める人が多くリアクション率UP）
- **便利機能カード**: BGM of the day（最大15秒・切取り）／ハッシュタグ・位置情報・メンション／**ストーリーコメント欄**（2024年9月新機能・24時間限定で全員可視＝気軽に書かれる）／リポスト（メンションDMから・全画面拡大）

#### SECTION C: CanvaのAIと黄金レイアウト（要点3）
- **マジック拡張（Magic Expand）**: 横長・見切れ写真をAIが背景補完して <code>9:16</code> 縦長化 → 素材を実質無限に
- **黄金レイアウト3パターン（info-card 3枚）**: ①上に文字・下に画像（Zの法則／左上に大きくタイトル）②上に画像・下に文字（文字下に白グラデで可読性）③真ん中に文字＝万能（黒半透明＋白文字／滞在時間UP）

#### SECTION D: ハイライトで資産にする
- 24時間で消えるストーリーズを **ハイライト** にまとめると、後から来た新規フォロワーの滞在時間を伸ばす「カタログ（プロフィールに残る資産）」になる
- 実習でハイライトのカテゴリ分けを実際に作る（実習Aと連動）

#### 動画セクション（前半3本）`<div class="video-section">`（`video-section-title`: 📺 授業の元動画（前半））
1. `<details class="video-item">` 【Instagramストーリーズ】親密度を爆上げする方法（約3:00）— embed `https://www.youtube.com/embed/SD4UJJ4dYL8`
2. 【ストーリー実践】ストーリーズの作り方を総フォロワー50万人の運用者が超詳しく解説（約29:50）— embed `https://www.youtube.com/embed/XSc_Z-_KgM8`
3. 【センスゼロでも】canvaワンクリックでインスタストーリーを作る方法（約20:10）— embed `https://www.youtube.com/embed/W8ixFxr_aQU`

#### ワークシートA（実習）
- タイトル：**ストーリーズで10秒動画を投稿しよう**／目的：基本操作・**ハイライト追加**・**アクション（双方向スタンプ）機能の追加**
- 実習ページ: `<a href="https://platinumzone.co.jp/dx-biome/2606/618instagram_stories_practice.html" target="_blank" rel="noopener" class="tool-link-btn">実習ページを開く</a>`
- worksheet-card: 「使った双方向スタンプ」「作ったハイライトのカテゴリ名」をメモする欄

**フッター**: `<button class="tool-link-btn secondary" onclick="openTab('second')">後半へ <i class="fa-solid fa-arrow-right"></i></button>`

---

### タブ3: 後半（`id="second"`）— 心と行動を動かす運用法
**見出し**: `後半 ／ 閲覧数・DM数を伸ばす「心と行動を動かす」運用法`
**スライド**: `day09_slide16`〜`day09_slide30` を縦1列で配置。

#### SECTION E: 最新の役割と外部リンクNG（要点4）
- ストーリーズは**リールの補助・補足**。複数枚で疲弊せず「**渾身の1枚（読むストーリーズ）**」に有益情報を凝縮
- **STOP：外部リンク直貼りNG** — Instagramが「アプリ外へ逃がすアカウント」と評価し表示優先度↓→閲覧数激減
- **正しい導線**: ストーリー →（直リンクせず）**プロフィールリンク**へ誘導（インスタ内完結で評価が落ちず、意欲の高いファンだけ登録で成約率UP）
- 離脱防止デザイン: 暗背景＋白文字で読ませる／ポートレートで背景ぼかし・被写体右端・文字左上（Zの法則）

#### SECTION F: DM数を2倍にする「問いかけ（フック）」（要点5）
- 自己満足の長文ではなく、冒頭に必ず**フック**を入れて思考を動かす
- **3つの感情アプローチ（info-card 3枚）**: ①問題の顕在化（「こんなお悩みありませんか？」）②理想のイメージ化（具体的な未来）③痛みの掘り起こし（現状維持の痛みを言語化）
- **5つの問いかけフック**（リサーチ要点5の5例をカード化。※「最大限の幸福」表記に直す）

#### SECTION G: 売上を作る「問題意識」の教育ファネル（要点6）
- **黄金の4階段（step-card／後半スライドのメイン図）**: Step1 問題の顕在化（気づき）→ Step2 理想のイメージ化（憧れ）→ Step3 痛みの掘り起こし（共感・恐れ）→ **Step4 行動への誘導（背中を押す＝DM送信）**
- **問題意識を育てる4要素**: ①理想と現状のギャップ整理 ②うまくいかない原因の特定 ③放置リスク（インフレで貯金が目減り 等）④時間の優位性（早く動いた人が勝つ）
- **上手に損する思考**: 短期の支出を長期リターンへの投資と捉えさせる

#### 動画セクション（後半3本）`video-section`（📺 授業の元動画（後半））
4. 【最新戦略】閲覧数が10倍になるインスタのストーリーズの作り方！（13:46）— embed `https://www.youtube.com/embed/DvgNxjIwaSQ`
5. 【保存版】Instagramストーリーズ攻略！「DM数を2倍にする」運用法（20:05）— embed `https://www.youtube.com/embed/Qgfj-zUuDgU`
6. 【最重要】ストーリーズで売上を作るための問題意識の作り方（18:39）— embed `https://www.youtube.com/embed/NN19KnXUFAY`

#### ワークシートB（実習）
- タイトル：**目標達成に向けて課題を作成しよう**
- ワークフロー: `<a href="https://platinumzone.co.jp/dx-biome/2606/dx_workflow_oshi.html" target="_blank" rel="noopener" class="tool-link-btn">ワークフローを開く</a>`
- Padlet: `<a href="https://padlet.com/platinumzonedx/dx-instagram-sfikt2pbwarlfa1x" target="_blank" rel="noopener" class="tool-link-btn secondary">Padletシェアボード</a>`
- worksheet-card: 「自分の発信に使う問いかけフックを1つ作る」欄

**フッター**: `<button class="tool-link-btn" onclick="openTab('summary')">今日のまとめへ <i class="fa-solid fa-arrow-right"></i></button>`

---

### タブ4: 今日のまとめ（`id="summary"`）
**今日学んだこと（4点・sticky-grid 4枚）**:
1. 親密度の最重要アクションは**DM返信**。双方向スタンプ（アンケート/質問/クイズ等）を右下に置き、1日1回投稿で枠をアクティブに保つ
2. 作り方：暗めフィルター×文字、Canvaマジック拡張で素材を縦長化、黄金レイアウト3パターンで可読性を確保
3. **外部リンクは直貼りせずプロフィール導線へ**。ストーリーズはリールの補助として渾身の1枚で勝負
4. **問いかけ（フック）→黄金の4階段**で心と行動を動かす。問題意識を育ててDM・売上につなげる

**フッター**（Day10未作成のため `href="#"` のまま）:
```html
<div class="tab-nav-footer">
    <a href="#" class="tool-link-btn">▶ Day 10へ</a>
    <a href="./index.html" class="tool-link-btn secondary"><i class="fa-solid fa-house"></i> コース一覧に戻る</a>
</div>
```

---

## ③ Antigravity向け実装チェックリスト
- [ ] `vol08-1.html` まとめタブの「▶ Day 09へ」を `href="#"` → `href="./vol09-1.html"` に変更
- [ ] `vol08-1.html` を `vol09-1.html` にコピーして**全内容を差し替え**
- [ ] スライド `assets/day09_slideN.png`（N=1〜30）を使用。`day09_slide1` のみ `.cover-slide`
- [ ] 前半3本・後半3本を `<details class="video-item">`（`loading="lazy"` + `title` 必須）。前半は前半タブ・後半は後半タブ
- [ ] `<code>` チップ：`Now2.0`／`9:16`／URL／プロンプト
- [ ] cache-bust: `<!-- cache-bust: 2026-06-18T20:00:00 -->`
- [ ] まとめの「▶ Day 10へ」は `href="#"` のまま
- [ ] `.deploy_tmp/vol08-1.html` と `.deploy_tmp/vol09-1.html` も同内容に更新

---

## ④ デプロイ手順（ClaudeCode担当）
```powershell
Set-Location "G:\マイドライブ\研修\【202606】Instagramコース"
Copy-Item assets\day09_slide*.png .deploy_tmp\assets\ -Force
Copy-Item vol08-1.html .deploy_tmp\ -Force
Copy-Item vol09-1.html .deploy_tmp\ -Force
$ts = Get-Date -Format "yyyyMMddHHmmss"
$dest = "C:\Users\Hi\AppData\Local\Temp\deploy-instagram-2606-$ts"
New-Item -ItemType Directory -Path $dest | Out-Null
Copy-Item ".deploy_tmp\*" $dest -Recurse -Force
Set-Location $dest
npx wrangler pages deploy . --project-name=training-summary-2606 --commit-dirty=true
```
本番確認: `https://training-summary-2606.pages.dev/vol09-1.html`

---

## ⑤ レビュー必須チェック（Day08の不具合からの再発防止・ClaudeCodeレビュー時に必ず）
Antigravity（特にFlash）実装は差し替え漏れ・文字化けが出るため、**デプロイ前のClaudeCodeレビューを必須工程**とする。
- [ ] テンプレ複製後、**全4タブ**（目標／前半／後半／まとめ）の本文・スライド・動画・実習が Day09 内容へ差し替わっているか、1タブずつ照合（Day08で前半タブ丸ごと残存・後半スライド0枚の事故あり）
- [ ] **目標タブのポイントカード3枚**がコピー元（Day08）の文言のまま残っていないか
- [ ] 本文を全文検索し、**半角英単語の混入**（特に` of `／` in `／` the `＝助詞「の」化け）がないか
- [ ] 後半SECTIONに**後半スライド（slide16〜30）が実際に挿入**されているか、枚数を数えて確認
- [ ] スライド計30枚・動画計6本が揃っているか（コース情報共有 Day9 と一致）
- [ ] 合格項目（layout-split 1fr・lightbox・cover-slide・lazy+title・code・cache-bust ISO形式）を全クリア
