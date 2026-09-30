/* Quang Duy Vuong — portfolio interactions. Vanilla JS, no dependencies. */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function cssVar(name) { return getComputedStyle(root).getPropertyValue(name).trim(); }

  // Runs `fn` only while `el` is on screen, so off-screen animations cost nothing.
  function whileVisible(el, start, stop) {
    if (!('IntersectionObserver' in window)) { start(); return; }
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.isIntersecting ? start() : stop(); });
    }, { threshold: 0.05 }).observe(el);
  }

  /* ---------------- Theme ---------------- */
  var themeListeners = [];
  document.getElementById('themeToggle').addEventListener('click', function () {
    var next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    themeListeners.forEach(function (fn) { fn(); });
  });

  /* ---------------- Nav ---------------- */
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('is-scrolled', window.scrollY > 20);
  }, { passive: true });

  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__links a'));
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['about', 'work', 'lab', 'skills', 'contact'].forEach(function (id) {
      var s = document.getElementById(id); if (s) spy.observe(s);
    });
  }

  /* ---------------- Cursor glow ---------------- */
  var glow = document.querySelector('.cursor-glow');
  if (window.matchMedia('(pointer: fine)').matches && !reduceMotion) {
    document.body.classList.add('has-pointer');
    var gx = 0, gy = 0, tx = 0, ty = 0, glowRaf = null;
    window.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!glowRaf) glowRaf = requestAnimationFrame(moveGlow);
    });
    function moveGlow() {
      gx += (tx - gx) * 0.15; gy += (ty - gy) * 0.15;
      glow.style.transform = 'translate(' + (gx - 260) + 'px,' + (gy - 260) + 'px)';
      glowRaf = Math.abs(tx - gx) + Math.abs(ty - gy) > 0.5 ? requestAnimationFrame(moveGlow) : null;
    }
  }

  /* ---------------- Reveal on scroll ---------------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) {
      // Stagger siblings that share a parent.
      var sibs = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.classList.contains('reveal'); });
      el.style.setProperty('--d', (Math.min(sibs.indexOf(el), 6) * 0.08) + 's');
      ro.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------------- Count-up stats ---------------- */
  var counters = document.querySelectorAll('[data-count]');
  function countUp(el) {
    var target = +el.dataset.count;
    if (reduceMotion) { el.textContent = target; return; }
    var t0 = performance.now(), dur = 1400;
    (function tick(now) {
      var p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.dataset.count; });
  }

  /* ---------------- Typed roles ---------------- */
  var typedEl = document.getElementById('typed');
  var roles = [
    'grounded LLM systems',
    'RAG pipelines that cite sources',
    'real-time object tracking',
    'models chosen by measurement',
    'AI that ships, with tests'
  ];
  if (!reduceMotion) {
    var ri = 0, ci = roles[0].length, deleting = true;
    setTimeout(function typeLoop() {
      var word = roles[ri];
      ci += deleting ? -1 : 1;
      typedEl.textContent = word.slice(0, ci);
      var delay = deleting ? 28 : 55;
      if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; delay = 300; }
      else if (!deleting && ci === roles[ri].length) { deleting = true; delay = 2200; }
      setTimeout(typeLoop, delay);
    }, 2600);
  }

  /* ---------------- Hero: neural field ---------------- */
  (function neural() {
    var canvas = document.getElementById('neural');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W, H, nodes = [], pulses = [], raf = null, mouse = { x: -9999, y: -9999 };
    var c1, c2, lineRGB;

    function readColors() {
      c1 = cssVar('--a1'); c2 = cssVar('--a2');
      lineRGB = root.dataset.theme === 'light' ? '40,50,90' : '160,175,220';
    }
    themeListeners.push(readColors);

    function resize() {
      var r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(110, (W * H) / 13000));
      nodes = [];
      for (var i = 0; i < n; i++) {
        nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25, r: Math.random() * 1.6 + .8, hue: Math.random() < .5 });
      }
    }

    var LINK = 140;
    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < nodes.length; i++) {
        var p = nodes[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        var mdx = mouse.x - p.x, mdy = mouse.y - p.y, md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < 180) { p.x += mdx * 0.004; p.y += mdy * 0.004; }
      }
      for (i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var a = nodes[i], b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
          if (d < LINK * LINK) {
            var o = 1 - Math.sqrt(d) / LINK;
            ctx.strokeStyle = 'rgba(' + lineRGB + ',' + (o * 0.22) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            if (Math.random() < 0.0009 && pulses.length < 14) pulses.push({ a: a, b: b, t: 0, c: Math.random() < .5 ? c1 : c2 });
          }
        }
      }
      // Signals travelling along edges, like activations.
      for (i = pulses.length - 1; i >= 0; i--) {
        var s = pulses[i]; s.t += 0.018;
        if (s.t >= 1) { pulses.splice(i, 1); continue; }
        var x = s.a.x + (s.b.x - s.a.x) * s.t, y = s.a.y + (s.b.y - s.a.y) * s.t;
        ctx.fillStyle = s.c; ctx.shadowColor = s.c; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(x, y, 2.2, 0, 6.283); ctx.fill();
        ctx.shadowBlur = 0;
      }
      for (i = 0; i < nodes.length; i++) {
        var q = nodes[i];
        ctx.fillStyle = q.hue ? c1 : c2; ctx.globalAlpha = 0.75;
        ctx.beginPath(); ctx.arc(q.x, q.y, q.r, 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }

    readColors(); resize();
    window.addEventListener('resize', function () { resize(); if (reduceMotion) drawOnce(); });
    canvas.parentElement.addEventListener('mousemove', function (e) {
      var r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    canvas.parentElement.addEventListener('mouseleave', function () { mouse.x = mouse.y = -9999; });

    function drawOnce() { frame(); cancelAnimationFrame(raf); raf = null; }
    if (reduceMotion) { drawOnce(); themeListeners.push(drawOnce); return; }
    whileVisible(canvas, function () { if (!raf) raf = requestAnimationFrame(frame); },
                         function () { cancelAnimationFrame(raf); raf = null; });
  })();

  /* ---------------- RAG pipeline simulation ---------------- */
  (function ragSim() {
    var box = document.getElementById('ragSim');
    if (!box) return;
    var qEl = document.getElementById('ragQ');
    var list = document.getElementById('ragChunks');
    var ans = document.getElementById('ragA');
    var stages = box.querySelectorAll('.stage');

    // Mirrors the real demo: sample company handbook, 6 chunks, top_k = 6.
    var scenarios = [
      {
        q: 'Được làm việc từ xa mấy ngày một tuần?',
        en: 'How many days a week can I work remotely?',
        chunks: [['§ Làm việc từ xa', .88, 1], ['§ Giờ làm việc', .84, 0], ['§ Nghỉ phép', .82, 0], ['§ Thiết bị làm việc', .80, 0], ['§ Chi phí công tác', .79, 0], ['§ Giới thiệu', .77, 0]],
        a: 'Tối đa <b>2 ngày</b> mỗi tuần. <span class="muted">— Up to 2 days per week.</span>',
        cite: 'source: noi-quy.md › Làm việc từ xa'
      },
      {
        q: 'cong ty co ho tro tien gui xe khong?',
        en: 'Does the company pay for parking? (typed without diacritics)',
        chunks: [['§ Chi phí công tác', .83, 0], ['§ Thiết bị làm việc', .81, 0], ['§ Giờ làm việc', .80, 0], ['§ Làm việc từ xa', .79, 0], ['§ Nghỉ phép', .78, 0], ['§ Giới thiệu', .76, 0]],
        a: 'Không tìm thấy thông tin này trong tài liệu. <span class="muted">— Not in the documents, so no answer is invented.</span>',
        cite: 'no_answer · 0/6 chunks passed grading'
      }
    ];

    var timers = [], running = false, idx = 0;
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
    function clear() { timers.forEach(clearTimeout); timers = []; }
    function setStage(name, cls) {
      stages.forEach(function (s) { s.classList.remove('is-on', 'is-no'); if (s.dataset.stage === name) s.classList.add(cls || 'is-on'); });
    }

    function render(sc, instant) {
      qEl.innerHTML = sc.q + '<br><span class="muted small">' + sc.en + '</span>';
      list.innerHTML = sc.chunks.map(function (c) {
        return '<li><span>' + c[0] + '</span><span class="score">' + c[1].toFixed(2) + '</span><span class="verdict"></span></li>';
      }).join('');
      ans.className = 'rag__a'; ans.innerHTML = '';
      var items = list.children;
      var kept = sc.chunks.some(function (c) { return c[2]; });

      function grade(i) {
        items[i].classList.add(sc.chunks[i][2] ? 'keep' : 'drop');
        items[i].querySelector('.verdict').textContent = sc.chunks[i][2] ? '✓' : '✗';
      }
      function answer() {
        setStage(kept ? 'generate' : 'generate', kept ? 'is-on' : 'is-no');
        if (!kept) stages[2].textContent = 'no_answer';
        ans.classList.toggle('refuse', !kept);
        ans.innerHTML = sc.a + '<cite>' + sc.cite + '</cite>';
      }

      stages[2].textContent = 'generate';
      if (instant) {
        for (var k = 0; k < items.length; k++) { items[k].classList.add('in'); grade(k); }
        answer(); return;
      }
      setStage('retrieve');
      for (var i = 0; i < items.length; i++) (function (i) { later(function () { items[i].classList.add('in'); }, 250 + i * 120); })(i);
      later(function () { setStage('grade'); }, 1300);
      for (var j = 0; j < items.length; j++) (function (j) { later(function () { grade(j); }, 1600 + j * 260); })(j);
      later(answer, 1600 + items.length * 260 + 300);
    }

    function loop() {
      if (!running) return;
      render(scenarios[idx]);
      idx = (idx + 1) % scenarios.length;
      later(loop, 7600);
    }

    if (reduceMotion) { render(scenarios[0], true); return; }
    whileVisible(box, function () { if (!running) { running = true; loop(); } },
                      function () { running = false; clear(); });
  })();

  /* ---------------- Traffic tracking simulation ---------------- */
  (function trafficSim() {
    var canvas = document.getElementById('trafficSim');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W = 560, H = 340, dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var inEl = document.getElementById('tIn'), outEl = document.getElementById('tOut'), uqEl = document.getElementById('tUniq');
    var LINE_Y = H * 0.55;
    // Lanes: x centre and direction (+1 = down / "in", -1 = up / "out").
    var lanes = [{ x: 150, dir: 1 }, { x: 225, dir: 1 }, { x: 335, dir: -1 }, { x: 410, dir: -1 }];
    var types = [
      { name: 'car', w: 30, h: 50, p: .62, col: '#5eead4' },
      { name: 'truck', w: 36, h: 82, p: .14, col: '#a78bfa' },
      { name: 'bus', w: 38, h: 96, p: .09, col: '#f472b6' },
      { name: 'motorcycle', w: 14, h: 28, p: .15, col: '#fbbf24' }
    ];
    var vehicles = [], nextId = 1, counts = { in: 0, out: 0 }, flash = 0, raf = null, spawnT = 0, dash = 0;

    function pickType() { var r = Math.random(), acc = 0; for (var i = 0; i < types.length; i++) { acc += types[i].p; if (r < acc) return types[i]; } return types[0]; }
    function spawn() {
      var lane = lanes[(Math.random() * lanes.length) | 0], t = pickType();
      var y = lane.dir > 0 ? -t.h : H + t.h;
      for (var i = 0; i < vehicles.length; i++) {
        var v = vehicles[i];
        if (v.lane === lane && Math.abs(v.y - y) < v.t.h + t.h + 30) return;
      }
      vehicles.push({ id: nextId++, lane: lane, t: t, x: lane.x + (Math.random() - .5) * 6, y: y, v: (1.1 + Math.random() * 1.1) * lane.dir, conf: (0.62 + Math.random() * 0.35).toFixed(2), trail: [], counted: false });
      uqEl.textContent = nextId - 1;
    }

    function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

    function drawRoad() {
      ctx.fillStyle = '#0a0d14'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#121724'; ctx.fillRect(110, 0, 340, H);
      ctx.fillStyle = '#1b2233'; ctx.fillRect(106, 0, 4, H); ctx.fillRect(450, 0, 4, H);
      ctx.fillStyle = '#fbbf24'; ctx.fillRect(278, 0, 2, H); ctx.fillRect(282, 0, 2, H);
      ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 2; ctx.setLineDash([16, 18]); ctx.lineDashOffset = -dash;
      [188, 372].forEach(function (x) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); });
      ctx.setLineDash([]);
      // Sidewalk texture.
      ctx.fillStyle = '#0e121c'; for (var y = 0; y < H; y += 22) { ctx.fillRect(40, y, 60, 20); ctx.fillRect(460, y, 60, 20); }
    }

    function drawLine() {
      var a = 0.55 + flash * 0.45;
      ctx.strokeStyle = 'rgba(248,113,113,' + a + ')'; ctx.lineWidth = 2 + flash * 2;
      ctx.setLineDash([8, 6]); ctx.beginPath(); ctx.moveTo(90, LINE_Y); ctx.lineTo(470, LINE_Y); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(248,113,113,.9)'; ctx.font = '500 10px "JetBrains Mono", monospace';
      ctx.fillText('COUNT LINE', 474, LINE_Y + 3);
      flash = Math.max(0, flash - 0.04);
    }

    function drawVehicle(v) {
      var t = v.t, x = v.x - t.w / 2, y = v.y - t.h / 2;
      // Trail
      ctx.strokeStyle = t.col; ctx.globalAlpha = .35; ctx.lineWidth = 2; ctx.beginPath();
      v.trail.forEach(function (p, i) { i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); ctx.stroke(); ctx.globalAlpha = 1;
      // Body (stylised, top-down)
      ctx.fillStyle = '#2a3246'; roundRect(x + 3, y + 3, t.w - 6, t.h - 6, 5); ctx.fill();
      ctx.fillStyle = '#3a4560'; roundRect(x + 6, y + t.h * (v.v > 0 ? .55 : .15), t.w - 12, t.h * .28, 3); ctx.fill();
      // Bounding box
      ctx.strokeStyle = t.col; ctx.lineWidth = 1.6; ctx.strokeRect(x, y, t.w, t.h);
      // Label
      var label = t.name + ' #' + v.id + ' ' + v.conf;
      ctx.font = '500 9.5px "JetBrains Mono", monospace';
      var tw = ctx.measureText(label).width + 8;
      ctx.fillStyle = t.col; ctx.fillRect(x - .8, y - 14, tw, 14);
      ctx.fillStyle = '#06080f'; ctx.fillText(label, x + 3, y - 4);
    }

    function step() {
      dash += 0.6;
      spawnT -= 1;
      if (spawnT <= 0) { spawn(); spawnT = 26 + Math.random() * 40; }
      drawRoad();
      for (var i = vehicles.length - 1; i >= 0; i--) {
        var v = vehicles[i], prevY = v.y;
        v.y += v.v; v.x += Math.sin((v.y + v.id * 40) / 60) * 0.12;
        v.trail.push([v.x, v.y]); if (v.trail.length > 26) v.trail.shift();
        if (!v.counted && (prevY - LINE_Y) * (v.y - LINE_Y) <= 0) {
          v.counted = true; flash = 1;
          if (v.v > 0) { counts.in++; inEl.textContent = counts.in; } else { counts.out++; outEl.textContent = counts.out; }
        }
        if (v.y < -140 || v.y > H + 140) vehicles.splice(i, 1);
      }
      drawLine();
      vehicles.forEach(drawVehicle);
      raf = requestAnimationFrame(step);
    }

    if (reduceMotion) {
      for (var k = 0; k < 6; k++) spawn();
      vehicles.forEach(function (v, i) { v.y = 40 + i * 50; v.x = v.lane.x; });
      drawRoad(); drawLine(); vehicles.forEach(drawVehicle);
      return;
    }
    whileVisible(canvas, function () { if (!raf) raf = requestAnimationFrame(step); },
                         function () { cancelAnimationFrame(raf); raf = null; });
  })();

  document.getElementById('year').textContent = new Date().getFullYear();
})();
