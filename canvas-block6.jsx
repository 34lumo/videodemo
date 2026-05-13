// canvas-block6.jsx — Block 6: The Numbers. 0:46 → 0:53
// Atmosphere: deep indigo with radial pulse anchor.
// Three escalating beats: €0 → 60 → 14. Scatter labels with depth blur.

function drawShootingLineB6(ctx, t, { inAt, dur = 0.10, trailDur = 0.20,
                                       x = 0, y, length = 1920, thickness = 2,
                                       color = '#4A9EFF' }) {
  const dt = t - inAt;
  if (dt < 0 || dt > dur + trailDur) return;
  const drawT = dt < dur ? Easing.easeOutExpo(dt / dur) : 1;
  const trailT = dt > dur ? clamp((dt - dur) / trailDur, 0, 1) : 0;
  const opacity = 1 - trailT;
  const blur = trailT * 3;
  const glow = (1 - trailT) * 16;
  ctx.save();
  ctx.globalAlpha = opacity;
  if (blur > 0.1) ctx.filter = `blur(${blur}px)`;
  ctx.shadowColor = color; ctx.shadowBlur = glow;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, length * drawT, thickness);
  ctx.restore();
}

function drawScatterLabelB6(ctx, t, {
  text, x, y, align = 'left',
  inAt, outAt = null, outDur = 0.20,
  fontSize = 15, color = '#4A9EFF', letterSpacing = 3.3,
  depth = 0,
}) {
  const s = popInState(t, { inAt, dur: 0.10, fromScale: 1.18, outAt, outDur });
  if (!s) return;
  const depthScale = 1 - depth * 0.18;
  const depthAlpha = 1 - depth * 0.35;
  const blur = depth * 3.2;

  ctx.save();
  ctx.globalAlpha = s.opacity * depthAlpha;
  if (blur > 0.1) ctx.filter = `blur(${blur}px)`;
  ctx.font = `500 ${fontSize}px ${FONT_MONO}`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${letterSpacing}px`;
  ctx.textBaseline = 'top'; ctx.textAlign = align;
  ctx.fillStyle = color;
  ctx.translate(x, y);
  ctx.scale(s.scale * depthScale, s.scale * depthScale);
  ctx.fillText(text.toUpperCase(), 0, 0);
  ctx.restore();
}

function renderBlock6Beat1(ctx, t) {
  if (t < 46.0 || t > 48.05) return;
  const lt = t - 46.0;

  // Grid overlay
  if (lt < 1.85) {
    const fade = clamp(lt / 0.30, 0, 1) * (1 - clamp((lt - 1.85) / 0.20, 0, 1));
    drawGridSection(ctx, { x: 0, y: 0, w: 1920, h: 1080, cellSize: 80,
      color: 'rgba(255,255,255,0.045)', alpha: fade });
  }

  // Shooting line
  drawShootingLineB6(ctx, lt, { inAt: 0.04, dur: 0.10, trailDur: 0.22, y: 210, length: 1920 });

  // €0 hero — POP center
  const s = popInState(lt, { inAt: 0.20, dur: 0.10, fromScale: 1.22, outAt: 1.85, outDur: 0.20 });
  if (s) {
    ctx.save();
    ctx.globalAlpha = s.opacity;
    ctx.translate(960, 360);
    ctx.scale(s.scale, s.scale);
    ctx.font = `900 280px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-11.2px';
    ctx.textBaseline = 'top'; ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('€0', 0, 0);
    ctx.restore();
  }

  drawTextLetteredT(ctx, lt, 'HARDWARE COST', {
    x: 960, y: 680, align: 'center',
    font: `500 20px ${FONT_MONO}`,
    color: '#4A9EFF', letterSpacing: 5.6,
    inAt: 0.32, totalDur: 0.33,
    outAt: 1.85, outDur: 0.20,
  });

  // 4 scattered tertiary labels
  drawScatterLabelB6(ctx, lt, { text: 'No wearables',    x: 460,  y: 380, inAt: 0.55, outAt: 1.30, outDur: 0.18, fontSize: 16, letterSpacing: 3.52 });
  drawScatterLabelB6(ctx, lt, { text: 'No sensors',      x: 1340, y: 380, inAt: 0.65, outAt: 1.30, outDur: 0.18, fontSize: 16, letterSpacing: 3.52 });
  drawScatterLabelB6(ctx, lt, { text: 'No setup',        x: 460,  y: 640, inAt: 0.75, outAt: 1.30, outDur: 0.18, fontSize: 16, letterSpacing: 3.52 });
  drawScatterLabelB6(ctx, lt, { text: 'No installation', x: 1340, y: 640, inAt: 0.85, outAt: 1.30, outDur: 0.18, fontSize: 16, letterSpacing: 3.52 });

  // Tertiary system tag
  const sT = slamInState(lt, { inAt: 0.10, dur: 0.30, offsetY: 8 });
  if (sT) {
    drawTextBlock(ctx, '○ DEPLOYMENT · BROWSER-NATIVE · NO INSTALL', {
      x: 960, y: 920, align: 'center',
      font: `500 12px ${FONT_MONO}`,
      color: 'rgba(74,158,255,0.65)', letterSpacing: 2.6,
      opacity: sT.opacity, translateY: sT.ty,
    });
  }
}

