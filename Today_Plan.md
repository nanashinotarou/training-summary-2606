# Today_Plan.md — Day 07「フィード投稿」実装計画

**作成日時**: 2026-06-16
**対象ファイル**: `vol07-1.html`（新規作成）
**テンプレート元**: `vol06-1.html`（コピーして全内容を差し替える）
**追加作業**: `vol06-1.html` のまとめタブに「▶ Day 07へ」リンクを追加

---

## スライド構成

| セット | ファイル名 | 枚数 |
|---|---|---|
| 前半 | `assets/day07_slide1.png` ～ `assets/day07_slide14.png` | 14枚 |
| 後半 | `assets/day07_slide15.png` ～ `assets/day07_slide26.png` | 12枚 |
| **合計** | | **26枚** |

---

## ① vol06-1.html の修正（Cursor が必ず最初に行うこと）

vol06-1.html のまとめタブ（`id="summary"`）末尾の `tab-nav-footer` を以下に差し替える：

```html
<div class="tab-nav-footer">
    <a href="./vol07-1.html" class="tool-link-btn">▶ Day 07へ</a>
    <a href="./index.html" class="tool-link-btn secondary"><i class="fa-solid fa-house"></i> コース一覧に戻る</a>
</div>
```

現在の該当箇所（vol06-1.html 約1148行目）：
```html
<div class="tab-nav-footer">
    <a href="./index.html" class="tool-link-btn secondary"><i class="fa-solid fa-house"></i> コース一覧に戻る</a>
</div>
```

---

## ② vol07-1.html の新規作成

### 基本設定

- `<title>`: `Day 07 フィード投稿 | Instagram運用コース`
- `<h1>` クラス `.day-title`: `Day 07`
- `.day-subtitle`: `フィード投稿マスター`
- cache-bust: `<!-- cache-bust: 2026-06-16T12:00:00 -->`
- タブラベル：「今日の目標」「前半」「後半」「今日のまとめ」

---

### タブ1: 今日の目標（`id="goal"`）

**カバースライド**:
```html
<img src="assets/day07_slide1.png" alt="Day07 カバー" class="slide-img cover-slide">
```
（`.cover-slide` クラス付き → ライトボックス対象外、border-radiusなし）

**今日のゴールテキスト**:
> フィード投稿の基本操作・カルーセル設計・プロデザイナーの添削視点を習得し、保存率と滞在時間を高める投稿が作れるようになる。

**ポイントカード（3枚）**:
1. フィード投稿の仕様（サイズ・複数選択・加工・設定）とカルーセル投稿の基本操作を身につける
2. Canvaで「繋がる横長カルーセル」をデザインし、分割ツールで5枚に切り出して投稿できるようにする
3. 色数の引き算・情報のメリハリ・統一感の原則をデザイン添削事例から学ぶ

**タブフッター**:
```html
<div class="tab-nav-footer">
    <button type="button" class="tool-link-btn" onclick="openTab('first')">前半へ進む <i class="fa-solid fa-arrow-right"></i></button>
</div>
```

---

### タブ2: 前半（`id="first"`）

**タブ見出し**: `前半 ／ フィード投稿の基本とカルーセル設計`

---

#### SECTION A: フィード投稿の基本操作と仕様

**スライド**: `day07_slide2.png` ～ `day07_slide7.png`（内容に合わせて調整可）

**説明テキスト**（箇条書き `<ul>`）:
- フィード投稿とは：プロフィール画面に残るメインの投稿。画像・動画を1枚から最大**20枚**まで投稿可能
- 複数枚の画像投稿を**カルーセル投稿**と呼ぶ。動画は1本最大60分までサポート
- 投稿サイズは3種類：縦長<code>4:5</code>（現在の主流・1080×1350px）／正方形／横長<code>16:9</code>
- 投稿手順：右上 `+` → 投稿 → 画像選択 → 加工 → キャプション入力 → シェア
- 複数枚選択は「重なった四角ボタン」をタップしてから選択。長押しドラッグで並び替え
- **お気に入り絞り込み**：写真アプリでハートをつけておくとInstagramの投稿画面から「お気に入り」フォルダで素早く絞り込める
- 個別加工：フィルター・明るさ調整・BGM追加（公式音源）が各枚ごとに設定可能
- **AIラベル**：AI生成画像を使った投稿は「AIラベル」の設定が義務
- 予約投稿・下書き保存・アーカイブ（非表示化）・ピン止め（プロフィール上部3枚固定）も活用できる

---

#### SECTION B: フィード投稿のアルゴリズムと最新トレンド

**スライド**: `day07_slide8.png` ～ `day07_slide11.png`（内容に合わせて調整可）

**説明テキスト**:
- リールが激戦区（レッドオーシャン）化した今、競合が少ないフィード投稿はブルーオーシャン
- アルゴリズムが最も重視するのは「1人あたりの**滞在時間**」と「**保存率**」
- フィード向けジャンル：ノウハウ・チェックリスト・比較・ルーティンなど「後から見返したい」コンテンツ
  - 動きで見せるものはリール、止まって論理的に理解させるものはフィード
