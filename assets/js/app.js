/* 楊梅高中70週年校慶專刊 — 網站程式
   路由（網址 # 後）：#/home  #/toc  #/read/12  #/read/12?hl=校歌  #/search/關鍵字  #/grid  #/quiz  #/marks */
(function () {
  'use strict';
  const S = window.SITE;
  const TOTAL = S.total;
  const TEXT = window.PAGE_TEXT || [];
  const SECS = S.sections;
  const main = document.getElementById('main');

  /* ---------- 工具 ---------- */
  const pad = n => String(n).padStart(3, '0');
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = s => (s || '').replace(/\s+/g, '');
  const img = n => 'images/pages/' + pad(n) + '.webp';
  const store = {
    get(k, d) { try { const v = localStorage.getItem('ym70_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('ym70_' + k, JSON.stringify(v)); } catch (e) { /* 無痕模式等情況 */ } }
  };
  const ARTS = [];
  SECS.forEach(s => s.arts.forEach((a, i) => {
    const nx = s.arts[i + 1];
    ARTS.push({ sec: s, p: a[0], t: a[1], au: a[2] || '', end: nx ? nx[0] - 1 : s.to });
  }));
  const artIdx = p => { for (let i = ARTS.length - 1; i >= 0; i--) if (ARTS[i].p <= p) return i; return 0; };
  const secOf = p => SECS.find(s => p >= s.from && p <= s.to) || SECS[0];
  /* 縮圖：images/thumbs/sNN.webp，每張 20 頁（5 欄 × 4 列） */
  function thumb(n, big) {
    const i = n - 1, sh = Math.floor(i / 20), k = i % 20, c = k % 5, r = Math.floor(k / 5);
    const w = big ? 120 : 84, h = big ? 169.8 : 118.86;
    return `<span class="sp ${big ? 'tb' : 'ts'}" aria-hidden="true" style="background-image:url(images/thumbs/s${String(sh).padStart(2, '0')}.webp);background-position:-${c * w}px -${(r * h).toFixed(2)}px"></span>`;
  }
  const ICON = {
    search: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    book: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2z"/><path d="M22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/></svg>',
    dice: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.3" fill="currentColor"/></svg>',
    left: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
    right: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
    zin: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M8 11h6M11 8v6"/></svg>',
    zout: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M8 11h6"/></svg>',
    mark: f => `<svg class="icon" viewBox="0 0 24 24" fill="${f ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4.5L6 21z"/></svg>`,
    check: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>',
    on: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/></svg>',
    off: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="m22 9-6 6"/><path d="m16 9 6 6"/></svg>',
    petal: '<svg viewBox="0 0 40 40" width="100%" height="100%"><g fill="currentColor"><circle cx="20" cy="10" r="8"/><circle cx="29.5" cy="16.9" r="8"/><circle cx="25.9" cy="28.1" r="8"/><circle cx="14.1" cy="28.1" r="8"/><circle cx="10.5" cy="16.9" r="8"/></g><circle cx="20" cy="20" r="4.5" fill="#FFE066"/></svg>'
  };

  /* ---------- 狀態 ---------- */
  const FS = ['16px', '18px', '21px', '24px'];
  const ZOOMS = [0.6, 0.8, 1, 1.3, 1.6, 2];
  const st = {
    fs: store.get('fs', 1), sound: store.get('sound', true), marks: store.get('marks', []),
    visited: store.get('visited', {}), last: store.get('last', 0),
    page: 1, zi: 2, showText: true, sf: 'all', gf: 'all', fact: 0,
    qi: 0, picked: -1, score: 0, qdone: false, view: ''
  };

  /* ---------- 音效（Web Audio 即時合成，不需音檔） ---------- */
  let ac = null;
  function sfx(kind) {
    if (!st.sound) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      if (!ac) ac = new AC();
      if (ac.state === 'suspended') ac.resume();
      const now = ac.currentTime;
      const tone = (f, t, d, type, vol) => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = type || 'sine'; o.frequency.setValueAtTime(f, now + t);
        g.gain.setValueAtTime(0.0001, now + t);
        g.gain.exponentialRampToValueAtTime(vol || 0.15, now + t + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, now + t + d);
        o.connect(g); g.connect(ac.destination); o.start(now + t); o.stop(now + t + d + 0.05);
      };
      if (kind === 'click') tone(880, 0, 0.08, 'triangle', 0.12);
      else if (kind === 'flip') {
        const len = 0.24, buf = ac.createBuffer(1, Math.floor(ac.sampleRate * len), ac.sampleRate), d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) { const x = i / d.length; d[i] = (Math.random() * 2 - 1) * Math.pow(1 - x, 2) * Math.min(1, x * 8); }
        const s = ac.createBufferSource(); s.buffer = buf;
        const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2400; f.Q.value = 0.6;
        const g = ac.createGain(); g.gain.value = 0.6;
        s.connect(f); f.connect(g); g.connect(ac.destination); s.start(now);
      }
      else if (kind === 'ok') [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.25, 'sine', 0.16));
      else if (kind === 'bad') { tone(220, 0, 0.22, 'sawtooth', 0.07); tone(165, 0.13, 0.3, 'sawtooth', 0.07); }
      else if (kind === 'ping') { tone(1320, 0, 0.18, 'sine', 0.12); tone(1760, 0.07, 0.22, 'sine', 0.09); }
      else if (kind === 'win') [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.11, 0.32, 'triangle', 0.14));
      else if (kind === 'pop') { tone(620, 0, 0.06, 'square', 0.05); tone(990, 0.05, 0.1, 'sine', 0.1); }
    } catch (e) { /* 忽略 */ }
  }

  let toastT;
  function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.hidden = false;
    t.style.animation = 'none'; void t.offsetWidth; t.style.animation = '';
    clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 1700);
  }

  /* ---------- 頁首工具列 ---------- */
  function applyFs() { document.documentElement.style.setProperty('--fs', FS[st.fs] || FS[1]); }
  function applySound() {
    const b = document.getElementById('soundBtn');
    b.innerHTML = (st.sound ? ICON.on : ICON.off) + '<span style="font-size:.85em">音效</span>';
    b.classList.toggle('on', st.sound);
    b.setAttribute('aria-pressed', String(st.sound));
    b.title = st.sound ? '音效：開（按一下關閉）' : '音效：關（按一下開啟）';
  }
  document.getElementById('fsUp').onclick = () => { st.fs = Math.min(FS.length - 1, st.fs + 1); store.set('fs', st.fs); applyFs(); sfx('pop'); };
  document.getElementById('fsDown').onclick = () => { st.fs = Math.max(0, st.fs - 1); store.set('fs', st.fs); applyFs(); sfx('pop'); };
  document.getElementById('soundBtn').onclick = () => { st.sound = !st.sound; store.set('sound', st.sound); applySound(); sfx('ping'); };

  /* ---------- 共用片段 ---------- */
  function chips(cur, key) {
    return [{ id: 'all', name: '全部', c: '#4B1F73' }].concat(SECS).map(s => {
      const on = cur === s.id;
      return `<button class="chip" data-${key}="${s.id}" aria-pressed="${on}" style="color:${on ? '#fff' : s.c};background:${on ? s.c : '#fff'};border-color:${s.c}">${esc(s.name)}</button>`;
    }).join('');
  }
  const visitedN = () => Object.keys(st.visited).length;
  const pct = (a, b) => Math.round(a / b * 100) + '%';

  /* ---------- 首頁 ---------- */
  function viewHome() {
    const petals = Array.from({ length: 16 }, (_, i) =>
      `<span class="petal" aria-hidden="true" style="left:${(i * 61) % 100}%;width:${16 + (i * 7) % 22}px;height:${16 + (i * 7) % 22}px;color:${['#FF7EB9', '#ffffff', '#E8202A', '#C77DDB', '#FFB3D9'][i % 5]};animation-duration:${9 + (i * 5) % 9}s;animation-delay:-${(i * 13) % 17}s">${ICON.petal}</span>`).join('');
    const stats = [[70, '週年', '1948 – 2018', '#D4006F'], [220, '頁專刊', '每一頁完整呈現', '#6A3D9A'], [7, '大篇章', '歲月・禮讚・今日・薈萃…', '#1E5FAD'], [10, '任校長', '省立楊梅高中迄今', '#C2410C']];
    const f = S.facts[st.fact % S.facts.length];
    main.innerHTML = `
<section class="hero">
  <div class="blob" style="width:340px;height:340px;background:#FFB3D9;left:-90px;top:-110px;opacity:.55"></div>
  <div class="blob" style="width:260px;height:260px;background:#B9E4FF;right:6%;top:40px;opacity:.6;animation-delay:-3s"></div>
  <div class="blob" style="width:200px;height:200px;background:#FFE58A;left:38%;bottom:-80px;opacity:.6;animation-delay:-5s"></div>
  <div class="blob" style="width:140px;height:140px;background:#C8F2C2;right:30%;top:-40px;opacity:.6;animation-delay:-1s"></div>
  ${petals}
  <div class="wrap hero-in">
    <div class="hero-art"><div class="hero-logo floaty">
      <img src="images/logo70.webp" alt="梅高70 迎曦御風 SINCE 1948 七十週年標誌">
      <div class="hero-badge popin"><img src="images/badge.png" alt="楊梅高中校徽"></div>
    </div></div>
    <div class="hero-txt rise">
      <span class="tag">SINCE 1948 ・ 七十週年</span>
      <h1>楊梅高中<br><span>70週年校慶專刊</span></h1>
      <p>從心出發・迎曦而起・御風飛揚。翻閱 220 頁專刊，走進梅岡七十年的歲月、今日與青春記憶。</p>
      <form class="searchform" id="homeSearch" role="search">
        <label class="sr" for="hq">搜尋專刊全文</label>
        <input id="hq" type="search" placeholder="搜尋全文，例如：校歌、美術班、鼎園">
        <button class="btn pur" type="submit" style="min-height:52px">${ICON.search}檢索</button>
      </form>
      <div class="row-btns">
        <a class="btn pri" href="#/read/1" style="font-size:1.05em">${ICON.book}開始翻閱</a>
        <a class="btn" href="#/toc">看目次</a>
        <button class="btn gold" id="randomBtn">${ICON.dice}隨機翻一頁</button>
        ${st.last > 1 ? `<a class="btn" href="#/read/${st.last}">接續閱讀 第 ${pad(st.last)} 頁</a>` : ''}
      </div>
    </div>
  </div>
</section>
<section class="wrap sec"><div class="stats">
  ${stats.map(s => `<div class="card stat popin" style="border-color:${s[3]}"><b style="color:${s[3]}" data-count="${s[0]}">0</b><span><strong>${s[1]}</strong><small>${s[2]}</small></span></div>`).join('')}
</div></section>
<section class="wrap sec" style="padding-top:0">
  <h2 class="h2">八大篇章</h2>
  <p class="lead">依專刊第 4–5 頁目次編排，點選卡片直接翻到該篇。</p>
  <div class="seccards">${SECS.map(s => {
      const arts = s.arts.filter(a => a[1] !== '篇章扉頁');
      return `<a class="seccard" href="#/read/${s.from}">
      <div class="seccard-hd" style="background:${s.c}"><span class="seccard-no" style="color:${s.c}">${s.no}</span>
      <span><strong>${esc(s.name)}</strong><small>P.${pad(s.from)}–${pad(s.to)}　${arts.length} 篇</small></span></div>
      <div class="seccard-bd">${thumb(s.from, false)}<span>${esc(arts.slice(0, 4).map(a => a[1]).join('・'))}</span></div></a>`;
    }).join('')}</div>
</section>
<section class="wrap" style="padding-bottom:32px">
  <h2 class="h2">校史時光機</h2>
  <div class="timeline">${S.timeline.map(t => `<a class="tl" href="#/read/${t.p}" style="background:${t.c}"><b>${t.y}</b><small>${t.roc}</small>${esc(t.e)}<em>看原頁 P.${pad(t.p)} →</em></a>`).join('')}</div>
</section>
<section class="wrap duo">
  <div class="card fact">
    <div style="display:flex;align-items:center;gap:10px"><span class="qmark" aria-hidden="true">?</span><h2>梅高小知識</h2></div>
    <p class="popin" id="factText">${esc(f.t)}</p>
    <div class="row-btns"><button class="btn gold" id="nextFact">換一則</button><a class="btn" id="factLink" href="#/read/${f.p}">看原頁 P.${pad(f.p)}</a></div>
  </div>
  <div class="card dark">
    <h2>挑戰校史小測驗</h2>
    <p style="margin:0;font-size:1.05em">10 道題目，答案都藏在專刊裡。答對有歡呼音效，全部完成還有彩帶慶祝！</p>
    <div><a class="btn gold" href="#/quiz">開始挑戰</a></div>
    <div style="font-size:.9em">閱讀進度：已翻閱 ${visitedN()} / ${TOTAL} 頁</div>
    <div class="bar"><i style="width:${pct(visitedN(), TOTAL)};background:var(--gold)"></i></div>
  </div>
</section>`;
    // 數字跳動動畫
    const els = main.querySelectorAll('[data-count]'); const t0 = performance.now();
    (function step(t) {
      const k = Math.min(1, (t - t0) / 1600), e = 1 - Math.pow(1 - k, 3);
      els.forEach(el => { el.textContent = Math.round(+el.dataset.count * e); });
      if (k < 1 && document.body.contains(els[0])) requestAnimationFrame(step);
    })(t0);
    document.getElementById('homeSearch').onsubmit = e => {
      e.preventDefault(); sfx('ping');
      location.hash = '#/search/' + encodeURIComponent(document.getElementById('hq').value.trim());
    };
    document.getElementById('randomBtn').onclick = () => { sfx('pop'); location.hash = '#/read/' + (1 + Math.floor(Math.random() * TOTAL)); };
    document.getElementById('nextFact').onclick = () => {
      st.fact++; sfx('pop');
      const f2 = S.facts[st.fact % S.facts.length], el = document.getElementById('factText');
      el.textContent = f2.t; el.classList.remove('popin'); void el.offsetWidth; el.classList.add('popin');
      const a = document.getElementById('factLink'); a.href = '#/read/' + f2.p; a.textContent = '看原頁 P.' + pad(f2.p);
    };
  }

  /* ---------- 目次 ---------- */
  function viewToc() {
    main.innerHTML = `<section class="wrap sec rise">
  <div style="display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:12px;margin-bottom:22px">
    <div><h1 class="h1" style="color:#8A1C8C;font-size:2.3em">目次 <span style="font-weight:500;color:#9A3E9A">Contents</span></h1>
    <p class="lead" style="margin:0">點選任一篇文章即可翻到該頁；頁碼與紙本專刊相同。</p></div>
    <div class="row-btns"><a class="btn" href="#/read/4">原版目次 P.004</a><a class="btn" href="#/read/5">原版目次 P.005</a></div>
  </div>
  <div class="toc-grid">${SECS.map(s => `<div class="card toc-card">
    <div class="toc-hd"><a href="#/read/${s.from}" aria-label="翻到${esc(s.name)}篇章扉頁">${thumb(s.from, false)}</a>
      <div><span style="font-size:.85em;font-weight:800;color:${s.c}">第 ${s.no} 篇　P.${pad(s.from)}–${pad(s.to)}</span><h2 style="color:${s.c}">${esc(s.name)}</h2></div></div>
    ${s.arts.map(a => `<a class="row" href="#/read/${a[0]}"><span class="pn" style="color:${s.c}">${pad(a[0])}</span><span class="bar-sep">|</span><span style="flex:1">${esc(a[1])}${a[2] ? `<span class="au">（${esc(a[2])}）</span>` : ''}</span></a>`).join('')}
  </div>`).join('')}</div>
</section>`;
  }

  /* ---------- 翻閱 ---------- */
  function viewRead(p, hl) {
    p = Math.max(1, Math.min(TOTAL, p | 0));
    const firstOpen = st.view !== 'read';
    st.page = p; st.visited[p] = 1; st.last = p;
    store.set('visited', st.visited); store.set('last', p);
    const ai = artIdx(p), art = ARTS[ai], sec = art.sec, z = ZOOMS[st.zi];
    const marked = st.marks.indexOf(p) >= 0;
    const raw = TEXT[p - 1] || '';
    const lines = raw ? raw.split('\n').map(l => {
      let h = esc(l);
      if (hl) h = h.split(esc(hl)).join(`<span class="hit">${esc(hl)}</span>`);
      return `<p>${h}</p>`;
    }).join('') : `<p style="color:#6E5A80">本頁以圖片為主，沒有可辨識的文字。</p>`;
    let strip = '';
    for (let i = art.p; i <= art.end; i++) strip += `<a href="#/read/${i}" aria-label="第 ${i} 頁" style="outline:${i === p ? '3px solid ' + sec.c : 'none'}">${thumb(i, false)}${pad(i)}</a>`;
    main.innerHTML = `<section class="wrap" style="max-width:1440px;padding-top:18px;padding-bottom:40px">
  <div class="crumb">
    <a class="chip" href="#/read/${sec.from}" style="color:#fff;background:${sec.c};border-color:${sec.c};text-decoration:none;display:inline-flex;align-items:center">${esc(sec.name)}</a>
    <span style="color:#9A86AC">›</span><strong>${esc(art.t)}</strong>${art.au ? `<span style="color:#6E5A80">文／${esc(art.au)}</span>` : ''}
  </div>
  <div class="reader">
    <div class="viewer" id="viewer" tabindex="0" aria-label="專刊頁面，可用左右方向鍵翻頁">
      <div class="card toolbar">
        <button class="btn pur" id="prev" ${p <= 1 ? 'disabled' : ''} aria-label="上一頁">${ICON.left}上一頁</button>
        <label>第<input type="number" id="pgInput" min="1" max="${TOTAL}" value="${p}" aria-label="頁碼">頁 / ${TOTAL}</label>
        <button class="btn pur" id="next" ${p >= TOTAL ? 'disabled' : ''} aria-label="下一頁">下一頁${ICON.right}</button>
        <span class="grow"></span>
        <button class="btn sm" id="zout" aria-label="縮小頁面">${ICON.zout}</button>
        <span style="font-weight:800;min-width:3.2em;text-align:center">${Math.round(z * 100)}%</span>
        <button class="btn sm" id="zin" aria-label="放大頁面">${ICON.zin}</button>
        <button class="btn ${marked ? 'pri' : ''}" id="markBtn" aria-pressed="${marked}">${ICON.mark(marked)}${marked ? '已加入書籤' : '加入書籤'}</button>
      </div>
      <input type="range" id="slider" min="1" max="${TOTAL}" value="${p}" aria-label="拖曳快速翻頁">
      <div class="stage ${z > 1 ? 'zoomed' : ''}">
        <img class="pgimg flip" src="${img(p)}" alt="專刊第 ${pad(p)} 頁：${esc(art.t)}" style="width:${z * 100}%">
      </div>
      <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap">
        <button class="btn" id="prevArt" ${ai <= 0 ? 'disabled' : ''}>« 上一篇</button>
        <span style="color:#6E5A80;align-self:center;font-size:.9em">提示：可用鍵盤 ← → 鍵翻頁</span>
        <button class="btn" id="nextArt" ${ai >= ARTS.length - 1 ? 'disabled' : ''}>下一篇 »</button>
      </div>
    </div>
    <aside class="side">
      <div class="card" style="border-top:8px solid ${sec.c}">
        <div style="font-size:.85em;font-weight:800;color:${sec.c}">本篇頁面　P.${pad(art.p)}–${pad(art.end)}</div>
        <div class="strip">${strip}</div>
      </div>
      <div class="card">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">
          <h2 style="margin:0;font-size:1.15em;font-weight:900;color:#4B1F73">本頁文字版</h2>
          <button class="btn sm" id="textBtn" aria-expanded="${st.showText}">${st.showText ? '收合' : '展開'}</button>
        </div>
        <p class="note">由掃描頁面文字辨識（OCR）產生，供檢索與放大閱讀，少數字可能有誤，請以頁面圖像為準。</p>
        <div class="ocr" id="ocr" ${st.showText ? '' : 'hidden'}>${lines}</div>
      </div>
    </aside>
  </div>
</section>`;
    if (p < TOTAL) { const pre = new Image(); pre.src = img(p + 1); }
    const go = n => { location.hash = '#/read/' + n + (hl ? '?hl=' + encodeURIComponent(hl) : ''); };
    document.getElementById('prev').onclick = () => go(p - 1);
    document.getElementById('next').onclick = () => go(p + 1);
    document.getElementById('pgInput').onchange = e => { const n = parseInt(e.target.value, 10); if (n >= 1 && n <= TOTAL) go(n); };
    document.getElementById('slider').onchange = e => go(parseInt(e.target.value, 10));
    document.getElementById('zin').onclick = () => { st.zi = Math.min(ZOOMS.length - 1, st.zi + 1); sfx('pop'); rerender(); };
    document.getElementById('zout').onclick = () => { st.zi = Math.max(0, st.zi - 1); sfx('pop'); rerender(); };
    document.getElementById('prevArt').onclick = () => go(ARTS[ai - 1].p);
    document.getElementById('nextArt').onclick = () => go(ARTS[ai + 1].p);
    document.getElementById('textBtn').onclick = e => {
      st.showText = !st.showText; sfx('click');
      document.getElementById('ocr').hidden = !st.showText;
      e.currentTarget.textContent = st.showText ? '收合' : '展開';
      e.currentTarget.setAttribute('aria-expanded', String(st.showText));
    };
    document.getElementById('markBtn').onclick = () => {
      st.marks = marked ? st.marks.filter(x => x !== p) : st.marks.concat([p]).sort((a, b) => a - b);
      store.set('marks', st.marks); sfx(marked ? 'click' : 'ok');
      toast(marked ? '已移除書籤' : '已加入書籤：第 ' + pad(p) + ' 頁'); rerender();
    };
    const hit = main.querySelector('.ocr .hit'); if (hit) hit.scrollIntoView({ block: 'center' });
    if (firstOpen) window.scrollTo(0, 0);
  }

  /* ---------- 檢索 ---------- */
  function viewSearch(q) {
    q = norm(q);
    let res = '';
    if (q) {
      const hits = [], counts = {}; let total = 0;
      for (let i = 0; i < TOTAL; i++) {
        const flat = norm(TEXT[i]); let idx = flat.indexOf(q), c = 0, first = -1;
        while (idx >= 0) { if (first < 0) first = idx; c++; idx = flat.indexOf(q, idx + q.length); }
        if (c) { const p = i + 1, s = secOf(p); total += c; counts[s.id] = (counts[s.id] || 0) + c; hits.push({ p, c, first, flat, s }); }
      }
      const max = Math.max(1, ...SECS.map(s => counts[s.id] || 0));
      const filt = hits.filter(h => st.sf === 'all' || h.s.id === st.sf);
      const arts = ARTS.filter(a => a.t !== '篇章扉頁' && norm(a.t + a.au).includes(q));
      const hlq = '?hl=' + encodeURIComponent(q);
      res = `<div class="card summary popin">
  <div style="font-size:1.15em"><b style="font-size:1.6em;color:var(--magenta)">${total}</b> 處符合「<b>${esc(q)}</b>」，分布在 <b>${hits.length}</b> 頁</div>
  <div class="bars">${SECS.map(s => `<button data-sf="${s.id}"><span class="nm" style="color:${s.c}">${esc(s.name)}</span><span class="bar"><i style="width:${Math.round((counts[s.id] || 0) / max * 100)}%;background:${s.c}"></i></span><span class="n">${counts[s.id] || 0}</span></button>`).join('')}</div>
</div>
<div class="chips">${chips(st.sf, 'sf')}</div>
${arts.length ? `<h2 style="font-size:1.2em;margin:8px 0;color:#4B1F73">符合的文章標題／作者</h2><div class="row-btns" style="margin-bottom:16px">${arts.map(a => `<a class="btn" href="#/read/${a.p}${hlq}" style="border-color:${a.sec.c}"><b style="color:${a.sec.c}">P.${pad(a.p)}</b>${esc(a.t)}${a.au ? '（' + esc(a.au) + '）' : ''}</a>`).join('')}</div>` : ''}
<div class="results">${filt.slice(0, 80).map(h => `<a class="result" href="#/read/${h.p}${hlq}">${thumb(h.p, false)}
  <span style="display:flex;flex-direction:column;gap:4px;flex:1;min-width:0">
    <span style="display:flex;flex-wrap:wrap;gap:8px;align-items:center"><span class="pill" style="background:${h.s.c}">${esc(h.s.name)}</span><b>P.${pad(h.p)}　${esc(ARTS[artIdx(h.p)].t)}</b><span style="color:#6E5A80;font-size:.85em">${h.c} 處</span></span>
    <span style="line-height:1.7">…${esc(h.flat.slice(Math.max(0, h.first - 30), h.first))}<span class="hit">${esc(q)}</span>${esc(h.flat.slice(h.first + q.length, h.first + q.length + 44))}…</span>
  </span></a>`).join('')}</div>
${filt.length > 80 ? '<p style="color:#6E5A80;text-align:center">僅列出前 80 頁結果，請輸入更精確的關鍵字或使用篇章篩選。</p>' : ''}
${!hits.length && !arts.length ? `<div class="card empty">找不到「${esc(q)}」，換個關鍵字試試看，或點選上方熱門關鍵字。</div>` : ''}`;
    }
    main.innerHTML = `<section class="wrap sec rise" style="max-width:1200px">
  <h1 class="h1">全文檢索</h1>
  <p class="lead">搜尋 220 頁專刊的文章標題、作者與內文（OCR 文字）。</p>
  <form class="searchform sbox" id="sForm" role="search" style="max-width:none">
    <label class="sr" for="sq">搜尋關鍵字</label>
    <input id="sq" type="search" value="${esc(q)}" placeholder="輸入關鍵字…">
    <button class="btn pur" type="submit" style="min-height:56px">${ICON.search}檢索</button>
  </form>
  <div class="chips" style="margin:14px 0 6px"><span style="font-weight:700;color:var(--muted)">熱門關鍵字：</span>
    ${S.hot.map((h, i) => `<a class="chip" href="#/search/${encodeURIComponent(h)}" style="color:${SECS[(i % 7) + 1].c};border-color:${SECS[(i % 7) + 1].c};text-decoration:none;display:inline-flex;align-items:center">${esc(h)}</a>`).join('')}</div>
  ${res}
</section>`;
    const inp = document.getElementById('sq');
    document.getElementById('sForm').onsubmit = e => { e.preventDefault(); sfx('ping'); st.sf = 'all'; location.hash = '#/search/' + encodeURIComponent(inp.value.trim()); };
    main.querySelectorAll('[data-sf]').forEach(b => b.onclick = () => { st.sf = b.dataset.sf; sfx('pop'); rerender(); });
    if (!q) inp.focus();
  }

  /* ---------- 縮圖總覽 ---------- */
  function viewGrid() {
    let tiles = '';
    for (let n = 1; n <= TOTAL; n++) {
      const s = secOf(n); if (st.gf !== 'all' && s.id !== st.gf) continue;
      tiles += `<a class="tile" href="#/read/${n}" aria-label="第 ${n} 頁 ${esc(ARTS[artIdx(n)].t)}">${thumb(n, true)}<span style="color:${s.c}">P.${pad(n)}</span>${st.visited[n] ? `<span class="seen" title="已閱讀">${ICON.check}</span>` : ''}</a>`;
    }
    main.innerHTML = `<section class="wrap sec rise">
  <h1 class="h1">全刊縮圖瀏覽</h1>
  <p class="lead">220 頁一覽無遺，綠色勾勾代表你已翻閱過。點選縮圖即可閱讀。</p>
  <div class="chips">${chips(st.gf, 'gf')}</div>
  <div class="tiles">${tiles}</div>
</section>`;
    main.querySelectorAll('[data-gf]').forEach(b => b.onclick = () => { st.gf = b.dataset.gf; sfx('pop'); rerender(); });
  }

  /* ---------- 校史測驗 ---------- */
  function viewQuiz() {
    const Q = S.quiz;
    if (st.qdone) {
      const sc = st.score;
      const medal = sc >= 9 ? '梅岡校史達人！你對母校瞭若指掌。' : sc >= 6 ? '表現亮眼！再翻翻專刊就能全對。' : '已經認識梅高的一些故事了，去專刊找答案吧！';
      const colors = ['#D4006F', '#6A3D9A', '#FFD23F', '#1E5FAD', '#00A3A3', '#E8202A', '#4A9A12', '#FF8A00'];
      main.innerHTML = `<section class="wrap sec quiz">
  <div class="confetti" aria-hidden="true">${Array.from({ length: 44 }, (_, i) => `<span class="conf" style="left:${(i * 37) % 100}%;background:${colors[i % 8]};animation-delay:${((i * 7) % 20) / 10}s;transform:rotate(${(i * 47) % 360}deg)"></span>`).join('')}</div>
  <div class="card done popin">
    <img src="images/badge.png" alt="楊梅高中校徽" class="floaty" style="width:96px;height:90px;object-fit:contain">
    <h2 style="font-size:2em;color:var(--deep)">挑戰完成！</h2>
    <div class="score">${sc} / ${Q.length}</div>
    <p style="margin:0;font-size:1.15em">${medal}</p>
    <div class="row-btns" style="justify-content:center"><button class="btn pri" id="again">再玩一次</button><a class="btn" href="#/toc">去讀專刊</a></div>
  </div></section>`;
      document.getElementById('again').onclick = () => { st.qi = 0; st.picked = -1; st.score = 0; st.qdone = false; sfx('click'); rerender(); };
      return;
    }
    const q = Q[st.qi], ans = st.picked >= 0;
    main.innerHTML = `<section class="wrap sec quiz"><div class="card rise">
  <div class="qhd"><span class="qno">第 ${st.qi + 1} / ${Q.length} 題</span><span style="font-weight:800;color:var(--ok)">得分 ${st.score}</span></div>
  <div class="bar" style="height:10px"><i style="width:${pct(st.qi + (ans ? 1 : 0), Q.length)};background:var(--magenta)"></i></div>
  <h2>${esc(q.q)}</h2>
  <div style="display:flex;flex-direction:column;gap:10px">${q.o.map((t, i) => {
      const cls = !ans ? '' : i === q.a ? 'right' : i === st.picked ? 'wrong' : 'dim';
      return `<button class="opt ${cls}" data-i="${i}" ${ans ? 'disabled' : ''}><span class="k">${'ABCD'[i]}</span>${esc(t)}</button>`;
    }).join('')}</div>
  ${ans ? `<div class="feedback popin"><span style="font-weight:800;color:${st.picked === q.a ? 'var(--ok)' : 'var(--bad)'}">${st.picked === q.a ? '答對了！太棒了！' : '可惜答錯了，正確答案是：' + esc(q.o[q.a])}</span>
    <span class="row-btns"><a class="btn" href="#/read/${q.p}">看原頁 P.${pad(q.p)}</a><button class="btn pri" id="qNext">${st.qi + 1 >= Q.length ? '看成績' : '下一題'}</button></span></div>` : ''}
</div></section>`;
    main.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      if (st.picked >= 0) return;
      const i = +b.dataset.i, ok = i === q.a;
      st.picked = i; if (ok) st.score++; sfx(ok ? 'ok' : 'bad'); rerender();
    });
    const nx = document.getElementById('qNext');
    if (nx) nx.onclick = () => {
      if (st.qi + 1 >= Q.length) { st.qdone = true; sfx('win'); } else { st.qi++; st.picked = -1; sfx('click'); }
      rerender();
    };
  }

  /* ---------- 書籤 ---------- */
  function viewMarks() {
    const n = visitedN();
    main.innerHTML = `<section class="wrap sec rise" style="max-width:1100px">
  <h1 class="h1">我的書籤與閱讀足跡</h1>
  <p class="lead">書籤與閱讀紀錄只存在這台裝置的瀏覽器中。</p>
  <div class="card" style="padding:18px 20px;margin-bottom:18px">
    <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;font-weight:800"><span>已翻閱 ${n} / ${TOTAL} 頁</span><span style="color:var(--magenta)">${pct(n, TOTAL)}</span></div>
    <div class="bar" style="height:16px;margin:8px 0 14px"><i style="width:${pct(n, TOTAL)};background:var(--ok)"></i></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px">${SECS.map(s => {
      let c = 0; for (let i = s.from; i <= s.to; i++) if (st.visited[i]) c++;
      const tot = s.to - s.from + 1;
      return `<div><span style="font-size:.85em;font-weight:800;color:${s.c}">${esc(s.name)}　${c}/${tot}</span><div class="bar" style="height:10px"><i style="width:${pct(c, tot)};background:${s.c}"></i></div></div>`;
    }).join('')}</div>
    <div style="margin-top:14px"><button class="btn sm" id="clearAll">清除閱讀紀錄</button></div>
  </div>
  ${st.marks.length ? `<div class="tiles">${st.marks.map(p => `<a class="tile" href="#/read/${p}">${thumb(p, true)}<span style="color:${secOf(p).c}">P.${pad(p)}</span><span class="tt">${esc(ARTS[artIdx(p)].t)}</span></a>`).join('')}</div>`
        : '<div class="card empty">還沒有書籤。閱讀時按下「加入書籤」，喜歡的頁面就會收藏在這裡。</div>'}
</section>`;
    document.getElementById('clearAll').onclick = () => {
      if (!confirm('確定要清除閱讀紀錄嗎？（書籤會保留）')) return;
      st.visited = {}; st.last = 0; store.set('visited', {}); store.set('last', 0); sfx('click'); rerender();
    };
  }

  /* ---------- 路由 ---------- */
  function parse() {
    const h = decodeURIComponent((location.hash || '#/home').slice(2));
    const [path, qs] = h.split('?');
    const parts = path.split('/');
    const hl = qs && qs.indexOf('hl=') === 0 ? qs.slice(3) : '';
    return { view: parts[0] || 'home', arg: parts.slice(1).join('/'), hl };
  }
  function rerender() { route(true); }
  function route(silent) {
    const r = parse();
    const prev = st.view;
    let view = r.view;
    if (view === 'read') {
      const n = parseInt(r.arg, 10);
      if (!silent) sfx('flip');
      viewRead(n >= 1 ? n : (st.last || 1), r.hl);
    } else {
      if (!silent && prev) sfx('click');
      if (view === 'toc') viewToc();
      else if (view === 'search') viewSearch(r.arg);
      else if (view === 'grid') viewGrid();
      else if (view === 'quiz') viewQuiz();
      else if (view === 'marks') viewMarks();
      else { view = 'home'; viewHome(); }
      if (!silent) window.scrollTo(0, 0);
    }
    st.view = view;
    document.querySelectorAll('[data-nav]').forEach(a => {
      const on = a.dataset.nav === view;
      a.classList.toggle('on', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (view === 'read') document.querySelector('[data-nav="read"]').href = '#/read/' + st.page;
    document.title = (view === 'home' ? '' : ({ toc: '目次', read: '第 ' + pad(st.page) + ' 頁', search: '全文檢索', grid: '縮圖總覽', quiz: '校史測驗', marks: '我的書籤' }[view] + '｜')) + '楊梅高中70週年校慶專刊';
  }

  // 鍵盤左右翻頁（只在閱讀頁、焦點不在輸入框時）
  document.addEventListener('keydown', e => {
    if (st.view !== 'read') return;
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (e.key === 'ArrowRight' && st.page < TOTAL) { e.preventDefault(); location.hash = '#/read/' + (st.page + 1); }
    else if (e.key === 'ArrowLeft' && st.page > 1) { e.preventDefault(); location.hash = '#/read/' + (st.page - 1); }
  });

  window.addEventListener('hashchange', () => route(false));
  applyFs(); applySound();
  route(true);
})();
