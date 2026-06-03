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
