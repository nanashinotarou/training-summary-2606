# Today_Plan.md — Day 11「フィード投稿と資料生成AI」後半 実装計画

**作成日時**: 2026-06-24  
**対象ファイル**: `vol11-1.html`（既存ファイルの後半タブを差し替え。新規ファイル作成なし）  
**実装担当**: Antigravity → **レビュー: 目視確認**  
**追加作業**: なし（vol10のDay11リンクは前半実装時に対応済み）

---

## ⚠ 最重要方針＋Day11前半の教訓（必読）

- スライドの貼り付けだけで済ませない。本文で理解できる詳細さで説明を書く（スライドは補完）
- **`の→of` 文字化けは前半でも再発した。実装後に必ず全文検索すること**
- `.step-num` の中には数字のみ（`1`,`2`,`3`）。「Step 1」などの文字列は書かない
- Font Awesome アイコンは Free で確実に表示されるものだけ使う（`fa-list-columns` は無効）
- 後半タブの「準備中プレースホルダー」を全削除してから実コンテンツを書く
- **インラインJSを削除しないこと**（`openTab` 等のタブ切替JS・コピーボタンJSが消えるとボタンが全滅する）

---

## スライド構成（リネーム）

```powershell
$a = "G:\マイドライブ\研修\【202606】Instagramコース\assets"
1..14 | ForEach-Object { Rename-Item "$a\Manus_AI_Instagram_Workflow_-_Slide_$_ .png" ("day11_slide" + ($_ + 14) + ".png") }
```

| ファイル名 | 枚数 |
|---|---|
| `assets/day11_slide15.png` ～ `day11_slide28.png` | 14枚（後半） |
| 前半 `day11_slide1〜14` と合わせて合計 | **28枚** |

---

## ① 後半タブ（`id="second"`）の差し替え

**見出し**: `後半 ／ 自律型AIエージェント「Manus」でInstagram運用を全自動化する`  
**スライド**: `day11_slide15`〜`day11_slide28` を縦1列で配置。

### SECTION D: 自律型AIエージェント「Manus AI」とは（要点4）

- **従来のAIとの違い（info-card 2枚対比）**:
  - ChatGPT等：質問に答える「先生」型。人間が都度指示を出して操作する
  - Manus：自律的にブラウザ操作・検索・ツール連携を実行する「秘書」型。指示を出すとあとはAIが完遂する
- **Meta公式API連携の安全性**：ManusはMeta社グループ傘下に入りMeta公式のAPI連携が実現。ストーリー自動投稿も含む安全で強固な自動運用が可能になった
- **活用イメージ**：「競合を調べてレポートして」「今日の投稿を作って予約して」などの依頼を一言出すだけでManusが全部やってくれる

### SECTION E: Manusが実現する4大自動化機能（要点5）

**4機能を info-card 4枚で**（アイコン付き）:

1. **競合アカウントの自動分析** — 競合アカウントを伝えるだけで、いいね数・フォロワー数・投稿頻度・リール再生数・ハッシュタグ等を自動収集しレポートを作成
2. **自社アカウントのインサイト分析** — アカウント連携でリーチ数・エンゲージメント率を自動分析、ダッシュボードと改善案を自動生成
3. **コンテンツの自動生成と投稿** — フィード・リール・ストーリーのデザインからキャプション・タグまで生成し、Instagramへの自動投稿（予約投稿も可）を実行
4. **メタ広告マネージャー連携（中級者向け）** — Instagram広告のパフォーマンス分析と改善案を自動テスト

### SECTION F: Manus×Gemini×Instagram 3ステップ自動化フロー（要点6）

- **なぜGeminiを組み合わせるか**：Manus単体でも画像生成はできるが、文字化けや品質にばらつきが出る。Geminiに画像生成を担わせることで高品質なカルーセル画像を作れる
- **3ステップ（step-card）**:
  - Step 1: **市場調査とコンセプト設計（Manus）** — Manusにテーマを指示し、市場・ライバル調査から「投稿コンセプト」と「3枚の画像設計図（テキスト指示文）」を作らせる（このステップでは画像を生成させない）
  - Step 2: **画像生成（Gemini）** — ManusがStep 1で作った画像設計図をそのままGeminiに渡し「1枚ずつ出力してください」と指示して高品質なカルーセル画像を生成。文字化けのない仕上がりになる
  - Step 3: **自動投稿（Manus）** — 生成された画像の共有URLをManusに渡し「Instagramのカルーセル投稿をして」と指示。Manusが自動ログインして投稿設定を行い、最終確認の1クリックで完了
