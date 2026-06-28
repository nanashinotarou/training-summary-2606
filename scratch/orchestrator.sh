#!/usr/bin/env bash
# フルオート連携オーケストレーター（§19）骨格。
# 思想：signalファイル(scratch/orch/*.done)が「正」。tmux-bridgeは"起動の合図"のみ。
#       完了検知を端末出力パースでやると壊れるので、各エージェントが自工程完了時にsignalを書く。
#
# signalプロトコル（全ファイルは scratch/orch/ ＝正本ワークスペース内。外に出すと許可プロンプトが出る）:
#   inbox.json    入力 {day, half, urls[], work}
#   slides.done   agy   {status:GREEN|HALT, savedCount, gateResult, halt_reason?}
#   plan.done     claude{status:OK|FAIL}
#   impl.done     agy   {status:OK|FAIL, htmlFile}
#   deploy.done   codex {status:OK|FAIL, url}
#   HALT          停止指示 {reason}（誰でも書ける）
#   STATUS.txt    Hiroya向け人間可読の現況
#
# 使い方:
#   本番 : bash scratch/orchestrator.sh           （tmuxペインのclaude/codex/agyを実駆動）
#   検証 : bash scratch/orchestrator.sh --mock     （実AIを触らず・ダミーsignalで状態機械だけ検証）
set -uo pipefail

ORCH_DIR="/home/hi/project/scratch/orch"
BRIDGE="$HOME/.smux/bin/tmux-bridge"
POLL=3
STAGE_TIMEOUT=${STAGE_TIMEOUT:-600}
MOCK=0
for a in "$@"; do [ "$a" = "--mock" ] && MOCK=1; done

# pane配置（start-agents.sh準拠）: claude=%0 codex=%1 agy=%2
PANE_CLAUDE="%0"; PANE_CODEX="%1"; PANE_AGY="%2"

mkdir -p "$ORCH_DIR"

ts()     { date +%H:%M:%S; }
status() { echo "[$(ts)] $*"; echo "$*" > "$ORCH_DIR/STATUS.txt"; }
notify() { printf '\a'; status "[通知] $*"; }
halt()   { echo "${1:-?}" > "$ORCH_DIR/HALT"; notify "HALT: ${1:-?}"; exit 2; }

# 既知モーダル（レート制限/許可/認証）を検知→人間判断が要るので自動応答せず停止
check_modal() {
  local pane="$1" out
  out=$("$BRIDGE" read "$pane" 8 2>/dev/null || true)
  if echo "$out" | grep -qiE "Approaching rate limits|Allow access|Password authentication|Do you want to proceed"; then
    halt "pane $pane に人間判断が要るモーダルを検知（レート制限/許可等）。Hiroya対応待ち。"
  fi
}

trigger_agent() {
  local pane="$1" task="$2"
  if [ "$MOCK" = "1" ]; then status "  (mock) skip trigger $pane"; return; fi
  "$BRIDGE" read "$pane" 3 >/dev/null 2>&1            # read-guard
  "$BRIDGE" type "$pane" "$task"
  tmux send-keys -t "$pane" Enter                     # 生Enterで送信（tmux-bridge keysは不発の実証あり）
}

mock_writer() { sleep 1; echo "{\"status\":\"OK\",\"mock\":true,\"at\":\"$(date -Iseconds)\"}" > "$ORCH_DIR/$1"; }

wait_for_signal() {   # 主シェルで実行（halt のexitを効かせるため $() に入れない）
  local sigfile="$1" pane="$2" waited=0
  while [ ! -f "$ORCH_DIR/$sigfile" ]; do
    [ -f "$ORCH_DIR/HALT" ] && halt "$(cat "$ORCH_DIR/HALT")"
    [ "$waited" -ge "$STAGE_TIMEOUT" ] && halt "$sigfile タイムアウト(${STAGE_TIMEOUT}s)"
    [ "$MOCK" != "1" ] && check_modal "$pane"
    sleep "$POLL"; waited=$((waited+POLL))
  done
}

run_stage() {
  local name="$1" pane="$2" sigfile="$3" task="$4"
  status "▶ $name 開始 (pane $pane)"
  rm -f "$ORCH_DIR/$sigfile"
  trigger_agent "$pane" "$task"
  [ "$MOCK" = "1" ] && mock_writer "$sigfile" &
  wait_for_signal "$sigfile" "$pane"
  local result; result=$(cat "$ORCH_DIR/$sigfile")
  if echo "$result" | grep -qiE '"status"[[:space:]]*:[[:space:]]*"(HALT|FAIL)"'; then halt "$name 失敗: $result"; fi
  status "✓ $name 完了: $result"
}

# ===== パイプライン本体 =====
rm -f "$ORCH_DIR/HALT"
[ -f "$ORCH_DIR/inbox.json" ] || echo '{"day":13,"half":"前半","urls":["MOCK_URL"],"work":"mock"}' > "$ORCH_DIR/inbox.json"
status "=== オーケストレーター開始 (mock=$MOCK) ==="

run_stage "リサーチ+スライド"   "$PANE_AGY"    "slides.done" "【orchestrator】Today_Research.md更新→notebooklm-auto.js本実行。完了したら scratch/orch/slides.done に {\"status\":\"GREEN\",\"savedCount\":N} を書け。"
run_stage "厳選+vol計画"        "$PANE_CLAUDE" "plan.done"   "【orchestrator】昇格スライドと実習からvol計画+厳選。完了したら scratch/orch/plan.done に {\"status\":\"OK\"} を書け。"
run_stage "HTML実装"            "$PANE_AGY"    "impl.done"   "【orchestrator】計画に沿いvolXX-1.html実装。完了したら scratch/orch/impl.done に {\"status\":\"OK\",\"htmlFile\":\"...\"} を書け。"
run_stage "レビュー+デプロイ"   "$PANE_CODEX"  "deploy.done" "【orchestrator】品質ゲート+HTMLレビュー→WSL直デプロイ(§5)。完了したら scratch/orch/deploy.done に {\"status\":\"OK\",\"url\":\"...\"} を書け。"

notify "✅ 全工程完了。Hiroyaの確認をどうぞ。"
status "=== 完了 ==="
