// canvas-block4.jsx — Block 4: The Clinical Report. 0:27 → 0:39
// Atmosphere: very dark warm amber (the "clinician's world" color shift).
// Five sub-beats with procedural CRI ring, metric cards, waveform, all drawn.

function renderBlock4Opening(ctx, t) {
  // Stage 27.0 → 30.0
  if (t < 27.0 || t > 30.05) return;
  const lt = t - 27.0;

  // Pulsing line
  const pulseAt = 2.42;
  let pulseMul = 1;
  if (lt >= pulseAt && lt < pulseAt + 0.36) {
    const tt = (lt - pulseAt) / 0.36;
    pulseMul = 1 + 1.6 * Math.sin(tt * Math.PI);
  }

  if (lt >= 0.05) {
    const tDraw = clamp((lt - 0.05) / 0.48, 0, 1);
    const draw = Easing.easeOutExpo(tDraw);
    const x = 140, y = 488, w = 1640 * draw;
    let opacity = 1;
    if (lt > 2.85) opacity = 1 - clamp((lt - 2.85) / 0.20, 0, 1);
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.shadowColor = '#4A9EFF'; ctx.shadowBlur = 14 * pulseMul;
    ctx.fillStyle = '#4A9EFF';
    ctx.fillRect(x, y, w, 2);
    ctx.shadowBlur = 28 * pulseMul; ctx.globalAlpha = opacity * 0.6;
    ctx.fillRect(x, y, w, 2);
    ctx.restore();
  }

  drawTextLetteredT(ctx, lt,
    'GENERATING CLINICAL REPORT · SESSION COMPLETE · 14 BIOMARKERS CAPTURED',
    {
      x: 960, y: 528, align: 'center',
      font: `500 17px ${FONT_MONO}`,
      color: '#4A9EFF',
      letterSpacing: 4.08,
      inAt: 0.55, totalDur: 1.55,
      outAt: 2.85, outDur: 0.20,
    });

  // Tertiary: line numbers fading in as the typewriter advances
  if (lt > 1.10) {
    const fade = clamp((lt - 1.10) / 0.30, 0, 1) * (1 - clamp((lt - 2.85) / 0.20, 0, 1));
    ctx.save();
    ctx.globalAlpha = fade;
    ctx.font = `500 11px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '1.8px';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText('REPORT.SESSION-243F · UID 2A:8C:FE', 1920 - 96, 580);
    ctx.restore();
  }
}

function renderBlock4Dashboard(ctx, t) {
  if (t < 30.0 || t > 35.05) return;
  const lt = t - 30.0;

  // RIGHT SIDE: procedural CRI ring panel
  const panelX = 1040, panelY = 100, panelW = 760, panelH = 880;

  // Panel background
  let panelFade = clamp(lt / 0.55, 0, 1) * (1 - clamp((lt - 4.85) / 0.20, 0, 1));
  ctx.save();
  ctx.globalAlpha = panelFade;
  // Inset panel — slightly warm
  const panelG = ctx.createLinearGradient(panelX, panelY, panelX + panelW, panelY + panelH);
  panelG.addColorStop(0, 'rgba(38, 24, 12, 0.92)');
  panelG.addColorStop(1, 'rgba(20, 12, 6, 0.95)');
  ctx.fillStyle = panelG;
  ctx.fillRect(panelX, panelY, panelW, panelH);

  // Grid backdrop
  drawGridSection(ctx, {
    x: panelX, y: panelY, w: panelW, h: panelH,
    cellSize: 56, color: 'rgba(74,158,255,0.06)', alpha: 1,
  });
  ctx.restore();

  // Slide-in offset (panel slides from +260 over first 0.55s)
  let slideX = 0;
  if (lt < 0.05) slideX = 260;
  else {
    const tt = clamp((lt - 0.05) / 0.55, 0, 1);
    slideX = (1 - Easing.easeOutBack(tt)) * 260;
  }
  const offsetX = slideX;

  // Beat 2 zoom state: when lt > 3.0, ring grows and rest of panel blurs
  const zoom = clamp((lt - 3.0) / 0.70, 0, 1);
  const easedZoom = Easing.easeInOutCubic(zoom);
  const ringR = 110 + easedZoom * 200;
  const ringCX = panelX + offsetX + 180 + easedZoom * 200;
  const ringCY = panelY + 240 + easedZoom * 200;

  // CRI ring
  if (lt > 0.10) {
    const ringFade = clamp((lt - 0.10) / 0.30, 0, 1) * panelFade;
    const ringPct = countUpValue(lt, { inAt: 0.20, dur: 0.85, from: 0, to: 0.86, decimals: 2, punchScale: 1, ease: Easing.easeOutExpo });
    const pct = ringPct ? parseFloat(ringPct.display) : 0;
    ctx.save();
    ctx.globalAlpha = ringFade;
    // Background ring track
    drawProgressArc(ctx, {
      cx: ringCX, cy: ringCY, r: ringR, thickness: 14,
      sweep: Math.PI * 2, pct: 1,
      trackColor: 'rgba(255,255,255,0.10)',
      fillColor: 'rgba(255,255,255,0.10)',
      glow: 0,
    });
    drawProgressArc(ctx, {
      cx: ringCX, cy: ringCY, r: ringR, thickness: 14,
      sweep: Math.PI * 2, pct,
      trackColor: 'rgba(255,255,255,0)',
      fillColor: '#4A9EFF',
      glow: 18,
    });
    // Center number
    ctx.font = `900 ${48 + easedZoom * 80}px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.5px';
    ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('86', ringCX, ringCY);
    // "/100" beneath
    ctx.font = `500 ${10 + easedZoom * 14}px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '2px';
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.fillText('/100', ringCX, ringCY + 36 + easedZoom * 40);
    ctx.restore();
  }

  // Lower panel: 4 mini bars (domain breakdown teaser) — blurred when zoomed
  if (lt > 0.50) {
    const fade = clamp((lt - 0.50) / 0.40, 0, 1) * panelFade * (1 - easedZoom * 0.8);
    if (fade > 0.02) {
      ctx.save();
      ctx.globalAlpha = fade;
      if (easedZoom > 0.1) ctx.filter = `blur(${easedZoom * 4.5}px)`;
      const bars = [
        { l: 'PINCH', v: 88 }, { l: 'HAND OPENING', v: 84 },
        { l: 'SMILE', v: 82 }, { l: 'VOICE', v: 90 },
      ];
      const colY = panelY + 500;
      const colH = 56;
      bars.forEach((b, i) => {
        const by = colY + i * (colH + 18);
        const bx = panelX + offsetX + 40;
        const bw = panelW - 80;
        // Label + value
        ctx.font = `500 13px ${FONT_MONO}`;
        if ('letterSpacing' in ctx) ctx.letterSpacing = '2.4px';
        ctx.textBaseline = 'top'; ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(255,255,255,0.65)';
        ctx.fillText(b.l, bx, by);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#4A9EFF';
        ctx.fillText(`${b.v} / 100`, bx + bw, by);
        // Bar
        drawDataBar(ctx, { x: bx, y: by + 22, w: bw, h: 4, pct: b.v / 100,
          trackColor: 'rgba(255,255,255,0.08)', fillColor: '#4A9EFF', glow: 5 });
      });
      ctx.restore();
    }
  }

  // Hairline frame
  drawClinicalFrame(ctx, lt, {
    vpX: panelX + offsetX, vpY: panelY, vpW: panelW, vpH: panelH,
    inAt: 0.50, totalDur: 0.04, trace: false, color: '#4A9EFF',
    outAt: 4.85, outDur: 0.20,
  });
  drawCornerBrackets(ctx, lt, {
    vpX: panelX + offsetX, vpY: panelY, vpW: panelW, vpH: panelH,
    inAt: 0.55, dur: 0.30,
  });

  // ── LEFT TEXT — Beat 1 ──
  let s = slamInState(lt, { inAt: 0.10, dur: 0.28, offsetY: 8 });
  if (s && lt < 3.0) {
    drawTextBlock(ctx, '● REPORT · DELIVERY · SECURE', {
      x: 120, y: 234,
      font: `500 12px ${FONT_MONO}`,
      color: 'rgba(74,158,255,0.85)', letterSpacing: 2.4,
      opacity: s.opacity * (1 - clamp((lt - 2.80) / 0.30, 0, 1)),
      translateY: s.ty,
    });
  }

  s = slamInState(lt, { inAt: 0.40, dur: 0.34, offsetY: 28, fromScale: 0.95,
                         outAt: 2.80, outDur: 0.30 });
  if (s) {
    drawTextBlock(ctx, 'Session ends.', {
      x: 120, y: 280,
      font: `900 108px ${FONT_SERIF}`,
      color: '#ffffff', letterSpacing: -2.7,
      opacity: s.opacity, scale: s.scale, translateY: s.ty,
    });
  }
  s = slamInState(lt, { inAt: 0.80, dur: 0.34, offsetY: 22, outAt: 2.80, outDur: 0.30 });
  if (s) {
    drawTextBlock(ctx, 'Clinician receives this.', {
      x: 120, y: 410,
      font: `700 68px ${FONT_SERIF}`,
      color: 'rgba(255,255,255,0.88)', letterSpacing: -1.02,
      opacity: s.opacity, translateY: s.ty,
    });
  }
  drawGlowLine(ctx, lt, {
    x: 124, y: 526, length: 520, thickness: 1,
    inAt: 1.20, drawDur: 0.32, color: 'rgba(74,158,255,0.45)', glow: 3,
    outAt: 2.80, outDur: 0.30,
  });
  s = slamInState(lt, { inAt: 1.32, dur: 0.30, offsetY: 12, outAt: 2.80, outDur: 0.30 });
  if (s) {
    drawTextBlock(ctx, 'AUTOMATICALLY · EVERY SESSION', {
      x: 120, y: 554,
      font: `500 22px ${FONT_MONO}`,
      color: '#4A9EFF', letterSpacing: 4.84,
      opacity: s.opacity, translateY: s.ty,
    });
  }

  // ── LEFT TEXT — Beat 2 ──
  s = slamInState(lt, { inAt: 3.20, dur: 0.36, offsetY: 32, fromScale: 0.94, blurPx: 3,
                         outAt: 4.85, outDur: 0.20 });
  if (s) {
    const flickerAt = 3.62;
    const dt = lt - flickerAt;
    const inFlicker = dt > 0 && dt < 0.04;
    const opts = {
      x: 120, y: 280,
      font: `900 240px ${FONT_SERIF}`,
      color: '#ffffff', letterSpacing: -8.4,
      opacity: s.opacity * (inFlicker ? 0.55 : 1),
      scale: s.scale, blur: s.blur, translateY: s.ty,
    };
    drawGhostTrail(ctx, lt, '86.', opts,
      { at: 3.55, dur: 0.45, offsetY: 18, extraScale: 0.08, blur: 26, alpha: 0.48 });
    drawTextBlock(ctx, '86.', opts);
  }
  s = slamInState(lt, { inAt: 3.55, dur: 0.34, offsetY: 20, outAt: 4.85, outDur: 0.20 });
  if (s) {
    drawTextBlock(ctx, 'Clinical Recovery Index.', {
      x: 120, y: 520,
      font: `700 56px ${FONT_SERIF}`,
      color: 'rgba(255,255,255,0.92)', letterSpacing: -0.84,
      opacity: s.opacity, translateY: s.ty,
    });
  }
  drawGlowLine(ctx, lt, {
    x: 124, y: 610, length: 460, thickness: 1,
    inAt: 3.85, drawDur: 0.32, color: 'rgba(74,158,255,0.45)', glow: 3,
    outAt: 4.85, outDur: 0.20,
  });
  s = slamInState(lt, { inAt: 3.95, dur: 0.30, offsetY: 12, outAt: 4.85, outDur: 0.20 });
  if (s) {
    drawTextBlock(ctx, 'COMPOSITE · MOTOR + FACIAL + VOICE', {
      x: 120, y: 638,
      font: `500 20px ${FONT_MONO}`,
      color: '#4A9EFF', letterSpacing: 4.4,
      opacity: s.opacity, translateY: s.ty,
    });
  }
}

function renderBlock4Beat3(ctx, t) {
  if (t < 35.0 || t > 37.05) return;
  const lt = t - 35.0;

  // Eyebrow
  let s = slamInState(lt, { inAt: 0.02, dur: 0.28, offsetY: 10 });
  if (s) {
    drawTextBlock(ctx, '§6 · DOMAIN BREAKDOWN · PER-DOMAIN PERFORMANCE · 0–100', {
      x: 140, y: 180,
      font: `500 15px ${FONT_MONO}`,
      color: 'rgba(255,255,255,0.55)', letterSpacing: 3.9,
      opacity: s.opacity, translateY: s.ty,
    });
  }

  const gutter = 140, gap = 28;
  const cardW = (1920 - gutter * 2 - gap * 3) / 4;
  const cardH = 360;
  const cardY = 280;

  const cards = [
    { label: 'PINCH',        value: 88, desc: 'THUMB-INDEX OPPOSITION' },
    { label: 'HAND OPENING', value: 84, desc: 'FINGER EXTENSION HOLD' },
    { label: 'SMILE',        value: 82, desc: 'SYMMETRY & AMPLITUDE' },
    { label: 'VOICE',        value: 90, desc: 'PHONATION QUALITY' },
  ];
  cards.forEach((c, i) => {
    drawMetricCard(ctx, lt, {
      x: gutter + i * (cardW + gap),
      y: cardY, w: cardW, h: cardH,
      label: c.label, value: c.value, desc: c.desc,
      inAt: 0.10 + i * 0.15,
    });
  });

  // Italic closer
  s = slamInState(lt, { inAt: 1.05, dur: 0.36, offsetY: 20 });
  if (s) {
    drawTextBlock(ctx, 'Objective data. Not "how are you feeling?"', {
      x: 140, y: 740,
      font: `italic 500 56px ${FONT_SERIF}`,
      color: '#ffffff', letterSpacing: -0.28,
      opacity: s.opacity, translateY: s.ty,
    });
  }

  // Tertiary mono trailer
  s = slamInState(lt, { inAt: 1.45, dur: 0.30, offsetY: 8 });
  if (s) {
    drawTextBlock(ctx, '[ DELTA · WK-OVER-WK · MOTOR +2.4 · FACIAL +1.8 · VOCAL +0.6 ]', {
      x: 140, y: 850,
      font: `500 14px ${FONT_MONO}`,
      color: 'rgba(74,158,255,0.65)', letterSpacing: 2.4,
      opacity: s.opacity, translateY: s.ty,
    });
  }
}

function drawMetricCard(ctx, lt, { x, y, w, h, label, value, desc, inAt }) {
  const t = lt - inAt;
  if (t < -0.05) return;
  const op = clamp(t / 0.08, 0, 1);

  ctx.save();
  ctx.globalAlpha = op;

  // Top bar drawn L→R with glow
  const barW = w * clamp(t / 0.20, 0, 1);
  ctx.shadowColor = '#4A9EFF'; ctx.shadowBlur = 12;
  ctx.fillStyle = '#4A9EFF';
  ctx.fillRect(x, y, barW, 2);
  ctx.shadowBlur = 0;

  // Mono label
  const labelOp = clamp((t - 0.08) / 0.18, 0, 1);
  if (labelOp > 0.001) {
    ctx.globalAlpha = op * labelOp;
    ctx.font = `500 17px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '4.42px';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#4A9EFF';
    ctx.fillText(label, x, y + 24);
  }

  // Serif value + small "/100"
  const valOp = clamp((t - 0.16) / 0.18, 0, 1);
  const valTy = (1 - clamp((t - 0.16) / 0.24, 0, 1)) * 14;
  const c = countUpValue(t, { inAt: 0, dur: 0.40, from: 0, to: value, decimals: 0, punchScale: 1.04 });
  if (c && valOp > 0.001) {
    ctx.globalAlpha = op * valOp;
    ctx.save();
    ctx.translate(x, y + 76 + valTy);
    ctx.scale(c.scale, c.scale);
    ctx.font = `900 168px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-5.88px';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(c.display, 0, 0);
    const widthDisp = ctx.measureText(c.display).width;
    ctx.font = `500 28px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '1.68px';
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.fillText('/100', widthDisp + 10, 90);
    ctx.restore();
  }

  // Progress bar
  ctx.globalAlpha = op;
  ctx.fillStyle = 'rgba(255,255,255,0.10)';
  ctx.fillRect(x, y + 260, w, 2);
  const fillT = clamp((t - 0.30) / 0.50, 0, 1);
  ctx.shadowColor = '#4A9EFF'; ctx.shadowBlur = 8;
  ctx.fillStyle = '#4A9EFF';
  ctx.fillRect(x, y + 260, w * (value / 100) * fillT, 2);
  ctx.shadowBlur = 0;

  // Description
  const descOp = clamp((t - 0.40) / 0.30, 0, 1);
  if (descOp > 0.001) {
    ctx.globalAlpha = op * descOp;
    ctx.font = `500 13px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '2.6px';
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.fillText(desc, x, y + 280);
  }

  // Tertiary: delta indicator bottom-right
  if (descOp > 0.001) {
    ctx.globalAlpha = op * descOp;
    ctx.font = `500 11px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '1.6px';
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(74,158,255,0.65)';
    const deltas = ['+2.4', '+1.8', '+0.6', '+3.1'];
    const idx = Math.abs(label.charCodeAt(0)) % deltas.length;
    ctx.fillText(`Δ ${deltas[idx]}`, x + w, y + 322);
    ctx.textAlign = 'left';
  }

  ctx.restore();
}