- **実習メモ（quote-box）**: 無料アカウントで画像をカルーセル投稿する際は、画像を直接アップロードするのではなく「画像の共有URLリンクを渡す」のがコツ

#### 動画セクション（後半2本）`<div class="video-section">`（`video-section-title`: 📺 授業の元動画（後半））

1. `<details class="video-item">` 【インスタ自動化】自律型AIエージェントManusでインスタ運用を自動化する方法【初心者向け】（38:39）  
   — embed `https://www.youtube.com/embed/UjIa7_0oe8U`
2. `<details class="video-item">` 【Manus×Gemini×インスタ自動化】競合調査からインスタ画像・投稿まで全自動化する3つのステップ（6:50）  
   — embed `https://www.youtube.com/embed/VHCD5lZ77Rs`

#### ワークシートB（実習）

- タイトル：**Manusを登録してInstagramと連携しよう**
- 実習内容：Manusの無料アカウント登録（紹介コード経由）→ Instagram連携 → 上記3ステップフローを1回試す
- worksheet-card: 「試してみた感想・できたこと・詰まったこと」メモ欄

**フッター**: `<button class="tool-link-btn" onclick="openTab('summary')">今日のまとめへ <i class="fa-solid fa-arrow-right"></i></button>`

---

## ② まとめタブ（`id="summary"`）の更新

**前半+後半を網羅した4枚に書き換える**（sticky-grid 4枚維持）:

1. Canva一括作成＋ChatGPT CSV設計で投稿を量産。テンプレ×データで数十枚が瞬時に完成、ネタ切れゼロのコンテンツ在庫が作れる
2. データバインド3ステップ（①CSVインポート ②右クリック→データ接続 ③続行で一括生成）。見出し・キャプション・画像プロンプトをCSV列として設計しておくのがコツ
3. 自律型AIエージェントManusはMeta公式API連携で**競合分析・コンテンツ生成・自動投稿**まで実現。指示1つで「秘書が全部やってくれる」時代へ
4. Manus×Gemini 3ステップ（①Manusで市場調査＋画像設計図 → ②Geminiで高品質画像生成 → ③Manusで自動投稿）で文字化けなしの高品質投稿を自動化

**フッター**（Day12未作成のため変更なし）:
```html
<div class="tab-nav-footer">
    <a href="#" class="tool-link-btn">▶ Day 12へ</a>
    <a href="./index.html" class="tool-link-btn secondary"><i class="fa-solid fa-house"></i> コース一覧に戻る</a>
</div>
```

---

## ③ cache-bust 更新

```html
<!-- cache-bust: 2026-06-24T21:00:00 -->
```

`.deploy_tmp/vol11-1.html` も同じ値に更新すること。

---

## ④ 機械チェックリスト（後半追加後の合格値）

```powershell
# ① of化けチェック（0件なら合格）
Select-String -Path vol11-1.html -Pattern " of | in | the " -CaseSensitive

# ② スライド枚数（28件なら合格：前半14＋後半14）
(Select-String -Path vol11-1.html -Pattern "day11_slide" | Measure-Object).Count

# ③ 動画数（4件なら合格：前半2＋後半2）
(Select-String -Path vol11-1.html -Pattern 'class="video-item"' | Measure-Object).Count

# ④ cover-slide 存在（1件なら合格）
Select-String -Path vol11-1.html -Pattern "cover-slide"

# ⑤ cache-bust（2026-06-24T21:00:00 なら合格）
Select-String -Path vol11-1.html -Pattern "cache-bust: 2026-06-24T21:00:00"

# ⑥ 後半プレースホルダーが消えているか（0件なら合格）
Select-String -Path vol11-1.html -Pattern "後半コンテンツは準備中"
```

---

## ⑤ デプロイ手順

```powershell
Set-Location "G:\マイドライブ\研修\【202606】Instagramコース"
.\deploy.ps1
```

本番確認: `https://training-summary-2606.pages.dev/vol11-1.html`
