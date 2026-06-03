# Today_Plan.md

> **Cursor はここから読むこと。固定ヘッダーの指示を最優先で従うこと。**

---

## [実装メタ情報]
- **テンプレートファイル:** vol02-1.html（既存ファイルに後半・まとめを追記して上書き）
- **出力ファイル:** vol02-1.html
- **cache-bust:** 2026-06-03T20:00:00
- **画像素材（前半タブ）:** ※実装済み。変更不要。
  - slide1〜14：前半タブで実装済み
- **画像素材（後半タブ）:**
  - slide15 → 後半タブ ヘッダー（表紙）
  - slide16 → セクション1（フォロワー至上主義の罠）
  - slide17 → セクション2（トリプルメディア）
  - slide18 → セクション2（KPI/KGI ファネル）
  - slide19 → セクション3（単価別戦略 比較表）
  - slide20 → セクション3 低単価（UGC 4ステップ）
  - slide21 → セクション3 低単価（仕掛けの具体例）
  - slide22 → セクション3 高単価（信用獲得戦略）
  - slide23 → セクション4（推し＝コンセプトの言語化）
  - slide24 → セクション4（ペルソナ 氷山モデル）
  - slide25 → セクション4（ペルソナ 具体例：30代ママ）
  - slide26 → セクション5（プロフィール・ハイライト・導線）
  - slide27 → セクション5（社内素材収集ルール）
  - slide28 → 実習セクション（4項目ワークシート）
  - slide29 → まとめタブ

---

## [追加実装要件（2026-06-03 追記）─ 必ず対応すること]

### A. レスポンシブ対応（CSS追加）

現状は `max-width: 900px` + `@media (max-width: 768px)` のみ。tablet/desktop で横幅が余りすぎている。
以下の `@media` を `</style>` の直前に追加すること（既存の `max-width: 768px` クエリはそのまま残す）。

```css
/* ── Tablet（769px〜1199px）── */
@media (min-width: 769px) {
    .container { max-width: 1050px; }
}

/* ── Desktop（1200px〜）── */
@media (min-width: 1200px) {
    .container { max-width: 1240px; }
    .tab-content { padding: 50px 70px; }
    .header { padding: 40px 70px 24px; }

    /* スライド画像＋テキストを横並びにするラッパー */
    .layout-split {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 48px;
        align-items: start;
        margin: 24px 0;
    }
    .layout-split .slide-img { margin: 0; }

    /* カードグリッドのgapをやや広く */
    .card-grid-2, .before-after-grid, .worksheet-grid { gap: 24px; }
    .card-grid-3 { gap: 20px; }
}
```

また `.layout-split` クラスを既存CSS（モバイル側）にも追加して、小画面ではシングルカラムになるようにする：

```css
/* デフォルト（モバイル）：縦積み */
.layout-split {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    margin: 24px 0;
    align-items: start;
}
```

**`.layout-split` の使い方（後半タブのHTML構造）:**
スライド1枚＋対応テキストをペアにする場合、以下の構造にする：
```html
<div class="layout-split">
    <div>
        <!-- テキスト内容（見出し・本文・カードなど） -->
    </div>
    <img src="./assets/day02_slideXX.png" alt="説明" class="slide-img">
</div>
```

後半タブでの適用推奨箇所：
- セクション1（slide16 フォロワー罠）
- セクション2のトリプルメディア（slide17）
- セクション3の単価比較（slide19）
- セクション4の推しコンセプト（slide23）・ペルソナ氷山（slide24）
- セクション5のプロフィール（slide26）

※ 複数スライドが連続するセクション（slide20〜22など）は通常の縦積みで構わない。

---

### B. YouTube動画埋め込み（各タブの先頭に追加）

参考動画を `<details>` 折りたたみ形式で埋め込む。CSS を `</style>` 直前に追加：

```css
/* ── YouTube埋め込み ── */
.video-section {
    background: #faf8ff; border: 1px solid #e9d5f5;
    border-radius: var(--radius-medium);
    padding: 18px 22px; margin-bottom: 36px;
}
.video-section-title {
    font-size: 0.9rem; font-weight: 700; color: var(--ig-purple);
    margin-bottom: 12px; display: flex; align-items: center; gap: 8px;
}
details.video-item { margin-bottom: 8px; }
details.video-item summary {
    cursor: pointer; font-size: 0.88rem; font-weight: 600;
    color: var(--text-main); padding: 10px 14px;
    background: #fff; border: 1px solid #ede9f5;
    border-radius: var(--radius-small);
    list-style: none; display: flex; align-items: center; gap: 8px; transition: 0.2s;
}
details.video-item summary::before { content: '▶'; color: var(--ig-magenta); flex-shrink: 0; }
details.video-item[open] summary::before { content: '▼'; }
details.video-item summary:hover { background: #fdf0ff; border-color: var(--ig-purple); }
details.video-item[open] summary {
    border-radius: var(--radius-small) var(--radius-small) 0 0; border-bottom: none;
}
.video-embed {
    position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;
    border-radius: 0 0 var(--radius-small) var(--radius-small);
    border: 1px solid #ede9f5; border-top: none;
}
.video-embed iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }
```

