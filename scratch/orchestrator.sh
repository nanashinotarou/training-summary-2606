#!/usr/bin/env bash
# フルオート連携オーケストレーター（§19）。Day13(6/30)で新基盤(/home/hi 正本)初投入。
# 思想：signalファイル(scratch/orch/*.done)が「正」。tmux-bridgeは"起動の合図"のみ。
#       完了検知を端末出力パースでやると壊れるので、各エージェントが自工程完了時にsignalを書く。
#       各AIのsignal書込仕様は GEMINI.md / CLAUDE.md / CODEX.md の「オーケストレーター連携」節に明記。
#
# pane配置（start-agents.sh準拠・session=agents/window0）:
#   0.0=claude  0.1=codex  0.2=agy  0.3=空き（←ここで本スクリプトを実行する）
#   ※pane ID(%N)はtmuxサーバ寿命で番号がdriftするため、安定するindex形式 agents:0.N を使う。
#
# signalプロトコル（全ファイルは scratch/orch/ ＝正本ワークスペース内。外に出すと許可プロンプトが出る）:
#   inbox.json    入力 {day, half, urls[], work}（real時は事前に用意。無ければテンプレを書いて停止）
#   slides.done   agy   {status:GREEN|HALT, savedCount, gateResult?, halt_reason?}
#   plan.done     claude{status:OK|FAIL}
#   impl.done     agy   {status:OK|FAIL, htmlFile}
#   deploy.done   codex {status:OK|FAIL, url}
#   HALT          停止指示 {reason}（誰でも書ける。人間判断が要るとき各AIはこれを書いて止まる）
#   STATUS.txt    Hiroya向け人間可読の現況
#
# 使い方:
#   本番 : (session=agents の空きpane 0.3 で) bash scratch/orchestrator.sh
#   検証 : bash scratch/orchestrator.sh --mock   （実AIを触らず・ダミーsignalで状態機械だけ検証）
set -uo pipefail

ORCH_DIR="/home/hi/project/scratch/orch"
BRIDGE="$HOME/.smux/bin/tmux-bridge"
SESSION="${ORCH_SESSION:-agents}"
POLL=3
MOCK=0
for a in "$@"; do [ "$a" = "--mock" ] && MOCK=1; done

# pane配置（index形式＝サーバ再起動でも安定）。必要なら環境変数で上書き可。
PANE_CLAUDE="${PANE_CLAUDE:-$SESSION:0.0}"
PANE_CODEX="${PANE_CODEX:-$SESSION:0.1}"
PANE_AGY="${PANE_AGY:-$SESSION:0.2}"

# 段ごとのタイムアウト（秒）。研究+NotebookLMは生成待ち込みで長い。env上書き可。
T_SLIDES=${T_SLIDES:-2400}   # research+文字起こし+NotebookLM生成待ち+連番保存
T_PLAN=${T_PLAN:-900}
T_IMPL=${T_IMPL:-1800}
T_DEPLOY=${T_DEPLOY:-1200}

mkdir -p "$ORCH_DIR"

ts()     { date +%H:%M:%S; }
status() { echo "[$(ts)] $*"; echo "$*" > "$ORCH_DIR/STATUS.txt"; }
notify() { printf '\a'; status "[通知] $*"; }
halt()   { echo "${1:-?}" > "$ORCH_DIR/HALT"; notify "HALT: ${1:-?}"; exit 2; }

# 既知モーダル（レート制限/許可/認証）を検知→人間判断が要るので自動応答せず停止
check_modal() {
  local pane="$1" out
  out=$("$BRIDGE" read "$pane" 8 2>/dev/null || true)
  if echo "$out" | grep -qiE "Approaching rate limits|usage limit|Allow access|Grant access|Password authentication|Do you want to proceed"; then
    halt "pane $pane に人間判断が要るモーダルを検知（レート制限/許可等）。Hiroya対応待ち。"
  fi
}

trigger_agent() {
  local pane="$1" task="$2"
  if [ "$MOCK" = "1" ]; then status "  (mock) skip trigger $pane"; return; fi
  "$BRIDGE" read "$pane" 3 >/dev/null 2>&1            # read-guard
  "$BRIDGE" type "$pane" "$task"
  # 送信：codexは「ペインが非フォーカスだと send-keys Enter を取りこぼす」実証あり（2026-06-29・Retrospective L9）。
  # select-paneでフォーカス→挿入テキストが落ち着くのを待ってからEnter。agyは不要だが入れても無害。
  tmux select-pane -t "$pane"
  sleep 1.2
  tmux send-keys -t "$pane" Enter
}

mock_writer() { sleep 1; echo "{\"status\":\"OK\",\"mock\":true,\"at\":\"$(date -Iseconds)\"}" > "$ORCH_DIR/$1"; }

wait_for_signal() {   # 主シェルで実行（halt のexitを効かせるため $() に入れない）
  local sigfile="$1" pane="$2" timeout="$3" waited=0
  while [ ! -f "$ORCH_DIR/$sigfile" ]; do
    [ -f "$ORCH_DIR/HALT" ] && halt "$(cat "$ORCH_DIR/HALT")"
    [ "$waited" -ge "$timeout" ] && halt "$sigfile タイムアウト(${timeout}s)"
    [ "$MOCK" != "1" ] && check_modal "$pane"
    sleep "$POLL"; waited=$((waited+POLL))
  done
}

