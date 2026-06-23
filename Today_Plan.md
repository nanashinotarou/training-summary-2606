# Today_Plan.md — Day 10「インスタグラムが伸びるポイント」前半実装計画

**作成日時**: 2026-06-23  
**対象ファイル**: `vol10-1.html`（新規作成）  
**テンプレート元**: `vol09-1.html`（コピーして全内容を差し替える）  
**実装担当**: Antigravity → **レビュー: ClaudeCode（必須）** ／ デプロイ: Codex試験可  
**追加作業**: `vol09-1.html` のまとめタブの「▶ Day 10へ」リンクを実URLに張替え

---

## ⚠ 最重要方針（ユーザー指示）

**NotebookLMスライドの貼り付けだけで済ませない。** 各スライドに対応する本文（説明・手順・効果・補足カード）を必ず添え、簡素なレイアウト/デザインにしない。スライドは要点提示、理解は本文で作る。**画像→本文→画像→本文の縦1列**（`layout-split` は `1fr` のみ・2カラム禁止）。

---

## スライド構成（リネーム）

NotebookLM英語名 → `day10_slideN.png` に通し番号でリネーム（今回は前半のみ・14枚）。

```powershell
$a = "G:\マイドライブ\研修\【202606】Instagramコース\assets"
1..14 | ForEach-Object { Rename-Item "$a\Instagram_Level_Up_-_Slide_$_.png" "day10_slide$_.png" }
```

| ファイル名 | 枚数 |
|---|---|
| `assets/day10_slide1.png` ～ `day10_slide14.png` | 14枚（全て前半） |

※実装者は中身を確認し、セクション分けと配置を内容に合わせて調整すること。

---

## 【重要】実装上の注意点

- テンプレート（vol09-1.html）の **CSS・ライトボックス・タブJS・clock.js タグ** をそのまま引き継ぐ
- `layout-split` の 2カラム化禁止（`@media(min-width:1200px)` の2カラム指定を足さない）
- スライド画像と説明文は**縦1列**（テキスト→画像 or 画像→テキスト）
- 動画は `<details class="video-item">` アコーディオン（`loading="lazy"` + `title` 必須）
- 設定値・URL・プロンプトは `<code>`／`quote-box`／`<pre>` で表示（Markdownバッククォート禁止）
- **後半タブは「準備中」プレースホルダーを置くだけ**（コンテンツ追加禁止）

---

## ① vol09-1.html の修正（最初に行うこと）

まとめタブ末尾 `tab-nav-footer` の「▶ Day 10へ」を実URLへ：

```html
<!-- 変更前 --> <a href="#" class="tool-link-btn">▶ Day 10へ</a>
<!-- 変更後 --> <a href="./vol10-1.html" class="tool-link-btn">▶ Day 10へ</a>
```

→ vol09-1.html の cache-bust を `<!-- cache-bust: 2026-06-23T20:00:00 -->` に更新。

---

## ② vol10-1.html の新規作成

### 基本設定

- `<title>`: `Day 10 インスタグラムが伸びるポイント | Instagram運用コース`
- `.day-title`: `Day 10` ／ `.day-subtitle`: `インスタグラムが伸びるポイント`
- `header-sub`: `フォロワー数より「質」の時代へ — Jun 2026`
- `progress-pill`: `Day 10 / 13` ／ `back-link`: `./vol09-1.html`（Day 09へ）
- cache-bust: `<!-- cache-bust: 2026-06-23T20:00:00 -->`
- clock.js: `<script src="./clock.js?v=20260621a"></script>`
- タブラベル：「今日の目標」「前半」「後半」「今日のまとめ」

---

### タブ1: 今日の目標（`id="goal"`）

**カバースライド**: `<img src="assets/day10_slide1.png" alt="Day10 カバー" class="slide-img cover-slide">`

**今日のゴール**:
> フォロワー数より投稿の「質」が重視される新アルゴリズムの本質を理解し、視聴維持率・共有数・オリジナリティを意識したリール制作の基礎を、自分の発信に1つ落とし込めるようになる。

**ポイントカード（3枚・info-card）**:
1. InstagramCEOが「フォロワー数は意味がない」と明言した背景〜Uアルゴリズムの仕組みを理解し、なぜ今が初心者に有利な時代なのかを知る
2. 投稿の質を決める4指標（視聴維持率・ターゲット・オリジナリティ・共有数）を整理し、特に「共有（紙飛行機マーク）」が最重要アクションである理由を知る
3. 初心者がなぜ伸びやすいか（比率評価・自動テスト再生）を理解し、AIに「誰向けか」を学習させるための最初の目標「30本投稿」を設定できる

**フッター**: `<button class="tool-link-btn" onclick="openTab('first')">前半へ進む <i class="fa-solid fa-arrow-right"></i></button>`

---

