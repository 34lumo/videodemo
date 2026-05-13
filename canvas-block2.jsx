// canvas-block2.jsx — Block 2: The Product Enters. 0:11 → 0:18
// Atmosphere: deep navy holding from B1, transitions toward teal-ish.
// No images. Right side has a PROCEDURAL clinical viewport — pure geometry
// communicating "system view": grid, crosshair, face mesh dots, waveform.
// Left side: text panel (primary serif + secondary mono + tertiary system stat).

function renderBlock2Beat1(ctx, t) {
  // Stage 11.0 → 14.0
  if (t < 11.0 || t > 14.0) return;
  const lt = t - 11.0;

  const vp = { x: 880, y: 240, w: 940, h: 600 };

  // ── Viewport background: dark with subtle grid ──
  ctx.save();
  ctx.beginPath();
  ctx.rect(vp.x, vp.y, vp.w, vp.h);
  ctx.clip();

  // Inner gradient — slightly lighter than the atmosphere
  const innerGrad = ctx.createLinearGradient(vp.x, vp.y, vp.x + vp.w, vp.y + vp.h);
  innerGrad.addColorStop(0, 'rgba(12, 20, 32, 0.92)');
  innerGrad.addColorStop(1, 'rgba(6, 10, 18, 0.95)');
  ctx.fillStyle = innerGrad;
  ctx.fillRect(vp.x, vp.y, vp.w, vp.h);

  // Grid section inside viewport
  drawGridSection(ctx, {
    x: vp.x, y: vp.y, w: vp.w, h: vp.h, cellSize: 56,
    color: 'rgba(74,158,255,0.08)', alpha: clamp(lt / 0.4, 0, 1),
  });

  // Crosshair on a face area
  if (lt > 0.55) {
    const crossAlpha = clamp((lt - 0.55) / 0.35, 0, 1) * (1 - clamp((lt - 2.85) / 0.20, 0, 1));
    drawCrosshair(ctx, {
      cx: vp.x + vp.w * 0.50, cy: vp.y + vp.h * 0.42,
      ringR: 70, armLen: 32,
      color: '#4A9EFF', alpha: crossAlpha,
      label: 'FACE · LOCK',
      pulseT: (lt * 0.7) % 1,
    });
  }

  // Face mesh dots — emerging in upper half (procedural)
  if (lt > 0.75) {
    drawFaceMesh(ctx, lt - 0.75, {
      cx: vp.x + vp.w * 0.50, cy: vp.y + vp.h * 0.42,
      w: 240, h: 320,
      inAt: 0, alpha: clamp(lt - 0.75, 0, 1) * (1 - clamp((lt - 2.85) / 0.20, 0, 1)),
      density: 0.6, jitterAmp: 0.6,
    });
  }

  // Waveform at bottom of viewport — vocal stability monitor
  if (lt > 1.10) {
    const wfA = clamp((lt - 1.10) / 0.30, 0, 1) * (1 - clamp((lt - 2.85) / 0.20, 0, 1));
    drawWaveform(ctx, lt, {
      x: vp.x + 30, y: vp.y + vp.h - 100, w: vp.w - 60, h: 64,
      alpha: wfA * 0.85, color: '#4A9EFF',
      amplitude: 0.55, speed: 1.2, bars: 64,
    });
  }
  ctx.restore();

  // ── Monitor topbar — drawn outside the clip ──
  ctx.save();
  const topG = ctx.createLinearGradient(0, vp.y, 0, vp.y + 36);
  topG.addColorStop(0, 'rgba(0,0,0,0.92)');
  topG.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = topG;
  ctx.fillRect(vp.x, vp.y, vp.w, 36);
  // Hairline under topbar
  ctx.fillStyle = 'rgba(74,158,255,0.30)';
  ctx.fillRect(vp.x, vp.y + 35, vp.w, 1);
  // Topbar text
  ctx.shadowColor = '#4A9EFF'; ctx.shadowBlur = 8;
  ctx.fillStyle = '#4A9EFF';
  ctx.beginPath(); ctx.arc(vp.x + 18, vp.y + 18, 3, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.font = `500 12px ${FONT_MONO}`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = '2.64px';
  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.fillStyle = '#4A9EFF';
  ctx.fillText('PATIENT SESSION · HOME ENVIRONMENT', vp.x + 30, vp.y + 18);
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.fillText('CAM-01 · 30 FPS', vp.x + vp.w - 14, vp.y + 18);

  // Bottom-right readout
  ctx.font = `500 12px ${FONT_MONO}`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = '1.92px';
  ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(0,0,0,0.65)';
  ctx.fillRect(vp.x + vp.w - 152, vp.y + vp.h - 30, 138, 22);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText('T+00:43 / 01:00', vp.x + vp.w - 22, vp.y + vp.h - 19);
  ctx.restore();

  // Clinical frame around viewport
  drawClinicalFrame(ctx, lt, {
    vpX: vp.x, vpY: vp.y, vpW: vp.w, vpH: vp.h,
    inAt: 0.05, totalDur: 0.46, trace: true, color: '#4A9EFF',
  });
  drawCornerBrackets(ctx, lt, {
    vpX: vp.x, vpY: vp.y, vpW: vp.w, vpH: vp.h, inAt: 0.40, dur: 0.30,
  });

  // ── LEFT TEXT PANEL ──

  // TERTIARY — system status top-left mono caps row
  let s = slamInState(lt, { inAt: 0.10, dur: 0.28, offsetY: 8 });
  if (s) {
    drawTextBlock(ctx, '○ CAPTURE · INITIALIZED', {
      x: 120, y: 234,
      font: `500 12px ${FONT_MONO}`,
      color: 'rgba(74,158,255,0.85)', letterSpacing: 2.4,
      opacity: s.opacity, translateY: s.ty,
    });
  }

  // PRIMARY — "60" with count-up
  s = slamInState(lt, { inAt: 0.38, dur: 0.34, offsetY: 28, fromScale: 0.94, blurPx: 4 });
  const c60 = countUpValue(lt, { inAt: 0.45, dur: 0.55, from: 17, to: 60, decimals: 0, punchScale: 1.05 });
  if (s && c60) {
    const opts = {
      x: 120, y: 280,
      font: `900 280px ${FONT_SERIF}`,
      color: '#ffffff', letterSpacing: -7,
      opacity: s.opacity, scale: s.scale, blur: s.blur, translateY: s.ty,
      punchScale: c60.scale,
    };
    drawGhostTrail(ctx, lt, c60.display, opts,
      { at: 1.00, dur: 0.50, offsetY: 14, extraScale: 0.08, blur: 24, alpha: 0.48 });
    drawTextBlock(ctx, c60.display, opts);
  }

  // SECONDARY — "SECONDS."
  s = slamInState(lt, { inAt: 1.05, dur: 0.30, offsetY: 14 });
  if (s) {
    drawTextBlock(ctx, 'SECONDS.', {
      x: 124, y: 564,
      font: `500 36px ${FONT_MONO}`,
      color: '#ffffff', letterSpacing: 7.2,
      opacity: s.opacity, translateY: s.ty,
    });
  }

  // Hairline divider
  drawGlowLine(ctx, lt, {
    x: 124, y: 666, length: 520, thickness: 1,
    inAt: 1.30, drawDur: 0.34, color: 'rgba(255,255,255,0.22)', glow: 0,
  });

  // SECONDARY italic — "Any camera. Any device."
  s = slamInState(lt, { inAt: 1.45, dur: 0.38, offsetY: 18 });
  if (s) {
    drawTextBlock(ctx, 'Any camera. Any device.', {
      x: 124, y: 696,
      font: `italic 500 42px ${FONT_SERIF}`,
      color: 'rgba(255,255,255,0.78)',
      opacity: s.opacity, translateY: s.ty,
    });
  }

  // TERTIARY — small metadata row bottom-left
  s = slamInState(lt, { inAt: 1.95, dur: 0.30, offsetY: 8 });
  if (s) {
    drawTextBlock(ctx, 'WEBRTC · CV PIPELINE · NO SDK', {
      x: 124, y: 760,
      font: `500 12px ${FONT_MONO}`,
      color: 'rgba(255,255,255,0.42)', letterSpacing: 2.5,
      opacity: s.opacity, translateY: s.ty,
    });
  }
}

function renderBlock2Beat2(ctx, t) {
  if (t < 14.0 || t > 17.62) return;
  const lt = t - 14.0;

  const vp = { x: 880, y: 240, w: 940, h: 600 };

  // ── Viewport background ──
  ctx.save();
  ctx.beginPath();
  ctx.rect(vp.x, vp.y, vp.w, vp.h);
  ctx.clip();
  const innerGrad = ctx.createLinearGradient(vp.x, vp.y, vp.x + vp.w, vp.y + vp.h);
  innerGrad.addColorStop(0, 'rgba(10, 22, 38, 0.95)');
  innerGrad.addColorStop(1, 'rgba(6, 12, 22, 0.97)');
  ctx.fillStyle = innerGrad;
  ctx.fillRect(vp.x, vp.y, vp.w, vp.h);

  // Grid
  drawGridSection(ctx, {
    x: vp.x, y: vp.y, w: vp.w, h: vp.h, cellSize: 56,
    color: 'rgba(74,158,255,0.08)', alpha: 1,
  });

  // Hand keypoints — communicates "no hardware, just camera"
  drawHandKeypoints(ctx, lt, {
    cx: vp.x + vp.w * 0.48, cy: vp.y + vp.h * 0.46,
    size: 280,
    inAt: 0.10,
    alpha: 1 - clamp((lt - 3.40) / 0.20, 0, 1),
    color: '#4A9EFF', pointSize: 4.5, showBones: true,
    revealStaggerDur: 0.55, jitterAmp: 1.2,
  });

  // Waveform — vocal stability (more active this beat)
  const wfA = clamp(lt / 0.30, 0, 1) * (1 - clamp((lt - 3.40) / 0.20, 0, 1));
  drawWaveform(ctx, lt, {
    x: vp.x + 30, y: vp.y + vp.h - 90, w: vp.w - 60, h: 64,
    alpha: wfA * 0.95, color: '#4A9EFF',
    amplitude: 0.78, speed: 1.6, bars: 80,
  });
  ctx.restore();

  // Topbar
  ctx.save();
  const topG = ctx.createLinearGradient(0, vp.y, 0, vp.y + 36);
  topG.addColorStop(0, 'rgba(0,0,0,0.92)');
  topG.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = topG;
  ctx.fillRect(vp.x, vp.y, vp.w, 36);
  ctx.fillStyle = 'rgba(74,158,255,0.30)';
  ctx.fillRect(vp.x, vp.y + 35, vp.w, 1);
  ctx.shadowColor = '#4A9EFF'; ctx.shadowBlur = 8;
  ctx.fillStyle = '#4A9EFF';
  ctx.beginPath(); ctx.arc(vp.x + 18, vp.y + 18, 3, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.font = `500 12px ${FONT_MONO}`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = '2.64px';
  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.fillStyle = '#4A9EFF';
  ctx.fillText('ACTIVE CHALLENGE · VOCAL STABILITY', vp.x + 30, vp.y + 18);
  ctx.textAlign = 'right';
  // pulsing REC dot
  const pulse = 0.5 + 0.5 * Math.sin(lt * 4.5);
  ctx.globalAlpha = 0.55 + 0.45 * pulse;
  ctx.shadowColor = '#4A9EFF'; ctx.shadowBlur = 10;
  ctx.fillStyle = '#4A9EFF';
  ctx.beginPath(); ctx.arc(vp.x + vp.w - 90, vp.y + 18, 3.5, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0; ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.fillText('REC · 16 KHZ', vp.x + vp.w - 14, vp.y + 18);

  // Bottom-right readout
  ctx.font = `500 12px ${FONT_MONO}`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = '1.92px';
  ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(0,0,0,0.65)';
  ctx.fillRect(vp.x + vp.w - 192, vp.y + vp.h - 30, 178, 22);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText('f₀ 132 Hz · SNR 24.8 dB', vp.x + vp.w - 22, vp.y + vp.h - 19);
  ctx.restore();

  // Clinical frame (instant)
  drawClinicalFrame(ctx, lt, {
    vpX: vp.x, vpY: vp.y, vpW: vp.w, vpH: vp.h,
    inAt: 0.04, totalDur: 0.04, trace: false, color: '#4A9EFF',
  });
  drawCornerBrackets(ctx, lt, {
    vpX: vp.x, vpY: vp.y, vpW: vp.w, vpH: vp.h, inAt: 0.08, dur: 0.28,
  });

  // ── LEFT TEXT PANEL ──

  // TERTIARY system stat
  let s = slamInState(lt, { inAt: 0.04, dur: 0.28, offsetY: 8 });
  if (s) {
    drawTextBlock(ctx, '● SIGNAL · 14 BIOMARKERS · ACTIVE', {
      x: 120, y: 234,
      font: `500 12px ${FONT_MONO}`,
      color: 'rgba(74,158,255,0.85)', letterSpacing: 2.4,
      opacity: s.opacity, translateY: s.ty,
    });
  }

  // PRIMARY — "Zero" serif
  s = slamInState(lt, { inAt: 0.18, dur: 0.36, offsetY: 28, fromScale: 0.94, blurPx: 4 });
  if (s) {
    const opts = {
      x: 120, y: 280,
      font: `900 280px ${FONT_SERIF}`,
      color: '#ffffff', letterSpacing: -7,
      opacity: s.opacity, scale: s.scale, blur: s.blur, translateY: s.ty,
    };
    drawGhostTrail(ctx, lt, 'Zero', opts,
      { at: 0.45, dur: 0.45, offsetY: 14, extraScale: 0.08, blur: 22, alpha: 0.45 });
    drawTextBlock(ctx, 'Zero', opts);
  }

  // SECONDARY — "HARDWARE."
  s = slamInState(lt, { inAt: 0.58, dur: 0.30, offsetY: 14 });
  if (s) {
    drawTextBlock(ctx, 'HARDWARE.', {
      x: 124, y: 564,
      font: `500 36px ${FONT_MONO}`,
      color: '#ffffff', letterSpacing: 7.2,
      opacity: s.opacity, translateY: s.ty,
    });
  }

  drawGlowLine(ctx, lt, {
    x: 124, y: 666, length: 520, thickness: 1,
    inAt: 0.86, drawDur: 0.34, color: 'rgba(255,255,255,0.22)', glow: 0,
  });

  // PRIMARY accent — "From home."
  s = slamInState(lt, { inAt: 1.05, dur: 0.46, offsetY: 14, fromScale: 0.98, blurPx: 2 });
  if (s) {
    drawTextBlock(ctx, 'From home.', {
      x: 124, y: 696,
      font: `italic 500 50px ${FONT_SERIF}`,
      color: '#4A9EFF',
      opacity: s.opacity, translateY: s.ty,
    });
  }

  // TERTIARY metadata
  s = slamInState(lt, { inAt: 1.55, dur: 0.30, offsetY: 8 });
  if (s) {
    drawTextBlock(ctx, '21 HAND · 468 FACE · GAZE · F₀ · SNR', {
      x: 124, y: 760,
      font: `500 12px ${FONT_MONO}`,
      color: 'rgba(255,255,255,0.42)', letterSpacing: 2.5,
      opacity: s.opacity, translateY: s.ty,
    });
  }
}

function renderBlock2Canvas(ctx, t) {
  if (t < 11.0 || t > 18.0) return;

  // Section chrome
  if (t >= 11.05 && t < 13.95) drawSectionLabel(ctx, t, '§ 03 · Capture', { inAt: 11.05, outAt: 13.65 });
  if (t >= 14.05 && t < 17.30) drawSectionLabel(ctx, t, '§ 04 · Signal',  { inAt: 14.05, outAt: 17.20 });

  renderBlock2Beat1(ctx, t);
  renderBlock2Beat2(ctx, t);

  // Vertical wipe transition out (Block 2 → Block 3)
  drawVerticalWipe(ctx, t - 17.55, 0.36, '#4A9EFF');
}

Object.assign(window, { renderBlock2Canvas });
