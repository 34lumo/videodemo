// canvas-block5.jsx — Block 5: Before / After. 0:39 → 0:46
// Atmosphere: left desaturated grey, right sharp black — emotional contrast.

const BV_RED_B5 = '#FF6B6B';

function renderBlock5Beat1(ctx, t) {
  if (t < 39.0 || t > 42.05) return;
  const lt = t - 39.0;

  // Stronger film grain only in this beat
  drawGrain(ctx, lt, 0.07);

  // SECONDARY eyebrow — "Last data point:" left side
  let s = slamInState(lt, { inAt: 0.25, dur: 0.42, offsetY: 16, fromScale: 0.98, blurPx: 2 });
  if (s) {
    drawTextBlock(ctx, 'Last data point:', {
      x: 140, y: 360,
      font: `600 50px ${FONT_SERIF}`,
      color: 'rgba(255,255,255,0.85)', letterSpacing: -0.25,
      opacity: s.opacity, scale: s.scale, blur: s.blur, translateY: s.ty,
    });
  }

  // PRIMARY — "6 weeks ago." in BV_RED (ghost trail)
  s = slamInState(lt, { inAt: 1.35, dur: 0.36, offsetY: 32, fromScale: 0.94, blurPx: 4 });
  if (s) {
    const opts = {
      x: 140, y: 440,
      font: `900 184px ${FONT_SERIF}`,
      color: BV_RED_B5, letterSpacing: -5.52,
      opacity: s.opacity, scale: s.scale, blur: s.blur, translateY: s.ty,
    };
    drawGhostTrail(ctx, lt, '6 weeks ago.', opts,
      { at: 1.65, dur: 0.50, offsetY: 14, extraScale: 0.06, blur: 22, alpha: 0.38 });
    drawTextBlock(ctx, '6 weeks ago.', opts);
  }

  // TERTIARY mono caption — dim
  s = slamInState(lt, { inAt: 2.05, dur: 0.30, offsetY: 12 });
  if (s) {
    drawTextBlock(ctx, 'SUBJECTIVE RECALL · NO OBJECTIVE DATA', {
      x: 144, y: 720,
      font: `500 18px ${FONT_MONO}`,
      color: 'rgba(255,255,255,0.42)', letterSpacing: 4.32,
      opacity: s.opacity, translateY: s.ty,
    });
  }

  // GEOMETRY — flat-line monitor strip on the left, ominous
  if (lt > 0.60) {
    const fade = clamp((lt - 0.60) / 0.50, 0, 1) * (1 - clamp((lt - 2.85) / 0.20, 0, 1));
    ctx.save();
    ctx.globalAlpha = fade;
    // Horizontal flatline EKG-style at the bottom
    const x = 144, y = 840, w = 920;
    ctx.strokeStyle = 'rgba(255,107,107,0.55)';
    ctx.shadowColor = BV_RED_B5;
    ctx.shadowBlur = 8;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    // Mostly flat with a single weak blip at 40%
    ctx.lineTo(x + w * 0.4, y);
    ctx.lineTo(x + w * 0.42, y - 12);
    ctx.lineTo(x + w * 0.44, y + 4);
    ctx.lineTo(x + w * 0.46, y);
    ctx.lineTo(x + w, y);
    ctx.stroke();
    // Endpoint marker
    ctx.fillStyle = BV_RED_B5;
    ctx.beginPath(); ctx.arc(x + w, y, 3, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // TERTIARY — system stat top-left
  s = slamInState(lt, { inAt: 0.10, dur: 0.30, offsetY: 8 });
  if (s) {
    drawTextBlock(ctx, '○ MONITORING · OFFLINE · NO SIGNAL', {
      x: 144, y: 240,
      font: `500 12px ${FONT_MONO}`,
      color: 'rgba(255,107,107,0.65)', letterSpacing: 2.4,
      opacity: s.opacity, translateY: s.ty,
    });
  }
}

function renderBlock5Beat2(ctx, t) {
  if (t < 42.0 || t > 46.05) return;
  const lt = t - 42.0;

  // Bottom blue bleed once "This morning." lands
  if (lt > 0.95) {
    const fIn = clamp((lt - 0.95) / 0.50, 0, 1);
    const fOut = lt > 3.95 ? clamp((lt - 3.95) / 0.35, 0, 1) : 0;
    drawBottomBleed(ctx, Math.max(0, fIn - fOut) * 0.9, '#4A9EFF');
  }

  // SECONDARY — "Last data point:" right anchored
  let s = slamInState(lt, { inAt: 0.10, dur: 0.30, offsetY: 16, fromScale: 0.98, blurPx: 2,
                              outAt: 3.95, outDur: 0.35 });
  if (s) {
    drawTextBlock(ctx, 'Last data point:', {
      x: 1920 - 140, y: 360,
      font: `600 50px ${FONT_SERIF}`,
      color: '#ffffff', letterSpacing: -0.25,
      align: 'right',
      opacity: s.opacity, scale: s.scale, blur: s.blur, translateY: s.ty,
    });
  }

  // PRIMARY — "This morning." in BV_BLUE, slams harder
  s = slamInState(lt, { inAt: 0.80, dur: 0.28, offsetY: 44, fromScale: 0.92, blurPx: 5,
                         outAt: 3.95, outDur: 0.35 });
  if (s) {
    const opts = {
      x: 1920 - 140, y: 440,
      font: `900 184px ${FONT_SERIF}`,
      color: '#4A9EFF', letterSpacing: -5.52,
      align: 'right',
      opacity: s.opacity, scale: s.scale, blur: s.blur, translateY: s.ty,
    };
    drawGhostTrail(ctx, lt, 'This morning.', opts,
      { at: 1.08, dur: 0.55, offsetY: 18, extraScale: 0.08, blur: 28, alpha: 0.55 });
    drawTextBlock(ctx, 'This morning.', opts);
  }

  // TERTIARY mono caption — BV_BLUE
  s = slamInState(lt, { inAt: 1.45, dur: 0.30, offsetY: 12, outAt: 3.95, outDur: 0.35 });
  if (s) {
    drawTextBlock(ctx, 'OBJECTIVE · CONTINUOUS · AUTOMATIC', {
      x: 1920 - 144, y: 720,
      font: `500 18px ${FONT_MONO}`,
      color: '#4A9EFF', letterSpacing: 4.32,
      align: 'right',
      opacity: s.opacity, translateY: s.ty,
    });
  }

  // GEOMETRY — live active waveform on the right (the opposite of the flatline)
  if (lt > 1.10) {
    const fade = clamp((lt - 1.10) / 0.40, 0, 1) * (1 - clamp((lt - 3.95) / 0.30, 0, 1));
    drawWaveform(ctx, lt, {
      x: 1920 - 140 - 920, y: 830, w: 920, h: 40,
      alpha: fade * 0.85, color: '#4A9EFF',
      amplitude: 0.7, speed: 1.6, thickness: 2,
    });
  }

  // Center typewriter
  drawTextLetteredT(ctx, lt, 'BETWEEN VISITS · CLOSES THIS GAP', {
    x: 960, y: 920, align: 'center',
    font: `500 20px ${FONT_MONO}`,
    color: '#ffffff', letterSpacing: 6,
    inAt: 2.85, totalDur: 1.10,
    outAt: 3.95, outDur: 0.35,
  });

  // TERTIARY — system stat top-right
  s = slamInState(lt, { inAt: 0.04, dur: 0.30, offsetY: 8, outAt: 3.95, outDur: 0.35 });
  if (s) {
    drawTextBlock(ctx, '● MONITORING · ONLINE · LIVE', {
      x: 1920 - 144, y: 240,
      font: `500 12px ${FONT_MONO}`,
      color: '#4A9EFF', letterSpacing: 2.4,
      align: 'right',
      opacity: s.opacity, translateY: s.ty,
    });
  }
}

function renderBlock5Canvas(ctx, t) {
  if (t < 39.0 || t > 46.05) return;

  renderBlock5Beat1(ctx, t);
  renderBlock5Beat2(ctx, t);

  // Closing transition: color flash 5→6 (subtle blue tint)
  drawColorFlash(ctx, t - 45.78, 0.22, 'rgba(74,158,255,0.55)');
}

Object.assign(window, { renderBlock5Canvas });
