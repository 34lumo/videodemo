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
      color: 'rgba(150,150,150,0.85)', letterSpacing: -0.25,
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

  // New italic line — "How are you feeling, María?"
  s = slamInState(lt, { inAt: 2.40, dur: 0.32, offsetY: 14 });
  if (s) {
    drawTextBlock(ctx, 'How are you feeling, María?', {
      x: 144, y: 760,
      font: `italic 500 42px ${FONT_SERIF}`,
      color: 'rgba(150,150,150,0.75)', letterSpacing: -0.21,
      opacity: s.opacity, translateY: s.ty,
    });
  }

  // GEOMETRY — Enhanced flatline visualization showing data gap
  if (lt > 0.60) {
    const fade = clamp((lt - 0.60) / 0.50, 0, 1) * (1 - clamp((lt - 2.85) / 0.20, 0, 1));
    ctx.save();
    ctx.globalAlpha = fade;

    const x = 144, y = 780, w = 920, h = 120;

    // Background grid for context
    ctx.strokeStyle = 'rgba(255, 107, 107, 0.08)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 6; i++) {
      const gridY = y + (h / 6) * i;
      ctx.beginPath();
      ctx.moveTo(x, gridY);
      ctx.lineTo(x + w, gridY);
      ctx.stroke();
    }

    // Vertical time markers
    for (let i = 0; i <= 4; i++) {
      const gridX = x + (w / 4) * i;
      ctx.beginPath();
      ctx.moveTo(gridX, y);
      ctx.lineTo(gridX, y + h);
      ctx.stroke();
    }

    // Main flatline with dramatic single spike (last data point 6 weeks ago)
    ctx.strokeStyle = BV_RED_B5;
    ctx.shadowColor = BV_RED_B5;
    ctx.shadowBlur = 12;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x, y + h / 2);

    // Mostly flat until 15% where the old spike was
    ctx.lineTo(x + w * 0.14, y + h / 2);

    // Single dramatic spike (the last data point)
    ctx.lineTo(x + w * 0.15, y + h * 0.2); // Up
    ctx.lineTo(x + w * 0.16, y + h * 0.75); // Down
    ctx.lineTo(x + w * 0.17, y + h * 0.45); // Recovery
    ctx.lineTo(x + w * 0.19, y + h / 2); // Back to baseline

    // Then completely flat (no data since then)
    ctx.lineTo(x + w, y + h / 2);
    ctx.stroke();

    // Pulsing dot at the spike point
    const dotT = (lt * 2.5) % 1;
    const dotPulse = Math.sin(dotT * Math.PI) * 0.6 + 0.4;
    ctx.shadowBlur = 20 * dotPulse;
    ctx.fillStyle = BV_RED_B5;
    ctx.beginPath();
    ctx.arc(x + w * 0.155, y + h / 2 - 30, 5 * (0.8 + dotPulse * 0.4), 0, Math.PI * 2);
    ctx.fill();

    // "No data since" annotation with arrow
    ctx.shadowBlur = 0;
    ctx.font = `500 11px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '1.8px';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255, 107, 107, 0.7)';
    ctx.fillText('GAP: 6 WEEKS', x + w * 0.25, y + h / 2 + 35);

    // Dashed line showing gap
    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = 'rgba(255, 107, 107, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.19, y + h / 2);
    ctx.lineTo(x + w * 0.95, y + h / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Time labels
    ctx.font = `500 10px ${FONT_MONO}`;
    ctx.fillStyle = 'rgba(255, 107, 107, 0.5)';
    ctx.textAlign = 'center';
    ctx.fillText('6 WKS AGO', x + w * 0.155, y + h + 18);
    ctx.fillText('NOW', x + w * 0.95, y + h + 18);

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

  // New italic line — "Day 18. Coordination drop detected. Doctor calls."
  s = slamInState(lt, { inAt: 1.80, dur: 0.32, offsetY: 14, outAt: 3.95, outDur: 0.35 });
  if (s) {
    drawTextBlock(ctx, 'Day 18. Coordination drop detected. Doctor calls.', {
      x: 1920 - 144, y: 760,
      font: `italic 500 42px ${FONT_SERIF}`,
      color: '#ffffff', letterSpacing: -0.21,
      align: 'right',
      opacity: s.opacity, translateY: s.ty,
    });
  }

  // GEOMETRY — Enhanced real-time data visualization (continuous monitoring)
  if (lt > 1.10) {
    const fade = clamp((lt - 1.10) / 0.40, 0, 1) * (1 - clamp((lt - 3.95) / 0.30, 0, 1));
    ctx.save();
    ctx.globalAlpha = fade;

    const x = 1920 - 140 - 920, y = 780, w = 920, h = 120;

    // Background grid for context
    ctx.strokeStyle = 'rgba(74, 158, 255, 0.08)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 6; i++) {
      const gridY = y + (h / 6) * i;
      ctx.beginPath();
      ctx.moveTo(x, gridY);
      ctx.lineTo(x + w, gridY);
      ctx.stroke();
    }

    // Vertical time markers
    for (let i = 0; i <= 4; i++) {
      const gridX = x + (w / 4) * i;
      ctx.beginPath();
      ctx.moveTo(gridX, y);
      ctx.lineTo(gridX, y + h);
      ctx.stroke();
    }

    // Multiple overlapping waveforms showing rich continuous data
    const cy = y + h / 2;

    // Main waveform - primary signal
    ctx.strokeStyle = '#4A9EFF';
    ctx.shadowColor = '#4A9EFF';
    ctx.shadowBlur = 10;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const px = x + (i / 200) * w;
      const u = i / 200;
      const timeOffset = lt * 2;
      const env = 0.5 + 0.5 * Math.sin(u * Math.PI);
      const v = Math.sin(timeOffset + u * 12) * 0.5 +
                Math.sin(timeOffset * 3 + u * 25) * 0.3 +
                Math.sin(timeOffset * 0.7 + u * 5) * 0.2;
      const py = cy + v * env * h * 0.35;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Secondary waveform - complementary signal with different frequency
    ctx.globalAlpha = fade * 0.4;
    ctx.strokeStyle = '#00D9FF';
    ctx.shadowColor = '#00D9FF';
    ctx.shadowBlur = 8;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const px = x + (i / 200) * w;
      const u = i / 200;
      const timeOffset = lt * 1.8;
      const v = Math.sin(timeOffset * 2 + u * 18) * 0.4 +
                Math.sin(timeOffset * 5 + u * 32) * 0.25;
      const py = cy + v * h * 0.25;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Data points along the waveform
    ctx.globalAlpha = fade;
    ctx.shadowBlur = 0;
    for (let i = 0; i < 8; i++) {
      const u = 0.15 + i * 0.1;
      const px = x + u * w;
      const timeOffset = lt * 2;
      const env = 0.5 + 0.5 * Math.sin(u * Math.PI);
      const v = Math.sin(timeOffset + u * 12) * 0.5 +
                Math.sin(timeOffset * 3 + u * 25) * 0.3;
      const py = cy + v * env * h * 0.35;

      ctx.fillStyle = '#4A9EFF';
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Pulsing "live" indicator
    const liveT = (lt * 2.5) % 1;
    const livePulse = Math.sin(liveT * Math.PI) * 0.6 + 0.4;
    ctx.shadowColor = '#00D9FF';
    ctx.shadowBlur = 16 * livePulse;
    ctx.fillStyle = '#00D9FF';
    ctx.beginPath();
    ctx.arc(x + w - 20, y + 20, 6 * (0.8 + livePulse * 0.3), 0, Math.PI * 2);
    ctx.fill();

    // "LIVE" label
    ctx.shadowBlur = 0;
    ctx.font = `600 11px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '1.8px';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#00D9FF';
    ctx.fillText('LIVE', x + w - 32, y + 20);

    // Time labels
    ctx.font = `500 10px ${FONT_MONO}`;
    ctx.fillStyle = 'rgba(74, 158, 255, 0.6)';
    ctx.textAlign = 'center';
    ctx.fillText('6H AGO', x + w * 0.15, y + h + 18);
    ctx.fillText('3H AGO', x + w * 0.5, y + h + 18);
    ctx.fillText('NOW', x + w * 0.95, y + h + 18);

    // Annotation
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(74, 158, 255, 0.7)';
    ctx.fillText('CONTINUOUS DATA', x, y + h / 2 + 35);

    ctx.restore();
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
