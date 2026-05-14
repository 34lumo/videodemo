// canvas-engine.jsx — frame-by-frame Canvas 2D engine for Between Visits.
// Pure motion graphics: typography, color, geometry, atmosphere. No images.
//
// Public API (assigned to window):
//   CanvasComposition({width, height, render})
//   beginFrame(ctx)                           — call once at top of each frame
//   recordTextBox(box) / wouldOverlap(box)    — per-frame text ledger
//   drawText(ctx, text, opts)                 — auto-bbox-recording text
//   drawTextLettered(ctx, t, text, opts)      — letter-by-letter reveal
//   slamInState, popInState, slamFromAboveState, countUpValue
//   drawGhostTrail
//   drawGrain, drawDust, drawVignette
//   drawScanFlash, drawColorFlash, drawRadialWipe, drawVerticalWipe, drawLetterbox, drawGeometryCollapse
//   drawAtmosphereNavy/Teal/Amber/Desat/Indigo/Cold/Warm
//   drawAccentWash, drawBottomBleed, drawRadialPulse, drawGlowLine
//   drawProgressArc, drawDataBar, drawCrosshair, drawHandKeypoints, drawFaceMesh,
//   drawWaveform, drawGridSection, drawRingIndicator, drawCornerBrackets, drawClinicalFrame,
//   drawSectionLabel
//   lerpKeyframes
//   FONT_SERIF, FONT_MONO  (declared once here so blocks share)

// Font stacks
const FONT_SERIF = '"Playfair Display", "Times New Roman", serif';
const FONT_MONO  = '"JetBrains Mono", ui-monospace, monospace';
// Compatibility aliases
const SERIF = FONT_SERIF;
const MONO = FONT_MONO;

// ── Composition root ────────────────────────────────────────────────────────
function CanvasComposition({ width = 1920, height = 1080, render }) {
  const canvasRef = React.useRef(null);
  const time = useTime();
  const [fontsReady, setFontsReady] = React.useState(false);
  const firstFrameRef = React.useRef(true);
  const mountTimeRef = React.useRef(performance.now());

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('[BV] Canvas ref is null on mount');
      return;
    }
    // Reducir DPR a 1 para mejor performance
    const dpr = 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    const ctx = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
      willReadFrequently: false
    });
    if (!ctx) {
      console.error('[BV] Failed to get 2D context');
      return;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.textBaseline = 'alphabetic';
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'medium';
    console.log('[BV] Canvas mounted',
      'logical:', width + 'x' + height,
      'backing:', canvas.width + 'x' + canvas.height,
      'dpr:', dpr);
  }, [width, height]);

  // Font loading with timeout fallback.
  // If fonts haven't resolved in 1500ms, proceed anyway — fallback fonts
  // (Times New Roman / ui-monospace) render fine and we shouldn't gate forever.
  React.useEffect(() => {
    let cancelled = false;
    let settled = false;
    const finish = (label) => {
      if (cancelled || settled) return;
      settled = true;
      console.log('[BV] Fonts ready (' + label + ')');
      setFontsReady(true);
    };

    Promise.all([
      document.fonts.load('900 200px "Playfair Display"'),
      document.fonts.load('500 italic 60px "Playfair Display"'),
      document.fonts.load('500 16px "JetBrains Mono"'),
    ]).then(() => finish('document.fonts'))
      .catch((err) => {
        console.warn('[BV] Font load error, proceeding anyway:', err);
        finish('error fallback');
      });

    const timeoutId = setTimeout(() => finish('timeout 1500ms'), 1500);
    return () => { cancelled = true; clearTimeout(timeoutId); };
  }, []);

  // Per-frame render con throttle
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !fontsReady) return;
    const ctx = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true
    });
    const dpr = 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Clear w/ pure black base - optimizado
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    if (firstFrameRef.current) {
      console.log('[BV] First frame rendered. Elapsed since mount:',
        Math.round(performance.now() - mountTimeRef.current) + 'ms',
        'time=' + time.toFixed(3));
      firstFrameRef.current = false;
    }

    if (render) {
      try {
        render(ctx, time, width, height);
      } catch (err) {
        console.error('[BV] Render error at t=' + time.toFixed(3) + ':', err);
        if (err && err.stack) console.error('[BV] Stack:', err.stack);
        // Unmistakable error indicator — full red flash + diagnostic text
        ctx.fillStyle = 'rgba(255,107,107,0.85)';
        ctx.fillRect(0, 0, width, height);
        ctx.font = '700 56px ui-monospace, monospace';
        ctx.fillStyle = '#fff';
        ctx.textBaseline = 'top';
        ctx.fillText('RENDER ERROR', 80, 80);
        ctx.font = '500 22px ui-monospace, monospace';
        ctx.fillText('t=' + time.toFixed(3) + 's', 80, 160);
        ctx.fillText((err && err.message) || String(err) || 'unknown', 80, 200);
        if (err && err.stack) {
          const lines = String(err.stack).split('\n').slice(0, 6);
          ctx.font = '500 16px ui-monospace, monospace';
          lines.forEach((ln, i) => ctx.fillText(ln, 80, 260 + i * 24));
        }
      }
    }
  });

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, display: 'block' }} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Text ledger — track bounding boxes drawn this frame to detect overlaps.
// ─────────────────────────────────────────────────────────────────────────────
let _textLedger = [];

function beginFrame(ctx) {
  _textLedger = [];
}

function recordTextBox(box) {
  _textLedger.push(box);
}

function rectsOverlap(a, b, pad = 0) {
  return !(a.x + a.w + pad < b.x ||
           b.x + b.w + pad < a.x ||
           a.y + a.h + pad < b.y ||
           b.y + b.h + pad < a.y);
}