**前半タブ（id="first"）の先頭に追加するHTML:**
```html
<div class="video-section">
    <div class="video-section-title">📺 参考動画（前半）</div>
    <details class="video-item">
        <summary>① ５分でわかる！Canvaってどんなツール？（5:36）</summary>
        <div class="video-embed">
            <iframe src="https://www.youtube.com/embed/gUav9YFHp0o" allowfullscreen loading="lazy" title="Canvaとは"></iframe>
        </div>
    </details>
    <details class="video-item">
        <summary>② リール動画をCanvaで作る方法・完全解説（22:49）</summary>
        <div class="video-embed">
            <iframe src="https://www.youtube.com/embed/fn9BRQpxr8c" allowfullscreen loading="lazy" title="Canvaリール動画編集"></iframe>
        </div>
    </details>
    <details class="video-item">
        <summary>③ Canva新機能マジックレイヤーが日本語でも！（8:57）</summary>
        <div class="video-embed">
            <iframe src="https://www.youtube.com/embed/INnDR6qfUUI" allowfullscreen loading="lazy" title="マジックレイヤー日本語対応"></iframe>
        </div>
    </details>
</div>
```

**後半タブ（id="second"）の先頭に追加するHTML:**
```html
<div class="video-section">
    <div class="video-section-title">📺 参考動画（後半）</div>
    <details class="video-item">
        <summary>④ 企業インスタ担当が成果を出すためにまずやるべき5つのこと（11:11）</summary>
        <div class="video-embed">
            <iframe src="https://www.youtube.com/embed/oEeA3nsZHog" allowfullscreen loading="lazy" title="企業インスタ担当の5つのこと"></iframe>
        </div>
    </details>
    <details class="video-item">
        <summary>⑤ Instagramアカウント運用完全攻略（13:18）</summary>
        <div class="video-embed">
            <iframe src="https://www.youtube.com/embed/K-2YscFIucc" allowfullscreen loading="lazy" title="Instagram完全攻略"></iframe>
        </div>
    </details>
    <details class="video-item">
        <summary>⑥ 店舗のInstagram集客の常識が変わる（28:46）</summary>
        <div class="video-embed">
            <iframe src="https://www.youtube.com/embed/YrWL9yiYjhs" allowfullscreen loading="lazy" title="店舗Instagram集客"></iframe>
        </div>
    </details>
</div>
```

⚠️ **注意:** 前半タブのYouTube埋め込みは既存コンテンツへの追記（後半実装ついでに対応）。タブの最初の `<div class="section">` の前に挿入すること。

---

## [タブ構成]

| タブID | タブ名 | 状態 |
|---|---|---|
| goal | 今日の目標 | ✅ 実装済み（【後半で学ぶこと】の内容のみ更新） |
| first | 前半 | ✅ 実装済み。変更なし |
| second | 後半 | 🔴 今回実装 |
| summary | 今日のまとめ | 🔴 今回実装 |

---

## [セクション構成 ─ 後半タブ]

| # | セクション見出し | 内容概要 | 主な画像 |
|---|---|---|---|
| 1 | 初心者が陥りがちな「最大の罠」 | フォロワー至上主義の危険性。アルゴリズムは「コンテンツファースト」に変化している | slide16 |
| 2 | 企業Instagram運用の「真の目的」 | トリプルメディアの整理。KPIは「指名検索数」と「リンクタップ数」。フォロワーは結果 | slide17, slide18 |
| 3 | 商材の「単価」でSNS戦略が変わる | 低単価＝UGC獲得ゲーム、高単価＝信用構築ゲーム。それぞれの戦略と具体事例 | slide19〜22 |
| 4 | 「推し」を発信の軸にする | コンセプトの言語化（NG/OK比較）。ペルソナは感情まで深く設計（氷山モデル） | slide23〜25 |
| 5 | アカウントの「玄関」を整える | プロフィール・ハイライト・リンク導線の設計。素材収集の社内体制づくり | slide26, slide27 |
| 6 | 実習：自分の「推し」戦略を設計しよう | 4項目ワークシート（15分）。今日学んだフレームワークを自分のアカウントに当てはめる | slide28 |