run_stage() {
  local name="$1" pane="$2" sigfile="$3" timeout="$4" task="$5"
  status "▶ $name 開始 (pane $pane, timeout ${timeout}s)"
  rm -f "$ORCH_DIR/$sigfile"
  trigger_agent "$pane" "$task"
  [ "$MOCK" = "1" ] && mock_writer "$sigfile" &
  wait_for_signal "$sigfile" "$pane" "$timeout"
  local result; result=$(cat "$ORCH_DIR/$sigfile")
  if echo "$result" | grep -qiE '"status"[[:space:]]*:[[:space:]]*"(HALT|FAIL)"'; then halt "$name 失敗: $result"; fi
  status "✓ $name 完了: $result"
}

write_inbox_template() {
  cat > "$ORCH_DIR/inbox.example.json" <<'JSON'
{
  "day": 13,
  "half": "前半",
  "urls": ["https://www.youtube.com/watch?v=XXXXXXXXXXX"],
  "work": "（主催者指定の実習内容を1文で。例：推しを発信するワークフローに沿って課題を作りPadletに投稿）"
}
JSON
}

preflight() {
  [ "$MOCK" = "1" ] && { status "preflight: mock — pane/inbox検証スキップ"; return; }
  # tmux内で動いているか（生tmux send-keysとbridgeが同一サーバを指すため必須）
  [ -n "${TMUX:-}" ] || halt "tmux外で起動。session=$SESSION の空きpane(0.3)で実行すること。"
  [ -x "$BRIDGE" ]   || halt "tmux-bridge が見つからない/実行不可: $BRIDGE"
  # 3 paneの存在確認
  local p
  for p in "$PANE_CLAUDE" "$PANE_CODEX" "$PANE_AGY"; do
    tmux display-message -t "$p" -p '#{pane_id}' >/dev/null 2>&1 \
      || halt "pane '$p' が見つからない。start-agents.sh で session=$SESSION を起動済みか確認（tmux-bridge list で配置確認）。"
  done
  # 入力inbox（real時は必須。無ければテンプレを書いて停止＝事故防止）
  if [ ! -s "$ORCH_DIR/inbox.json" ]; then
    write_inbox_template
    halt "scratch/orch/inbox.json が無い。$ORCH_DIR/inbox.example.json を埋めて inbox.json として保存してから再実行。"
  fi
  status "preflight OK: claude=$PANE_CLAUDE codex=$PANE_CODEX agy=$PANE_AGY / inbox.json あり"
  "$BRIDGE" list 2>/dev/null | sed 's/^/  /' || true
}

# ===== パイプライン本体 =====
rm -f "$ORCH_DIR/HALT"
[ "$MOCK" = "1" ] && [ ! -f "$ORCH_DIR/inbox.json" ] && echo '{"day":13,"half":"前半","urls":["MOCK_URL"],"work":"mock"}' > "$ORCH_DIR/inbox.json"
status "=== オーケストレーター開始 (mock=$MOCK, session=$SESSION) ==="
preflight

INBOX="scratch/orch/inbox.json"

run_stage "リサーチ+スライド" "$PANE_AGY" "slides.done" "$T_SLIDES" \
  "【orchestrator】$INBOX の{day,half,urls,work,theme}を読め。(A) Today_Research.md を君自身の動画要約で更新（**yt-dlp禁止・文字起こしツール不要**。NotebookLMがURLを直接読む）。(B) NotebookLMスライドは inbox の値で次を実行：bash scratch/run-notebooklm.sh --day <day> --half <half> --urls <urlsをカンマ区切り> --work <work>（Windows node interopでnotebooklm-auto.jsを起動・連番保存。詳細はrun-notebooklm.sh冒頭）。完了で scratch/orch/slides.done に {\"status\":\"GREEN\",\"savedCount\":N} を書け。**NotebookLM要ログイン/依存不足等で無人継続できないなら、調査ループに入らず即、.done でなく scratch/orch/HALT に具体的な理由（例：NotebookLM未ログイン→headless:falseで手動ログイン要）を書いて止まれ。**"

run_stage "厳選+vol計画" "$PANE_CLAUDE" "plan.done" "$T_PLAN" \
  "【orchestrator】$INBOX と昇格スライド・実習からvolXX計画＋スライド厳選（〜14枚から取捨）。Today_Plan.mdを更新。完了したら scratch/orch/plan.done に {\"status\":\"OK\"} を書け（CLAUDE.md §8）。ブロック時は scratch/orch/HALT に理由を書いて止まれ。"

run_stage "HTML実装" "$PANE_AGY" "impl.done" "$T_IMPL" \
  "【orchestrator】Today_Plan.mdの計画どおりvolXX-1.html実装（GEMINI.md §4・文字化け0・前Dayまとめの次Dayリンク張替）。完了したら scratch/orch/impl.done に {\"status\":\"OK\",\"htmlFile\":\"volXX-1.html\"} を書け。ブロック時は scratch/orch/HALT に理由。"

run_stage "レビュー+デプロイ" "$PANE_CODEX" "deploy.done" "$T_DEPLOY" \
  "【orchestrator】Today_Plan §④の機械チェック→全PassならWSL直デプロイ（CODEX.md §3-B）。成功後 Retrospective.md に1行追記（CODEX.md §8）。完了したら scratch/orch/deploy.done に {\"status\":\"OK\",\"url\":\"...\"} を書け。Failはデプロイせず scratch/orch/HALT に転送ブロック要旨を書いて止まれ。"

notify "✅ 全工程完了。Hiroyaの確認をどうぞ。"
status "=== 完了（$(cat "$ORCH_DIR/deploy.done" 2>/dev/null)） ==="
