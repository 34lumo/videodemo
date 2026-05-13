// canvas-block2.jsx — Block 2: The Product Enters. 0:11 → 0:18
// Atmosphere: deep navy holding from B1, transitions toward teal-ish.
// Right side shows the actual game screenshot with clinical UI overlay.
// Left side: text panel (primary serif + secondary mono + tertiary system stat).

// Load game screenshot
let gameImage = null;
let gameImageLoaded = false;
(function loadGameImage() {
  const img = new Image();
  img.onload = function() {
    gameImage = img;
    gameImageLoaded = true;
  };
  img.onerror = function() {
    console.error('Failed to load juego.png');
  };
  img.src = './juego.png';
})();

function renderBlock2Beat1(ctx, t) {
  // Stage 11.0 → 14.0
  if (t < 11.0 || t > 14.0) return;
  const lt = t - 11.0;

  // Calculate viewport for game image - 55% of canvas width
  const canvasW = 1920;
  const imgW = canvasW * 0.55; // 55% width
  const imgH = imgW * (9/16); // Maintain 16:9 aspect ratio (assuming game is landscape)
  const imgX = canvasW - imgW - 50; // Right side with 50px margin
  const imgY = (1080 - imgH) / 2; // Vertically centered

  const vp = { x: imgX, y: imgY, w: imgW, h: imgH };

  // Don't render if image hasn't loaded
  if (!gameImageLoaded || !gameImage) {
    return; // Wait for image to load
  }

  // ── Color bleed effect — warm colors from game bleeding into dark bg ──
  const bleedFade = clamp(lt / 0.5, 0, 1);
  if (bleedFade > 0.01) {
    ctx.save();
    ctx.globalAlpha = bleedFade * 0.4;
    const bleedGrad = ctx.createRadialGradient(
      vp.x + vp.w / 2, vp.y + vp.h / 2, vp.w * 0.3,
      vp.x + vp.w / 2, vp.y + vp.h / 2, vp.w * 0.9
    );
    bleedGrad.addColorStop(0, 'rgba(255, 180, 100, 0.15)');
    bleedGrad.addColorStop(0.6, 'rgba(255, 140, 80, 0.08)');
    bleedGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = bleedGrad;
    ctx.fillRect(vp.x - 100, vp.y - 100, vp.w + 200, vp.h + 200);
    ctx.restore();
  }

  // ── Draw the game image ──
  ctx.save();
  const imgFade = clamp(lt / 0.4, 0, 1);
  ctx.globalAlpha = imgFade;

  // Draw image
  ctx.drawImage(gameImage, vp.x, vp.y, vp.w, vp.h);

  // Dark vignette on edges to blend naturally
  ctx.globalAlpha = imgFade * 0.6;
  const vignetteGrad = ctx.createRadialGradient(
    vp.x + vp.w / 2, vp.y + vp.h / 2, Math.min(vp.w, vp.h) * 0.3,
    vp.x + vp.w / 2, vp.y + vp.h / 2, Math.max(vp.w, vp.h) * 0.7
  );
  vignetteGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignetteGrad.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
  ctx.fillStyle = vignetteGrad;
  ctx.fillRect(vp.x, vp.y, vp.w, vp.h);

  ctx.restore();

  // ── Label above image with glow ──
  const labelFade = clamp((lt - 0.2) / 0.3, 0, 1);
  if (labelFade > 0.01) {
    ctx.save();
    ctx.globalAlpha = labelFade;
    ctx.font = `600 12px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '2.8px';
    ctx.textBaseline = 'bottom';
    ctx.textAlign = 'left';
    ctx.shadowColor = '#4A9EFF';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#4A9EFF';
    ctx.fillText('PATIENT SESSION · HOME ENVIRONMENT · CAM-01', vp.x, vp.y - 12);
    ctx.restore();
  }

  // Thin #4A9EFF hairline border around image (1px)
  const frameFade = clamp((lt - 0.05) / 0.3, 0, 1);
  if (frameFade > 0.01) {
    ctx.save();
    ctx.globalAlpha = frameFade;
    ctx.strokeStyle = '#4A9EFF';
    ctx.lineWidth = 1;
    ctx.strokeRect(vp.x, vp.y, vp.w, vp.h);
    ctx.restore();
  }

  // Corner brackets
  drawCornerBrackets(ctx, lt, {
    vpX: vp.x, vpY: vp.y, vpW: vp.w, vpH: vp.h, inAt: 0.40, dur: 0.30,
  });

  // ── LEFT TEXT PANEL ──

  // System status removido

  // PRIMARY — "60" with count-up
  let s = slamInState(lt, { inAt: 0.38, dur: 0.34, offsetY: 28, fromScale: 0.94, blurPx: 4 });
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

  // SECONDARY — "SECONDS." with gradient
  s = slamInState(lt, { inAt: 1.05, dur: 0.30, offsetY: 14 });
  if (s) {
    ctx.save();
    ctx.globalAlpha = s.opacity;
    ctx.translate(124, 564 + s.ty);
    ctx.font = `700 42px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '8.4px';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    const grad = ctx.createLinearGradient(0, 0, 300, 0);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(1, '#4A9EFF');

    ctx.shadowColor = '#4A9EFF';
    ctx.shadowBlur = 16;
    ctx.fillStyle = grad;
    ctx.fillText('SECONDS.', 0, 0);
    ctx.restore();
  }

  // Hairline divider with stronger glow
  drawGlowLine(ctx, lt, {
    x: 124, y: 666, length: 520, thickness: 2,
    inAt: 1.30, drawDur: 0.34, color: '#4A9EFF', glow: 12,
  });

  // SECONDARY italic — "Any camera. Any device." with glow
  s = slamInState(lt, { inAt: 1.45, dur: 0.38, offsetY: 18 });
  if (s) {
    ctx.save();
    ctx.globalAlpha = s.opacity;
    ctx.translate(124, 696 + s.ty);
    ctx.font = `italic 700 48px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-0.96px';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.shadowColor = 'rgba(255,255,255,0.5)';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Any camera. Any device.', 0, 0);
    ctx.restore();
  }

  // TERTIARY — small metadata row with cyan glow
  s = slamInState(lt, { inAt: 1.95, dur: 0.30, offsetY: 8 });
  if (s) {
    ctx.save();
    ctx.globalAlpha = s.opacity;
    ctx.translate(124, 760 + s.ty);
    ctx.font = `500 13px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '2.8px';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.shadowColor = '#00D9FF';
    ctx.shadowBlur = 8;
    ctx.fillStyle = 'rgba(0, 217, 255, 0.75)';
    ctx.fillText('WEBRTC · CV PIPELINE · NO SDK', 0, 0);
    ctx.restore();
  }

  // ── ADDITIONAL VISUAL ELEMENTS ──

  // Animated circle progress around "60" (optimized)
  if (lt > 0.45) {
    const progress60 = clamp((lt - 0.45) / 0.55, 0, 60);
    const alpha = clamp((lt - 0.45) / 0.3, 0, 1);

    const ringCX = 300;
    const ringCY = 420;
    const ringR = 180;

    ctx.globalAlpha = alpha;

    // Background track
    ctx.strokeStyle = 'rgba(74, 158, 255, 0.1)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(ringCX, ringCY, ringR, 0, Math.PI * 2);
    ctx.stroke();

    // Progress arc
    ctx.strokeStyle = '#4A9EFF';
    ctx.shadowColor = '#4A9EFF';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(ringCX, ringCY, ringR, -Math.PI / 2, -Math.PI / 2 + (progress60 / 60) * Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Floating data cards around the scene
  const dataCards = [
    { x: 140, y: 180, label: 'SESSION TIME', value: '60s', delay: 0.6 },
    { x: 140, y: 860, label: 'SETUP TIME', value: '0s', delay: 0.8 },
    { x: 1680, y: 200, label: 'ACCURACY', value: '98%', delay: 1.0 },
  ];

  // Optimized card rendering
  const cardW = 140;
  const cardH = 70;

  dataCards.forEach(card => {
    const cardT = lt - card.delay;
    if (cardT < 0) return;

    const cardFade = clamp(cardT / 0.25, 0, 1);
    if (cardFade < 0.01) return;

    ctx.globalAlpha = cardFade;

    // Card background
    ctx.fillStyle = 'rgba(15, 25, 35, 0.8)';
    ctx.shadowColor = '#4A9EFF';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.roundRect(card.x, card.y, cardW, cardH, 8);
    ctx.fill();

    // Border
    ctx.strokeStyle = '#4A9EFF';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Label
    ctx.font = `600 10px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '1.5px';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(74, 158, 255, 0.7)';
    ctx.fillText(card.label, card.x + 12, card.y + 12);

    // Value
    ctx.font = `900 28px ${FONT_MONO}`;
    ctx.fillStyle = '#4A9EFF';
    ctx.shadowColor = '#4A9EFF';
    ctx.shadowBlur = 8;
    ctx.fillText(card.value, card.x + 12, card.y + 32);
    ctx.shadowBlur = 0;
  });

  // Animated scan lines (optimized - only 2 lines)
  if (lt > 0.2) {
    const scanLines = 2;
    for (let i = 0; i < scanLines; i++) {
      const scanT = (lt * 0.3 + i * 0.5) % 2.0;
      const scanY = (scanT / 2.0) * 1080;
      const scanAlpha = Math.sin(scanT * Math.PI) * 0.12;

      if (scanAlpha > 0.01) {
        ctx.globalAlpha = scanAlpha;
        ctx.fillStyle = '#4A9EFF';
        ctx.fillRect(0, scanY, 1920, 1);
      }
    }
  }

  // Particle field around "60" (optimized - only 12 particles, batch rendering)
  if (lt > 0.5) {
    const particleCount = 12;
    ctx.fillStyle = '#4A9EFF';
    ctx.shadowColor = '#4A9EFF';
    ctx.shadowBlur = 6;

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 200 + Math.sin(lt * 2 + i) * 25;
      const px = 300 + Math.cos(angle) * radius;
      const py = 420 + Math.sin(angle) * radius;
      const pSize = 1.5 + Math.sin(lt * 3 + i * 0.5) * 0.5;
      const pAlpha = 0.25 + Math.sin(lt * 2 + i * 0.8) * 0.15;

      ctx.globalAlpha = pAlpha;
      ctx.beginPath();
      ctx.arc(px, py, pSize, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  // Corner tech brackets (optimized - batch rendering)
  const brackets = [
    { x: 100, y: 100, w: 60, h: 60, delay: 0.3 },
    { x: 1760, y: 100, w: 60, h: 60, delay: 0.4 },
    { x: 100, y: 920, w: 60, h: 60, delay: 0.5 },
    { x: 1760, y: 920, w: 60, h: 60, delay: 0.6 },
  ];

  // Batch all bracket drawing
  ctx.strokeStyle = '#4A9EFF';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#4A9EFF';
  ctx.shadowBlur = 6;

  brackets.forEach(br => {
    const brT = lt - br.delay;
    if (brT < 0) return;

    const brFade = clamp(brT / 0.2, 0, 1);
    if (brFade < 0.01) return;

    ctx.globalAlpha = brFade;

    // Draw all 4 corners in one path
    ctx.beginPath();
    // Top-left
    ctx.moveTo(br.x, br.y + 20);
    ctx.lineTo(br.x, br.y);
    ctx.lineTo(br.x + 20, br.y);
    // Top-right
    ctx.moveTo(br.x + br.w - 20, br.y);
    ctx.lineTo(br.x + br.w, br.y);
    ctx.lineTo(br.x + br.w, br.y + 20);
    // Bottom-left
    ctx.moveTo(br.x, br.y + br.h - 20);
    ctx.lineTo(br.x, br.y + br.h);
    ctx.lineTo(br.x + 20, br.y + br.h);
    // Bottom-right
    ctx.moveTo(br.x + br.w - 20, br.y + br.h);
    ctx.lineTo(br.x + br.w, br.y + br.h);
    ctx.lineTo(br.x + br.w, br.y + br.h - 20);
    ctx.stroke();
  });

  ctx.shadowBlur = 0;
}

function renderBlock2Beat2(ctx, t) {
  if (t < 14.0 || t > 17.62) return;
  const lt = t - 14.0;

  // Same viewport as Beat 1
  const canvasW = 1920;
  const imgW = canvasW * 0.55;
  const imgH = imgW * (9/16);
  const imgX = canvasW - imgW - 50;
  const imgY = (1080 - imgH) / 2;
  const vp = { x: imgX, y: imgY, w: imgW, h: imgH };

  // Don't render if image hasn't loaded
  if (!gameImageLoaded || !gameImage) {
    return;
  }

  // ── Color bleed effect ──
  ctx.save();
  ctx.globalAlpha = 0.4;
  const bleedGrad = ctx.createRadialGradient(
    vp.x + vp.w / 2, vp.y + vp.h / 2, vp.w * 0.3,
    vp.x + vp.w / 2, vp.y + vp.h / 2, vp.w * 0.9
  );
  bleedGrad.addColorStop(0, 'rgba(255, 180, 100, 0.15)');
  bleedGrad.addColorStop(0.6, 'rgba(255, 140, 80, 0.08)');
  bleedGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = bleedGrad;
  ctx.fillRect(vp.x - 100, vp.y - 100, vp.w + 200, vp.h + 200);
  ctx.restore();

  // ── Draw the game image ──
  ctx.save();
  ctx.drawImage(gameImage, vp.x, vp.y, vp.w, vp.h);

  // Dark vignette on edges
  ctx.globalAlpha = 0.6;
  const vignetteGrad = ctx.createRadialGradient(
    vp.x + vp.w / 2, vp.y + vp.h / 2, Math.min(vp.w, vp.h) * 0.3,
    vp.x + vp.w / 2, vp.y + vp.h / 2, Math.max(vp.w, vp.h) * 0.7
  );
  vignetteGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignetteGrad.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
  ctx.fillStyle = vignetteGrad;
  ctx.fillRect(vp.x, vp.y, vp.w, vp.h);
  ctx.restore();

  // ── Hand keypoints overlay — communicates "no hardware, just camera" ──
  ctx.save();
  drawHandKeypoints(ctx, lt, {
    cx: vp.x + vp.w * 0.48, cy: vp.y + vp.h * 0.46,
    size: 280,
    inAt: 0.10,
    alpha: 1 - clamp((lt - 3.40) / 0.20, 0, 1),
    color: '#4A9EFF', pointSize: 4.5, showBones: true,
    revealStaggerDur: 0.55, jitterAmp: 1.2,
  });
  ctx.restore();

  // ── Label above image with glow ──
  ctx.save();
  ctx.font = `600 12px ${FONT_MONO}`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = '2.8px';
  ctx.textBaseline = 'bottom';
  ctx.textAlign = 'left';
  ctx.shadowColor = '#4A9EFF';
  ctx.shadowBlur = 12;
  ctx.fillStyle = '#4A9EFF';
  ctx.fillText('PATIENT SESSION · HOME ENVIRONMENT · CAM-01', vp.x, vp.y - 12);
  ctx.restore();

  // Thin border
  ctx.save();
  ctx.strokeStyle = '#4A9EFF';
  ctx.lineWidth = 1;
  ctx.strokeRect(vp.x, vp.y, vp.w, vp.h);
  ctx.restore();

  // Corner brackets
  drawCornerBrackets(ctx, lt, {
    vpX: vp.x, vpY: vp.y, vpW: vp.w, vpH: vp.h, inAt: 0.08, dur: 0.28,
  });

  // ── LEFT TEXT PANEL ──

  // System stat removido
  let s;

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

  // SECONDARY — "HARDWARE." with gradient
  s = slamInState(lt, { inAt: 0.58, dur: 0.30, offsetY: 14 });
  if (s) {
    ctx.save();
    ctx.globalAlpha = s.opacity;
    ctx.translate(124, 564 + s.ty);
    ctx.font = `700 42px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '8.4px';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    const grad = ctx.createLinearGradient(0, 0, 350, 0);
    grad.addColorStop(0, '#5FE5FF');
    grad.addColorStop(0.5, '#00D9FF');
    grad.addColorStop(1, '#00B8DB');

    ctx.shadowColor = '#00D9FF';
    ctx.shadowBlur = 18;
    ctx.fillStyle = grad;
    ctx.fillText('HARDWARE.', 0, 0);
    ctx.restore();
  }

  drawGlowLine(ctx, lt, {
    x: 124, y: 666, length: 520, thickness: 2,
    inAt: 0.86, drawDur: 0.34, color: '#00D9FF', glow: 14,
  });

  // PRIMARY accent — "From home." with strong gradient
  s = slamInState(lt, { inAt: 1.05, dur: 0.46, offsetY: 14, fromScale: 0.98, blurPx: 2 });
  if (s) {
    ctx.save();
    ctx.globalAlpha = s.opacity;
    ctx.translate(124, 696 + s.ty);
    ctx.scale(s.scale, s.scale);
    if (s.blur > 0) ctx.filter = `blur(${s.blur}px)`;
    ctx.font = `italic 800 58px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.16px';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    const grad = ctx.createLinearGradient(0, 0, 300, 0);
    grad.addColorStop(0, '#6BB3FF');
    grad.addColorStop(0.5, '#4A9EFF');
    grad.addColorStop(1, '#3D8FE6');

    ctx.shadowColor = '#4A9EFF';
    ctx.shadowBlur = 30;
    ctx.fillStyle = grad;
    ctx.fillText('From home.', 0, 0);
    ctx.restore();
  }

  // TERTIARY metadata with cyan glow
  s = slamInState(lt, { inAt: 1.55, dur: 0.30, offsetY: 8 });
  if (s) {
    ctx.save();
    ctx.globalAlpha = s.opacity;
    ctx.translate(124, 760 + s.ty);
    ctx.font = `600 13px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '2.8px';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.shadowColor = '#00D9FF';
    ctx.shadowBlur = 10;
    ctx.fillStyle = 'rgba(0, 217, 255, 0.85)';
    ctx.fillText('21 HAND · 468 FACE · GAZE · F₀ · SNR', 0, 0);
    ctx.restore();
  }
}

function renderBlock2Canvas(ctx, t) {
  if (t < 11.0 || t > 18.0) return;

  // Section labels removidos

  renderBlock2Beat1(ctx, t);
  renderBlock2Beat2(ctx, t);

  // Vertical wipe transition out (Block 2 → Block 3)
  drawVerticalWipe(ctx, t - 17.55, 0.36, '#4A9EFF');
}

Object.assign(window, { renderBlock2Canvas });