function wouldOverlap(box, pad = 8) {
  for (const b of _textLedger) {
    if (rectsOverlap(box, b, pad)) return b;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Procedural noise tile + drift
// ─────────────────────────────────────────────────────────────────────────────
let _noiseCache = null;
function getNoiseTile() {
  if (_noiseCache) return _noiseCache;
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const cx = c.getContext('2d');
  const img = cx.createImageData(256, 256);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = Math.floor(120 + Math.random() * 135);
    d[i] = d[i + 1] = d[i + 2] = v;
    d[i + 3] = 255;
  }
  cx.putImageData(img, 0, 0);
  _noiseCache = c;
  return c;
}

function drawGrain(ctx, t, alpha = 0.045) {
  const noise = getNoiseTile();
  const offX = Math.floor(t * 19) % 256;
  const offY = Math.floor(t * 11) % 256;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = 'screen';
  for (let x = -offX; x < 1920; x += 256) {
    for (let y = -offY; y < 1080; y += 256) {
      ctx.drawImage(noise, x, y);
    }
  }
  ctx.restore();
}

function drawVignette(ctx, strength = 0.45) {
  const g = ctx.createRadialGradient(960, 540, 600, 960, 540, 1200);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, `rgba(0,0,0,${strength})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1920, 1080);
}

// Dust particles
const _dustParticles = (() => {
  let s = 0x9d2c5680;
  const r = () => { s = (s * 16807) % 0x7fffffff; return s / 0x7fffffff; };
  const out = [];
  for (let i = 0; i < 22; i++) {
    out.push({
      x: r() * 1920, y: r() * 1080,
      vx: (r() - 0.5) * 8, vy: (r() - 0.5) * 5,
      depth: 0.25 + r() * 0.75,
      size: 0.7 + r() * 1.6,
      twinkleOffset: r() * 6,
    });
  }
  return out;
})();

function drawDust(ctx, t, mul = 1, color = '#ffffff') {
  ctx.save();
  for (const p of _dustParticles) {
    const x = ((p.x + p.vx * t) % 1920 + 1920) % 1920;
    const y = ((p.y + p.vy * t) % 1080 + 1080) % 1080;
    const tw = 0.65 + 0.35 * Math.sin(t * 1.3 + p.twinkleOffset);
    ctx.globalAlpha = (0.025 + p.depth * 0.06) * tw * mul;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, p.size * (0.5 + p.depth * 0.7), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// Atmospheres — each block gets a distinct mood base.
// All composited via radial + linear gradients on top of pure black.
// ─────────────────────────────────────────────────────────────────────────────
function drawAtmosphereNavy(ctx, t, intensity = 1) {
  // Deep cold dark navy — Block 1 — richer gradient
  const linear = ctx.createLinearGradient(0, 0, 1920, 1080);
  linear.addColorStop(0,    `rgba(18, 28, 52, ${0.92 * intensity})`);
  linear.addColorStop(0.35, `rgba(12, 18, 34, ${0.78 * intensity})`);
  linear.addColorStop(0.65, `rgba(6, 10, 20, ${0.68 * intensity})`);
  linear.addColorStop(1,    `rgba(2, 4, 10, ${0.55 * intensity})`);
  ctx.fillStyle = linear;
  ctx.fillRect(0, 0, 1920, 1080);
  // Left-anchored radial cool light with subtle breathing
  const breath = 1 + Math.sin(t * 0.7) * 0.08;
  const rad = ctx.createRadialGradient(320, 520, 0, 320, 520, 1200 * breath);
  rad.addColorStop(0,    `rgba(35, 70, 135, ${0.28 * intensity * breath})`);
  rad.addColorStop(0.40, `rgba(22, 48, 100, ${0.15 * intensity})`);
  rad.addColorStop(0.75, `rgba(12, 25, 60, ${0.06 * intensity})`);
  rad.addColorStop(1,    'rgba(0,0,0,0)');
  ctx.fillStyle = rad;
  ctx.fillRect(0, 0, 1920, 1080);
}

function drawAtmosphereTeal(ctx, t, intensity = 1) {
  // Deep teal w/ blue keypoint glow — Block 3
  const linear = ctx.createLinearGradient(0, 0, 1920, 1080);
  linear.addColorStop(0,    `rgba(8, 28, 36, ${0.92 * intensity})`);
  linear.addColorStop(0.55, `rgba(6, 18, 26, ${0.75 * intensity})`);
  linear.addColorStop(1,    `rgba(4, 10, 18, ${0.62 * intensity})`);
  ctx.fillStyle = linear;
  ctx.fillRect(0, 0, 1920, 1080);
  // Center-right blue glow (where the hand keypoints live)
  const breath = 1 + Math.sin(t * 0.9) * 0.10;
  const rad = ctx.createRadialGradient(1280, 540, 0, 1280, 540, 950);
  rad.addColorStop(0,    `rgba(40, 110, 220, ${0.30 * intensity * breath})`);
  rad.addColorStop(0.45, `rgba(30, 80, 180, ${0.14 * intensity * breath})`);
  rad.addColorStop(1,    'rgba(0,0,0,0)');
  ctx.fillStyle = rad;
  ctx.fillRect(0, 0, 1920, 1080);
}

function drawAtmosphereAmber(ctx, t, intensity = 1) {
  // Very dark warm amber — Block 4
  const linear = ctx.createLinearGradient(0, 0, 1920, 1080);
  linear.addColorStop(0,    `rgba(40, 22, 8, ${0.78 * intensity})`);
  linear.addColorStop(0.55, `rgba(22, 14, 6, ${0.62 * intensity})`);
  linear.addColorStop(1,    `rgba(10, 6, 4, ${0.5 * intensity})`);
  ctx.fillStyle = linear;
  ctx.fillRect(0, 0, 1920, 1080);
  const rad = ctx.createRadialGradient(1380, 540, 0, 1380, 540, 1050);
  rad.addColorStop(0,    `rgba(140, 80, 30, ${0.18 * intensity})`);
  rad.addColorStop(0.45, `rgba(90, 50, 20, ${0.08 * intensity})`);
  rad.addColorStop(1,    'rgba(0,0,0,0)');
  ctx.fillStyle = rad;
  ctx.fillRect(0, 0, 1920, 1080);
}

function drawAtmosphereDesat(ctx, t, intensity = 1) {
  // Left half desat grey, right side sharp black — Block 5 Beat 1
  const linear = ctx.createLinearGradient(0, 0, 1920, 0);
  linear.addColorStop(0,    `rgba(28, 32, 38, ${0.95 * intensity})`);
  linear.addColorStop(0.45, `rgba(22, 24, 28, ${0.85 * intensity})`);
  linear.addColorStop(0.78, `rgba(6, 7, 9, ${0.6 * intensity})`);
  linear.addColorStop(1,    'rgba(0,0,0,0)');
  ctx.fillStyle = linear;
  ctx.fillRect(0, 0, 1920, 1080);
}

function drawAtmosphereIndigo(ctx, t, intensity = 1) {
  // Deep indigo with radial pulse anchor — Block 6
  const linear = ctx.createLinearGradient(0, 0, 0, 1080);
  linear.addColorStop(0,    `rgba(14, 18, 42, ${0.88 * intensity})`);
  linear.addColorStop(0.55, `rgba(10, 12, 30, ${0.72 * intensity})`);
  linear.addColorStop(1,    `rgba(6, 8, 20, ${0.62 * intensity})`);
  ctx.fillStyle = linear;
  ctx.fillRect(0, 0, 1920, 1080);
  // Radial center
  const breath = 1 + Math.sin(t * 1.3) * 0.12;
  const rad = ctx.createRadialGradient(960, 540, 0, 960, 540, 1150);
  rad.addColorStop(0,    `rgba(60, 90, 200, ${0.18 * intensity * breath})`);
  rad.addColorStop(0.5,  `rgba(40, 60, 160, ${0.08 * intensity * breath})`);
  rad.addColorStop(1,    'rgba(0,0,0,0)');
  ctx.fillStyle = rad;
  ctx.fillRect(0, 0, 1920, 1080);
}

// Legacy names so older code paths still work
function drawAtmosphereCold(ctx, t, intensity = 1) { drawAtmosphereNavy(ctx, t, intensity); }
function drawAtmosphereWarm(ctx, t, intensity = 1) { drawAtmosphereAmber(ctx, t, intensity); }
function drawBaseAtmosphere(ctx, t) { drawAtmosphereNavy(ctx, t, 1); }

// Accent wash anchored to a point
function drawAccentWash(ctx, t, {
  cx, cy, radius = 900,
  color = [60, 130, 220],
  baseAlpha = 0.16,
  breathSpeed = 0.8, breathAmount = 0.12,
  flareAt = null, flareDur = 0.5, flareMul = 1.6,
}) {
  const breath = 1 + Math.sin(t * breathSpeed) * breathAmount;
  let flare = 1;
  if (flareAt != null && t >= flareAt && t < flareAt + flareDur) {
    const ft = (t - flareAt) / flareDur;
    flare = 1 + (flareMul - 1) * (1 - Easing.easeOutCubic(ft));
  }
  const a = baseAlpha * breath * flare;
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  g.addColorStop(0,    `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${a})`);
  g.addColorStop(0.35, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${a * 0.45})`);
  g.addColorStop(1,    `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1920, 1080);
}

function drawBottomBleed(ctx, intensity, color = '#4A9EFF') {
  if (intensity <= 0.001) return;
  const a1 = 0.14 * intensity, a2 = 0.04 * intensity;
  const g = ctx.createLinearGradient(0, 1080, 0, 600);
  g.addColorStop(0,    `rgba(74, 158, 255, ${a1})`);
  g.addColorStop(0.45, `rgba(74, 158, 255, ${a2})`);
  g.addColorStop(1,    'rgba(74, 158, 255, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1920, 1080);
}

// ─────────────────────────────────────────────────────────────────────────────
// Transition primitives
// ─────────────────────────────────────────────────────────────────────────────
function drawScanFlash(ctx, local, scanDur = 0.12, flashDur = 0.08, flashIntensity = 0.95) {
  if (local < 0 || local > scanDur + flashDur + 0.05) return;
  if (local < scanDur) {
    const t = local / scanDur;
    const eased = Easing.easeInQuad(t);
    const yLead = eased * 1080;
    const trail = [
      { dy:   0, alpha: 1.00, h: 4 },
      { dy: -10, alpha: 0.55, h: 5 },
      { dy: -22, alpha: 0.30, h: 7 },
      { dy: -40, alpha: 0.15, h: 11 },
      { dy: -70, alpha: 0.07, h: 16 },
    ];
    for (const seg of trail) {
      const y = yLead + seg.dy;
      if (y < -seg.h || y > 1080 + seg.h) continue;
      const bloomH = seg.h * 5;
      const g = ctx.createLinearGradient(0, y - bloomH, 0, y + bloomH);
      g.addColorStop(0,   'rgba(255,255,255,0)');
      g.addColorStop(0.5, `rgba(255,255,255,${seg.alpha * 0.65})`);
      g.addColorStop(1,   'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, y - bloomH, 1920, bloomH * 2);
      ctx.fillStyle = `rgba(255,255,255,${seg.alpha})`;
      ctx.fillRect(0, y - seg.h / 2, 1920, seg.h);
    }
  }
  if (local >= scanDur && local < scanDur + flashDur) {
    const t = (local - scanDur) / flashDur;
    const a = flashIntensity * (1 - Easing.easeOutCubic(t));
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.fillRect(0, 0, 1920, 1080);
  }
}

// Color flash — momentary screen-wide tint and bleed.
function drawColorFlash(ctx, local, dur = 0.18, color = 'rgba(74,158,255,0.8)') {
  if (local < 0 || local > dur) return;
  const t = local / dur;
  const a = (1 - Easing.easeOutCubic(t));
  ctx.fillStyle = color.replace(/[\d.]+\)$/, `${a})`);
  ctx.fillRect(0, 0, 1920, 1080);
}

// Radial wipe — black circle expands from center.
function drawRadialWipe(ctx, local, dur = 0.35, fromCenter = true) {
  if (local < 0 || local > dur + 0.05) return;
  const t = clamp(local / dur, 0, 1);
  const eased = Easing.easeInOutCubic(t);
  if (fromCenter) {
    // Black fills outward — leaves an expanding black circle.
    const r = eased * 1300;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(960, 540, r, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Black recedes inward — reveals new content from edges.
    const r = (1 - eased) * 1300;
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.rect(0, 0, 1920, 1080);
    ctx.arc(960, 540, r, 0, Math.PI * 2, true);
    ctx.fill('evenodd');
    ctx.restore();
  }
}

// Vertical wipe — horizontal bar of color sweeps top→bottom; everything above clears to black.
function drawVerticalWipe(ctx, local, dur = 0.32, color = '#4A9EFF') {
  if (local < 0 || local > dur + 0.10) return;
  const t = clamp(local / dur, 0, 1);
  const eased = Easing.easeInOutCubic(t);
  const y = eased * 1080;
  // Black above the bar wipes out old content
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 1920, y);
  // Bright bar
  const barH = 6;
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = 26;
  ctx.fillStyle = color;
  ctx.fillRect(0, y - barH / 2, 1920, barH);
  // Vertical bloom around the bar
  const bloomH = 60;
  const ga = ctx.createLinearGradient(0, y - bloomH, 0, y);
  ga.addColorStop(0, 'rgba(74,158,255,0)');
  ga.addColorStop(1, 'rgba(74,158,255,0.32)');
  ctx.fillStyle = ga;
  ctx.fillRect(0, y - bloomH, 1920, bloomH);
  const gb = ctx.createLinearGradient(0, y, 0, y + bloomH);
  gb.addColorStop(0, 'rgba(74,158,255,0.32)');
  gb.addColorStop(1, 'rgba(74,158,255,0)');
  ctx.fillStyle = gb;
  ctx.fillRect(0, y, 1920, bloomH);
  ctx.restore();
}

// Letterbox — black bars compress top + bottom toward center then release.
function drawLetterbox(ctx, local, dur = 0.30) {
  if (local < 0 || local > dur + 0.05) return;
  const t = clamp(local / dur, 0, 1);
  // Triangle wave: 0 → 1 (close) → 0 (open)
  const phase = t < 0.5 ? Easing.easeInOutCubic(t * 2) : Easing.easeInOutCubic((1 - t) * 2);
  const barH = phase * 380;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 1920, barH);
  ctx.fillRect(0, 1080 - barH, 1920, barH);
  // Bright slim hairlines on the edges of each bar
  const lineY1 = barH;
  const lineY2 = 1080 - barH;
  if (barH > 4) {
    ctx.save();
    ctx.shadowColor = '#4A9EFF';
    ctx.shadowBlur = 16;
    ctx.fillStyle = '#4A9EFF';
    ctx.globalAlpha = phase;
    ctx.fillRect(0, lineY1 - 1, 1920, 1);
    ctx.fillRect(0, lineY2, 1920, 1);
    ctx.restore();
  }
}

// Geometry collapse — scatter rectangles flying outward from center as old block ends.
function drawGeometryCollapse(ctx, local, dur = 0.45) {
  if (local < 0 || local > dur) return;
  const t = local / dur;
  // 24 small particle "shards" expanding outward
  const eased = Easing.easeOutCubic(t);
  ctx.save();
  for (let i = 0; i < 28; i++) {
    const angle = (i / 28) * Math.PI * 2 + (i % 2 ? 0.18 : -0.18);
    const dist = eased * (480 + (i % 5) * 90);
    const x = 960 + Math.cos(angle) * dist;
    const y = 540 + Math.sin(angle) * dist;
    const sz = 2 + (i % 4);
    ctx.globalAlpha = (1 - t) * 0.85;
    ctx.shadowColor = '#4A9EFF';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#4A9EFF';
    ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
  }
  // Central flash on detonation
  if (t < 0.2) {
    ctx.globalAlpha = (1 - t / 0.2) * 0.6;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 1920, 1080);
  }
  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// Glowing hairline
// ─────────────────────────────────────────────────────────────────────────────
function drawGlowLine(ctx, t, {
  x, y, length, thickness = 1,
  inAt = 0, drawDur = 0.30,
  color = '#4A9EFF',
  outAt = null, outDur = 0.30,
  origin = 'left',
  glow = 8,
}) {
  if (t < inAt) return;
  const tIn = clamp((t - inAt) / drawDur, 0, 1);
  const draw = Easing.easeOutExpo(tIn);
  let opacity = 1;
  if (outAt != null && t > outAt) opacity = 1 - clamp((t - outAt) / outDur, 0, 1);
  if (opacity <= 0.001) return;
  const currentLen = length * draw;
  const sx = origin === 'right' ? x + length - currentLen : x;
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.shadowColor = color;
  ctx.shadowBlur = glow;
  ctx.fillStyle = color;
  ctx.fillRect(sx, y, currentLen, thickness);
  ctx.shadowBlur = glow * 0.4;
  ctx.fillRect(sx, y, currentLen, thickness);
  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// Text drawing — slam state + ledger-recording draw fns
// ─────────────────────────────────────────────────────────────────────────────
function slamInState(t, { inAt, dur = 0.32, offsetY = 22, fromScale = 0.96, blurPx = 3,
                          outAt = null, outDur = 0.22 }) {
  if (t < inAt) return null;
  const tIn = clamp((t - inAt) / dur, 0, 1);
  const easedIn = Easing.easeOutBack(tIn);
  const fadeT = clamp((t - inAt) / (dur * 0.45), 0, 1);
  let opacity = fadeT;
  let ty = (1 - easedIn) * offsetY;
  let scale = fromScale + (1 - fromScale) * easedIn;
  let blur = (1 - clamp(tIn * 1.8, 0, 1)) * blurPx;
  if (outAt != null && t > outAt) {
    opacity = Math.min(opacity, 1 - Easing.easeInQuad(clamp((t - outAt) / outDur, 0, 1)));
  }
  return { opacity, ty, scale, blur };
}

function popInState(t, { inAt, dur = 0.10, fromScale = 1.20, outAt = null, outDur = 0.18 }) {
  if (t < inAt) return null;
  const tt = clamp((t - inAt) / dur, 0, 1);
  const eased = Easing.easeOutCubic(tt);
  const scale = fromScale + (1 - fromScale) * eased;
  const opIn = clamp((t - inAt) / Math.max(dur * 0.25, 0.02), 0, 1);
  let opacity = opIn;
  if (outAt != null && t > outAt) {
    opacity = Math.min(opacity, 1 - Easing.easeInQuad(clamp((t - outAt) / outDur, 0, 1)));
  }
  return { opacity, scale };
}

function slamFromAboveState(t, { inAt, dur = 0.42, fromY = -110, overshootY = 10,
                                  outAt = null, outDur = 0.22 }) {
  if (t < inAt) return null;
  const tt = clamp((t - inAt) / dur, 0, 1);
  let ty;
  if (tt < 0.70) {
    const lt = tt / 0.70;
    ty = fromY + (overshootY - fromY) * Easing.easeOutCubic(lt);
  } else {
    const lt = (tt - 0.70) / 0.30;
    ty = overshootY + (0 - overshootY) * Easing.easeOutCubic(lt);
  }
  let opacity = clamp((t - inAt) / (dur * 0.15), 0, 1);
  if (outAt != null && t > outAt) {
    opacity = Math.min(opacity, 1 - Easing.easeInQuad(clamp((t - outAt) / outDur, 0, 1)));
  }
  return { opacity, ty };
}

function countUpValue(t, { inAt, dur = 0.45, from = 0, to = 100, decimals = 0,
                            punchScale = 1.045, punchDur = 0.20,
                            ease = Easing.easeOutExpo }) {
  if (t < inAt) return null;
  const tCount = clamp((t - inAt) / dur, 0, 1);
  const eased = ease(tCount);
  const value = from + (to - from) * eased;
  const display = value.toFixed(decimals);
  let scale = 1;
  if (tCount >= 1) {
    const tPunch = clamp((t - inAt - dur) / punchDur, 0, 1);
    scale = 1 + (punchScale - 1) * (1 - Easing.easeOutCubic(tPunch));
  }
  return { display, scale };
}

// drawTextBlock — bedrock primitive. Records its bbox in the per-frame ledger.
function drawTextBlock(ctx, text, {
  x, y, font, color = '#ffffff',
  letterSpacing = 0,
  align = 'left', originY = 'top',
  opacity = 1, scale = 1, blur = 0, translateY = 0,
  punchScale = 1,
  noRecord = false,
}) {
  if (opacity <= 0.001 || !text) return null;

  ctx.save();
  ctx.font = font;
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${letterSpacing}px`;
  ctx.textBaseline = originY;
  ctx.textAlign = align;

  // Measure
  const m = ctx.measureText(text);
  const w = m.width;
  // Parse font size from font string for height estimate
  const sizeMatch = font.match(/(\d+(?:\.\d+)?)px/);
  const fSize = sizeMatch ? parseFloat(sizeMatch[1]) : 24;
  const h = fSize * 1.10;
  let bx = x;
  if (align === 'center') bx = x - w / 2;
  else if (align === 'right') bx = x - w;
  const by = originY === 'top' ? y : (y - fSize);
  const bbox = { x: bx, y: by + translateY, w, h };

  if (blur > 0.05) ctx.filter = `blur(${blur}px)`;
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;

  const totalScale = scale * punchScale;
  if (totalScale !== 1 || translateY !== 0) {
    ctx.translate(x, y + translateY);
    ctx.scale(totalScale, totalScale);
    ctx.fillText(text, 0, 0);
  } else {
    ctx.fillText(text, x, y);
  }
  ctx.restore();

  if (!noRecord && opacity > 0.15) recordTextBox(bbox);
  return bbox;
}

