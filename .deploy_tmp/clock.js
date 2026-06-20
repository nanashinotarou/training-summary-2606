/*!
 * clock.js — 日本標準時オーバーレイ時計（全ページ共通）
 * 右下のFABを押すとスクリーンセーバー風に時計が浮く。
 * デザイン3種（ブロック体／7セグLCD／フリップ）× ライト/ダーク を選択でき、localStorageに記憶。
 * 時刻はサーバー時刻（HTTP Dateヘッダ）にアンカーして±1秒精度。失敗時は端末時計にフォールバック。
 * サイズはウィンドウの幅・高さに追従して可能な限り大きく表示（全画面・大型モニタ向け）。
 */
(function () {
  'use strict';
  if (window.__jstClockLoaded) return;
  window.__jstClockLoaded = true;

  var GRAD = 'linear-gradient(45deg,#833ab4,#c13584,#f77737)';

  /* ---- スタイル注入 ---- */
  var css = ''
    + '#jc-fab{position:fixed;right:30px;z-index:3000;width:60px;height:60px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;background:' + GRAD + ';box-shadow:0 10px 25px rgba(193,53,132,.4);transition:transform .3s}'
    + '#jc-fab:hover{transform:translateY(-4px) scale(1.05)}'
    + '.jc-overlay{display:none;position:fixed;inset:0;z-index:3001;flex-direction:column;align-items:center;justify-content:center;cursor:zoom-out}'
    + '.jc-overlay.jc-open{display:flex;animation:jcfade .25s ease}'
    + '@keyframes jcfade{from{opacity:0}to{opacity:1}}'
    + '.jc-overlay.jc-dark{background:#000}'
    + '.jc-overlay.jc-light{background:#f4f4ef}'
    + '.jc-panel{display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:default;width:100%}'
    + ".jc-label{font-family:'Noto Sans JP',sans-serif;font-weight:700;letter-spacing:.42em;font-size:clamp(13px,2vw,40px);margin-bottom:clamp(34px,7vh,104px)}"
    + ".jc-date{font-family:'Noto Sans JP',sans-serif;font-weight:700;letter-spacing:.2em;font-size:clamp(16px,2.4vw,46px);margin-top:clamp(36px,7vh,106px)}"
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
    /* ダーク：中央が明るく端が深い琥珀のグラデで丸みのある立体感（横=縦方向/縦=横方向） */
    + '.jc-seven .jc-on[data-seg="a"],.jc-seven .jc-on[data-seg="g"],.jc-seven .jc-on[data-seg="d"]{fill:url(#jcGH)}'
    + '.jc-seven .jc-on[data-seg="b"],.jc-seven .jc-on[data-seg="c"],.jc-seven .jc-on[data-seg="e"],.jc-seven .jc-on[data-seg="f"]{fill:url(#jcGV)}'
    + '.jc-seven .jc-cl rect{fill:url(#jcGR)}'
    + '.jc-overlay.jc-dark .jc-seven .jc-off{fill:#141414}'
    /* ライト：従来どおりフラット紺（高specificityでグラデを上書き） */
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
    + '.jc-controls{position:absolute;bottom:26px;left:50%;transform:translateX(-50%);display:flex;gap:16px;align-items:center;cursor:default;flex-wrap:wrap;justify-content:center}'
    + '.jc-grp{display:flex;gap:6px;background:rgba(128,128,128,.16);padding:6px;border-radius:30px}'
    + ".jc-grp button{border:none;background:transparent;color:inherit;font-family:'Noto Sans JP',sans-serif;font-size:13px;font-weight:700;padding:7px 14px;border-radius:24px;cursor:pointer;white-space:nowrap}"
    + '.jc-overlay.jc-dark .jc-controls{color:#cfcfcf}'
    + '.jc-overlay.jc-light .jc-controls{color:#4a4458}'
    + '.jc-grp button.jc-sel{background:' + GRAD + ';color:#fff}'
    + '.jc-close{position:absolute;top:16px;right:24px;background:none;border:none;font-size:34px;line-height:1;cursor:pointer;padding:4px 10px;opacity:.7}'
    + '.jc-overlay.jc-dark .jc-close{color:#fff}'
    + '.jc-overlay.jc-light .jc-close{color:#1e1035}'
    + '.jc-close:hover{opacity:1}'
    + ".jc-hint{position:absolute;top:22px;left:50%;transform:translateX(-50%);font-size:12px;letter-spacing:.08em;opacity:.5;font-family:'Noto Sans JP',sans-serif}"
    + ".jc-tlabel{font-family:'Noto Sans JP',sans-serif;font-size:13px;font-weight:700;opacity:.65;align-self:center}"
    + '.jc-grp.jc-timer button.jc-trun{background:' + GRAD + ';color:#fff}'
    + '@keyframes jcflash{0%,100%{opacity:1}50%{opacity:.2}}'
    + '.jc-panel.jc-flash{animation:jcflash .55s ease 6}'
    + ".jc-target{display:none;text-align:center;margin-top:clamp(16px,3vh,40px);font-family:'Noto Sans JP',sans-serif;font-weight:700;font-size:clamp(14px,1.7vw,30px);letter-spacing:.06em;line-height:1.5}"
    + ".jc-target .jc-tgt-time,.jc-target .jc-tgt-rem{font-family:'Roboto Mono',ui-monospace,monospace}"
    + '.jc-overlay.jc-dark .jc-target{color:#d8c89a}'
    + '.jc-overlay.jc-light .jc-target{color:#7a5a2a}'
    + '.jc-target .jc-tgt-rem{color:#f4ad3c}'
    + '.jc-grp.jc-tgt{flex-wrap:wrap;align-items:center}'
    + ".jc-tgt-label{font-family:'Noto Sans JP',sans-serif;font-size:13px;font-weight:700;border:none;border-radius:18px;padding:6px 12px;width:150px;outline:none}"
    + '.jc-overlay.jc-dark .jc-tgt-label{background:rgba(255,255,255,.16);color:#eee}'
    + '.jc-overlay.jc-light .jc-tgt-label{background:rgba(0,0,0,.07);color:#1e1035}'
    + ".jc-tgt-time-input{font-family:'Roboto Mono',ui-monospace,monospace;font-weight:700;font-size:15px;border:none;border-radius:18px;padding:5px 10px;outline:none}"
    + '.jc-overlay.jc-dark .jc-tgt-time-input{color-scheme:dark;background:rgba(255,255,255,.16);color:#eee}'
    + '.jc-overlay.jc-light .jc-tgt-time-input{color-scheme:light;background:rgba(0,0,0,.07);color:#1e1035}'
    + ".jc-tset{position:relative;cursor:pointer;font-family:'Roboto Mono',ui-monospace,monospace;font-weight:700;font-size:18px;min-width:34px;height:34px;display:flex;align-items:center;justify-content:center;border-radius:6px;user-select:none}"
    + '.jc-tset:hover{background:rgba(131,58,180,.22)}'
    + ".jc-tset::before{content:'\\25B2';position:absolute;top:0;left:0;right:0;text-align:center;font-size:8px;line-height:9px;opacity:.55}"
    + ".jc-tset::after{content:'\\25BC';position:absolute;bottom:0;left:0;right:0;text-align:center;font-size:8px;line-height:9px;opacity:.55}"
    + ".jc-tcolon{font-family:'Roboto Mono',ui-monospace,monospace;font-weight:700;font-size:18px;display:flex;align-items:center}"
    + '@media (min-width:769px){.jc-seven{gap:min(2.4vw,4.3vh)}.jc-seven .jc-dg{width:min(8.8vw,16vh)}.jc-seven .jc-cl{width:min(2.46vw,4.5vh)}}'
    + '@media (max-width:768px){#jc-fab{right:20px}.jc-controls{bottom:18px;gap:10px}}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---- 7セグ図形ビルダー（本家NICT風：45°ミターの正統派LCD） ---- */
  var SEG = { '0': 'abcdef', '1': 'bc', '2': 'abdeg', '3': 'abcdg', '4': 'bcfg', '5': 'acdfg', '6': 'acdefg', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg' };
  var H = 9;   // セグメント半太さ
  var G = 3.5; // セグメント間ノッチ
  // 水平セグメント：左右端を45°にカットした横長六角形
  function hseg(xL, xR, yc) {
    var a = xL + G, b = xR - G;
    return a + ',' + yc + ' ' + (a + H) + ',' + (yc - H) + ' ' + (b - H) + ',' + (yc - H) + ' ' + b + ',' + yc + ' ' + (b - H) + ',' + (yc + H) + ' ' + (a + H) + ',' + (yc + H);
  }
  // 垂直セグメント：上下端を45°にカットした縦長六角形
  function vseg(xc, yT, yB) {
    var a = yT + G, b = yB - G;
    return xc + ',' + a + ' ' + (xc + H) + ',' + (a + H) + ' ' + (xc + H) + ',' + (b - H) + ' ' + xc + ',' + b + ' ' + (xc - H) + ',' + (b - H) + ' ' + (xc - H) + ',' + (a + H);
  }
  function pg(p, s) { return '<polygon data-seg="' + s + '" points="' + p + '"/>'; }
  function digit() {
    return '<svg class="jc-dg" viewBox="0 0 100 176">'
      + pg(hseg(12, 88, 12), 'a')
      + pg(vseg(12, 12, 88), 'f')
      + pg(vseg(88, 12, 88), 'b')
      + pg(hseg(12, 88, 88), 'g')
      + pg(vseg(12, 88, 164), 'e')
      + pg(vseg(88, 88, 164), 'c')
      + pg(hseg(12, 88, 164), 'd')
      + '</svg>';
  }
  // コロン：四角ドット（本家準拠）
  var colon = '<svg class="jc-cl" viewBox="0 0 28 176"><rect x="6" y="47" width="16" height="16" rx="1.5"/><rect x="6" y="113" width="16" height="16" rx="1.5"/></svg>';
  // セグメントの立体感用グラデーション定義（中央=明るい琥珀／端=深い琥珀）。objectBoundingBoxで各セグに追従。
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
    + '<span class="jc-hint">Esc／画面クリックで閉じる</span>'
    + '<button class="jc-close" type="button" aria-label="閉じる">&times;</button>'
    + '<div class="jc-panel">'
    + '<div class="jc-label">日 本 標 準 時 ・ JST</div>'
    + '<div id="jc-c1" class="jc-blocky">00:00:00</div>'
    + '<div id="jc-c2" class="jc-seven">' + sevenHTML + '</div>'
    + '<div id="jc-c3" class="jc-flip">' + flipHTML + '</div>'
    + '<div id="jc-date" class="jc-date">----/--/--</div>'
    + '<div id="jc-target" class="jc-target"></div>'
    + '</div>'
    + '<div class="jc-controls">'
    + '<div class="jc-grp">'
    + '<button type="button" data-d="d1">① ブロック体</button>'
    + '<button type="button" data-d="d2">② 7セグ</button>'
    + '<button type="button" data-d="d3">③ フリップ</button>'
    + '</div>'
    + '<div class="jc-grp">'
    + '<button type="button" data-t="dark">ダーク</button>'
    + '<button type="button" data-t="light">ライト</button>'
    + '</div>'
    + '<span class="jc-tlabel">休憩</span>'
    + '<div class="jc-grp jc-timer">'
    + '<button type="button" data-min="5">5分</button>'
    + '<button type="button" data-min="10">10分</button>'
    + '<button type="button" data-min="15">15分</button>'
    + '<button type="button" data-min="0" class="jc-tclear" aria-label="タイマー解除">✕</button>'
    + '</div>'
    + '<span class="jc-tlabel">目標</span>'
    + '<div class="jc-grp jc-tgt">'
    + '<input class="jc-tgt-label" type="text" maxlength="24" value="フィードバックタイム" aria-label="目標の見出し">'
    + '<button type="button" class="jc-tgt-nudge" data-delta="-5" aria-label="5分早める">−5</button>'
    + '<input class="jc-tgt-time-input" type="time" value="10:30" step="60" aria-label="目標の時刻">'
    + '<button type="button" class="jc-tgt-nudge" data-delta="5" aria-label="5分遅らせる">＋5</button>'
    + '<button type="button" class="jc-tgt-set">セット</button>'
    + '<button type="button" class="jc-tgt-clear" aria-label="目標を消す">✕</button>'
    + '</div>'
    + '<span class="jc-tlabel">よく使う</span>'
    + '<div class="jc-grp jc-tgt-presets" id="jc-presets"></div>'
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
    var dBtns = overlay.querySelectorAll('[data-d]');
    var tBtns = overlay.querySelectorAll('[data-t]');

    /* サーバー時刻アンカー。HTTP Dateは秒未満を切り捨てる（平均0.5秒遅延＋最大1秒ジッタ）ため、
       1回計測では合わせきれない。+500で切り捨て分を中心化し、5回サンプリングの中央値でジッタを低減。
       LEADで本家にわずかに先行させる。失敗時は端末時計（offset=0）にフォールバック。 */
    var offset = 0;
    var LEAD = 150;
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
        if (i >= n) {
          if (samples.length) { samples.sort(function (a, b) { return a - b; }); offset = samples[samples.length >> 1]; }
          return;
        }
        syncOnce().then(function (o) {
          if (o !== null) samples.push(o);
          setTimeout(function () { step(i + 1); }, 120);
        });
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
          card.classList.remove('jc-flipping');
          void card.offsetWidth;
          card.classList.add('jc-flipping');
        }
      }
    }
    var labelEl = overlay.querySelector('.jc-label');
    var panel = overlay.querySelector('.jc-panel');
    var LABEL_CLOCK = '日 本 標 準 時 ・ JST';
    var LABEL_TIMER = '休 憩 タ イ マ ー';
    var LABEL_DONE = '休 憩 お わ り';
    var timerEnd = 0, timerMode = false, timerDone = false, audioCtx = null;
    function ensureAudio() {
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
      } catch (e) {}
    }
    function beep() {
      if (!audioCtx) return;
      try {
        var t = audioCtx.currentTime;
        for (var i = 0; i < 3; i++) {
          var o = audioCtx.createOscillator(), g = audioCtx.createGain();
          o.type = 'sine'; o.frequency.value = 880;
          o.connect(g); g.connect(audioCtx.destination);
          var s = t + i * 0.35;
          g.gain.setValueAtTime(0.0001, s);
          g.gain.exponentialRampToValueAtTime(0.25, s + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, s + 0.3);
          o.start(s); o.stop(s + 0.32);
        }
      } catch (e) {}
    }
    function show(a) { c1.textContent = a[0] + a[1] + ':' + a[2] + a[3] + ':' + a[4] + a[5]; setSeven(a); setFlip(a); }
    var targetEl = overlay.querySelector('#jc-target');
    var setHH = 10, setMM = 30;
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
        if (rem <= 0) {
          rem = 0;
          if (!timerDone) { timerDone = true; labelEl.textContent = LABEL_DONE; panel.classList.add('jc-flash'); beep(); }
        }
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

    function markSel() {
      dBtns.forEach(function (b) { b.classList.toggle('jc-sel', b.getAttribute('data-d') === design); });
      tBtns.forEach(function (b) { b.classList.toggle('jc-sel', b.getAttribute('data-t') === theme); });
    }
    markSel();

    function open() { overlay.classList.add('jc-open'); document.body.style.overflow = 'hidden'; }
    function close() { overlay.classList.remove('jc-open'); document.body.style.overflow = ''; }
    fab.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && overlay.classList.contains('jc-open')) close(); });

    dBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        design = b.getAttribute('data-d');
        overlay.classList.remove('jc-d1', 'jc-d2', 'jc-d3');
        overlay.classList.add('jc-' + design);
        localStorage.setItem('jstClockDesign', design);
        markSel();
      });
    });
    tBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        theme = b.getAttribute('data-t');
        overlay.classList.remove('jc-dark', 'jc-light');
        overlay.classList.add('jc-' + theme);
        localStorage.setItem('jstClockTheme', theme);
        markSel();
      });
    });

    var tmBtns = overlay.querySelectorAll('[data-min]');
    tmBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var min = parseInt(b.getAttribute('data-min'), 10);
        if (min > 0) {
          ensureAudio();
          timerEnd = Date.now() + offset + LEAD + min * 60000;
          timerMode = true; timerDone = false;
          labelEl.textContent = LABEL_TIMER;
          panel.classList.remove('jc-flash');
          tmBtns.forEach(function (x) { x.classList.toggle('jc-trun', x === b); });
        } else {
          timerMode = false; timerDone = false;
          labelEl.textContent = LABEL_CLOCK;
          panel.classList.remove('jc-flash');
          tmBtns.forEach(function (x) { x.classList.remove('jc-trun'); });
        }
        tick();
      });
    });

    var tgtLabelInput = overlay.querySelector('.jc-tgt-label');
    var timeInput = overlay.querySelector('.jc-tgt-time-input');
    function renderSet() { timeInput.value = two(setHH) + ':' + two(setMM); }
    function readTime() {
      var v = (timeInput.value || '').split(':');
      var h = parseInt(v[0], 10), m = parseInt(v[1], 10);
      if (!isNaN(h)) setHH = ((h % 24) + 24) % 24;
      if (!isNaN(m)) setMM = ((m % 60) + 60) % 60;
    }
    timeInput.addEventListener('change', function () { if (targetActive) activateTarget(); });
    overlay.querySelectorAll('.jc-tgt-nudge').forEach(function (b) {
      b.addEventListener('click', function () {
        readTime();
        var total = ((setHH * 60 + setMM + parseInt(b.getAttribute('data-delta'), 10)) % 1440 + 1440) % 1440;
        setHH = Math.floor(total / 60); setMM = total % 60;
        renderSet();
        if (targetActive) activateTarget();
      });
    });
    function activateTarget() {
      readTime();
      targetLabel = (tgtLabelInput.value || '').trim() || 'タイマー';
      targetHHMM = two(setHH) + ':' + two(setMM);
      var nowMs = Date.now() + offset + LEAD;
      var t = new Date(nowMs); t.setHours(setHH, setMM, 0, 0);
      if (t.getTime() <= nowMs) t.setDate(t.getDate() + 1);
      targetTime = t.getTime();
      targetActive = true; targetDone = false;
      panel.classList.remove('jc-flash');
      try { localStorage.setItem('jstClockTgt', JSON.stringify({ h: setHH, m: setMM, label: targetLabel })); } catch (e) {}
      updateTarget(nowMs);
    }
    overlay.querySelector('.jc-tgt-set').addEventListener('click', activateTarget);
    overlay.querySelector('.jc-tgt-clear').addEventListener('click', function () {
      targetActive = false; targetDone = false;
      panel.classList.remove('jc-flash');
      try { localStorage.removeItem('jstClockTgt'); } catch (e) {}
      updateTarget(0);
    });
    (function () {
      try {
        var sv = JSON.parse(localStorage.getItem('jstClockTgt'));
        if (sv && typeof sv.h === 'number') {
          setHH = sv.h; setMM = sv.m;
          if (sv.label) tgtLabelInput.value = sv.label;
          renderSet(); activateTarget();
        } else { renderSet(); }
      } catch (e) { renderSet(); }
    })();

    var PRESETS = [
      { label: 'フィードバックタイム', h: 10, m: 30 },
      { label: '後半開始', h: 11, m: 30 }
    ];
    var presetWrap = overlay.querySelector('#jc-presets');
    PRESETS.forEach(function (p) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = p.label + ' ' + two(p.h) + ':' + two(p.m);
      btn.addEventListener('click', function () {
        tgtLabelInput.value = p.label;
        setHH = p.h; setMM = p.m;
        renderSet();
        activateTarget();
      });
      presetWrap.appendChild(btn);
    });
  }

  if (document.body) attach();
  else document.addEventListener('DOMContentLoaded', attach);
})();