- **トレンド音源チート**：投稿に「上昇マーク付きのトレンド音源」を追加すると、リールタブにもフィード投稿が表示され新規リーチが倍増する

---

#### SECTION C: Canvaで「繋がるカルーセル」を作る

**スライド**: `day07_slide12.png` ～ `day07_slide14.png`（内容に合わせて調整可）

**説明テキスト**:
- スワイプ時に画像が繋がって見えるカルーセルは、Canvaで**横長1枚のキャンバス**として作成する
- カスタムサイズ：幅<code>5400px</code> × 高さ<code>1350px</code>（5等分すると1枚あたり<code>1080×1350px</code>の4:5サイズ）
- **ガイド設定**：ファイル → 設定 → ガイドを追加 → カスタム（列数：<code>5</code>、隙間：<code>0</code>）
- **切れ目の仕掛け**：ページの境界線をまたぐように丸・矢印・写真を半分ずつ配置 → 「次がある」と思わせる視覚的誘導
- 完成した横長画像を**ミニウェブツール**などの無料分割ツールにアップ → 水平5分割・垂直1で一瞬で5枚に分割
- **注意**：分割後の画像をInstagramにアップする際はタップ順（1→2→3...）に細心の注意を払う

---

#### 動画セクション（前半）

```html
<div class="video-section">
  <details class="video-item">
    <summary>① 【iPad】今更聞けない！Instagramのフィード投稿の方法と写真サイズがバラバラな時の解決法（15:42）</summary>
    <iframe src="https://www.youtube.com/embed/Xb6aoVkk7FI" ... loading="lazy" title="フィード投稿の方法と写真サイズ解決法"></iframe>
  </details>
  <details class="video-item">
    <summary>② 【2026年最新】リールはもう伸びない？滞在時間を伸ばして保存率を爆上げするフィード投稿攻略法（15:30）</summary>
    <iframe src="https://www.youtube.com/embed/ASmTlnr786E" ... loading="lazy" title="滞在時間と保存率を高めるフィード投稿攻略法"></iframe>
  </details>
  <details class="video-item">
    <summary>③ 【Canva】初心者でも簡単！スワイプで繋がるカルーセル投稿の作り方（15:16）</summary>
    <iframe src="https://www.youtube.com/embed/u8HOpFtym5I" ... loading="lazy" title="Canvaで作るカルーセル投稿"></iframe>
  </details>
</div>
```

---

#### ワークシートA（実習）

タイトル：フィード投稿の基本操作を覚えよう
目的：Instagramのフィード投稿の基本操作を体験する
実習ページURL：`http://platinumzone.co.jp/dx-biome/2606/616instagram_feed_post_practice.html`

step-card × 1 で外部リンクを提示（`<a href="..." target="_blank" class="tool-link-btn">実習ページを開く</a>`）

**タブフッター**:
```html
<div class="tab-nav-footer">
    <button type="button" class="tool-link-btn secondary" onclick="openTab('second')">後半へ <i class="fa-solid fa-arrow-right"></i></button>
</div>
```

---

### タブ3: 後半（`id="second"`）

**タブ見出し**: `後半 ／ カルーセルデザインの添削と品質原則`

---

#### SECTION D: デザインの統一感と色の引き算

**スライド**: `day07_slide15.png` ～ `day07_slide20.png`（内容に合わせて調整可）

**説明テキスト**:
- **デザインの統一感**：カルーセル全体を通して同じテイストのイラスト・素材を使用する。別テイストが混ざるとクオリティが低く見える
- **色の引き算**：メインカラーにプラスしてあれこれ色（青・緑・オレンジ等）を混ぜない
  - 同一色相（例：濃い青と薄い青）でまとめるか、アクセントカラーを**1色**に絞る
  - ビジネス向けは「知的でまとまりのある印象」が最優先
- **配色の手順**：まずモノクロで明度差（コントラスト）をつけて読みやすくレイアウトし、その後に背景色や文字色を乗せていく

---

#### SECTION E: 情報のメリハリとデザインテクニック

**スライド**: `day07_slide21.png` ～ `day07_slide26.png`（内容に合わせて調整可）

**説明テキスト**:
- **情報の優先度とメリハリ**：タイトル・見出し・本文の文字サイズに大きな差をつけ視線を誘導する（すべて同じサイズだと「どこから読めばいい?」となる）
- **装飾ルールの統一**：枠線の太さ・角丸の大きさ・矢印（三角）などはカルーセル内で必ず揃える
- **テキストボックスの罠**：短い文字をドラッグして入力するとバウンディングボックスが生まれ、文字サイズを大きくした時に文字が切れたり消えたりする → 短い単語は**クリックして打ち始める**
- **孤立点の削除**：不要なゴミデータはオブジェクトメニューから一括消去する

---