function drawTextLetteredT(ctx, t, text, {
  x, y, font, color = '#ffffff',
  letterSpacing = 0,
  align = 'left',
  inAt, totalDur, perCharOpacityDur = null,
  outAt = null, outDur = 0.3,
  originY = 'top',
}) {
  if (!text || t < inAt) return;
  ctx.save();
  ctx.font = font;
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${letterSpacing}px`;
  ctx.textBaseline = originY;
  ctx.fillStyle = color;

  const chars = Array.from(text);
  const perChar = totalDur / Math.max(1, chars.length);
  const charFadeDur = perCharOpacityDur != null ? perCharOpacityDur : perChar * 1.4;

  const widths = chars.map(c => ctx.measureText(c).width + (c === ' ' ? 0 : letterSpacing));
  const total = widths.reduce((a, b) => a + b, 0);
  let startX = x;
  if (align === 'right')  startX = x - total;
  if (align === 'center') startX = x - total / 2;

  let containerOp = 1;
  if (outAt != null && t > outAt) {
    containerOp = 1 - Easing.easeInOutCubic(clamp((t - outAt) / outDur, 0, 1));
  }
  if (containerOp <= 0.001) { ctx.restore(); return; }

  // Record bbox for the full string area
  const sizeMatch = font.match(/(\d+(?:\.\d+)?)px/);
  const fSize = sizeMatch ? parseFloat(sizeMatch[1]) : 24;
  const h = fSize * 1.10;
  recordTextBox({ x: startX, y: originY === 'top' ? y : (y - fSize), w: total, h });

  let cx = startX;
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (ch === ' ') { cx += widths[i]; continue; }
    const charT = clamp((t - (inAt + i * perChar)) / charFadeDur, 0, 1);
    const op = Easing.easeOutCubic(charT) * containerOp;
    if (op > 0.001) {
      ctx.globalAlpha = op;
      ctx.fillText(ch, cx, y);
    }
    cx += widths[i];
  }
  ctx.restore();
}

// Ghost trail behind a text element (drawn behind, then real text on top)
function drawGhostTrail(ctx, t, text, opts, ghost = { at: 0, dur: 0.40,
                                                       offsetY: 8, extraScale: 0.06,
                                                       blur: 12, alpha: 0.45 }) {
  const dt = t - ghost.at;
  if (dt < 0 || dt > ghost.dur) return;
  const fade = 1 - Easing.easeOutCubic(dt / ghost.dur);
  drawTextBlock(ctx, text, {
    ...opts,
    color: opts.color || '#ffffff',
    opacity: (opts.opacity || 1) * ghost.alpha * fade,
    scale: (opts.scale || 1) * (1 + ghost.extraScale),
    translateY: (opts.translateY || 0) + ghost.offsetY,
    blur: ghost.blur,
    punchScale: 1,
    noRecord: true,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Section chrome
// ─────────────────────────────────────────────────────────────────────────────
function drawSectionLabel(ctx, t, text, { inAt, outAt, x = 96, y = 86 }) {
  // Función deshabilitada - no dibujar section labels
  return;
}

// ─────────────────────────────────────────────────────────────────────────────
// CINEMATIC EFFECTS
// ─────────────────────────────────────────────────────────────────────────────

// Chromatic aberration effect for hero numbers
function drawChromaticText(ctx, text, { x, y, font, opacity = 1, aberration = 2 }) {
  ctx.save();
  ctx.font = font;
  if ('letterSpacing' in ctx) ctx.letterSpacing = '-12.8px';
  ctx.textBaseline = 'top';

  // Red channel
  ctx.globalAlpha = opacity * 0.5;
  ctx.fillStyle = '#ff0040';
  ctx.globalCompositeOperation = 'screen';
  ctx.fillText(text, x - aberration, y);

  // Blue channel
  ctx.fillStyle = '#00a0ff';
  ctx.fillText(text, x + aberration, y);

  // Main white channel
  ctx.globalAlpha = opacity;
  ctx.fillStyle = '#ffffff';
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillText(text, x, y);
  ctx.restore();
}

// Lens flare effect
function drawLensFlare(ctx, t, { x, y, inAt, dur = 0.8, intensity = 1 }) {
  const dt = t - inAt;
  if (dt < 0 || dt > dur) return;
  const progress = dt / dur;
  const opacity = Math.sin(progress * Math.PI) * intensity;

  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  // Core bright spot
  const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, 80);
  coreGrad.addColorStop(0, `rgba(100, 200, 255, ${opacity * 0.8})`);
  coreGrad.addColorStop(0.3, `rgba(100, 200, 255, ${opacity * 0.3})`);
  coreGrad.addColorStop(1, 'rgba(100, 200, 255, 0)');
  ctx.fillStyle = coreGrad;
  ctx.fillRect(x - 80, y - 80, 160, 160);

  // Streaks
  ctx.globalAlpha = opacity * 0.4;
  ctx.fillStyle = 'rgba(100, 200, 255, 0.3)';
  ctx.fillRect(x - 200, y - 1, 400, 2);
  ctx.fillRect(x - 1, y - 200, 2, 400);

  ctx.restore();
}

// Light leak effect
function drawLightLeak(ctx, t, { inAt, dur = 1.2, side = 'left' }) {
  const dt = t - inAt;
  if (dt < 0 || dt > dur) return;
  const progress = Easing.easeOutQuad(dt / dur);
  const opacity = Math.sin(progress * Math.PI) * 0.15;

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const grad = side === 'left'
    ? ctx.createLinearGradient(0, 0, 400, 0)
    : ctx.createLinearGradient(1920, 0, 1520, 0);

  grad.addColorStop(0, `rgba(255, 180, 100, ${opacity})`);
  grad.addColorStop(0.5, `rgba(100, 150, 255, ${opacity * 0.3})`);
  grad.addColorStop(1, 'rgba(100, 150, 255, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1920, 1080);
  ctx.restore();
}

// Glitch effect - simplified to avoid canvas self-reference issues
function drawGlitchEffect(ctx, t, { inAt, dur = 0.15, intensity = 10 }) {
  const dt = t - inAt;
  if (dt < 0 || dt > dur) return;

  const glitchAmount = intensity * (1 - dt / dur);
  const sliceCount = 8;

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  for (let i = 0; i < sliceCount; i++) {
    const y = (1080 / sliceCount) * i;
    const height = 1080 / sliceCount;
    const offset = (Math.random() - 0.5) * glitchAmount;

    // Draw colored glitch lines instead of canvas copy
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = i % 2 === 0 ? '#ff0040' : '#00a0ff';
    ctx.fillRect(0, y + Math.random() * height, 1920, 2);

    if (Math.random() > 0.7) {
      ctx.fillRect(offset, y, 1920, 1);
    }
  }
  ctx.restore();
}

// Pulse wave from center
function drawPulseWave(ctx, t, { cx, cy, inAt, speed = 1, color = '#4A9EFF', maxRadius = 600 }) {
  if (!ctx || typeof t !== 'number') return;
  const dt = t - inAt;
  if (dt < 0) return;

  const numWaves = 3;
  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  try {
    for (let i = 0; i < numWaves; i++) {
      const waveTime = (dt * speed - i * 0.3) % 2;
      if (waveTime < 0 || waveTime > 1) continue;

      const radius = Easing.easeOutCubic(waveTime) * maxRadius;
      const opacity = (1 - waveTime) * 0.15;

      ctx.strokeStyle = color;
      ctx.globalAlpha = opacity;
      ctx.lineWidth = 2;
      ctx.shadowColor = color;
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  } catch (e) {
    console.warn('[BV] drawPulseWave error:', e);
  }
  ctx.restore();
}

// iOS Notification - TAP & EXPAND TO FULLSCREEN (classic iOS transition)
function drawIOSNotification(ctx, t, { inAt, stayDur = 2.5, exitDur = 0.2 }) {
  const dt = t - inAt;
  if (dt < 0) return;

  // Animation timeline
  const entryDur = 0.3;
  const holdDur = 1.5; // Hold before tap
  const tapDownDur = 0.08; // Scale down
  const tapUpDur = 0.08; // Bounce back
  const expandDur = 0.4; // Expand to fullscreen
  const fadeDur = 0.3; // Fade to next scene

  const tapStart = entryDur + holdDur;
  const expandStart = tapStart + tapDownDur + tapUpDur;
  const fadeStart = expandStart + expandDur;
  const totalDur = fadeStart + fadeDur;

  if (dt > totalDur) return;

  let translateY = 0;
  let opacity = 1;
  let scale = 1;
  let expandProgress = 0;
  let fadeProgress = 0;

  // Entry spring animation
  if (dt < entryDur) {
    const t = dt / entryDur;
    const spring = Easing.easeOutBack(t);
    translateY = -200 + spring * 200;
    opacity = t;
  }
  // Tap down (scale to 97%)
  else if (dt >= tapStart && dt < tapStart + tapDownDur) {
    const tapT = (dt - tapStart) / tapDownDur;
    scale = 1 - Easing.easeOutQuad(tapT) * 0.03;
  }
  // Bounce back to 100%
  else if (dt >= tapStart + tapDownDur && dt < expandStart) {
    const bounceT = (dt - tapStart - tapDownDur) / tapUpDur;
    scale = 0.97 + Easing.easeOutBack(bounceT) * 0.03;
  }
  // Expand to fullscreen
  else if (dt >= expandStart && dt < fadeStart) {
    const expandT = (dt - expandStart) / expandDur;
    expandProgress = Easing.easeOutCubic(expandT);
  }
  // Fade to next scene
  else if (dt >= fadeStart) {
    expandProgress = 1;
    fadeProgress = (dt - fadeStart) / fadeDur;
  }

  ctx.save();

  // FULL-SCREEN DARK OVERLAY (fades as we expand)
  const overlayOpacity = (1 - expandProgress) * 0.6;
  ctx.globalAlpha = opacity * overlayOpacity;
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 1920, 1080);

  // EXPANDING WHITE FILL - grows from notification to fullscreen
  if (expandProgress > 0) {
    const notifW = 680;
    const notifH = 160;
    const centerX = 960;
    const centerY = 540 + translateY;

    // Interpolate from notification size to fullscreen
    const currentW = notifW + (1920 - notifW) * expandProgress;
    const currentH = notifH + (1080 - notifH) * expandProgress;
    const currentX = centerX - currentW / 2;
    const currentY = centerY - currentH / 2;

    // Fade from dark notification to bright white
    const whiteness = expandProgress * 255;
    ctx.globalAlpha = opacity;
    ctx.fillStyle = `rgb(${whiteness}, ${whiteness}, ${whiteness})`;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 40 * (1 - expandProgress);
    ctx.beginPath();
    ctx.roundRect(currentX, currentY, currentW, currentH, 24 * (1 - expandProgress));
    ctx.fill();
    ctx.shadowBlur = 0;

    // Fade notification content as we expand
    const contentOpacity = 1 - expandProgress;
    if (contentOpacity > 0.01) {
      drawNotificationContent(ctx, centerX - notifW / 2, centerY - notifH / 2, notifW, notifH, contentOpacity);
    }
  } else {
    // Normal notification state
    const notifW = 680;
    const notifH = 160;
    const notifX = (1920 - notifW * scale) / 2;
    const notifY = (1080 - notifH * scale) / 2 + translateY;

    ctx.globalAlpha = opacity;
    ctx.save();
    ctx.translate(notifX + (notifW * scale) / 2, notifY + (notifH * scale) / 2);
    ctx.scale(scale, scale);
    ctx.translate(-notifW / 2, -notifH / 2);

    // DROP SHADOW
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 60;
    ctx.shadowOffsetY = 20;

    // Dark iOS background
    ctx.fillStyle = 'rgba(28, 28, 30, 0.95)';
    ctx.beginPath();
    ctx.roundRect(0, 0, notifW, notifH, 24);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();

    drawNotificationContent(ctx, 0, 0, notifW, notifH, 1);

    ctx.restore();
  }

  // Final fade to next scene (white dissolves)
  if (fadeProgress > 0) {
    ctx.globalAlpha = 1 - fadeProgress;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1920, 1080);
  }

  ctx.restore();
}

// Helper: Draw notification content (icon + text)
function drawNotificationContent(ctx, x, y, w, h, opacity) {
  ctx.save();
  ctx.globalAlpha = opacity;

  // Gmail icon - 60x60px simplified classic design
  const iconX = x + 28;
  const iconY = y + 28;
  const iconSize = 60;

  // White background
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.roundRect(iconX, iconY, iconSize, iconSize, 14);
  ctx.fill();
  ctx.restore();

  // Gmail logo - simplified envelope design
  ctx.save();
  ctx.translate(iconX + iconSize / 2, iconY + iconSize / 2);

  const logoScale = 0.6;
  ctx.scale(logoScale, logoScale);

  // Red envelope body
  ctx.fillStyle = '#EA4335';
  ctx.beginPath();
  ctx.moveTo(-28, -12);
  ctx.lineTo(-28, 18);
  ctx.lineTo(28, 18);
  ctx.lineTo(28, -12);
  ctx.closePath();
  ctx.fill();

  // White fold - top part
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(-28, -12);
  ctx.lineTo(0, 8);
  ctx.lineTo(28, -12);
  ctx.lineTo(28, -16);
  ctx.lineTo(0, 4);
  ctx.lineTo(-28, -16);
  ctx.closePath();
  ctx.fill();

  // Blue fold shadow - left
  ctx.fillStyle = '#4285F4';
  ctx.beginPath();
  ctx.moveTo(-28, -12);
  ctx.lineTo(0, 8);
  ctx.lineTo(0, 4);
  ctx.lineTo(-28, -16);
  ctx.closePath();
  ctx.fill();

  // Blue fold shadow - right
  ctx.fillStyle = '#34A853';
  ctx.beginPath();
  ctx.moveTo(28, -12);
  ctx.lineTo(0, 8);
  ctx.lineTo(0, 4);
  ctx.lineTo(28, -16);
  ctx.closePath();
  ctx.fill();

  // Yellow accent on top
  ctx.fillStyle = '#FBBC04';
  ctx.beginPath();
  ctx.moveTo(-28, -16);
  ctx.lineTo(0, 4);
  ctx.lineTo(28, -16);
  ctx.lineTo(0, -24);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  // Subtle border around icon
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(iconX, iconY, iconSize, iconSize, 14);
  ctx.stroke();

  // Blue unread dot with stronger glow
  ctx.fillStyle = '#4A9EFF';
  ctx.shadowColor = '#4A9EFF';
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.arc(iconX + iconSize - 6, iconY + iconSize - 6, 8, 0, Math.PI * 2);
  ctx.fill();

  // Inner white dot for depth
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.beginPath();
  ctx.arc(iconX + iconSize - 6, iconY + iconSize - 6, 3, 0, Math.PI * 2);
  ctx.fill();

  // Text content
  const textX = iconX + iconSize + 24;
  const textStartY = y + 32;

  // App + timestamp - 18px
  ctx.font = '500 18px ' + FONT_MONO;
  ctx.fillStyle = '#8E8E93';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillText('Gmail · now', textX, textStartY);

  // Title - 26px bold white
  ctx.font = '700 26px Inter, -apple-system, system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('María D. — Session complete.', textX, textStartY + 28);

  // Body text - 21px grey
  ctx.font = '400 21px Inter, -apple-system, system-ui, sans-serif';
  ctx.fillStyle = '#AEAEB2';
  ctx.fillText('Report ready. All markers within range. ↗', textX, textStartY + 64);

  ctx.restore();
}

// Enhanced dust with depth
function drawEnhancedDust(ctx, t, alpha = 0.3, color = '#9bb6d6') {
  if (!ctx || typeof t !== 'number') return;
  const count = 60;
  ctx.save();
  try {
    for (let i = 0; i < count; i++) {
      const seed = i * 137.508; // Golden angle
      const depth = (seed % 100) / 100; // 0-1 depth
      const size = (1 + depth) * 2.5;
      const speed = (0.5 + depth) * 20;
      const x = ((seed * 73) % 1920);
      const y = ((t * speed + seed * 83) % 1300) - 100;
      const opacity = alpha * (0.3 + depth * 0.7);

      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8 * depth;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  } catch (e) {
    console.warn('[BV] drawEnhancedDust error:', e);
  }
  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// GEOMETRY PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

// Progress arc — clinical recovery index ring
function drawProgressArc(ctx, {
  cx, cy, r, thickness = 12,
  startAngle = -Math.PI / 2, sweep = Math.PI * 2,
  pct,                                // 0..1
  trackColor = 'rgba(255,255,255,0.12)',
  fillColor = '#4A9EFF',
  glow = 16,
}) {
  ctx.save();
  // Track
  ctx.strokeStyle = trackColor;
  ctx.lineWidth = thickness;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx, cy, r, startAngle, startAngle + sweep);
  ctx.stroke();
  // Fill
  ctx.shadowColor = fillColor;
  ctx.shadowBlur = glow;
  ctx.strokeStyle = fillColor;
  ctx.lineWidth = thickness;
  ctx.beginPath();
  ctx.arc(cx, cy, r, startAngle, startAngle + sweep * pct);
  ctx.stroke();
  ctx.restore();
}

// Data bar — horizontal mini bar chart fill
function drawDataBar(ctx, {
  x, y, w, h,
  pct,                                  // 0..1
  trackColor = 'rgba(255,255,255,0.10)',
  fillColor = '#4A9EFF',
  glow = 6,
}) {
  ctx.save();
  ctx.fillStyle = trackColor;
  ctx.fillRect(x, y, w, h);
  ctx.shadowColor = fillColor;
  ctx.shadowBlur = glow;
  ctx.fillStyle = fillColor;
  ctx.fillRect(x, y, w * clamp(pct, 0, 1), h);
  ctx.restore();
}

// Crosshair with ring + tick labels
function drawCrosshair(ctx, {
  cx, cy, ringR = 60, armLen = 28,
  color = '#4A9EFF', alpha = 1,
  label = null,
  pulseT = null,             // 0..1 pulse breath
}) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const breath = pulseT != null ? 1 + Math.sin(pulseT * Math.PI * 2) * 0.10 : 1;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(cx, cy, ringR * breath, 0, Math.PI * 2);
  ctx.stroke();
  // arms
  ctx.beginPath();
  ctx.moveTo(cx - ringR - armLen, cy); ctx.lineTo(cx - ringR + 4, cy);
  ctx.moveTo(cx + ringR - 4, cy);      ctx.lineTo(cx + ringR + armLen, cy);
  ctx.moveTo(cx, cy - ringR - armLen); ctx.lineTo(cx, cy - ringR + 4);
  ctx.moveTo(cx, cy + ringR - 4);      ctx.lineTo(cx, cy + ringR + armLen);
  ctx.stroke();
  if (label) {
    ctx.shadowBlur = 0;
    ctx.font = `500 11px ${MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '2px';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillStyle = color;
    ctx.fillText(label.toUpperCase(), cx + ringR + armLen + 4, cy - 7);
  }
  ctx.restore();
}

