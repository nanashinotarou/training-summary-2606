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
    + '.jc-overlay.jc-dark .jc-blocky{color:#f7a81b}'
    + '.jc-overlay.jc-light .jc-blocky{color:#1e1035}'
    + '.jc-seven{gap:min(2vw,3.4vh)}'
    + '.jc-seven .jc-dg{width:min(10vw,18vh);height:auto}'
    + '.jc-seven .jc-cl{width:min(2.8vw,5vh);height:auto;margin:0 min(.4vw,.7vh)}'
    + '.jc-overlay.jc-dark .jc-seven .jc-on{fill:#f7a81b}'
    + '.jc-overlay.jc-dark .jc-seven .jc-off{fill:#141414}'
    + '.jc-overlay.jc-dark .jc-seven .jc-cl rect{fill:#f7a81b}'
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
    + '@media (max-width:768px){#jc-fab{right:20px}.jc-controls{bottom:18px;gap:10px}}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---- 7セグ図形ビルダー（本家NICT風：45°ミターの正統派LCD） ---- */
  var SEG = { '0': 'abcdef', '1': 'bc', '2': 'abdeg', '3': 'abcdg', '4': 'bcfg', '5': 'acdfg', '6': 'acdefg', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg' };
  var H = 7;   // セグメント半太さ
  var G = 2.5; // セグメント間ノッチ
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
  var colon = '<svg class="jc-cl" viewBox="0 0 28 176"><rect x="7" y="48" width="14" height="14" rx="1.5"/><rect x="7" y="114" width="14" height="14" rx="1.5"/></svg>';

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
    + '<span class="jc-hint">Esc／画面クリックで閉じる</span>'
    + '<button class="jc-close" type="button" aria-label="閉じる">&times;</button>'
    + '<div class="jc-panel">'
    + '<div class="jc-label">日 本 標 準 時 ・ JST</div>'
    + '<div id="jc-c1" class="jc-blocky">00:00:00</div>'
    + '<div id="jc-c2" class="jc-seven">' + sevenHTML + '</div>'
    + '<div id="jc-c3" class="jc-flip">' + flipHTML + '</div>'
    + '<div id="jc-date" class="jc-date">----/--/--</div>'
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

    /* サーバー時刻アンカー（±1秒）。失敗時は端末時計（offset=0）。 */
    var offset = 0;
    function syncTime() {
      var t0 = Date.now();
      fetch(location.href, { method: 'HEAD', cache: 'no-store' }).then(function (r) {
        var t1 = Date.now();
        var ds = r.headers.get('date');
        if (!ds) return;
        var server = new Date(ds).getTime();
        if (isNaN(server)) return;
        offset = server + (t1 - t0) / 2 - t1;
      }).catch(function () {});
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
    function tick() {
      // offsetはHTTP Dateヘッダ基準だが、ヘッダは秒未満を切り捨てるため平均0.5秒遅れる。
      // その切り捨て分のみを+500msで補正（過剰補正だった+4000は撤去）。
      var d = new Date(Date.now() + offset + 500);
      var hh = two(d.getHours()), mm = two(d.getMinutes()), ss = two(d.getSeconds());
      c1.textContent = hh + ':' + mm + ':' + ss;
      var a = (hh + mm + ss).split('');
      setSeven(a); setFlip(a);
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
  }

  if (document.body) attach();
  else document.addEventListener('DOMContentLoaded', attach);
})();
