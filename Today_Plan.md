# Today_Plan.md — Day 08「リール投稿」実装計画

**作成日時**: 2026-06-17
**対象ファイル**: `vol08-1.html`（新規作成）
**テンプレート元**: `vol07-1.html`（コピーして全内容を差し替える）
**実装担当**: Antigravity（Proモデル）
**追加作業**: `vol07-1.html` のまとめタブに「▶ Day 08へ」リンクを追加

---

## スライド構成

| セット | ファイル名 | 枚数 | 備考 |
|---|---|---|---|
| 前半 | `assets/day08_slide1.png` ～ `assets/day08_slide14.png` | 14枚 | リネーム済み |
| 後半 | 後日追加予定 | — | 後半リサーチ待ち |

---

## 【重要】実装上の注意点

- テンプレート（vol07-1.html）の **CSS・ライトボックス・タブJS** をそのまま引き継ぐ
- `layout-split` の `grid-template-columns` は **`1fr` のみ**（2カラム化禁止）
- `@media (min-width: 1200px)` に `.layout-split` の2カラム指定を追加しないこと
- スライド画像と説明文は**縦1列**で配置（テキスト→画像の順）
- 動画は `<details class="video-item">` アコーディオン形式（`loading="lazy"` + `title` 属性必須）

---

## ① vol07-1.html の修正（最初に行うこと）

vol07-1.html のまとめタブ（`id="summary"`）末尾の `tab-nav-footer` を以下に差し替える：

```html
<div class="tab-nav-footer">
    <a href="./vol08-1.html" class="tool-link-btn">▶ Day 08へ</a>
    <a href="./index.html" class="tool-link-btn secondary"><i class="fa-solid fa-house"></i> コース一覧に戻る</a>
</div>
```

現在の該当箇所（vol07-1.html 約997行目）：
```html
<div class="tab-nav-footer">
    <a href="#" class="tool-link-btn">▶ Day 08へ</a>
    <a href="./index.html" class="tool-link-btn secondary">...
</div>
```
→ `href="#"` を `href="./vol08-1.html"` に変更するだけ。

---

## ② vol08-1.html の新規作成

### 基本設定

- `<title>`: `Day 08 リール投稿 | Instagram運用コース`
- `<h1>` クラス `.day-title`: `Day 08`
- `.day-subtitle`: `リール投稿マスター`
- `header-sub` サブテキスト: `バズるリールの構成とアルゴリズム攻略 — Jun 2026`
- `progress-pill`: `Day 08 / 13`
- `back-link`: `./vol07-1.html`（Day 07へ）
- cache-bust: `<!-- cache-bust: 2026-06-17T12:00:00 -->`
- タブラベル：「今日の目標」「前半」「後半」「今日のまとめ」

---

### タブ1: 今日の目標（`id="goal"`）

**カバースライド**:
```html
<img src="assets/day08_slide1.png" alt="Day08 カバー" class="slide-img cover-slide">
```
（`.cover-slide` クラス付き → ライトボックス対象外、border-radiusなし）

**今日のゴールテキスト**:
> バズるリール動画の構成法・アルゴリズムの評価指標・制作の勝ちパターンを習得し、1本目から伸びるリールを企画・制作できるようになる。

**ポイントカード（3枚）**:
1. ストーリー型（共感型）リールの仕組みを理解し、視聴維持率を高める動画構成が組み立てられるようになる
2. アルゴリズムが評価する4指標（視聴維持率・インタラクション・保存率・DMシェア）を把握する
3. 冒頭2秒・セーフゾーン・ジャンル別構成などリール制作の勝ちパターンを身につける

**タブフッター**:
```html
<div class="tab-nav-footer">
    <button type="button" class="tool-link-btn" onclick="openTab('first')">前半へ進む <i class="fa-solid fa-arrow-right"></i></button>
</div>
```

---

### タブ2: 前半（`id="first"`）

**タブ見出し**: `前半 ／ バズるリールの構成とアルゴリズム攻略`

---

#### SECTION A: ストーリー型リールとは何か

**スライド**: `day08_slide2.png` ～ `day08_slide5.png`（内容に合わせて調整可）

**説明テキスト**:
- **ストーリー型（共感型）リール**：単なるノウハウやテンプレート動画ではなく、視聴者が「これは自分のことだ」と共感する物語調の動画
- 最強である理由：**視聴維持率**（平均視聴時間）が飛躍的に高くなり、アルゴリズムに最優先で評価されてフォロワー外への拡散（バズ）が爆発的に伸びる
- 感情が動くため**ファン化**や購入（アフィリエイト等）にも直結しやすい

---

#### SECTION B: リール構成の3要素

**スライド**: `day08_slide6.png` ～ `day08_slide9.png`（内容に合わせて調整可）