// Hand keypoints — procedural 21-point hand constellation with bone connections
const _handKeypoints = [
  // Wrist
  [0.50, 0.95],
  // Thumb (1–4)
  [0.32, 0.88], [0.22, 0.74], [0.16, 0.60], [0.12, 0.46],
  // Index (5–8)
  [0.42, 0.66], [0.42, 0.50], [0.42, 0.37], [0.42, 0.24],
  // Middle (9–12)
  [0.52, 0.66], [0.52, 0.48], [0.52, 0.32], [0.52, 0.16],
  // Ring (13–16)
  [0.62, 0.68], [0.64, 0.52], [0.64, 0.36], [0.64, 0.22],
  // Pinky (17–20)
  [0.72, 0.72], [0.76, 0.60], [0.78, 0.48], [0.80, 0.36],
];
const _handBones = [
  [0,1],[1,2],[2,3],[3,4],
  [0,5],[5,6],[6,7],[7,8],
  [0,9],[9,10],[10,11],[11,12],
  [0,13],[13,14],[14,15],[15,16],
  [0,17],[17,18],[18,19],[19,20],
];

function drawHandKeypoints(ctx, t, {
  cx, cy, size = 320,
  inAt = 0,
  alpha = 1,
  color = '#4A9EFF',
  pointSize = 5,
  showBones = true,
  jitterAmp = 1.5,        // micro-jitter for "live" feel (px)
  revealStaggerDur = 0.45, // how long to stagger point reveals
}) {
  if (t < inAt) return;
  const local = t - inAt;
  // Bounding origin so (cx, cy) is the center of the constellation
  const half = size / 2;
  const ox = cx - half;
  const oy = cy - size * 0.55;  // center vertically by mass

  ctx.save();
  ctx.globalAlpha = alpha;

  // Bones — drawn first, behind points
  if (showBones) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.4;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    for (const [a, b] of _handBones) {
      const aRev = clamp((local - a * (revealStaggerDur / 21)) / 0.10, 0, 1);
      const bRev = clamp((local - b * (revealStaggerDur / 21)) / 0.10, 0, 1);
      const op = Math.min(aRev, bRev);
      if (op <= 0.001) continue;
      const pa = _handKeypoints[a];
      const pb = _handKeypoints[b];
      const jax = Math.sin(t * 2.0 + a * 0.7) * jitterAmp;
      const jay = Math.cos(t * 1.8 + a * 0.9) * jitterAmp;
      const jbx = Math.sin(t * 2.1 + b * 0.6) * jitterAmp;
      const jby = Math.cos(t * 1.7 + b * 1.0) * jitterAmp;
      ctx.globalAlpha = alpha * op * 0.7;
      ctx.beginPath();
      ctx.moveTo(ox + pa[0] * size + jax, oy + pa[1] * size + jay);
      ctx.lineTo(ox + pb[0] * size + jbx, oy + pb[1] * size + jby);
      ctx.stroke();
    }
  }

  // Points
  for (let i = 0; i < _handKeypoints.length; i++) {
    const rev = clamp((local - i * (revealStaggerDur / 21)) / 0.16, 0, 1);
    if (rev <= 0.001) continue;
    const p = _handKeypoints[i];
    const jx = Math.sin(t * 2.0 + i * 0.7) * jitterAmp;
    const jy = Math.cos(t * 1.8 + i * 0.9) * jitterAmp;
    const x = ox + p[0] * size + jx;
    const y = oy + p[1] * size + jy;
    const r = pointSize * (0.6 + 0.4 * rev);

    // Outer halo — soft blue radial
    ctx.globalAlpha = alpha * rev * 0.35;
    ctx.shadowColor = color;
    ctx.shadowBlur = 14;
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x, y, r * 1.6, 0, Math.PI * 2); ctx.fill();
    // Core
    ctx.globalAlpha = alpha * rev;
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    // Blue ring
    ctx.shadowBlur = 0;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(x, y, r + 1.5, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.restore();
}