---

## [Cursor実装指示]

### 全体方針
- **vol02-1.html の後半タブ（id="second"）とまとめタブ（id="summary"）のプレースホルダーを実コンテンツに差し替える**
- 前半タブ（id="first"）と今日の目標タブ（id="goal"）は**変更しない**（ただし今日の目標タブの「後半で学ぶこと」の文言のみ更新）
- 全スライド画像に `class="slide-img"` を適用（ダーク系なし）
- cache-bust コメントを `<!-- cache-bust: 2026-06-03T20:00:00 -->` に更新
- タブ名は**今日の目標 / 前半 / 後半 / 今日のまとめ**のまま（英語不要）

---

### 今日の目標タブ ─「後半で学ぶこと」の更新のみ

「後半で学ぶこと」の部分を以下に差し替える（他はそのまま）：

```
【後半で学ぶこと】
企業がInstagramを運用する本質的な目的（KPI・指名検索・UGC）
推し発信テーマの言語化とターゲット（ペルソナ）の設計
```

---

### 後半タブ詳細

#### ヘッダー画像
- 後半タブ冒頭（`.cover-slide` クラス）に `assets/day02_slide15.png` を配置

#### セクション1：初心者が陥りがちな「最大の罠」
- `assets/day02_slide16.png`
- **リード文:** 「Instagramを始めたばかりの多くの担当者が、まずこの落とし穴にはまります。」
- **強調ボックス:** 「フォロワーを増やさなきゃ！」という思考が、アカウントの成長を止める
- **2カード横並び:**
  - ❌ フォロワー至上主義：自社に興味がない人まで集めてしまう。プレゼントキャンペーンなど施策が逆効果になることも
  - ✅ コンテンツファースト：いいコンテンツ → エンゲージメント → リーチ拡大 → フォロワー増加（フォロワーは「結果」）
- 補足テキスト（小）: Instagramのアルゴリズムは「フォロワー主義」から「コンテンツ・エンゲージメント重視」に変化している

#### セクション2：企業Instagram運用の「真の目的」
- `assets/day02_slide17.png`（トリプルメディア ベン図）
- **見出し:** 企業のSNS運用は「トリプルメディア」で捉える
- **3カード（縦または横並び）:**
  - 📱 オウンドメディア（公式アカウント・カタログ）
  - 💬 アーンドメディア（UGC・口コミ・第三者からの共感）
  - 📣 ペイドメディア（広告）
- 補足: 「Instagramはオウンドとアーンド、両方の役割を担っています」

- `assets/day02_slide18.png`（KPI/KGI ファネル）
- **見出し:** 追うべき数字（KPI/KGI）はフォロワー数ではなく「指名検索」と「リンクのタップ」
- **ステップ形式:**
  - Step 1 アクション: 投稿・リールでいいね・保存してもらう
  - Step 2 KPI（中間目標）: プロフィールへのアクセス → リンクタップ（LINE・HPへ）
  - Step 3 KGI（最終目標）: Instagramの外での指名検索数アップ・サイトセッション・来店
- 💡 Tipsボックス: 「最終的な売上・予約は『Instagramの外（HP・LINE）』で発生します。この橋渡しがSNSの役割。」

#### セクション3：商材の「単価」でSNS戦略が180度変わる
- `assets/day02_slide19.png`（比較表）
- **見出し:** 【重要】商材の「単価」で、SNS戦略は180度変わる
- **2カード横並び（比較）:**
  - 【低単価商材】～数千円 / 例：カフェ・日用品・コスメ / メイン戦略：口コミ（UGC）獲得ゲーム / 最重要KPI：UGC発生数・リーチ数 / アプローチ：マス（広く多くの人へ）
  - 【高単価商材】数万円〜 / 例：美容クリニック・高級ホテル・BtoB / メイン戦略：信頼獲得・CVR（購入率）向上 / 最重要KPI：保存数・リンクタップ・指名検索 / アプローチ：比較検討している層へ「このお店なら安心」というファンにする
- 問いかけ: 「自社はどちらの戦略をとるべきか、考えてみましょう！」