function renderBlock6Beat2(ctx, t) {
  if (t < 48.0 || t > 50.05) return;
  const lt = t - 48.0;

  if (lt < 1.85) {
    const fade = clamp(lt / 0.30, 0, 1) * (1 - clamp((lt - 1.85) / 0.20, 0, 1));
    drawGridSection(ctx, { x: 0, y: 0, w: 1920, h: 1080, cellSize: 80,
      color: 'rgba(255,255,255,0.045)', alpha: fade });
  }

  // Vertical hairline
  if (lt >= 0.40) {
    const dt = lt - 0.40;
    const drawT = clamp(dt / 0.30, 0, 1);
    const drawE = Easing.easeOutExpo(drawT);
    ctx.save();
    ctx.shadowColor = '#4A9EFF'; ctx.shadowBlur = 10;
    ctx.fillStyle = '#4A9EFF';
    ctx.fillRect(780, 200, 1, 580 * drawE);
    ctx.restore();
  }

  // "60" slams from above
  const s = slamFromAboveState(lt, { inAt: 0.10, dur: 0.42, fromY: -110, overshootY: 10 });
  if (s) {
    ctx.save();
    ctx.globalAlpha = s.opacity;
    ctx.translate(880, 280 + s.ty);
    ctx.font = `900 320px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-12.8px';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('60', 0, 0);
    ctx.restore();
  }

  drawTextLetteredT(ctx, lt, 'SECONDS PER SESSION', {
    x: 880, y: 620, align: 'left',
    font: `500 20px ${FONT_MONO}`,
    color: '#4A9EFF', letterSpacing: 5.2,
    inAt: 0.50, totalDur: 0.42,
  });

  drawScatterLabelB6(ctx, lt, { text: 'Daily adherence',        x: 830, y: 300, inAt: 0.65, fontSize: 20, letterSpacing: 4.4 });
  drawScatterLabelB6(ctx, lt, { text: 'Home environment',       x: 830, y: 372, inAt: 0.80, fontSize: 20, letterSpacing: 4.4 });
  drawScatterLabelB6(ctx, lt, { text: 'No clinician present',   x: 830, y: 444, inAt: 0.95, fontSize: 20, letterSpacing: 4.4 });
  drawScatterLabelB6(ctx, lt, { text: 'Full biomarker capture', x: 830, y: 516, inAt: 1.10, fontSize: 20, letterSpacing: 4.4 });

  // Tertiary timestamp
  const sT = slamInState(lt, { inAt: 0.04, dur: 0.30, offsetY: 8 });
  if (sT) {
    drawTextBlock(ctx, 'T-MINUS · 00:00 ──── 01:00', {
      x: 960, y: 920, align: 'center',
      font: `500 12px ${FONT_MONO}`,
      color: 'rgba(74,158,255,0.65)', letterSpacing: 3.2,
      opacity: sT.opacity, translateY: sT.ty,
    });
  }
}

function renderBlock6Beat3(ctx, t) {
  if (t < 50.0 || t > 53.05) return;
  const lt = t - 50.0;

  // Radial pulse rings emanating from "14"
  drawRadialPulse(ctx, lt, {
    inAt: 0.40, dur: 0.65,
    cx: 960, cy: 460,
    startRadius: 30, endRadius: 620,
    color: '#4A9EFF', thickness: 2.5, alpha: 0.9,
  });
  drawRadialPulse(ctx, lt, {
    inAt: 0.50, dur: 0.55,
    cx: 960, cy: 460,
    startRadius: 20, endRadius: 380,
    color: '#4A9EFF', thickness: 1.5, alpha: 0.55,
  });

  // "14" discrete count
  const values = [0, 3, 7, 11, 14];
  const frameDur = 0.07;
  const popS = popInState(lt, { inAt: 0.10, dur: 0.08, fromScale: 1.15, outAt: 2.85, outDur: 0.20 });
  if (popS) {
    const idx = Math.min(Math.floor((lt - 0.10) / frameDur), values.length - 1);
    const val = values[Math.max(0, idx)];
    ctx.save();
    ctx.globalAlpha = popS.opacity;
    ctx.translate(960, 280);
    ctx.scale(popS.scale, popS.scale);
    ctx.font = `900 360px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-14.4px';
    ctx.textBaseline = 'top'; ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(String(val), 0, 0);
    ctx.restore();
  }

  // "clinical biomarkers." italic
  const cS = popInState(lt, { inAt: 0.50, dur: 0.16, fromScale: 1.08, outAt: 2.85, outDur: 0.20 });
  if (cS) {
    ctx.save();
    ctx.globalAlpha = cS.opacity;
    ctx.translate(960, 660);
    ctx.scale(cS.scale, cS.scale);
    ctx.font = `italic 600 60px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-0.3px';
    ctx.textBaseline = 'top'; ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.78)';
    ctx.fillText('clinical biomarkers.', 0, 0);
    ctx.restore();
  }

  // 14 scatter labels with random depth blur
  const labels = [
    { text: 'Pinch precision',      x: 280,  y: 250, depth: 0.0 },
    { text: 'Hand opening',         x: 1640, y: 270, depth: 0.6 },
    { text: 'Palm speed',           x: 220,  y: 440, depth: 0.4 },
    { text: 'Movement smoothness',  x: 1720, y: 420, depth: 0.0 },
    { text: 'Finger individuation', x: 440,  y: 195, depth: 0.7 },
    { text: 'Range of motion',      x: 1500, y: 175, depth: 0.3 },
    { text: 'Facial symmetry',      x: 720,  y: 140, depth: 0.0 },
    { text: 'Smile symmetry',       x: 1180, y: 145, depth: 0.5 },
    { text: 'Fixation heatmap',     x: 340,  y: 750, depth: 0.2 },
    { text: 'Gaze asymmetry',       x: 1580, y: 720, depth: 0.7 },
    { text: 'Dwell time',           x: 540,  y: 820, depth: 0.0 },
    { text: 'Vocal stability',      x: 1420, y: 840, depth: 0.4 },
    { text: 'Phonation quality',    x: 760,  y: 920, depth: 0.6 },
    { text: 'Blink asymmetry',      x: 1200, y: 900, depth: 0.1 },
  ];
  const LABELS_OUT = 2.05;
  labels.forEach((lbl, i) => {
    drawScatterLabelB6(ctx, lt, {
      text: lbl.text, x: lbl.x, y: lbl.y,
      inAt: 0.55 + i * 0.075,
      outAt: LABELS_OUT, outDur: 0.04,
      fontSize: 15, letterSpacing: 3.3,
      depth: lbl.depth,
    });
  });

  // Final italic closer
  const closerS = slamInState(lt, { inAt: 2.12, dur: 0.34, offsetY: 14, fromScale: 0.97, blurPx: 2,
                                      outAt: 2.85, outDur: 0.18 });
  if (closerS) {
    drawTextBlock(ctx, 'Captured in a 60-second game.', {
      x: 960, y: 1000, align: 'center',
      font: `italic 500 42px ${FONT_SERIF}`,
      color: '#ffffff', letterSpacing: -0.21,
      opacity: closerS.opacity, scale: closerS.scale, blur: closerS.blur, translateY: closerS.ty,
    });
  }
}

function renderBlock6Canvas(ctx, t) {
  if (t < 46.0 || t > 53.05) return;
  renderBlock6Beat1(ctx, t);
  renderBlock6Beat2(ctx, t);
  renderBlock6Beat3(ctx, t);

  // Inter-beat scan flashes
  drawScanFlash(ctx, t - 47.85, 0.10, 0.05, 0.85);
  drawScanFlash(ctx, t - 49.85, 0.10, 0.05, 0.85);
  // Closing transition: radial wipe 6→7
  drawRadialWipe(ctx, t - 52.85, 0.40, true);
}

Object.assign(window, { renderBlock6Canvas });