// Face mesh — procedural dot cloud in face oval shape
function drawFaceMesh(ctx, t, {
  cx, cy, w = 280, h = 360,
  inAt = 0, alpha = 1, density = 1.0,
  color = '#4A9EFF',
  jitterAmp = 0.8,
}) {
  if (t < inAt) return;
  const local = t - inAt;
  // Seeded points on an ellipse with some interior
  // We don't want literally 468 — that's heavy. Use ~180 for the look.
  const count = Math.floor(180 * density);
  ctx.save();
  ctx.fillStyle = color;
  for (let i = 0; i < count; i++) {
    // Deterministic-ish polar distribution
    const s = (i * 9301 + 49297) % 233280;
    const u = (s / 233280);
    const s2 = ((i * 1664525) % 233280) / 233280;
    const angle = u * Math.PI * 2;
    const radial = Math.sqrt(s2) * 0.95;       // density toward edge
    const px = cx + Math.cos(angle) * radial * w * 0.5;
    const py = cy + Math.sin(angle) * radial * h * 0.5;
    const jx = Math.sin(t * 1.6 + i) * jitterAmp;
    const jy = Math.cos(t * 1.4 + i * 1.3) * jitterAmp;
    const rev = clamp((local - i * 0.003) / 0.20, 0, 1);
    if (rev <= 0.01) continue;
    ctx.globalAlpha = alpha * rev * (0.35 + 0.45 * (1 - radial));
    ctx.fillRect(px + jx, py + jy, 1.4, 1.4);
  }
  ctx.restore();
}

