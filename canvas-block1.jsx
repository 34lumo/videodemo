// canvas-block1.jsx — Block 1: The Problem. 0:00 → 0:11
// Atmosphere: cold dark navy with a left-anchored cool radial.
// No images. Three text layers + geometric punctuation per beat.

function renderBlock1Beat1(ctx, t) {
  // Stage 0.00 → 3.62
  if (t > 3.62) return;
  const lt = t;

  // Tertiary clinical chrome removido para evitar sobreposición

  // ── PRIMARY — "40" hero with CINEMATIC EFFECTS ──
  let s = slamInState(lt, { inAt: 0.22, dur: 0.34, offsetY: 28, fromScale: 0.94, blurPx: 4 });
  const c40 = countUpValue(lt, { inAt: 0.25, dur: 0.40, from: 13, to: 40, decimals: 0, punchScale: 1.05 });
  if (s && c40) {
    const opts40 = {
      x: 144, y: 320,
      font: `900 320px ${FONT_SERIF}`,
      color: '#ffffff', letterSpacing: -8,
      opacity: s.opacity, scale: s.scale, blur: s.blur, translateY: s.ty,
      punchScale: c40.scale,
    };

    // Pulse wave when number appears
    drawPulseWave(ctx, lt, { cx: 400, cy: 450, inAt: 0.65, speed: 0.5, maxRadius: 400 });

    // Lens flare on impact
    drawLensFlare(ctx, lt, { x: 144, y: 320, inAt: 0.65, dur: 1.0, intensity: 0.8 });

    // Enhanced ghost trail
    drawGhostTrail(ctx, lt, c40.display, opts40,
      { at: 0.58, dur: 0.45, offsetY: 14, extraScale: 0.08, blur: 24, alpha: 0.50 });

    drawTextBlock(ctx, c40.display, opts40);
  }

  // Light leak transition
  drawLightLeak(ctx, lt, { inAt: 0.15, dur: 1.5, side: 'left' });

  // ── SECONDARY — "EVERY" eyebrow above "40" with glow ──
  s = slamInState(lt, { inAt: 0.15, dur: 0.28, offsetY: 14 });
  if (s) {
    ctx.save();
    ctx.globalAlpha = s.opacity;
    ctx.translate(144, 280 + s.ty);
    ctx.font = `600 26px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '7.8px';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.shadowColor = '#4A9EFF';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#4A9EFF';
    ctx.fillText('EVERY', 0, 0);
    ctx.restore();
  }

  // ── SECONDARY — "SECONDS," unit beside "40" with gradient ──
  s = slamInState(lt, { inAt: 0.66, dur: 0.28, offsetY: 18, fromScale: 0.96 });
  if (s) {
    ctx.save();
    ctx.font = `900 320px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-8px';
    const w40 = ctx.measureText('40').width;
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = s.opacity;
    ctx.translate(144 + w40 + 36, 580 + s.ty);
    ctx.scale(s.scale, s.scale);
    ctx.font = `700 56px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '2.8px';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    const grad = ctx.createLinearGradient(0, 0, 400, 0);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(1, '#4A9EFF');

    ctx.shadowColor = 'rgba(255,255,255,0.5)';
    ctx.shadowBlur = 16;
    ctx.fillStyle = grad;
    ctx.fillText('SECONDS,', 0, 0);
    ctx.restore();
  }

  // ── SECONDARY prose — "someone has a stroke." with glow ──
  s = slamInState(lt, { inAt: 0.94, dur: 0.34, offsetY: 22 });
  if (s) {
    ctx.save();
    ctx.globalAlpha = s.opacity;
    ctx.translate(580, 700 + s.ty);
    ctx.font = `800 70px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.4px';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.shadowColor = 'rgba(255,255,255,0.6)';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#ffffff';
    ctx.fillText('someone has a stroke.', 0, 0);
    ctx.restore();
  }

  // ── GEOMETRY — interval tick bar at bottom-left ──
  // A horizontal axis with 4 ticks at 10, 20, 30, 40 sec — a "40" highlighted.
  if (lt > 1.30) {
    const axisX = 144, axisY = 956, axisW = 460;
    const drawT = clamp((lt - 1.30) / 0.45, 0, 1);
    const eAxis = Easing.easeOutCubic(drawT);
    ctx.save();
    ctx.globalAlpha = eAxis;
    ctx.strokeStyle = 'rgba(255,255,255,0.30)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(axisX, axisY); ctx.lineTo(axisX + axisW * eAxis, axisY);
    ctx.stroke();
    // Tick labels — 10s 20s 30s 40s
    const ticks = [10, 20, 30, 40];
    ticks.forEach((tk, i) => {
      const tx = axisX + (i / 3) * axisW;
      const tickRev = clamp((lt - 1.30 - i * 0.10) / 0.20, 0, 1);
      if (tickRev <= 0.01) return;
      ctx.globalAlpha = tickRev * eAxis;
      const isLast = i === 3;
      ctx.strokeStyle = isLast ? '#4A9EFF' : 'rgba(255,255,255,0.38)';
      ctx.shadowColor = isLast ? '#4A9EFF' : 'transparent';
      ctx.shadowBlur = isLast ? 10 : 0;
      ctx.lineWidth = isLast ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(tx, axisY - (isLast ? 14 : 8)); ctx.lineTo(tx, axisY + 4);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = isLast ? '#4A9EFF' : 'rgba(255,255,255,0.55)';
      ctx.font = `500 11px ${FONT_MONO}`;
      if ('letterSpacing' in ctx) ctx.letterSpacing = '1.4px';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(`${tk}S`, tx, axisY + 10);
    });
    ctx.restore();
  }

  // ── 7.8M right side ──
  drawGlowLine(ctx, lt, {
    x: 1180, y: 836, length: 600, thickness: 1,
    inAt: 1.50, drawDur: 0.32, color: '#4A9EFF', glow: 4,
    origin: 'right',
  });

  // PRIMARY — "7.8" + "M"
  s = slamInState(lt, { inAt: 1.62, dur: 0.32, offsetY: 22, fromScale: 0.94 });
  const c78 = countUpValue(lt, { inAt: 1.65, dur: 0.40, from: 3.2, to: 7.8, decimals: 1 });
  if (s && c78) {
    ctx.save();
    ctx.font = `900 108px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-2.16px';
    const wM = ctx.measureText('M').width;
    ctx.restore();
    const xM = 1920 - 140;
    const x78r = xM - wM - 6;
    const opts78 = {
      x: x78r, y: 856,
      font: `900 156px ${FONT_SERIF}`,
      color: '#ffffff', letterSpacing: -3.9,
      align: 'right',
      opacity: s.opacity, scale: s.scale, blur: s.blur, translateY: s.ty,
      punchScale: c78.scale,
    };
    drawGhostTrail(ctx, lt, c78.display, opts78,
      { at: 1.95, dur: 0.40, offsetY: 10, extraScale: 0.08, blur: 20, alpha: 0.42 });
    drawTextBlock(ctx, c78.display, opts78);
  }
  s = slamInState(lt, { inAt: 1.98, dur: 0.26, offsetY: 12 });
  if (s) {
    drawTextBlock(ctx, 'M', {
      x: 1920 - 140, y: 856,
      font: `900 108px ${FONT_SERIF}`,
      color: '#ffffff', letterSpacing: -2.16,
      align: 'right',
      opacity: s.opacity, translateY: s.ty,
    });
  }

  // SECONDARY italic caption — right-aligned
  s = slamInState(lt, { inAt: 2.18, dur: 0.30, offsetY: 16 });
  if (s) {
    drawTextBlock(ctx, 'survivors in the US alone.', {
      x: 1920 - 140, y: 1018,
      font: `italic 500 30px ${FONT_SERIF}`,
      color: 'rgba(255,255,255,0.62)',
      align: 'right',
      opacity: s.opacity, translateY: s.ty,
    });
  }

  // Referencia removida para evitar sobreposición
}

function renderBlock1Beat2(ctx, t) {
  if (t < 4.00 || t > 9.95) return;
  const lt = t - 4.00;

  // ── PRIMARY — "673" hero ──
  let s = slamInState(lt, { inAt: 0.02, dur: 0.34, offsetY: 32, fromScale: 0.92, blurPx: 5,
                              outAt: 5.30, outDur: 0.55 });
  const c673 = countUpValue(lt, { inAt: 0.05, dur: 0.50, from: 0, to: 673, decimals: 0, punchScale: 1.08 });
  if (s && c673) {
    const opts = {
      x: 144, y: 300,
      font: `900 320px ${FONT_SERIF}`,
      color: '#ffffff', letterSpacing: -8,
      opacity: s.opacity, scale: s.scale, blur: s.blur, translateY: s.ty,
      punchScale: c673.scale,
    };
    // Stronger ghost trail on landing
    drawGhostTrail(ctx, lt, c673.display, opts,
      { at: 0.52, dur: 0.60, offsetY: 18, extraScale: 0.12, blur: 32, alpha: 0.62 });
    drawTextBlock(ctx, c673.display, opts);
  }

  // ── SECONDARY prose ──
  s = slamInState(lt, { inAt: 0.62, dur: 0.34, offsetY: 22, outAt: 5.30, outDur: 0.55 });
  if (s) {
    drawTextBlock(ctx, 'patients per clinician.', {
      x: 800, y: 620,
      font: `700 64px ${FONT_SERIF}`,
      color: '#ffffff', letterSpacing: -0.32,
      opacity: s.opacity, translateY: s.ty,
    });
  }

  // Hairline divider
  drawGlowLine(ctx, lt, {
    x: 144, y: 700, length: 1632, thickness: 1,
    inAt: 1.38, drawDur: 0.34, color: 'rgba(74,158,255,0.55)', glow: 4,
    outAt: 5.30, outDur: 0.55,
  });

  // ── SECONDARY stats ── "2 visits a week." + "5 days blind."
  s = slamInState(lt, { inAt: 1.52, dur: 0.32, offsetY: 22, outAt: 3.10, outDur: 0.30 });
  if (s) {
    drawTextBlock(ctx, '2', {
      x: 144, y: 740,
      font: `900 148px ${FONT_SERIF}`,
      color: '#ffffff', letterSpacing: -2.96,
      opacity: s.opacity, translateY: s.ty,
    });
    ctx.save();
    ctx.font = `900 148px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-2.96px';
    const w2 = ctx.measureText('2').width;
    ctx.restore();
    drawTextBlock(ctx, 'visits a week.', {
      x: 144 + w2 + 28, y: 800,
      font: `500 46px ${FONT_SERIF}`,
      color: '#ffffff',
      opacity: s.opacity, translateY: s.ty,
    });
  }
  s = slamInState(lt, { inAt: 1.72, dur: 0.32, offsetY: 22, outAt: 3.10, outDur: 0.30 });
  if (s) {
    drawTextBlock(ctx, '5', {
      x: 1020, y: 740,
      font: `900 148px ${FONT_SERIF}`,
      color: '#ffffff', letterSpacing: -2.96,
      opacity: s.opacity, translateY: s.ty,
    });
    ctx.save();
    ctx.font = `900 148px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-2.96px';
    const w5 = ctx.measureText('5').width;
    ctx.restore();
    drawTextBlock(ctx, 'days blind.', {
      x: 1020 + w5 + 28, y: 800,
      font: `500 46px ${FONT_SERIF}`,
      color: '#ffffff',
      opacity: s.opacity, translateY: s.ty,
    });
  }

  // ── GEOMETRY — week timeline showing 2 ticks (visits) and 5 dark cells (blind) ──
  // Only visible during stats, then transitions out before accent line.
  if (lt > 2.50 && lt < 3.40) {
    const visT = clamp((lt - 2.50) / 0.40, 0, 1) * (1 - clamp((lt - 3.10) / 0.30, 0, 1));
    ctx.save();
    ctx.globalAlpha = visT;
    // Week grid: 7 cells across, only 2 marked (visits) — at index 1, 4
    const gx = 144, gy = 928, gW = 1100, cellW = gW / 7, gH = 22;
    for (let i = 0; i < 7; i++) {
      const cx = gx + i * cellW;
      // Track
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fillRect(cx + 3, gy, cellW - 6, gH);
      const isVisit = (i === 1 || i === 4);
      if (isVisit) {
        ctx.shadowColor = '#4A9EFF';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#4A9EFF';
        ctx.fillRect(cx + 3, gy, cellW - 6, gH);
        ctx.shadowBlur = 0;
      } else {
        // hatch lines for "blind" days
        ctx.strokeStyle = 'rgba(255,107,107,0.30)';
        ctx.lineWidth = 1;
        for (let h = -gH; h < cellW + gH; h += 8) {
          ctx.beginPath();
          ctx.moveTo(cx + 3 + h, gy);
          ctx.lineTo(cx + 3 + h - gH, gy + gH);
          ctx.stroke();
        }
      }
      ctx.shadowBlur = 0;
      // Day label
      const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
      ctx.font = `500 10px ${FONT_MONO}`;
      if ('letterSpacing' in ctx) ctx.letterSpacing = '1px';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.fillText(dayLabels[i], cx + cellW / 2, gy + gH + 6);
    }
    // Caption
    ctx.font = `500 11px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '2px';
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.textAlign = 'right';
    ctx.fillText('OBSERVED ÷ UNOBSERVED', 1920 - 144, gy + 4);
    ctx.restore();
  }

  // ── PRIMARY accent — "Recovery happens every day." + "Clinical insight doesn't." with gradient ──
  s = slamInState(lt, { inAt: 3.28, dur: 0.34, offsetY: 20, outAt: 5.30, outDur: 0.55 });
  if (s) {
    ctx.save();
    ctx.globalAlpha = s.opacity;
    ctx.translate(960, 868 + s.ty);
    ctx.font = `italic 700 68px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.36px';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';

    const grad = ctx.createLinearGradient(-400, 0, 400, 0);
    grad.addColorStop(0, '#4A9EFF');
    grad.addColorStop(0.5, '#00D9FF');
    grad.addColorStop(1, '#4A9EFF');

    ctx.shadowColor = '#4A9EFF';
    ctx.shadowBlur = 28;
    ctx.fillStyle = grad;
    ctx.fillText('Recovery happens every day.', 0, 0);
    ctx.restore();
  }
  s = slamInState(lt, { inAt: 3.62, dur: 0.34, offsetY: 20, outAt: 5.30, outDur: 0.55 });
  if (s) {
    ctx.save();
    ctx.globalAlpha = s.opacity;
    ctx.translate(960, 956 + s.ty);
    ctx.font = `italic 700 68px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.36px';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';

    const grad = ctx.createLinearGradient(-400, 0, 400, 0);
    grad.addColorStop(0, '#4A9EFF');
    grad.addColorStop(0.5, '#00D9FF');
    grad.addColorStop(1, '#4A9EFF');

    ctx.shadowColor = '#4A9EFF';
    ctx.shadowBlur = 28;
    ctx.fillStyle = grad;
    ctx.fillText("Clinical insight doesn't.", 0, 0);
    ctx.restore();
  }
}

function renderBlock1Canvas(ctx, t) {
  if (t > 11.0) return;

  // Atmosphere
  drawAtmosphereNavy(ctx, t, 1.0);

  // Background dust (low intensity)
  drawDust(ctx, t, 0.5, '#9bb6d6');

  // Section chrome
  // Section labels removidos

  // Beats
  renderBlock1Beat1(ctx, t);
  renderBlock1Beat2(ctx, t);

  // Between-beat transition (3.42)
  drawScanFlash(ctx, t - 3.42, 0.12, 0.08, 0.95);

  // Vignette + grain (upgraded: 3% opacity, slower drift)
  drawVignette(ctx, 0.42);
  drawGrain(ctx, t, 0.030);
}

Object.assign(window, { renderBlock1Canvas });