**説明テキスト**:

**① 冒頭のフック（最初の3秒）**
- 視聴者の抱える「悩み」や「理想」を言語化してスクロールを止める
- 「これは自分向けの動画だ」と思わせることが最優先

**② ストーリー設計（本編）**
- 「課題・挫折」→「転機・出会い」→「行動・解決策」→「現在の結果」のテンポある展開
- **視聴維持率50%超え**を目標に、最後まで飽きさせない構成を意識する

**③ CTA（ラストのアクション誘導）**
- 動画の最後で「続きはプロフィールへ」「忘れないように保存してね」など、次の行動を明確に指示する

---

#### SECTION C: アルゴリズムが評価する4指標

**スライド**: `day08_slide10.png` ～ `day08_slide12.png`（内容に合わせて調整可）

**説明テキスト**:
- フォロワー数ゼロでも「コンテンツの質」が高ければ新規ユーザーへ広範囲に拡散されるのがリールの特性

アルゴリズム評価の4指標（重要度順）：

1. **視聴維持率**（最重要）：最後まで見られること。何度も繰り返す「ループ再生」も高評価
2. **過去のインタラクション履歴**：ユーザーが過去に同ジャンルのリールを閲覧・反応したか
3. **エンゲージメント**（いいね・コメント・保存）：特に保存率<code>2%</code>以上が目標KPI
4. **シェア数（DMシェア）**：現在のアルゴリズムで最も重視される指標。DMシェア率<code>0.5%</code>以上が推奨

---

#### SECTION D: リール制作の勝ちパターン

**スライド**: `day08_slide13.png` ～ `day08_slide14.png`（内容に合わせて調整可）

**説明テキスト**:
- **冒頭2カット（2秒）の勝負**：リール成否の7割は最初の2秒で決まる。ターゲットを明確にし、興味のない人を弾きつつ見たい人を引き込む
- **セーフゾーンの確保**：画面の上下左右端にテキストを寄せすぎると、InstagramのUI（アカウント名・いいねアイコン等）と重なって文字が切れるため、必ず余白（セーフゾーン）を確保する
- **ジャンル別の構成戦略**：
  - ブランド・プロダクト → 視覚的な美しさ・世界観の演出を最優先
  - メディア（情報発信） → ノウハウ・チェックリスト・比較情報の網羅性と読みやすさ
  - インフルエンサー（顔出し） → キャラクター・体験談・ライフスタイルへの共感をフックに

**注意事項ボックス**（`warning-box` または `caution-box`）:
- **エンゲージメント・ベイト回避**：「コメントに〇〇と書いて」などの強要行為はアルゴリズムにおすすめ表示を抑制される
- **他アプリの透かし回避**：TikTokロゴ入り動画はInstagramのアルゴリズムで評価を下げられる

---

#### 動画セクション（前半）

```html
<div class="video-section">
  <div class="video-section-title">📺 授業の元動画（前半）</div>
  <details class="video-item">
    <summary>① 【2026年最新】１投稿目から100万再生出すリールのつくり方【インスタ】（22:00）</summary>
    <div class="video-embed">
      <iframe src="https://www.youtube.com/embed/ywFaIPMChQw" allowfullscreen loading="lazy" title="100万再生リールのつくり方 2026年最新版"></iframe>
    </div>
  </details>
  <details class="video-item">
    <summary>② 【Instagram Reels】インスタ リール徹底攻略。企業やブランドの担当者必見!!（10:00）</summary>
    <div class="video-embed">
      <iframe src="https://www.youtube.com/embed/fV7jjdlihu0" allowfullscreen loading="lazy" title="インスタリール徹底攻略 企業向け"></iframe>
    </div>
  </details>
</div>
```

---

#### ワークシートA（実習）

タイトル：リールを3本企画し、制作しよう
目的：AIでリールの企画を練り、リール動画を制作する
URL：`https://platinumzone.co.jp/dx-biome/2606/dx_workflow_oshi.html#phase5`

step-card × 2 で実習手順を表示：

```
Step 1 ／ Geminiで3本のリールを企画する
役割の違う3本を企画し、CanvaやEditsでリール動画を制作する

▼ プロンプト例（コピーして使おう）
[推し]を発信するInstagramリールを3本企画してください。
1本目：まず知ってもらう（最初の3秒で目を引く）
2本目：もっと好きになってもらう（魅力を深く伝える）
3本目：行動してもらう（保存・フォローを促す）
各リールに以下を含めてください。
・タイトル ・最初の3秒で見せるもの ・場面の流れ
・画面に出す文字の案 ・音楽の雰囲気 ・長さ（秒数）

Step 2 ／ Geminiに企画を工夫してもらう
▼ プロンプト例
この動画を参考に、内容を工夫してください。
https://youtu.be/ywFaIPMChQw
```