### タブ2: 前半（`id="first"`）— アルゴリズムと投稿の質

**見出し**: `前半 ／ 「フォロワー数」から「質と共有」へ〜伸びるリールの新常識`  
**スライド**: `day10_slide2`〜`day10_slide14` を縦1列で配置（各スライドに下記本文）。

#### SECTION A: アルゴリズムの転換〜「フォロワー数より質」の時代（要点1）

- **InstagramCEO発言の真意**：「フォロワー数は意味がない」＝アルゴリズムが「人気アカウント優先」から「個人の興味・関心に合う質の高い投稿」へシフトしているため
- **Uアルゴリズム（関心アルゴリズム）**の登場：ユーザー自身が興味ジャンル（例：ネイル等）を設定すると優先表示される仕組み。海外でテスト実装中、日本にも近く導入予定
- **以前 vs 現在の比較（info-card 2枚並べ）**:
  - 以前：人気アカウントを表示 → フォロワー総数が多いほど有利
  - 現在：ユーザー個人の興味に合う「質の高い投稿」を表示 → 投稿の中身が最重要
- **Google/AI検索からの流入**が2025年比で160倍に激増。「インスタを検索する人」が増えている今が仕込み時

#### SECTION B: 投稿の質を決める4つの評価指標（要点2）

**4指標を info-card 4枚で**（各カードに概要＋実践ポイントを記載）:

1. **視聴維持率（完読率）** — 動画が最後まで見られたか。インサイトで冒頭離脱が多い場合は1秒目に「意外性フック（例：実はこれ…）」や「質問フック（例：これできる？）」を置く
2. **ターゲットの明確化** — 悩みを具体的に絞り込み、プロフィールに1文で明記。アルゴリズムはプロフィールを参考に「誰におすすめすべきか」を判断している
3. **投稿のオリジナリティ** — AI作成そのまま・他人のコピーは埋もれる。自分の体験談・失敗談・検証期間などのリアルな一次情報が差別化になる
4. **共有（シェア）数【最重要】** — 紙飛行機マーク。投稿を見た人が他者にアプリを開かせる＝Instagram運営が最も価値を置くアクション。いいね・保存よりも重視される

**共有されやすい投稿の3パターン（info-card 3枚）**:
- **あるある投稿**：日常の共感（子育て・転職・ダイエット我慢など）
- **勉強になる投稿**：ノウハウまとめ・知って得する雑学・名言
- **感情が大きく動く話題**：賛否両論あるテーマ（割り勘ありなし等）や驚き情報

#### SECTION C: 初心者が伸びる理由とリール制作の鉄則（要点3）

- **初心者優遇と比率評価の仕組み**：昔はフォロワー総数が有利だったが、現在はフォロワー数に対する「反応の割合」が重視される。間違った運用で割合が極めて低い大御所より、フォロワーは少なくても割合が高い新規アカウントの方がおすすめに載りやすい
- **自動テスト再生とAI属性学習**：フォロワー0人でも投稿リールは必ず数百回自動再生される。AIがA〜Dなどの属性グループにテスト表示し「どの層に受けるか」を判定。初期テストで維持率が高ければ一気に拡散される
- **まず「30本投稿」を目指す理由**：AIの属性学習精度を高め、アルゴリズムに「自分の投稿は誰向けか」を覚えさせるために30本が最初の目標
- **リール制作の鉄則 3ルール（step-card）**:
  - Step 1: **徹底した他者リサーチ** — 自分の言いたいことではなく、同ジャンルで「直近1週間以内」にフォロワー数以上の再生（3〜10万再生目安）を出した伸びたテーマを模倣する
  - Step 2: **冒頭1秒の設計** — 録画開始時の謎の間・画質の粗さは即離脱を招く。損失回避の心理に基づき「痩せる方法」より「これやると絶対太る」というネガティブ訴求が最もクリックされる
  - Step 3: **初心者は短尺（40秒〜1分）** — 長すぎると維持率が下がる。コンパクトにまとめることで完読率を高める

#### 動画セクション（2本）`<div class="video-section">`（`video-section-title`: 📺 授業の元動画）

1. `<details class="video-item">` 【衝撃】フォロワーを増やす時代はもう終わりました。（約20:38）  
   — embed `https://www.youtube.com/embed/fmGfol7kU2E`
2. `<details class="video-item">` 【2026年 Instagram攻略】フォロワー爆伸びさせる５つのポイントを徹底解説します（約13:07）  
   — embed `https://www.youtube.com/embed/FNFyKowO-K4`

**フッター**: `<button class="tool-link-btn secondary" onclick="openTab('second')">後半へ <i class="fa-solid fa-arrow-right"></i></button>`

---

### タブ3: 後半（`id="second"`）— 準備中プレースホルダー