function renderBlock4Beat4(ctx, t) {
  if (t < 37.0 || t > 39.05) return;
  const lt = t - 37.0;

  // RIGHT: detail panel with crosshair + waveform + ring indicator
  const panelX = 980, panelY = 180, panelW = 880, panelH = 760;

  ctx.save();
  // Panel bg
  const g = ctx.createLinearGradient(panelX, panelY, panelX + panelW, panelY + panelH);
  g.addColorStop(0, 'rgba(38, 24, 12, 0.92)');
  g.addColorStop(1, 'rgba(18, 10, 6, 0.95)');
  ctx.fillStyle = g;
  ctx.fillRect(panelX, panelY, panelW, panelH);
  // Grid
  drawGridSection(ctx, {
    x: panelX, y: panelY, w: panelW, h: panelH,
    cellSize: 56, color: 'rgba(74,158,255,0.06)', alpha: 1,
  });

  // Face mesh top
  drawFaceMesh(ctx, lt, {
    cx: panelX + panelW * 0.30, cy: panelY + 280, w: 200, h: 280,
    inAt: 0.08, alpha: 0.85, density: 0.6, jitterAmp: 0.5,
  });
  drawCrosshair(ctx, {
    cx: panelX + panelW * 0.30, cy: panelY + 230,
    ringR: 60, armLen: 22,
    color: '#4A9EFF', alpha: 0.7,
    label: 'AU · 17 + 12', pulseT: (lt * 0.7) % 1,
  });

  // Hand keypoints top-right
  drawHandKeypoints(ctx, lt, {
    cx: panelX + panelW * 0.75, cy: panelY + 260, size: 220,
    inAt: 0.12, alpha: 0.95, color: '#4A9EFF',
    pointSize: 4, showBones: true, revealStaggerDur: 0.4, jitterAmp: 1.0,
  });

  // Waveform — vocal biomarker, bottom of panel
  drawWaveform(ctx, lt, {
    x: panelX + 40, y: panelY + 580, w: panelW - 80, h: 100,
    alpha: 0.85, color: '#4A9EFF',
    amplitude: 0.7, speed: 1.5, bars: 0, thickness: 2.5,
  });

  // Edge vignette
  const vgrad = ctx.createRadialGradient(
    panelX + panelW / 2, panelY + panelH / 2, Math.min(panelW, panelH) * 0.4,
    panelX + panelW / 2, panelY + panelH / 2, Math.max(panelW, panelH) * 0.65
  );
  vgrad.addColorStop(0, 'rgba(0,0,0,0)');
  vgrad.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = vgrad;
  ctx.fillRect(panelX, panelY, panelW, panelH);
  ctx.restore();

  drawClinicalFrame(ctx, lt, {
    vpX: panelX, vpY: panelY, vpW: panelW, vpH: panelH,
    inAt: 0.02, totalDur: 0.04, trace: false,
  });
  drawCornerBrackets(ctx, lt, {
    vpX: panelX, vpY: panelY, vpW: panelW, vpH: panelH, inAt: 0.08, dur: 0.28,
  });

  // LEFT stack
  let s = slamInState(lt, { inAt: 0.15, dur: 0.34, offsetY: 28, fromScale: 0.95, blurPx: 3 });
  const c14 = countUpValue(lt, { inAt: 0.20, dur: 0.30, from: 0, to: 14, decimals: 0, punchScale: 1.04 });
  if (s && c14) {
    drawTextBlock(ctx, `${c14.display} biomarkers.`, {
      x: 120, y: 290,
      font: `900 96px ${FONT_SERIF}`,
      color: '#ffffff', letterSpacing: -2.4,
      opacity: s.opacity, scale: s.scale, blur: s.blur, translateY: s.ty,
      punchScale: c14.scale,
    });
  }
  s = slamInState(lt, { inAt: 0.55, dur: 0.32, offsetY: 22 });
  if (s) {
    drawTextBlock(ctx, 'Every session.', {
      x: 120, y: 430,
      font: `800 78px ${FONT_SERIF}`,
      color: '#ffffff', letterSpacing: -1.56,
      opacity: s.opacity, translateY: s.ty,
    });
  }
  s = slamInState(lt, { inAt: 0.95, dur: 0.32, offsetY: 22 });
  if (s) {
    drawTextBlock(ctx, 'Every day.', {
      x: 120, y: 550,
      font: `800 78px ${FONT_SERIF}`,
      color: '#4A9EFF', letterSpacing: -1.56,
      opacity: s.opacity, translateY: s.ty,
    });
  }

  // Tertiary mono trailer
  s = slamInState(lt, { inAt: 1.30, dur: 0.30, offsetY: 8 });
  if (s) {
    drawTextBlock(ctx, '[ TRAJECTORY · CONTINUOUS · CLINICIAN-FACING ]', {
      x: 120, y: 700,
      font: `500 13px ${FONT_MONO}`,
      color: 'rgba(255,255,255,0.42)', letterSpacing: 2.2,
      opacity: s.opacity, translateY: s.ty,
    });
  }
}

function renderBlock4Canvas(ctx, t) {
  if (t < 27.0 || t > 39.05) return;

  renderBlock4Opening(ctx, t);
  renderBlock4Dashboard(ctx, t);
  renderBlock4Beat3(ctx, t);
  renderBlock4Beat4(ctx, t);

  // Closing transition: letterbox (4→5)
  drawLetterbox(ctx, t - 38.70, 0.30);
}

Object.assign(window, { renderBlock4Canvas, drawMetricCard });
