/*!
 * clock.js — 日本標準時オーバーレイ時計（全ページ共通）
 * 右下のFABを押すとスクリーンセーバー風に時計が浮く。
 * 操作は下部の最小タブ（表示／休憩／目標）から、必要なパネルを1つずつ開閉する。
 * 目標時刻は丸い実時計風ピッカーで指定（針をドラッグ／文字盤クリック・分は任意値可）。
 * 時刻はサーバー時刻（HTTP Dateヘッダ）にアンカーして±1秒精度。失敗時は端末時計にフォールバック。
 */
(function () {
  'use strict';
  if (window.__jstClockLoaded) return;
  window.__jstClockLoaded = true;

  var GRAD = 'linear-gradient(45deg,#833ab4,#c13584,#f77737)';

  /* ---- スタイル注入 ---- */
  var css = ''
    /* FAB / オーバーレイ / 時計表示（コア・維持） */
    + '#jc-fab{position:fixed;right:30px;z-index:3000;width:60px;height:60px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;background:' + GRAD + ';box-shadow:0 10px 25px rgba(193,53,132,.4);transition:transform .3s}'
    + '#jc-fab:hover{transform:translateY(-4px) scale(1.05)}'
    + '.jc-overlay{display:none;position:fixed;inset:0;z-index:3001;flex-direction:column;align-items:center;justify-content:center;cursor:zoom-out}'
    + '.jc-overlay.jc-open{display:flex;animation:jcfade .25s ease}'
    + '@keyframes jcfade{from{opacity:0}to{opacity:1}}'
    + '.jc-overlay.jc-dark{background:#000}'
    + '.jc-overlay.jc-light{background:#f4f4ef}'
    + '.jc-panel{display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:default;width:100%}'
    + ".jc-label{font-family:'Noto Sans JP',sans-serif;font-weight:700;letter-spacing:.42em;font-size:clamp(13px,2vw,40px);margin-bottom:clamp(30px,6vh,96px)}"
    + ".jc-date{font-family:'Noto Sans JP',sans-serif;font-weight:700;letter-spacing:.2em;font-size:clamp(16px,2.4vw,46px);margin-top:clamp(30px,6vh,96px)}"
    + '.jc-overlay.jc-dark .jc-label,.jc-overlay.jc-dark .jc-date{color:#e8e8e8}'
    + '.jc-overlay.jc-light .jc-label,.jc-overlay.jc-light .jc-date{color:#4a4458}'
    + '.jc-blocky,.jc-seven,.jc-flip{display:none;align-items:center;justify-content:center;width:100%}'
    + '.jc-overlay.jc-d1 .jc-blocky{display:flex}'
    + '.jc-overlay.jc-d2 .jc-seven{display:flex}'
    + '.jc-overlay.jc-d3 .jc-flip{display:flex}'
    + ".jc-blocky{font-family:'Roboto Mono',ui-monospace,monospace;font-weight:700;font-size:min(15vw,27vh);letter-spacing:.14em;line-height:1}"
    + '.jc-overlay.jc-dark .jc-blocky{color:#f4ad3c}'
    + '.jc-overlay.jc-light .jc-blocky{color:#1e1035}'
    + '.jc-seven{gap:min(2.8vw,4.8vh)}'
    + '.jc-seven .jc-dg{width:min(10vw,18vh);height:auto}'
    + '.jc-seven .jc-cl{width:min(2.8vw,5vh);height:auto;margin:0 min(1.3vw,2.2vh)}'
    + '.jc-seven .jc-on[data-seg="a"],.jc-seven .jc-on[data-seg="g"],.jc-seven .jc-on[data-seg="d"]{fill:url(#jcGH)}'
    + '.jc-seven .jc-on[data-seg="b"],.jc-seven .jc-on[data-seg="c"],.jc-seven .jc-on[data-seg="e"],.jc-seven .jc-on[data-seg="f"]{fill:url(#jcGV)}'
    + '.jc-seven .jc-cl rect{fill:url(#jcGR)}'
    + '.jc-overlay.jc-dark .jc-seven .jc-off{fill:#141414}'
    + '.jc-overlay.jc-light .jc-seven .jc-on{fill:#171327}'
    + '.jc-overlay.jc-light .jc-seven .jc-off{fill:#e7e4da}'
    + '.jc-overlay.jc-light .jc-seven .jc-cl rect{fill:#171327}'
    + '.jc-flip{gap:min(1.6vw,2.6vh)}'
    + '.jc-flip .jc-fcard{width:min(12vw,21vh);height:min(18vw,31vh);border-radius:min(1.4vh,12px);display:flex;align-items:center;justify-content:center;position:relative;perspective:600px}'
    + ".jc-flip .jc-fv{font-family:'Roboto',ui-monospace,monospace;font-weight:700;font-size:min(8.5vw,15vh);display:block}"
    + ".jc-flip .jc-fcard::after{content:'';position:absolute;left:6px;right:6px;top:50%;height:1px}"
    + '.jc-flip .jc-fsep{font-weight:700;font-size:min(6vw,11vh);display:flex;align-items:center;padding:0 min(.5vw,8px)}'
    + '.jc-overlay.jc-dark .jc-flip .jc-fcard{background:#1d1d22}'
    + '.jc-overlay.jc-dark .jc-flip .jc-fv{color:#f3f3f3}'
    + '.jc-overlay.jc-dark .jc-flip .jc-fcard::after{background:rgba(0,0,0,.6)}'
    + '.jc-overlay.jc-dark .jc-flip .jc-fsep{color:#cfcfcf}'
    + '.jc-overlay.jc-light .jc-flip .jc-fcard{background:#fff;border:1px solid #e2dff0}'
    + '.jc-overlay.jc-light .jc-flip .jc-fv{color:#1e1035}'
    + '.jc-overlay.jc-light .jc-flip .jc-fcard::after{background:rgba(0,0,0,.12)}'
    + '.jc-overlay.jc-light .jc-flip .jc-fsep{color:#6a6478}'
    + '.jc-flip .jc-fcard.jc-flipping .jc-fv{animation:jcflip .32s ease}'
    + '@keyframes jcflip{0%{transform:rotateX(0)}45%{transform:rotateX(-82deg)}100%{transform:rotateX(0)}}'
    + '.jc-close{position:absolute;top:16px;right:24px;background:none;border:none;font-size:34px;line-height:1;cursor:pointer;padding:4px 10px;opacity:.7;z-index:4}'
    + '.jc-overlay.jc-dark .jc-close{color:#fff}'
    + '.jc-overlay.jc-light .jc-close{color:#1e1035}'
    + '.jc-close:hover{opacity:1}'
    + ".jc-hint{position:absolute;top:22px;left:50%;transform:translateX(-50%);font-size:12px;letter-spacing:.08em;opacity:.45;font-family:'Noto Sans JP',sans-serif}"
    /* 目標カウントダウンのサブ行（維持） */
    + ".jc-target{display:none;text-align:center;margin-top:clamp(14px,2.6vh,34px);font-family:'Noto Sans JP',sans-serif;font-weight:700;font-size:clamp(14px,1.7vw,30px);letter-spacing:.06em;line-height:1.5}"
    + ".jc-target .jc-tgt-time,.jc-target .jc-tgt-rem{font-family:'Roboto Mono',ui-monospace,monospace}"
    + '.jc-overlay.jc-dark .jc-target{color:#d8c89a}'
    + '.jc-overlay.jc-light .jc-target{color:#7a5a2a}'
    + '.jc-target .jc-tgt-rem{color:#f4ad3c}'
    + '@keyframes jcflash{0%,100%{opacity:1}50%{opacity:.2}}'
    + '.jc-panel.jc-flash{animation:jcflash .55s ease 6}'
    /* ── 下部ツールバー（最小・常時） ── */
    + '.jc-bar{position:absolute;bottom:26px;left:50%;transform:translateX(-50%);display:flex;gap:10px;z-index:2}'
    + '.jc-overlay.jc-dark .jc-bar{color:#cfcfcf}'
    + '.jc-overlay.jc-light .jc-bar{color:#4a4458}'
    + ".jc-tab{font-family:'Noto Sans JP',sans-serif;font-size:13px;font-weight:700;border:none;border-radius:22px;padding:10px 20px;cursor:pointer;transition:.18s;background:rgba(128,128,128,.16);color:inherit}"
    + '.jc-tab:hover{transform:translateY(-2px)}'
    + '.jc-tab.jc-on{background:' + GRAD + ';color:#fff}'
    + '.jc-tab .jc-dot{display:none;width:7px;height:7px;border-radius:50%;background:#f4ad3c;margin-left:7px;vertical-align:middle}'
    + '.jc-tab.jc-run .jc-dot{display:inline-block}'
    /* ── パネル（1つずつ開閉） ── */
    + '.jc-sheet{position:absolute;bottom:86px;left:50%;transform:translateX(-50%) translateY(12px);width:min(92vw,340px);border-radius:20px;padding:20px;opacity:0;pointer-events:none;transition:.2s ease;z-index:3;box-shadow:0 24px 60px rgba(0,0,0,.45)}'
    + '.jc-sheet.jc-open{opacity:1;pointer-events:auto;transform:translateX(-50%) translateY(0)}'
    + '.jc-overlay.jc-dark .jc-sheet{background:#1c1c23;color:#ededed}'
    + '.jc-overlay.jc-light .jc-sheet{background:#fff;color:#1e1035;border:1px solid #ece8f5}'
    + ".jc-sheet-h{font-family:'Noto Sans JP',sans-serif;font-size:12px;font-weight:700;opacity:.6;margin-bottom:14px;text-align:center;letter-spacing:.14em}"
    + '.jc-seg-row{display:flex;gap:8px;margin-bottom:10px}'
    + '.jc-seg-row:last-child{margin-bottom:0}'
    + ".jc-seg-row button{flex:1;font-family:'Noto Sans JP',sans-serif;font-size:13px;font-weight:700;border:none;border-radius:12px;padding:11px 4px;cursor:pointer;transition:.15s;background:rgba(128,128,128,.14);color:inherit}"
    + '.jc-seg-row button:hover{background:rgba(131,58,180,.2)}'
    + '.jc-seg-row button.jc-sel{background:' + GRAD + ';color:#fff}'
    + '.jc-break-stop{width:100%;margin-top:10px;font-family:"Noto Sans JP",sans-serif;font-size:13px;font-weight:700;border:none;border-radius:12px;padding:11px;cursor:pointer;background:rgba(128,128,128,.18);color:inherit}'
    + '.jc-chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}'
    + ".jc-chips button{font-family:'Noto Sans JP',sans-serif;font-size:12px;font-weight:700;border:none;border-radius:16px;padding:8px 13px;cursor:pointer;background:rgba(128,128,128,.14);color:inherit;transition:.15s}"
    + '.jc-chips button:hover{background:rgba(131,58,180,.2)}'
    + ".jc-tgt-label{width:100%;box-sizing:border-box;font-family:'Noto Sans JP',sans-serif;font-size:14px;font-weight:700;border:none;border-radius:12px;padding:11px 13px;margin-bottom:12px;outline:none;text-align:center}"
    + '.jc-overlay.jc-dark .jc-tgt-label{background:rgba(255,255,255,.09);color:#eee}'
    + '.jc-overlay.jc-light .jc-tgt-label{background:rgba(0,0,0,.05);color:#1e1035}'
    /* ── 丸い実時計ピッカー ── */
    + '.jc-pk{display:flex;flex-direction:column;align-items:center}'
    + ".jc-pk-read{font-family:'Roboto Mono',ui-monospace,monospace;font-weight:700;font-size:30px;display:flex;align-items:center;gap:3px;margin-bottom:12px}"
    + '.jc-pk-h,.jc-pk-m{cursor:pointer;padding:1px 8px;border-radius:8px;opacity:.45;transition:.15s}'
    + '.jc-pk-h.jc-on,.jc-pk-m.jc-on{opacity:1;background:rgba(131,58,180,.22)}'
    + '.jc-pk-ap{display:flex;flex-direction:column;gap:3px;margin-right:10px}'
    + ".jc-pk-ap button{font-family:'Noto Sans JP',sans-serif;font-size:11px;font-weight:700;border:none;border-radius:8px;padding:3px 8px;cursor:pointer;background:rgba(128,128,128,.16);color:inherit;line-height:1.35}"
    + '.jc-pk-ap button.jc-sel{background:' + GRAD + ';color:#fff}'
    + '.jc-pk-face{width:228px;height:228px;touch-action:none;cursor:pointer;user-select:none}'
    + '.jc-overlay.jc-dark .jc-pk-dial{fill:rgba(255,255,255,.05)}'
    + '.jc-overlay.jc-light .jc-pk-dial{fill:rgba(0,0,0,.04)}'
    + '.jc-pk-num{font-family:"Roboto",sans-serif;font-size:15px;font-weight:700;text-anchor:middle;dominant-baseline:central;fill:currentColor}'
    + '.jc-pk-num.jc-sel{fill:#fff}'
    + '.jc-pk-hand{stroke:#c13584;stroke-width:2}'
    + '.jc-pk-knob{fill:#c13584}'
    + '.jc-pk-center{fill:#c13584}'
    + '.jc-sheet-actions{display:flex;gap:8px;margin-top:16px}'
    + ".jc-sheet-actions button{flex:1;font-family:'Noto Sans JP',sans-serif;font-size:14px;font-weight:700;border:none;border-radius:12px;padding:13px;cursor:pointer}"
    + '.jc-tgt-set{background:' + GRAD + ';color:#fff}'
    + '.jc-tgt-clear{background:rgba(128,128,128,.18);color:inherit}'
    + '@media (min-width:769px){.jc-seven{gap:min(2.4vw,4.3vh)}.jc-seven .jc-dg{width:min(8.8vw,16vh)}.jc-seven .jc-cl{width:min(2.46vw,4.5vh)}}'
    + '@media (max-width:768px){#jc-fab{right:20px}.jc-bar{bottom:14px}}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---- 7セグ図形ビルダー（本家NICT風：45°ミターの正統派LCD） ---- */
  var SEG = { '0': 'abcdef', '1': 'bc', '2': 'abdeg', '3': 'abcdg', '4': 'bcfg', '5': 'acdfg', '6': 'acdefg', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg' };
  var H = 9, G = 3.5;
  function hseg(xL, xR, yc) {
    var a = xL + G, b = xR - G;
    return a + ',' + yc + ' ' + (a + H) + ',' + (yc - H) + ' ' + (b - H) + ',' + (yc - H) + ' ' + b + ',' + yc + ' ' + (b - H) + ',' + (yc + H) + ' ' + (a + H) + ',' + (yc + H);
  }
  function vseg(xc, yT, yB) {
    var a = yT + G, b = yB - G;
    return xc + ',' + a + ' ' + (xc + H) + ',' + (a + H) + ' ' + (xc + H) + ',' + (b - H) + ' ' + xc + ',' + b + ' ' + (xc - H) + ',' + (b - H) + ' ' + (xc - H) + ',' + (a + H);
  }
  function pg(p, s) { return '<polygon data-seg="' + s + '" points="' + p + '"/>'; }
  function digit() {
    return '<svg class="jc-dg" viewBox="0 0 100 176">'
      + pg(hseg(12, 88, 12), 'a') + pg(vseg(12, 12, 88), 'f') + pg(vseg(88, 12, 88), 'b')
      + pg(hseg(12, 88, 88), 'g') + pg(vseg(12, 88, 164), 'e') + pg(vseg(88, 88, 164), 'c')
      + pg(hseg(12, 88, 164), 'd') + '</svg>';
  }
  var colon = '<svg class="jc-cl" viewBox="0 0 28 176"><rect x="6" y="47" width="16" height="16" rx="1.5"/><rect x="6" y="113" width="16" height="16" rx="1.5"/></svg>';
  var defsHTML = '<svg class="jc-defs" width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0">'
    + '<defs>'
    + '<linearGradient id="jcGH" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e7a236"/><stop offset=".5" stop-color="#fbc35a"/><stop offset="1" stop-color="#e7a236"/></linearGradient>'
    + '<linearGradient id="jcGV" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e7a236"/><stop offset=".5" stop-color="#fbc35a"/><stop offset="1" stop-color="#e7a236"/></linearGradient>'
    + '<radialGradient id="jcGR" cx=".5" cy=".42" r=".72"><stop offset="0" stop-color="#fbc35a"/><stop offset="1" stop-color="#e7a236"/></radialGradient>'
    + '</defs></svg>';
  var sevenHTML = digit() + digit() + colon + digit() + digit() + colon + digit() + digit();
  var flipHTML = '';
  for (var k = 0; k < 6; k++) { flipHTML += '<div class="jc-fcard"><span class="jc-fv">0</span></div>'; if (k === 1 || k === 3) flipHTML += '<div class="jc-fsep">:</div>'; }

  /* ---- DOM生成 ---- */
  var design = localStorage.getItem('jstClockDesign') || 'd2';
  var theme = localStorage.getItem('jstClockTheme') || 'dark';

  var fab = document.createElement('button');
  fab.id = 'jc-fab';
  fab.type = 'button';
  fab.setAttribute('aria-label', '現在時刻（日本標準時）を表示');
  fab.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>';
  fab.style.bottom = document.querySelector('.home-btn') ? '102px' : '30px';

  var overlay = document.createElement('div');
  overlay.className = 'jc-overlay jc-' + design + ' jc-' + theme;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', '日本標準時');
  overlay.innerHTML = ''
    + defsHTML
    + '<span class="jc-hint">Esc／背景クリックで閉じる</span>'
    + '<button class="jc-close" type="button" aria-label="閉じる">&times;</button>'
    + '<div class="jc-panel">'
    + '<div class="jc-label">日 本 標 準 時 ・ JST</div>'
    + '<div id="jc-c1" class="jc-blocky">00:00:00</div>'
    + '<div id="jc-c2" class="jc-seven">' + sevenHTML + '</div>'
    + '<div id="jc-c3" class="jc-flip">' + flipHTML + '</div>'
    + '<div id="jc-date" class="jc-date">----/--/--</div>'
    + '<div id="jc-target" class="jc-target"></div>'
    + '</div>'
    + '<div class="jc-bar">'
    + '<button class="jc-tab" type="button" data-sheet="appear">表示</button>'
    + '<button class="jc-tab" type="button" data-sheet="break">休憩<span class="jc-dot"></span></button>'
    + '<button class="jc-tab" type="button" data-sheet="target">目標<span class="jc-dot"></span></button>'
    + '</div>'
    + '<div class="jc-sheet" id="jc-sheet-appear">'
    + '<div class="jc-sheet-h">表示スタイル</div>'
    + '<div class="jc-seg-row"><button type="button" data-d="d1">ブロック体</button><button type="button" data-d="d2">7セグ</button><button type="button" data-d="d3">フリップ</button></div>'
    + '<div class="jc-seg-row"><button type="button" data-t="dark">ダーク</button><button type="button" data-t="light">ライト</button></div>'
    + '</div>'
    + '<div class="jc-sheet" id="jc-sheet-break">'
    + '<div class="jc-sheet-h">休憩タイマー（経過時間）</div>'
    + '<div class="jc-seg-row"><button type="button" data-min="5">5分</button><button type="button" data-min="10">10分</button><button type="button" data-min="15">15分</button></div>'
    + '<button class="jc-break-stop" type="button" hidden>停止する</button>'
    + '</div>'
    + '<div class="jc-sheet" id="jc-sheet-target">'
    + '<div class="jc-sheet-h">目標の時刻まで</div>'
    + '<input class="jc-tgt-label" type="text" maxlength="24" value="フィードバックタイム" aria-label="見出し">'
    + '<div class="jc-chips"><button type="button" data-label="フィードバックタイム" data-h="10" data-m="30">フィードバックタイム 10:30</button><button type="button" data-label="後半開始" data-h="11" data-m="30">後半開始 11:30</button></div>'
    + '<div class="jc-pk">'
    + '<div class="jc-pk-read"><span class="jc-pk-ap"><button type="button" data-ap="am">午前</button><button type="button" data-ap="pm">午後</button></span><span class="jc-pk-h">10</span><span class="jc-pk-sep">:</span><span class="jc-pk-m">30</span></div>'
    + '<svg class="jc-pk-face" viewBox="0 0 240 240"></svg>'
    + '</div>'
    + '<div class="jc-sheet-actions"><button type="button" class="jc-tgt-clear">解除</button><button type="button" class="jc-tgt-set">決定</button></div>'
    + '</div>';

  function attach() {
    document.body.appendChild(fab);
    document.body.appendChild(overlay);

    var c1 = overlay.querySelector('#jc-c1');
    var dateEl = overlay.querySelector('#jc-date');
    var dgs = overlay.querySelectorAll('#jc-c2 .jc-dg');
    var fcards = overlay.querySelectorAll('#jc-c3 .jc-fcard');
    var fvs = overlay.querySelectorAll('#jc-c3 .jc-fv');
    var closeBtn = overlay.querySelector('.jc-close');
    var labelEl = overlay.querySelector('.jc-label');
    var panel = overlay.querySelector('.jc-panel');
    var targetEl = overlay.querySelector('#jc-target');

    /* ---- サーバー時刻アンカー（多サンプル中央値） ---- */
    var offset = 0, LEAD = 150;
    function syncOnce() {
      return new Promise(function (resolve) {
        var t0 = Date.now();
        fetch(location.href, { method: 'HEAD', cache: 'no-store' }).then(function (r) {
          var t1 = Date.now();
          var ds = r.headers.get('date');
          if (!ds) { resolve(null); return; }
          var server = new Date(ds).getTime();
          if (isNaN(server)) { resolve(null); return; }
          resolve(server + 500 + (t1 - t0) / 2 - t1);
        }).catch(function () { resolve(null); });
      });
    }
    function syncTime() {
      var samples = [], n = 5;
      (function step(i) {
        if (i >= n) { if (samples.length) { samples.sort(function (a, b) { return a - b; }); offset = samples[samples.length >> 1]; } return; }
        syncOnce().then(function (o) { if (o !== null) samples.push(o); setTimeout(function () { step(i + 1); }, 120); });
      })(0);
    }
    syncTime();
    setInterval(syncTime, 600000);

    var days = ['日', '月', '火', '水', '木', '金', '土'];
    function two(n) { return (n < 10 ? '0' : '') + n; }
    function setSeven(a) {
      for (var i = 0; i < 6; i++) {
        var on = SEG[a[i]], polys = dgs[i].children;
        for (var j = 0; j < polys.length; j++) {
          var s = polys[j].getAttribute('data-seg');
          polys[j].setAttribute('class', on.indexOf(s) > -1 ? 'jc-on' : 'jc-off');
        }
      }
    }
    function setFlip(a) {
      for (var i = 0; i < 6; i++) {
        if (fvs[i].textContent !== a[i]) {
          fvs[i].textContent = a[i];
          var card = fcards[i];
          card.classList.remove('jc-flipping'); void card.offsetWidth; card.classList.add('jc-flipping');
        }
      }
    }
    function show(a) { c1.textContent = a[0] + a[1] + ':' + a[2] + a[3] + ':' + a[4] + a[5]; setSeven(a); setFlip(a); }

    /* ---- 効果音 ---- */
    var audioCtx = null;
    function ensureAudio() { try { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === 'suspended') audioCtx.resume(); } catch (e) {} }
    function beep() {
      if (!audioCtx) return;
      try {
        var t = audioCtx.currentTime;
        for (var i = 0; i < 3; i++) {
          var o = audioCtx.createOscillator(), g = audioCtx.createGain();
          o.type = 'sine'; o.frequency.value = 880; o.connect(g); g.connect(audioCtx.destination);
          var s = t + i * 0.35;
          g.gain.setValueAtTime(0.0001, s); g.gain.exponentialRampToValueAtTime(0.25, s + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, s + 0.3);
          o.start(s); o.stop(s + 0.32);
        }
      } catch (e) {}
    }

    /* ---- 休憩タイマー（経過）＋目標カウントダウン（時刻） ---- */
    var LABEL_CLOCK = '日 本 標 準 時 ・ JST', LABEL_TIMER = '休 憩 タ イ マ ー', LABEL_DONE = '休 憩 お わ り';
    var timerEnd = 0, timerMode = false, timerDone = false;
    var targetActive = false, targetDone = false, targetTime = 0, targetHHMM = '', targetLabel = '';
    function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
    function updateTarget(nowMs) {
      if (!targetActive) { targetEl.style.display = 'none'; return; }
      targetEl.style.display = 'block';
      var rem = Math.round((targetTime - nowMs) / 1000);
      if (rem <= 0) {
        if (!targetDone) { targetDone = true; panel.classList.add('jc-flash'); beep(); }
        targetEl.innerHTML = '<b>' + esc(targetLabel) + '</b> の時間になりました';
        return;
      }
      var mm = Math.floor(rem / 60), ss = rem % 60;
      targetEl.innerHTML = '<span class="jc-tgt-time">' + targetHHMM + '</span> の <b>' + esc(targetLabel) + '</b> まで あと <span class="jc-tgt-rem">' + mm + '分' + two(ss) + '秒</span>';
    }
    function tick() {
      updateTarget(Date.now() + offset + LEAD);
      if (timerMode) {
        var rem = Math.round((timerEnd - (Date.now() + offset + LEAD)) / 1000);
        if (rem <= 0) { rem = 0; if (!timerDone) { timerDone = true; labelEl.textContent = LABEL_DONE; panel.classList.add('jc-flash'); beep(); } }
        var hh = Math.floor(rem / 3600), mm = Math.floor((rem % 3600) / 60), ss = rem % 60;
        show((two(hh) + two(mm) + two(ss)).split(''));
        var de = new Date(timerEnd);
        dateEl.textContent = timerDone ? 'おつかれさまでした' : (two(de.getHours()) + ':' + two(de.getMinutes()) + ' に再開');
        return;
      }
      var d = new Date(Date.now() + offset + LEAD);
      show((two(d.getHours()) + two(d.getMinutes()) + two(d.getSeconds())).split(''));
      dateEl.textContent = d.getFullYear() + '/' + two(d.getMonth() + 1) + '/' + two(d.getDate()) + ' (' + days[d.getDay()] + ')';
    }
    tick();
    setInterval(tick, 250);

    /* ---- パネル開閉（1つずつ） ---- */
    var tabs = overlay.querySelectorAll('.jc-tab');
    var breakStop = overlay.querySelector('.jc-break-stop');
    var curSheet = null;
    function closeSheet() {
      if (curSheet) { overlay.querySelector('#jc-sheet-' + curSheet).classList.remove('jc-open'); curSheet = null; }
      tabs.forEach(function (t) { t.classList.remove('jc-on'); });
    }
    function openSheet(name) {
      closeSheet();
      overlay.querySelector('#jc-sheet-' + name).classList.add('jc-open');
      curSheet = name;
      tabs.forEach(function (t) { t.classList.toggle('jc-on', t.getAttribute('data-sheet') === name); });
      if (name === 'break') breakStop.hidden = !timerMode;
      if (name === 'target') renderFace();
    }
    tabs.forEach(function (t) {
      t.addEventListener('click', function (e) { e.stopPropagation(); var n = t.getAttribute('data-sheet'); if (curSheet === n) closeSheet(); else openSheet(n); });
    });
    overlay.querySelectorAll('.jc-sheet').forEach(function (s) { s.addEventListener('click', function (e) { e.stopPropagation(); }); });
    function updateTabs() {
      overlay.querySelector('.jc-tab[data-sheet="break"]').classList.toggle('jc-run', timerMode);
      overlay.querySelector('.jc-tab[data-sheet="target"]').classList.toggle('jc-run', targetActive);
    }

    /* ---- 表示スタイル ---- */
    var dBtns = overlay.querySelectorAll('#jc-sheet-appear [data-d]');
    var tBtns = overlay.querySelectorAll('#jc-sheet-appear [data-t]');
    function markSel() {
      dBtns.forEach(function (b) { b.classList.toggle('jc-sel', b.getAttribute('data-d') === design); });
      tBtns.forEach(function (b) { b.classList.toggle('jc-sel', b.getAttribute('data-t') === theme); });
    }
    markSel();
    dBtns.forEach(function (b) { b.addEventListener('click', function () { design = b.getAttribute('data-d'); overlay.classList.remove('jc-d1', 'jc-d2', 'jc-d3'); overlay.classList.add('jc-' + design); localStorage.setItem('jstClockDesign', design); markSel(); }); });
    tBtns.forEach(function (b) { b.addEventListener('click', function () { theme = b.getAttribute('data-t'); overlay.classList.remove('jc-dark', 'jc-light'); overlay.classList.add('jc-' + theme); localStorage.setItem('jstClockTheme', theme); markSel(); renderFace(); }); });

    /* ---- 休憩タイマー ---- */
    overlay.querySelectorAll('#jc-sheet-break [data-min]').forEach(function (b) {
      b.addEventListener('click', function () {
        ensureAudio();
        timerEnd = Date.now() + offset + LEAD + parseInt(b.getAttribute('data-min'), 10) * 60000;
        timerMode = true; timerDone = false; labelEl.textContent = LABEL_TIMER; panel.classList.remove('jc-flash');
        updateTabs(); closeSheet(); tick();
      });
    });
    breakStop.addEventListener('click', function () { timerMode = false; timerDone = false; labelEl.textContent = LABEL_CLOCK; panel.classList.remove('jc-flash'); updateTabs(); closeSheet(); tick(); });

    /* ---- 目標時刻ピッカー（丸い実時計） ---- */
    var labelInput = overlay.querySelector('.jc-tgt-label');
    var face = overlay.querySelector('.jc-pk-face');
    var readH = overlay.querySelector('.jc-pk-h');
    var readM = overlay.querySelector('.jc-pk-m');
    var apAm = overlay.querySelector('.jc-pk-ap [data-ap="am"]');
    var apPm = overlay.querySelector('.jc-pk-ap [data-ap="pm"]');
    var pH = 10, pM = 30, pMode = 'h';
    function h12() { var h = pH % 12; return h === 0 ? 12 : h; }
    function pos(deg, r) { var rad = deg * Math.PI / 180; return [120 + r * Math.sin(rad), 120 - r * Math.cos(rad)]; }
    function renderFace() {
      readH.textContent = h12(); readM.textContent = two(pM);
      readH.classList.toggle('jc-on', pMode === 'h'); readM.classList.toggle('jc-on', pMode === 'm');
      apAm.classList.toggle('jc-sel', pH < 12); apPm.classList.toggle('jc-sel', pH >= 12);
      var selDeg = pMode === 'h' ? (h12() % 12) * 30 : pM * 6;
      var kp = pos(selDeg, 88);
      var html = '<circle class="jc-pk-dial" cx="120" cy="120" r="112"/>';
      html += '<line class="jc-pk-hand" x1="120" y1="120" x2="' + kp[0].toFixed(1) + '" y2="' + kp[1].toFixed(1) + '"/>';
      html += '<circle class="jc-pk-knob" cx="' + kp[0].toFixed(1) + '" cy="' + kp[1].toFixed(1) + '" r="17"/>';
      html += '<circle class="jc-pk-center" cx="120" cy="120" r="3.5"/>';
      for (var i = 0; i < 12; i++) {
        var p = pos(i * 30, 88);
        var val = pMode === 'h' ? (i === 0 ? 12 : i) : (i * 5);
        var sel = pMode === 'h' ? (val === h12()) : (val === pM);
        var lbl = pMode === 'h' ? String(val) : two(i * 5);
        html += '<text class="jc-pk-num' + (sel ? ' jc-sel' : '') + '" x="' + p[0].toFixed(1) + '" y="' + p[1].toFixed(1) + '">' + lbl + '</text>';
      }
      face.innerHTML = html;
    }
    function angleFromEvent(e) {
      var rect = face.getBoundingClientRect();
      var dx = e.clientX - (rect.left + rect.width / 2), dy = e.clientY - (rect.top + rect.height / 2);
      var deg = Math.atan2(dx, -dy) * 180 / Math.PI; if (deg < 0) deg += 360; return deg;
    }
    function applyAngle(deg) {
      if (pMode === 'h') { var idx = Math.round(deg / 30) % 12; var hv = idx === 0 ? 12 : idx; var pm = pH >= 12; var h = hv % 12; if (pm) h += 12; pH = h; }
      else { pM = Math.round(deg / 6) % 60; }
      renderFace();
    }
    var dragging = false;
    face.addEventListener('pointerdown', function (e) { dragging = true; try { face.setPointerCapture(e.pointerId); } catch (x) {} applyAngle(angleFromEvent(e)); });
    face.addEventListener('pointermove', function (e) { if (dragging) applyAngle(angleFromEvent(e)); });
    face.addEventListener('pointerup', function () { if (dragging) { dragging = false; if (pMode === 'h') { pMode = 'm'; renderFace(); } } });
    readH.addEventListener('click', function () { pMode = 'h'; renderFace(); });
    readM.addEventListener('click', function () { pMode = 'm'; renderFace(); });
    apAm.addEventListener('click', function () { if (pH >= 12) pH -= 12; renderFace(); });
    apPm.addEventListener('click', function () { if (pH < 12) pH += 12; renderFace(); });
    overlay.querySelectorAll('#jc-sheet-target .jc-chips button').forEach(function (b) {
      b.addEventListener('click', function () { labelInput.value = b.getAttribute('data-label'); pH = parseInt(b.getAttribute('data-h'), 10); pM = parseInt(b.getAttribute('data-m'), 10); pMode = 'h'; renderFace(); });
    });
    function activateTarget() {
      targetLabel = (labelInput.value || '').trim() || '目標';
      targetHHMM = two(pH) + ':' + two(pM);
      var nowMs = Date.now() + offset + LEAD;
      var t = new Date(nowMs); t.setHours(pH, pM, 0, 0); if (t.getTime() <= nowMs) t.setDate(t.getDate() + 1);
      targetTime = t.getTime(); targetActive = true; targetDone = false; panel.classList.remove('jc-flash');
      try { localStorage.setItem('jstClockTgt', JSON.stringify({ h: pH, m: pM, label: targetLabel })); } catch (e) {}
      updateTabs(); updateTarget(nowMs);
    }
    overlay.querySelector('.jc-tgt-set').addEventListener('click', function () { ensureAudio(); activateTarget(); closeSheet(); });
    overlay.querySelector('.jc-tgt-clear').addEventListener('click', function () { targetActive = false; targetDone = false; panel.classList.remove('jc-flash'); try { localStorage.removeItem('jstClockTgt'); } catch (e) {} updateTabs(); updateTarget(0); closeSheet(); });
    (function loadTarget() {
      try {
        var sv = JSON.parse(localStorage.getItem('jstClockTgt'));
        if (sv && typeof sv.h === 'number') {
          pH = sv.h; pM = sv.m; if (sv.label) labelInput.value = sv.label;
          targetLabel = sv.label || '目標'; targetHHMM = two(pH) + ':' + two(pM);
          var nowMs = Date.now() + offset + LEAD; var t = new Date(nowMs); t.setHours(pH, pM, 0, 0); if (t.getTime() <= nowMs) t.setDate(t.getDate() + 1);
          targetTime = t.getTime(); targetActive = true; updateTabs();
        }
      } catch (e) {}
    })();
    renderFace();

    /* ---- 開閉 ---- */
    function open() { overlay.classList.add('jc-open'); document.body.style.overflow = 'hidden'; }
    function close() { overlay.classList.remove('jc-open'); document.body.style.overflow = ''; closeSheet(); }
    fab.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) { if (curSheet) closeSheet(); else close(); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && overlay.classList.contains('jc-open')) { if (curSheet) closeSheet(); else close(); } });
  }

  if (document.body) attach();
  else document.addEventListener('DOMContentLoaded', attach);
})();
