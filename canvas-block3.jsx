// canvas-block3.jsx — Block 3: Real-Time Tracking. 0:18 → 0:27
// Atmosphere: deep teal with blue keypoint glow.
// HERO geometry block: full clinical observation rendered as pure procedural
// graphics — hand mesh (21 keypoints), face mesh (procedural dot cloud),
// waveform (vocal biomarker monitor), bio-data sidebar with rolling values.

function renderBlock3Beat1(ctx, t) {
  // Stage 18.0 → 21.0 — Tight on hand, then pull back to full clinical view
  if (t < 18.0 || t > 21.0) return;
  const lt = t - 18.0;

  // Keyframes: hand constellation scales from 5x (tight) to 1x (full view).
  // Hand position pans from center to right-mid as we pull back and reveal
  // the face + waveform + metrics.
  const kfs = [
    { t: 0.00, handScale: 5.0, handCX: 960, handCY: 540, reveal: 0 },
    { t: 1.00, handScale: 5.0, handCX: 960, handCY: 540, reveal: 0 },
    { t: 2.70, handScale: 1.0, handCX: 1180, handCY: 560, reveal: 1, ease: Easing.easeInOutCubic },
    { t: 3.00, handScale: 1.0, handCX: 1180, handCY: 560, reveal: 1 },
  ];
  const st = lerpKeyframes(kfs, lt);

  // Hand keypoints (tight crop → pulled back)
  drawHandKeypoints(ctx, lt, {
    cx: st.handCX, cy: st.handCY,
    size: 280 * st.handScale,
    inAt: 0,
    alpha: 1,
    color: '#4A9EFF',
    pointSize: 5,
    showBones: true,
    revealStaggerDur: 0.10,
    jitterAmp: 1.2,
  });

  // ── Reveal layer: face mesh, waveform, panels — appear as we pull back ──
  if (st.reveal > 0.05) {
    const rev = st.reveal;

    // Face mesh on the left half
    drawFaceMesh(ctx, lt, {
      cx: 600, cy: 540, w: 280, h: 360,
      inAt: 1.50, alpha: rev * 0.85, density: 0.7, jitterAmp: 0.5,
    });

    // Crosshair on face
    drawCrosshair(ctx, {
      cx: 600, cy: 480, ringR: 80, armLen: 28,
      color: '#4A9EFF', alpha: rev * 0.7,
      label: 'FACE · 468',
      pulseT: (lt * 0.6) % 1,
    });

    // Waveform at bottom — vocal biomarker
    drawWaveform(ctx, lt, {
      x: 120, y: 880, w: 1680, h: 80,
      alpha: rev * 0.7, color: '#4A9EFF',
      amplitude: 0.6, speed: 1.3, bars: 0, thickness: 2,
    });

    // Bio sidebar — vertical strip on far right with rolling metric values
    drawBioSidebar(ctx, lt, { x: 1800, y: 240, w: 100, h: 600, alpha: rev });
  }

  // Tertiary chrome — "LIVE" indicator that flashes in once pull-back starts
  if (st.reveal > 0.15) {
    const pulse = 0.5 + 0.5 * Math.sin(lt * 5.2);
    ctx.save();
    ctx.globalAlpha = st.reveal;
    ctx.shadowColor = '#4A9EFF'; ctx.shadowBlur = 12 * pulse;
    ctx.fillStyle = '#4A9EFF';
    ctx.beginPath(); ctx.arc(150, 996, 5, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.font = `500 14px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '2.8px';
    ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    ctx.fillStyle = '#4A9EFF';
    ctx.fillText('CAM-01 · DIRECT OBSERVATION · LIVE', 168, 996);
    ctx.restore();
  }
}

function drawBioSidebar(ctx, lt, { x, y, w, h, alpha = 1 }) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const labels = [
    { label: 'PINZA',     v: 88 },
    { label: 'APERTURA',  v: 84 },
    { label: 'DEDOS',     v: 76 },
    { label: 'ROT.MUÑECA', v: 71 },
    { label: 'TEMBLOR',   v: 12 },
    { label: 'SIMETRÍA',  v: 82 },
    { label: 'SONRISA',   v: 78 },
    { label: 'VOZ',       v: 90 },
  ];
  const rowH = h / labels.length;
  labels.forEach((row, i) => {
    const ry = y + i * rowH + rowH / 2;
    // Live-ish jitter
    const liveJitter = Math.sin(lt * 1.8 + i * 1.3) * 1.2;
    const v = row.v + liveJitter;
    // Label
    ctx.font = `500 9px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '1.2px';
    ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.fillText(row.label, x, ry - 10);
    // Value
    ctx.font = `500 14px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0.5px';
    ctx.fillStyle = '#4A9EFF';
    ctx.fillText(v.toFixed(0), x, ry + 6);
    // Mini-bar
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.fillRect(x + 32, ry + 4, 48, 2);
    ctx.shadowColor = '#4A9EFF'; ctx.shadowBlur = 4;
    ctx.fillStyle = '#4A9EFF';
    ctx.fillRect(x + 32, ry + 4, 48 * (v / 100), 2);
    ctx.shadowBlur = 0;
  });
  ctx.restore();
}

function renderBlock3Beat2(ctx, t) {
  // Stage 21.0 → 27.0 — Four claims stack in on the left while clinical view continues
  if (t < 21.0 || t > 27.0) return;
  const lt = t - 21.0;

  // Continue the clinical view on the right (hand + face + waveform + sidebar)
  // Slightly smaller/recede to make room for text panel
  const recede = clamp(lt / 0.50, 0, 1) * (1 - clamp((lt - 5.20) / 0.40, 0, 1));
  ctx.save();
  ctx.globalAlpha = recede;
  drawHandKeypoints(ctx, lt + 3.0, {
    cx: 1380, cy: 600, size: 260,
    inAt: 0, alpha: 1, color: '#4A9EFF',
    pointSize: 4, showBones: true, revealStaggerDur: 0.1, jitterAmp: 1.0,
  });
  drawFaceMesh(ctx, lt + 3.0, {
    cx: 1080, cy: 580, w: 200, h: 260,
    inAt: 0, alpha: 0.75, density: 0.55, jitterAmp: 0.5,
  });
  drawCrosshair(ctx, {
    cx: 1080, cy: 530, ringR: 56, armLen: 18,
    color: '#4A9EFF', alpha: 0.6, pulseT: (lt * 0.6) % 1,
  });
  drawWaveform(ctx, lt + 3.0, {
    x: 1020, y: 800, w: 700, h: 56,
    alpha: 0.65, color: '#4A9EFF',
    amplitude: 0.5, speed: 1.4, bars: 0, thickness: 2,
  });
  drawBioSidebar(ctx, lt + 3.0, { x: 1800, y: 280, w: 100, h: 540, alpha: 0.95 });
  ctx.restore();

  // ── FOUR CLAIMS on the LEFT ──
  // Tertiary chrome
  let s = slamInState(lt, { inAt: 0.05, dur: 0.28, offsetY: 8 });
  if (s) {
    drawTextBlock(ctx, '○ SIGNAL · MULTIMODAL · SYNCHRONIZED', {
      x: 120, y: 220,
      font: `500 12px ${FONT_MONO}`,
      color: 'rgba(74,158,255,0.85)', letterSpacing: 2.4,
      opacity: s.opacity, translateY: s.ty,
    });
  }

  // PRIMARY 1 — "21 hand landmarks."
  s = slamInState(lt, { inAt: 0.50, dur: 0.34, offsetY: 26, fromScale: 0.95, blurPx: 3,
                         outAt: 5.20, outDur: 0.35 });
  const c21 = countUpValue(lt, { inAt: 0.55, dur: 0.42, from: 0, to: 21, decimals: 0, punchScale: 1.04 });
  if (s && c21) {
    drawTextBlock(ctx, `${c21.display} hand landmarks.`, {
      x: 120, y: 290,
      font: `800 64px ${FONT_SERIF}`,
      color: '#ffffff', letterSpacing: -0.96,
      opacity: s.opacity, scale: s.scale, blur: s.blur, translateY: s.ty,
      punchScale: c21.scale,
    });
  }

  // PRIMARY 2 — "468 facial landmarks."
  s = slamInState(lt, { inAt: 1.70, dur: 0.34, offsetY: 26, fromScale: 0.95, blurPx: 3,
                         outAt: 5.20, outDur: 0.35 });
  const c468 = countUpValue(lt, { inAt: 1.75, dur: 0.50, from: 0, to: 468, decimals: 0, punchScale: 1.04 });
  if (s && c468) {
    drawTextBlock(ctx, `${c468.display} facial landmarks.`, {
      x: 120, y: 400,
      font: `800 64px ${FONT_SERIF}`,
      color: '#ffffff', letterSpacing: -0.96,
      opacity: s.opacity, scale: s.scale, blur: s.blur, translateY: s.ty,
      punchScale: c468.scale,
    });
  }

  // PRIMARY 3 — "Gaze. Pinch. Symmetry. Voice."
  s = slamInState(lt, { inAt: 2.90, dur: 0.34, offsetY: 26, fromScale: 0.95, blurPx: 3,
                         outAt: 5.20, outDur: 0.35 });
  if (s) {
    drawTextBlock(ctx, 'Gaze. Pinch. Symmetry. Voice.', {
      x: 120, y: 510,
      font: `800 56px ${FONT_SERIF}`,
      color: '#ffffff', letterSpacing: -0.84,
      opacity: s.opacity, scale: s.scale, blur: s.blur, translateY: s.ty,
    });
  }

  // Divider
  drawGlowLine(ctx, lt, {
    x: 124, y: 630, length: 700, thickness: 1,
    inAt: 4.00, drawDur: 0.34, color: 'rgba(74,158,255,0.42)', glow: 4,
    outAt: 5.20, outDur: 0.35,
  });

  // PRIMARY accent — mono BV_BLUE
  s = slamInState(lt, { inAt: 4.10, dur: 0.32, offsetY: 14, fromScale: 0.97, blurPx: 2,
                         outAt: 5.20, outDur: 0.35 });
  if (s) {
    drawTextBlock(ctx, 'ALL CAPTURED. SIMULTANEOUSLY.', {
      x: 120, y: 656,
      font: `500 22px ${FONT_MONO}`,
      color: '#4A9EFF', letterSpacing: 4.84,
      opacity: s.opacity, scale: s.scale, blur: s.blur, translateY: s.ty,
    });
  }

  // TERTIARY — small mono metadata bottom
  s = slamInState(lt, { inAt: 4.40, dur: 0.30, offsetY: 8 });
  if (s) {
    drawTextBlock(ctx, '[ FRAME-SYNC · 30FPS · CV PIPELINE · LATENCY <40MS ]', {
      x: 120, y: 700,
      font: `500 11px ${FONT_MONO}`,
      color: 'rgba(255,255,255,0.42)', letterSpacing: 1.8,
      opacity: s.opacity, translateY: s.ty,
    });
  }
}

function renderBlock3Canvas(ctx, t) {
  if (t < 18.0 || t > 27.0) return;

  // Section chrome (Beat 2)
  if (t >= 21.40 && t < 26.50) drawSectionLabel(ctx, t, '§ 05 · Multimodal', { inAt: 21.40, outAt: 26.10 });

  renderBlock3Beat1(ctx, t);
  renderBlock3Beat2(ctx, t);

  // Closing transition: geometry collapse (3→4)
  drawGeometryCollapse(ctx, t - 26.35, 0.45);
}

Object.assign(window, { renderBlock3Canvas });
