# プロジェクトルール (CLAUDE.md)

ClaudeCode は本ファイルを必ず読み込むこと。

## -1. AI横断：Obsidian Hub（Cursor / Codex / ClaudeCode 共通）

**セッション開始時（必ず Read）**
- `C:\Users\Hi\OneDrive\ドキュメント\Obsidian Vault\ClaudeCode\INDEX.md`
- 本プロジェクト作業時: 同 Vault の `Instagramコース 2606.md`

**作業完了時（必ず更新）**
- 上記プロジェクトファイル（実装済み・次タスク・既知課題）
- INDEX.md の「最近の重要変更」に1行追記

**詳細ルール**: `ClaudeCode\SHARED_RULES.md`

---

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

## 3. 実装ルール

- 新しいDayページ（`volXX-1.html`）を作成する際は、最新のDayファイルをテンプレートとして複製し、内容を差し替える
- **新Dayページを作成したら、前Dayのまとめタブの「▶ Day XXへ」リンク（`href="#"`）を実URLに張り替えること**（張り替え漏れ多発のため必須チェック項目）
- テーマカラーはInstagramグラデーション（`#833ab4 → #c13584 → #f77737`）で統一する
- スライド画像と説明文は**縦1列**で配置する。PC幅でのテキスト+画像2カラム化（layout-split の 1200px 2カラム指定）は可読性を損なうため禁止
- 先月（2605・簿記コース）の `vol*.html` 設計パターン・インタラクティブ採点型UIは参考にしてよいが、簿記コース側の GEMINI.md は参照しないこと
- 本プロジェクトの `GEMINI.md` は **Antigravity 用の実装ルール**（リサーチ担当フェーズの定義）。ClaudeCode の行動規範は本ファイル（CLAUDE.md）が正
- 制作・レビュー・デプロイの詳細ルールは Obsidian Vault の **`Web教材制作ハンドブック.md`** を参照

## 4. cache-bust フォーマット統一ルール

HTMLファイル末尾の cache-bust コメントは **必ず以下の形式** を使うこと。

```html
<!-- cache-bust: YYYY-MM-DDTHH:MM:SS -->
```

例: `<!-- cache-bust: 2026-06-02T12:00:00 -->`

- `YYYY-MM-DDThh:mm:ss`（ISO 8601形式）に統一する
- ページ固有の文字列を混ぜないこと
- 全 volXX-1.html・.deploy_tmp/ の両ファイルに同じ形式で記入すること

## 5. デプロイ

Cloudflare Pages プロジェクト名: `training-summary-2606`

### ⚠️ 既知の問題：2つの連鎖トラブル（2026-06-09 Day04 で確認）

プロジェクトルート（Googleドライブ上の日本語パス）から直接デプロイすると2種類のトラブルが起きる。**必ず下記の推奨手順のみを使うこと。**

**トラブル①** `npx wrangler pages deploy` を実行すると起動直後にクラッシュ
- エラーコード: `-1073740791`（Windows `STATUS_STACK_BUFFER_OVERRUN`）
- 原因: 日本語パスで wrangler がファイル列挙する際に不安定
- 対処: `.deploy_tmp` の**中身**を ASCII パスにコピーしてからデプロイ

**トラブル②** wrangler が「Success!」なのに本番が 404 になる
- 原因: `Copy-Item ".deploy_tmp" $dest` でフォルダごとコピーすると実パスが `/.deploy_tmp/vol04-1.html` になる
- 対処: 必ず `".deploy_tmp\*"` で**中身だけ**コピーする

### デプロイ手順（PowerShell）

```powershell
# Step 1: .deploy_tmp を同期（プロジェクトルートで実行）
Set-Location "G:\マイドライブ\研修\【202606】Instagramコース"
Copy-Item index.html .deploy_tmp\ -Force
Copy-Item vol*.html .deploy_tmp\ -Force
Copy-Item assets\dayXX_slide*.png .deploy_tmp\assets\ -Force   # 当日スライドがあれば

# Step 2: 一時フォルダへ「中身だけ」コピー（* が重要）
$dest = "C:\Users\Hi\AppData\Local\Temp\deploy-instagram-2606"
if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
New-Item -ItemType Directory -Path $dest | Out-Null
Copy-Item ".deploy_tmp\*" $dest -Recurse -Force   # ← フォルダごとではなく中身だけ

# Step 3: 確認してからデプロイ
Set-Location $dest
Get-ChildItem -Filter "vol*.html"   # ← ルートに volXX-1.html があることを確認
npx wrangler pages deploy . --project-name=training-summary-2606 --commit-dirty=true
```

**本番URL確認:** `https://training-summary-2606.pages.dev/volXX-1.html`

### git の手順（デプロイとは別）

```
git add / commit / push origin master
```