// Voice waveform — procedural sine + envelope, time-evolving
function drawWaveform(ctx, t, {
  x, y, w, h,
  alpha = 1,
  color = '#4A9EFF',
  amplitude = 0.7,
  speed = 1,
  bars = 0,                 // if > 0, draw as bar histogram
  thickness = 2,
}) {
  ctx.save();
  ctx.globalAlpha = alpha;

  if (bars > 0) {
    const barW = w / bars * 0.65;
    const gap = w / bars * 0.35;
    for (let i = 0; i < bars; i++) {
      const bx = x + i * (barW + gap);
      // Envelope based on combined sinusoids — feels like speech
      const v =
        Math.sin(t * 3 * speed + i * 0.55) * 0.5 +
        Math.sin(t * 7.3 * speed + i * 0.31) * 0.3 +
        Math.sin(t * 1.5 * speed - i * 0.18) * 0.2;
      const a = (Math.abs(v) * 0.55 + 0.15) * amplitude;
      const bh = h * a;
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      ctx.fillRect(bx, y + h - bh, barW, bh);
    }
  } else {
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    const cy = y + h / 2;
    const steps = 200;
    for (let i = 0; i <= steps; i++) {
      const px = x + (i / steps) * w;
      const u = i / steps;
      // Combined sines + envelope
      const env = 0.4 + 0.6 * Math.sin(u * Math.PI);
      const v =
        Math.sin(t * 4 * speed + u * 18) * 0.4 +
        Math.sin(t * 9 * speed + u * 33) * 0.25 +
        Math.sin(t * 1.4 * speed + u * 6) * 0.18;
      const py = cy + v * env * h * 0.45 * amplitude;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  ctx.restore();
}

// Grid section — fragment of graph paper with optional coords on axis ticks
function drawGridSection(ctx, {
  x, y, w, h, cellSize = 40,
  color = 'rgba(74,158,255,0.10)',
  axisLabel = null,
  alpha = 1,
}) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let cx = 0; cx <= w; cx += cellSize) { ctx.moveTo(x + cx, y); ctx.lineTo(x + cx, y + h); }
  for (let cy = 0; cy <= h; cy += cellSize) { ctx.moveTo(x, y + cy); ctx.lineTo(x + w, y + cy); }
  ctx.stroke();
  if (axisLabel) {
    ctx.font = `500 10px ${MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '1.6px';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillStyle = color.replace(/0\.\d+/, '0.55');
    ctx.fillText(axisLabel.toUpperCase(), x + 4, y + 4);
  }
  ctx.restore();
}

// Ring indicator — segmented rotating ring
function drawRingIndicator(ctx, t, {
  cx, cy, r, segments = 16,
  inAt = 0, alpha = 1,
  color = '#4A9EFF',
  thickness = 2,
  rotSpeed = 0.45,
}) {
  if (t < inAt) return;
  const local = t - inAt;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = thickness;
  ctx.shadowColor = color;
  ctx.shadowBlur = 6;
  const rot = local * rotSpeed;
  for (let i = 0; i < segments; i++) {
    const a0 = rot + (i / segments) * Math.PI * 2;
    const a1 = a0 + (Math.PI * 2 / segments) * 0.6;
    ctx.globalAlpha = alpha * (0.25 + 0.75 * (i / segments));
    ctx.beginPath();
    ctx.arc(cx, cy, r, a0, a1);
    ctx.stroke();
  }
  ctx.restore();
}

// Clinical frame rect (traced edges)
function drawClinicalFrame(ctx, t, {
  vpX, vpY, vpW, vpH,
  inAt = 0, totalDur = 0.42, trace = true,
  color = '#4A9EFF', strokeWidth = 1,
  outAt = null, outDur = 0.20,
}) {
  if (t < inAt) return;
  const local = t - inAt;
  const segDur = totalDur / 4;
  let topP, rightP, bottomP, leftP;
  if (!trace) {
    const tt = clamp(local / 0.06, 0, 1);
    topP = rightP = bottomP = leftP = tt;
  } else {
    topP    = Easing.easeOutCubic(clamp(local / segDur, 0, 1));
    rightP  = Easing.easeOutCubic(clamp((local - segDur) / segDur, 0, 1));
    bottomP = Easing.easeOutCubic(clamp((local - 2 * segDur) / segDur, 0, 1));
    leftP   = Easing.easeOutCubic(clamp((local - 3 * segDur) / segDur, 0, 1));
  }
  let opacity = 1;
  if (outAt != null && t > outAt) opacity = 1 - clamp((t - outAt) / outDur, 0, 1);
  if (opacity <= 0.001) return;
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.fillStyle = color;
  const sw = strokeWidth;
  ctx.fillRect(vpX, vpY, vpW * topP, sw);
  ctx.fillRect(vpX + vpW - sw, vpY, sw, vpH * rightP);
  ctx.fillRect(vpX + vpW * (1 - bottomP), vpY + vpH - sw, vpW * bottomP, sw);
  ctx.fillRect(vpX, vpY + vpH * (1 - leftP), sw, vpH * leftP);
  ctx.restore();
}

function drawCornerBrackets(ctx, t, { vpX, vpY, vpW, vpH, inAt, dur = 0.30, color = '#4A9EFF', size = 11 }) {
  if (t < inAt) return;
  const op = Easing.easeOutCubic(clamp((t - inAt) / dur, 0, 1));
  if (op <= 0.001) return;
  const sw = 1, out = 4;
  ctx.save();
  ctx.globalAlpha = op;
  ctx.shadowColor = color;
  ctx.shadowBlur = 6;
  ctx.fillStyle = color;
  ctx.fillRect(vpX - out, vpY - out, size, sw);
  ctx.fillRect(vpX - out, vpY - out, sw, size);
  ctx.fillRect(vpX + vpW + out - size, vpY - out, size, sw);
  ctx.fillRect(vpX + vpW + out - sw, vpY - out, sw, size);
  ctx.fillRect(vpX - out, vpY + vpH + out - sw, size, sw);
  ctx.fillRect(vpX - out, vpY + vpH + out - size, sw, size);
  ctx.fillRect(vpX + vpW + out - size, vpY + vpH + out - sw, size, sw);
  ctx.fillRect(vpX + vpW + out - sw, vpY + vpH + out - size, sw, size);
  ctx.restore();
}

// Radial pulse ring
function drawRadialPulse(ctx, t, {
  inAt, dur = 0.70, cx, cy,
  startRadius = 20, endRadius = 520,
  color = '#4A9EFF',
  thickness = 2.5, alpha = 1.0,
}) {
  if (t < inAt) return;
  const tt = clamp((t - inAt) / dur, 0, 1);
  if (tt >= 1) return;
  const eased = Easing.easeOutCubic(tt);
  const r = startRadius + (endRadius - startRadius) * eased;
  const op = (1 - tt) * alpha;
  ctx.save();
  ctx.globalAlpha = op;
  ctx.strokeStyle = color;
  ctx.lineWidth = thickness;
  ctx.shadowColor = color;
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

// Keyframe interpolator
function lerpKeyframes(kfs, t) {
  if (t <= kfs[0].t) return { ...kfs[0] };
  if (t >= kfs[kfs.length - 1].t) return { ...kfs[kfs.length - 1] };
  for (let i = 0; i < kfs.length - 1; i++) {
    const a = kfs[i], b = kfs[i + 1];
    if (t >= a.t && t <= b.t) {
      const span = b.t - a.t;
      const local = span > 0 ? (t - a.t) / span : 0;
      const ease = b.ease || Easing.easeInOutCubic;
      const e = ease(local);
      const out = {};
      for (const key in a) {
        if (key === 't' || key === 'ease') continue;
        if (typeof a[key] === 'number' && typeof b[key] === 'number') {
          out[key] = a[key] + (b[key] - a[key]) * e;
        } else out[key] = a[key];
      }
      return out;
    }
  }
  return kfs[kfs.length - 1];
}

Object.assign(window, {
  // composition
  CanvasComposition,
  // ledger
  beginFrame, recordTextBox, wouldOverlap, rectsOverlap,
  // texture
  getNoiseTile, drawGrain, drawDust, drawVignette,
  // atmospheres
  drawAtmosphereNavy, drawAtmosphereTeal, drawAtmosphereAmber, drawAtmosphereDesat, drawAtmosphereIndigo,
  drawAtmosphereCold, drawAtmosphereWarm, drawBaseAtmosphere,
  drawAccentWash, drawBottomBleed,
  // transitions
  drawScanFlash, drawColorFlash, drawRadialWipe, drawVerticalWipe, drawLetterbox, drawGeometryCollapse,
  // lines + chrome
  drawGlowLine, drawSectionLabel,
  // text
  slamInState, popInState, slamFromAboveState, countUpValue,
  drawTextBlock, drawTextLetteredT, drawGhostTrail,
  // geometry
  drawProgressArc, drawDataBar, drawCrosshair, drawHandKeypoints, drawFaceMesh,
  drawWaveform, drawGridSection, drawRingIndicator, drawClinicalFrame, drawCornerBrackets,
  drawRadialPulse,
  // cinematic effects
  drawChromaticText, drawLensFlare, drawLightLeak, drawGlitchEffect, drawPulseWave, drawEnhancedDust,
  drawIOSNotification,
  // misc
  lerpKeyframes,
  FONT_SERIF, FONT_MONO,
});