`<a href="https://platinumzone.co.jp/dx-biome/2606/dx_workflow_oshi.html#phase5" target="_blank" rel="noopener" class="tool-link-btn">実習ページを開く</a>` ボタンも配置。

プロンプト例は `<pre style="...">` または `<div class="quote-box">` にコピペしやすい形で記載。

**タブフッター**:
```html
<div class="tab-nav-footer">
    <button type="button" class="tool-link-btn secondary" onclick="openTab('second')">後半へ <i class="fa-solid fa-arrow-right"></i></button>
</div>
```

---

### タブ3: 後半（`id="second"`）

**後半リサーチ未完了のため、プレースホルダーを表示する**

```html
<h2 style="margin-top:0;">後半 ／ リール制作の実践テクニック</h2>

<div class="placeholder-box">
    <i class="fa-solid fa-film"></i>
    <p>後半コンテンツは近日公開予定です</p>
</div>
```

後半動画URL（参照用のみ。本番実装時に使用）:
- `https://www.youtube.com/embed/QxPnUD799N0`
- `https://www.youtube.com/embed/ZO8BixwqVPY`

**タブフッター**:
```html
<div class="tab-nav-footer">
    <button type="button" class="tool-link-btn" onclick="openTab('summary')">今日のまとめへ <i class="fa-solid fa-arrow-right"></i></button>
</div>
```

---

### タブ4: 今日のまとめ（`id="summary"`）

**今日学んだこと（4点）**:
1. ストーリー型（共感型）リールが最強な理由：視聴者が「自分事」と感じる物語調で視聴維持率が飛躍的に向上する
2. リール構成の3要素：冒頭3秒のフック→課題→転機→結果のストーリー→CTAで最後まで飽きさせない
3. アルゴリズムの評価4指標：視聴維持率（最重要）・インタラクション・保存率2%以上・DMシェア率0.5%以上
4. 勝ちパターン：冒頭2カット2秒の勝負、セーフゾーン確保、ジャンル別構成戦略、NG行為（エンゲージメント・ベイト・他アプリ透かし）の回避

**タブフッター**:
```html
<div class="tab-nav-footer">
    <a href="#" class="tool-link-btn">▶ Day 09へ</a>
    <a href="./index.html" class="tool-link-btn secondary"><i class="fa-solid fa-house"></i> コース一覧に戻る</a>
</div>
```
（Day 09が完成したら `href="#"` を `./vol09-1.html` に差し替える）

---

## ③ Antigravity向け実装チェックリスト

- [ ] `vol07-1.html` のまとめタブ `tab-nav-footer` の `▶ Day 08へ` リンクを `href="#"` → `href="./vol08-1.html"` に変更
- [ ] `vol07-1.html` を `vol08-1.html` にコピーして内容を差し替え
- [ ] スライド画像は `assets/day08_slideN.png`（N=1〜14）を使用
- [ ] `day08_slide1.png` のみ `.cover-slide` クラス付き（ライトボックス対象外）
- [ ] 前半動画2本は `<details class="video-item">` アコーディオン形式（`loading="lazy"` + `title` 属性必須）
- [ ] `<code>` タグを使うキーワード：`2%`（保存率目標）、`0.5%`（DMシェア率目標）、`50%`（視聴維持率目標）
- [ ] 後半タブは `placeholder-box` でプレースホルダー表示
- [ ] cache-bust: `<!-- cache-bust: 2026-06-17T12:00:00 -->`（ファイル末尾）
- [ ] タブラベル：「今日の目標」「前半」「後半」「今日のまとめ」
- [ ] まとめタブの「▶ Day 09へ」は `href="#"` のまま
- [ ] `.deploy_tmp/vol07-1.html` と `.deploy_tmp/vol08-1.html` も同内容に更新

---

## ④ デプロイ手順（ClaudeCode担当）

Antigravity実装完了後、ClaudeCodeが以下の手順でデプロイする：

```powershell
Set-Location "G:\マイドライブ\研修\【202606】Instagramコース"
Copy-Item vol07-1.html .deploy_tmp\ -Force
Copy-Item vol08-1.html .deploy_tmp\ -Force

$dest = "C:\Users\Hi\AppData\Local\Temp\deploy-instagram-2606"
if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
New-Item -ItemType Directory -Path $dest | Out-Null
Copy-Item ".deploy_tmp\*" $dest -Recurse -Force

Set-Location $dest
npx wrangler pages deploy . --project-name=training-summary-2606 --commit-dirty=true
```

本番確認URL：`https://training-summary-2606.pages.dev/vol08-1.html`
