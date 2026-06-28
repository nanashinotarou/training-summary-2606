# NotebookLM セマンティックセレクタ一覧

> **最終確認日**: 2026-06-27  
> **動作保証**: 座標（click_at 等）は一切排除し、レイアウト変更に強いセマンティックな指定のみを使用。

| STEP | 対象UI要素 | 使用セレクタ | 説明 |
|---|---|---|---|
| **STEP 0** | ダッシュボードログイン確認 | `::-p-xpath(//*[contains(text(), "新規作成") or contains(text(), "ノートブック")])` | ログイン完了後のダッシュボード検出用 |
| **STEP 1** | 新規作成ボタン | `::-p-xpath(//*[contains(text(), "新規作成") or contains(text(), "新しいノートブック")])` | 新規ノートブック作成モーダルのトリガー |
| **STEP 1** | ウェブサイト（YouTube）ボタン | `::-p-xpath(//*[contains(text(), "ウェブサイト") or contains(text(), "YouTube")])` | ソース選択ダイアログでのインポート種別選択 |
| **STEP 1** | URL入力エリア | `textarea[placeholder*="検索"], textarea[placeholder*="URL"]` | YouTubeのURLなどを入力するtextarea |
| **STEP 1** | インポート確定ボタン | `::-p-xpath(//button[contains(., "追加") or contains(., "インポート")])` | URLを入力した後の追加実行 |
| **STEP 1** | ソース読込チェック (✅) | `[aria-checked="true"]` | 各ソースのロード完了ステータス監視 |
| **STEP 1** | 失敗ソース削除ボタン | `button[aria-label*="削除"], mat-icon:contains(delete)` | 読込に失敗したソースの個別ゴミ箱削除 |
| **STEP 2** | ノートブックガイド起動 | `::-p-xpath(//*[contains(text(), "ノートブックガイド")])` | 画面右下のガイドパネル展開 |
| **STEP 2** | スライド設定「`>`」ボタン | `::-p-xpath(//*[contains(text(), "スライド")]/ancestor::*[contains(@class, "card")]//button)` | スライドのカスタマイズ画面表示 |
| **STEP 2** | プレゼンターのスライド選択 | `::-p-xpath(//*[contains(text(), "プレゼンターのスライド")])` | スライドタイプから「プレゼンターのスライド」を指定 |
| **STEP 2** | プロンプト説明欄 | `textarea[placeholder*="説明"], textarea[placeholder*="プロンプト"], textarea` | 生成プロンプトの入力エリア |
| **STEP 2** | 生成実行ボタン | `::-p-xpath(//button[contains(., "生成") or contains(., "作成")])` | プロンプト入力後の作成開始ボタン |
| **STEP 3** | 生成ローディング監視 | `mat-progress-bar, [role="progressbar"]` | 生成中プログレスバーの消失監視 |
| **STEP 3** | 成果物スライドカード検出 | `::-p-xpath(//*[contains(text(), "AI Shorts Mass") or contains(text(), "AI Shorts")])` | 生成完了後のStudioパネル内成果物の出現監視 |
| **STEP 4** | スライドビューア最大化 | `button[aria-label="開く"]` | ビューア起動後のモーダル最大化 |
| **STEP 5** | スライド画像（clientWidth > 500） | `img` | ビューア内の表示スライド画像特定（googleusercontent / storage / blob 等を部分一致含むもの） |
| **STEP 5** | スライドサムネイル総数 M | `.thumbnail-image-container` | スライド総数Mおよび現在選択スライドの検知 |
| **STEP 5** | 選択中のスライドインデックス | `.thumbnail-image-container.selected` | 終端判定用の現在選択スライド特定 |
