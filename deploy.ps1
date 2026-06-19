# =====================================================================
#  DX研修まとめ デプロイスクリプト（CLAUDE.md §5 準拠・1コマンド化）
#  使い方:
#    .\deploy.ps1            … HTML＋assets を同期してデプロイ
#    .\deploy.ps1 -NoAssets  … HTMLのみ（assets未変更時・高速）
#  既知の罠を封じ込め:
#    - 日本語パスからの直接 wrangler 実行 → ASCII一時パス経由で回避
#    - .deploy_tmp をフォルダごとコピーすると /.deploy_tmp/ で404 → "\*"で中身だけ
#    - Remove-Item はサンドボックスでブロックされる → 毎回タイムスタンプ新規フォルダ
# =====================================================================
param([switch]$NoAssets)
$ErrorActionPreference = 'Stop'

$proj    = "G:\マイドライブ\研修\【202606】Instagramコース"
$project = "training-summary-2606"

Set-Location $proj

# --- Step 1: .deploy_tmp を同期 ---
Copy-Item index.html .deploy_tmp\ -Force
Copy-Item vol*.html  .deploy_tmp\ -Force
if (-not $NoAssets) {
    Copy-Item assets\* .deploy_tmp\assets\ -Force -Recurse
    Write-Host "[1/3] HTML + assets を .deploy_tmp に同期しました"
} else {
    Write-Host "[1/3] HTML のみ .deploy_tmp に同期しました（-NoAssets）"
}

# --- Step 2: ASCII一時パスへ「中身だけ」コピー ---
$dest = Join-Path $env:TEMP ("deploy-instagram-2606-" + (Get-Date -Format 'yyyyMMddHHmmss'))
New-Item -ItemType Directory -Path $dest | Out-Null
Copy-Item ".deploy_tmp\*" $dest -Recurse -Force
Write-Host "[2/3] ASCII一時パスへコピー: $dest"

# --- Step 3: 確認してデプロイ ---
Set-Location $dest
$vols = (Get-ChildItem -Filter "vol*.html").Count
if ($vols -lt 1) { throw "vol*.html がルートに見当たりません。中断します。" }
Write-Host "[3/3] vol*.html を $vols 本検出 → デプロイ開始"
npx wrangler pages deploy . --project-name=$project --commit-dirty=true

Set-Location $proj
Write-Host "完了。 https://$project.pages.dev/"
