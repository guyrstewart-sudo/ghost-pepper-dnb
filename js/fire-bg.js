/* =====================================================================
   GHOST PEPPER — trippy fire / ember / UV particle background
   Auto-mounts a canvas behind any element with [data-fire].
   Optional intensity: data-fire="hot" (denser) | "calm" (sparser).
   Respects prefers-reduced-motion and pauses when off-screen.
   ===================================================================== */
(function () {
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const PALETTE = [
    [255, 94, 26],   // ember
    [255, 126, 54],  // hot ember
    [225, 18, 18],   // pepper red
    [255, 210, 122], // gold spark
    [0, 179, 255],   // blue flame (rare)
    [57, 255, 20],   // UV green (rare)
    [176, 38, 255]   // plasma (rare)
  ];
  const pick = () => {
    const r = Math.random();
    if (r > 0.93) return PALETTE[6];
    if (r > 0.86) return PALETTE[5];
    if (r > 0.78) return PALETTE[4];
    return PALETTE[(Math.random() * 4) | 0];
  };

  function mount(el) {
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    const c = document.createElement('canvas');
    Object.assign(c.style, {
      position: 'absolute', inset: '0', width: '100%', height: '100%',
      zIndex: '0', pointerEvents: 'none', display: 'block'
    });
    // ensure direct children sit above the canvas
    el.prepend(c);
    [...el.children].forEach(ch => {
      if (ch !== c && getComputedStyle(ch).position === 'static') ch.style.position = 'relative';
      if (ch !== c && !ch.style.zIndex) ch.style.zIndex = '1';
    });

    const ctx = c.getContext('2d');
    const intensity = el.dataset.fire === 'hot' ? 1.6 : el.dataset.fire === 'calm' ? 0.55 : 1;
    let W, H, DPR, parts = [], raf = null, visible = true;

    function size() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      const r = el.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      c.width = W * DPR; c.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const target = Math.min(160, Math.round((W * H) / 9000 * intensity));
      while (parts.length < target) parts.push(spawn(true));
      if (parts.length > target) parts.length = target;
    }

    function spawn(initial) {
      return {
        x: Math.random() * W,
        y: initial ? Math.random() * H : H + 12,
        r: 1 + Math.random() * 3.4,
        vy: -(0.25 + Math.random() * 0.9),
        vx: (Math.random() - 0.5) * 0.35,
        life: 0, max: 120 + Math.random() * 160,
        col: pick(),
        sway: Math.random() * Math.PI * 2,
        swaySpd: 0.01 + Math.random() * 0.03
      };
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      for (let p of parts) {
        p.life++;
        p.sway += p.swaySpd;
        p.x += p.vx + Math.sin(p.sway) * 0.4;
        p.y += p.vy;
        p.vy -= 0.0009; // accelerate upward (buoyancy)
        const t = p.life / p.max;
        if (t >= 1 || p.y < -16) { Object.assign(p, spawn(false)); continue; }
        const a = Math.sin(t * Math.PI) * 0.85;             // fade in/out
        const rad = p.r * (1 + t * 1.4);
        const [R, G, B] = p.col;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad * 3.2);
        g.addColorStop(0, `rgba(${R},${G},${B},${a})`);
        g.addColorStop(0.4, `rgba(${R},${G},${B},${a * 0.35})`);
        g.addColorStop(1, `rgba(${R},${G},${B},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad * 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      if (visible) raf = requestAnimationFrame(frame);
    }

    // static render for reduced motion
    function still() {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      for (let p of parts) {
        const [R, G, B] = p.col;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(${R},${G},${B},.5)`);
        g.addColorStop(1, `rgba(${R},${G},${B},0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, 7); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    }

    size();
    window.addEventListener('resize', () => { size(); if (reduce) still(); }, { passive: true });

    if (reduce) { still(); return; }

    const io = new IntersectionObserver((es) => {
      es.forEach(e => {
        visible = e.isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(frame);
        else if (!visible && raf) { cancelAnimationFrame(raf); raf = null; }
      });
    }, { threshold: 0.01 });
    io.observe(el);
    raf = requestAnimationFrame(frame);
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-fire]').forEach(mount);
  });
})();