**低単価の戦略：口コミ（UGC）を「狙って」生み出す**
- `assets/day02_slide20.png`（4ステップ）
- お客様は「理由」がないと投稿しません。自然に撮影したくなるUX・ギミック設計が必要
- **4ステップカード:**
  1. 来店（Visit）：お店に来る
  2. 体験（Experience）：驚き・感動・映えの発見
  3. ギミック（Gimmick）：思わず撮影したくなる仕掛け・オペレーション
  4. 投稿（UGC）：ストーリーズで拡散、フォロワーに教える
- 💡 Tipsボックス: 「投稿してもらうだけでは口コミは増えない。『投稿したくなる状況』を設計するのがプロの仕事。」

- `assets/day02_slide21.png`（具体例）
- **見出し:** 思わず撮りたくなる「仕掛け」の具体例
- **3事例横並び（カード）:**
  - 🥩 焼肉屋の事例（声かけ）: 大盛りの肉を持ってくる際に「今シャッターチャンスです！」と声かけるオペレーションを全スタッフに浸透
  - ☕ カフェの事例（商品設計）: 縦長グラスで提供 → 顔の横に持つと顔が小さく見える → 自然にストーリーズへ収まる縦長構図に
  - 🏕️ ホテルの事例（事前教育）: ハイライトで「他のお客様の投稿例」を常に掲示 → 自分もこう撮ればいいとわかる

**高単価の戦略：口コミに頼らず「信用」を重ねる**
- `assets/day02_slide22.png`（広告×Instagram×HP 連携図）
- **見出し:** 高単価商材の戦い方：口コミに頼らず「信用」を重ねる
- **フロー図（横矢印）:**
  1. 広告（Ads）/ SEO → 認知を獲得
  2. Instagram（Owned）→ 信用構築・教育（リールやフィード投稿で「このお店なら安心」というファンにする）
  3. HP・LINE → 比較検討・購入 → 最終的なCVR（購入率）を高める
- ⚠️ 注意ボックス（赤枠）: 「高単価は『SNSだけで完結させようとしない』ことが最大のコツ。」

#### セクション4：「推し」を発信の軸にする
- `assets/day02_slide23.png`（コンセプト言語化 NG/OK）
- **見出し:** 発信の軸となる「推し（コンセプト）」を言語化する
- **2カード横並び:**
  - ❌ NG（弱いコンセプト）: 「アットホームで技術力のある美容室です」→ 誰でも言える・誰にも刺さらない
  - ✅ OK（強い推し）: 「忙しい30代ママの、忙しい隙間時間に行ける時短ヘア特化サロン」→ ターゲットが一発で「自分に関係ある」と感じる
- 補足テキスト: 「機能やスペックではなく、『どんな課題を解決するのか』という価値提供で定義しましょう。」

- `assets/day02_slide24.png`（ペルソナ 氷山モデル）
- **見出し:** ターゲット像（ペルソナ）は「感情」まで深く設計する
- **氷山の図（上部と下部）:**
  - 水面上（見えやすい属性）: 20代女性、会社員、都内住み、年収…
  - 水面下の巨大な氷（隠れた深層心理）:
    - 「状況」: いつ・どこで・どんな状態でスマホを開くか？
    - 「感情」: その瞬間、どんな言葉に「いいね」や「保存」を押すか？
- 補足: 「SNSマーケティングでは、この水面下の解像度を分ます！」

- `assets/day02_slide25.png`（ペルソナ 具体例）
- **見出し:** 【具体例】ペルソナの「状況」と「感情」を書き出す
- **例（カード形式）:**
  - ペルソナ: 30代の働くママ
  - 状況: 子供を寝かしつけた後、22時、暗い部屋で一人ベッドに寝ながらなんとなくスマホをスクロールしている
  - 感情: じゃないけど自分だけ何かし遅れてる気がする…「明日のお弁当に使える、超時短の神レシピを見つけた時（保存）」
- 補足テキスト（小）: 「ここで解像度を上げると、投稿の『写真のトーン』と『キャプションの言葉選び』が劇的に変わります。」

#### セクション5：アカウントの「玄関」を整える
- `assets/day02_slide26.png`（プロフィール・ハイライト・導線）
- **見出し:** アカウントの「玄関（プロフィールと導線）」を整える
- **3ポイント縦積みカード:**
  1. 📝 プロフィール文: 名前/紹介文（誰に・何を・価格目安が一目でわかる）。弱い例：「アットホームなサロン」→ 強い例：「カット＋カラー6000円。忙しいママに時短スタイルを。」
  2. ⭐ ハイライト: 「メニュー」「スタッフ」「予約方法」「お客様の声」を必ず設置。公式LINEへのCTAも
  3. 🔗 リンク導線: 公式LINEなど「行動につながる1〜2個」に絞る。HPに飛ばすだけはNG