**内容**: 後半コンテンツは準備中のため、以下のプレースホルダーのみ設置。**本文・スライド・動画は追加しないこと。**

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
1. アルゴリズムが「フォロワー総数」から「反応の割合・投稿の質」重視へ転換。Uアルゴリズム上陸前の今が仕込み時
2. 最重要アクションは「共有（紙飛行機）」。あるある・勉強になる・感情が動く投稿で共有されやすくなる
3. 初心者はフォロワー0でも自動テスト再生される。AIに「誰向けか」を学習させるためにまず**30本投稿**を目指す
4. リール鉄則：直近1週間で伸びている他者を真似る・冒頭1秒でフック・短尺（40〜60秒）でコンパクトに

**フッター**（Day11未作成のため `href="#"` のまま）:
```html
<div class="tab-nav-footer">
    <a href="#" class="tool-link-btn">▶ Day 11へ</a>
    <a href="./index.html" class="tool-link-btn secondary"><i class="fa-solid fa-house"></i> コース一覧に戻る</a>
</div>
```

---

## ③ Antigravity向け実装チェックリスト

- [ ] `vol09-1.html` まとめタブの「▶ Day 10へ」を `href="#"` → `href="./vol10-1.html"` に変更
- [ ] `vol09-1.html` の cache-bust を `<!-- cache-bust: 2026-06-23T20:00:00 -->` に更新
- [ ] `vol09-1.html` を `vol10-1.html` にコピーして**全内容を差し替え**
- [ ] スライドリネームコマンドを実行（`Instagram_Level_Up_-_Slide_N.png` → `day10_slideN.png`）
- [ ] スライド `assets/day10_slideN.png`（N=1〜14）を使用。`day10_slide1` のみ `.cover-slide`
- [ ] 動画2本を `<details class="video-item">`（`loading="lazy"` + `title` 必須）
- [ ] 後半タブは**プレースホルダーのみ**（コンテンツを書かない）
- [ ] `<code>` チップ：`Now2.0` のような固有名称・コード・URL
- [ ] cache-bust: `<!-- cache-bust: 2026-06-23T20:00:00 -->`
- [ ] まとめの「▶ Day 11へ」は `href="#"` のまま
- [ ] `.deploy_tmp/vol09-1.html` と `.deploy_tmp/vol10-1.html` も同内容に更新

---

## ④ レビュー必須チェック（ClaudeCode担当）

Antigravity実装後、デプロイ前に以下を確認する。

- [ ] **全4タブ**（目標／前半／後半／まとめ）が Day10 内容へ差し替わっているか照合
- [ ] **目標タブのポイントカード3枚**がコピー元（Day09）の文言のまま残っていないか
- [ ] 本文を全文検索し、**半角英単語の混入**（特に` of `/` in `/` the `＝助詞「の」化け）がないか
- [ ] **前半スライド（slide1〜14）が実際に挿入**されているか、枚数確認
- [ ] **後半タブにコンテンツが書かれていないか**（プレースホルダーのみであるか）
- [ ] スライド計14枚・動画計2本が揃っているか
- [ ] 合格項目（layout-split 1fr・lightbox・cover-slide・lazy+title・code・cache-bust ISO形式）を全クリア

### Codexに委ねる場合の機械チェックコマンド（PowerShell）

```powershell
# of化けチェック（0件なら合格）
Select-String -Path vol10-1.html -Pattern " of | in | the " -CaseSensitive

# スライド枚数（14件なら合格）
(Select-String -Path vol10-1.html -Pattern "day10_slide" | Measure-Object).Count

# 動画数（2件なら合格）
(Select-String -Path vol10-1.html -Pattern "video-item" | Measure-Object).Count

# cover-slide 存在確認（1件なら合格）
Select-String -Path vol10-1.html -Pattern "cover-slide"

# cache-bust 形式確認（ISO形式か）
Select-String -Path vol10-1.html -Pattern "cache-bust: \d{4}-\d{2}-\d{2}T"

# Day09のリンク差し替え確認（vol10-1.html が含まれていれば合格）
Select-String -Path vol09-1.html -Pattern "vol10-1\.html"
```

---

## ⑤ デプロイ手順

```powershell
Set-Location "G:\マイドライブ\研修\【202606】Instagramコース"
.\deploy.ps1
```

本番確認: `https://training-summary-2606.pages.dev/vol10-1.html`

---

## ⑥ Codex委任について（デプロイのみ試験可・レビューはClaudeCode継続）

- **実装**: Antigravity（従来通り）
- **レビュー**: ClaudeCode（of化け・スライド残骸の品質ゲートはここで担う）
- **デプロイ**: Codex試験可（③のPowerShellコマンド確認 → `.\deploy.ps1` 実行 → URLで本番確認の3ステップ）

Codexにレビューも任せる場合は上記「機械チェックコマンド」を実行させて出力結果を報告させること。ただし初回は ClaudeCode との並走を推奨。