#### 動画セクション（後半）

```html
<div class="video-section">
  <details class="video-item">
    <summary>④ カルーセル画像のデザイン公開添削！男性向けビジネスノウハウ（前編）（12:03）</summary>
    <iframe src="https://www.youtube.com/embed/K1oBUoBxO9s" ... loading="lazy" title="カルーセルデザイン添削 前編"></iframe>
  </details>
  <details class="video-item">
    <summary>⑤ カルーセル画像のデザイン公開添削！男性向けビジネスノウハウ（中編）（14:47）</summary>
    <iframe src="https://www.youtube.com/embed/i-9emBO-jwA" ... loading="lazy" title="カルーセルデザイン添削 中編"></iframe>
  </details>
  <details class="video-item">
    <summary>⑥ カルーセル画像のデザイン公開添削！男性向けビジネスノウハウ（後編）（10:12）</summary>
    <iframe src="https://www.youtube.com/embed/MmD7mwnd5aE" ... loading="lazy" title="カルーセルデザイン添削 後編"></iframe>
  </details>
</div>
```

---

#### ワークシートB（実習）

タイトル：フィード投稿の基本操作を覚えよう（前半と同じ実習ページを継続利用）
目的：Instagramのフィード投稿の基本操作を体験する
実習ページURL：`http://platinumzone.co.jp/dx-biome/2606/616instagram_feed_post_practice.html`

**タブフッター**:
```html
<div class="tab-nav-footer">
    <button type="button" class="tool-link-btn" onclick="openTab('summary')">今日のまとめへ <i class="fa-solid fa-arrow-right"></i></button>
</div>
```

---

### タブ4: 今日のまとめ（`id="summary"`）

**今日学んだこと（4点）**:
1. フィード投稿はサイズ選択（4:5が主流）・複数選択・加工・キャプション・AIラベルまで一連の操作をマスターした
2. リールより競合が少ないフィード投稿が今ホット。滞在時間と保存率を高め、トレンド音源でリールタブにも表示させる
3. Canvaで幅5400×高さ1350pxの横長キャンバスを作り、ガイドと切れ目の仕掛けで「繋がるカルーセル」を設計・分割できるようになった
4. 色の引き算・モノクロ優先の配色手順・文字サイズのメリハリ・装飾ルールの統一がプロのデザイン原則

**タブフッター**:
```html
<div class="tab-nav-footer">
    <a href="#" class="tool-link-btn">▶ Day 08へ</a>
    <a href="./index.html" class="tool-link-btn secondary"><i class="fa-solid fa-house"></i> コース一覧に戻る</a>
</div>
```
（Day 08が完成したら `href="#"` を `./vol08-1.html` に差し替える）

---

## ③ Cursor向け実装チェックリスト

- [ ] `vol06-1.html` のまとめタブ `tab-nav-footer` に `▶ Day 07へ`（`./vol07-1.html`）リンクを追加
- [ ] `vol06-1.html` を `vol07-1.html` にコピーして内容を差し替え
- [ ] スライド画像は `assets/day07_slideN.png`（N=1〜26）を使用
- [ ] `day07_slide1.png` のみ `.cover-slide` クラス付き（ライトボックス対象外）
- [ ] 前半3本・後半3本の動画は `<details class="video-item">` アコーディオン形式（`loading="lazy"` + `title` 属性必須）
- [ ] `<code>` タグを使うキーワード：`4:5`、`16:9`、`5400px`、`1350px`、`1080×1350px`、列数`5`、隙間`0`
- [ ] cache-bust: `<!-- cache-bust: 2026-06-16T12:00:00 -->`（ファイル末尾）
- [ ] タブラベル：「今日の目標」「前半」「後半」「今日のまとめ」（統一済み）
- [ ] まとめタブの「▶ Day 08へ」は `href="#"` のまま（Day08未作成）
- [ ] `.deploy_tmp/vol06-1.html` と `.deploy_tmp/vol07-1.html` も同内容に更新（デプロイ用）

---

## ④ デプロイ手順（ClaudeCode担当）

Cursor実装完了後、ClaudeCodeが以下の手順でデプロイする（CLAUDE.mdの手順通り）：

```powershell
# Step 1: .deploy_tmp を同期
Set-Location "G:\マイドライブ\研修\【202606】Instagramコース"
Copy-Item vol06-1.html .deploy_tmp\ -Force
Copy-Item vol07-1.html .deploy_tmp\ -Force

# Step 2: 一時フォルダへ中身だけコピー
$dest = "C:\Users\Hi\AppData\Local\Temp\deploy-instagram-2606"
if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
New-Item -ItemType Directory -Path $dest | Out-Null
Copy-Item ".deploy_tmp\*" $dest -Recurse -Force

# Step 3: デプロイ
Set-Location $dest
npx wrangler pages deploy . --project-name=training-summary-2606 --commit-dirty=true
```

本番確認URL：`https://training-summary-2606.pages.dev/vol07-1.html`