- 注意ボックス: 「投稿を作り始める前に、まずこの『受け皿』を完璧にセットアップしましょう。」

- `assets/day02_slide27.png`（社内SNSルールブック）
- **見出し:** 「素材集め」の体制を社内（店舗）で作る ─ 担当者1人で背負わない
- **3ルール縦積みカード（社内SNSルールブック）:**
  1. 📸 撮影ルールの共有: 施術後や料理提供時に必ず1枚撮る「ルーティン」を組み込む
  2. 🎤 声がけスクリプト: 「お写真撮らせていただいてもいいですか？」という聞き方のトーク台本を全員で共有
  3. 📂 共有フォルダの作成: 取った素材を誰でもアクセスできるGoogleドライブ等の格納場所を作る

#### セクション6：実習 ─ 自分の「推し」戦略を設計しよう
- `assets/day02_slide28.png`（4項目ワークシート）
- **見出し:** 【実習】自社アカウントの戦略とペルソナを設計しよう（制限時間：15分）
- **4項目ワークシート（2×2グリッドカード）:**
  1. 自社商材の戦略：単価（低・高）はどちら？追うべきKPIは？
  2. UGCギミック設計（自社）：どんなUX・仕掛けで「撮影したくなる」を生み出せる？
  3. 推しの言語化：あなたのアカウントの「最大の価値提供（コンセプト）」は？
  4. ペルソナの深掘り：ターゲットがスマホを開く「状況」と「感情」は？
- 案内テキスト: 「隣の人とディスカッションしながら、思いつくままに付箋に書き出してみましょう！」
- タイマー表示（装飾）: 🕐 15:00

---

### 今日のまとめタブ詳細

- `assets/day02_slide29.png`（まとめスライド、コルクボード風）をメイン画像として配置
- **見出し:** 今日の授業のまとめ（Day 02）
- **4つのキーポイント（付箋風カード 2×2グリッド）:**
  - 🎯 目的: KGIは「指名検索」と「サイト遷移」。フォロワー数は後からついてくる。
  - ♟️ 戦略: 低単価はUGC（口コミ）獲得。高単価は信用構築・教育。
  - 🪤 仕掛け: 口コミは待つのではなく「UX設計」で意図的に生み出す。
  - 👤 ペルソナ: 「推し」を定め、ユーザーの「状況」と「感情」の解像度を上げる。
- **締めの一言（大きめテキスト）:** 「自信を持って、愛されるアカウント作りを進めていきましょう！」
- 次へのボタン: 「▶ Day 03へ」（`href="#"`）・「🏠 ホームへ」（`index.html`）

---

### 後半タブのナビゲーション
- 後半タブ末尾: 「今日のまとめへ →」ボタン
- まとめタブ末尾: 「▶ Day 03へ」（`href="#"`）・「🏠 ホームへ」

---

## [NotebookLMプロンプト 精度評価]

今回の後半スライド（Strategic_Instagram_Blueprint）評価：

| 項目 | 評価 |
|---|---|
| 画風の統一性（前半との整合） | ✅ 明るくポップで前半と統一感あり |
| テーマと内容の一致 | ✅ 企業運用・UGC・ペルソナ設計が網羅されている |
| 視覚化の質 | ✅ ベン図・ファネル・氷山モデル・比較表など多彩 |
| スライド枚数（15枚） | ✅ 適切なボリューム |
| 改善点 | なし。プロンプトの「明るく親しみやすいビジュアル」が効果的に機能している |

→ **Antigravity向けフィードバック不要。今回のプロンプト設計は成功。**

---

## [デプロイ手順]
```
copy vol02-1.html .deploy_tmp\
git add vol02-1.html .deploy_tmp\vol02-1.html assets\day02_slide15.png assets\day02_slide16.png assets\day02_slide17.png assets\day02_slide18.png assets\day02_slide19.png assets\day02_slide20.png assets\day02_slide21.png assets\day02_slide22.png assets\day02_slide23.png assets\day02_slide24.png assets\day02_slide25.png assets\day02_slide26.png assets\day02_slide27.png assets\day02_slide28.png assets\day02_slide29.png
git commit -m "Day 02 後半実装：企業Instagram運用目的・推しアカウント設計"
git push origin master
npx wrangler pages deploy .deploy_tmp --project-name=training-summary-2606
```
