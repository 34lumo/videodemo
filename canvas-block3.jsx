// canvas-block3.jsx — Block 3: Real-Time Tracking. 0:18 → 0:27
// Atmosphere: deep teal with blue keypoint glow.
// Shows the real tracking screenshot with blue keypoints - the most important visual in the video.

// Load tracking screenshot
let trackingImage = null;
let trackingImageLoaded = false;
(function loadTrackingImage() {
  const img = new Image();
  img.onload = function() {
    trackingImage = img;
    trackingImageLoaded = true;
  };
  img.onerror = function() {
    console.error('Failed to load varometricas.png');
  };
  img.src = './varometricas.png';
})();

function renderBlock3Beat1(ctx, t) {
  // Stage 18.0 → 21.0 — Show real tracking screenshot
  if (t < 18.0 || t > 21.0) return;
  const lt = t - 18.0;

  // Don't render if image hasn't loaded
  if (!trackingImageLoaded || !trackingImage) {
    return;
  }

  // Calculate viewport - 60% of canvas width, center-right positioned
  const canvasW = 1920;
  const imgW = canvasW * 0.60; // 60% width
  const imgH = imgW * (trackingImage.height / trackingImage.width); // Maintain aspect ratio
  const imgX = canvasW - imgW - 80; // Right side with margin, leaving left for text
  const imgY = (1080 - imgH) / 2; // Vertically centered

  const vp = { x: imgX, y: imgY, w: imgW, h: imgH };

  // ── ENTRANCE ANIMATION SEQUENCE (800ms total) ──
  // Phase 1: Frame draws (0-600ms) - 150ms per edge
  // Phase 2: Image fades in (0-400ms)
  // Phase 3: Scan line sweeps (400-700ms)
  // Phase 4: Label types out (700-800ms+)

  const frameDur = 0.15; // 150ms per edge
  const imgFadeDur = 0.40; // 400ms
  const scanDur = 0.30; // 300ms
  const scanStart = 0.40;
  const labelStart = 0.70;

  // ── Blue keypoint glow bleeding into background ──
  const glowFade = clamp(lt / 0.5, 0, 1);
  if (glowFade > 0.01) {
    ctx.save();
    ctx.globalAlpha = glowFade * 0.06; // 6% opacity max
    const blueGlow = ctx.createRadialGradient(
      vp.x + vp.w / 2, vp.y + vp.h / 2, vp.w * 0.2,
      vp.x + vp.w / 2, vp.y + vp.h / 2, vp.w * 1.2
    );
    blueGlow.addColorStop(0, '#4A9EFF');
    blueGlow.addColorStop(0.5, 'rgba(74, 158, 255, 0.3)');
    blueGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = blueGlow;
    ctx.fillRect(vp.x - 200, vp.y - 200, vp.w + 400, vp.h + 400);
    ctx.restore();
  }

  // ── Draw the tracking image (fade in 0-400ms) ──
  const imgFade = clamp(lt / imgFadeDur, 0, 1);
  ctx.save();
  ctx.globalAlpha = imgFade;
  ctx.drawImage(trackingImage, vp.x, vp.y, vp.w, vp.h);
  ctx.restore();

  // ── Dark vignette on edges ──
  ctx.save();
  ctx.globalAlpha = imgFade * 0.5;
  const vignetteGrad = ctx.createRadialGradient(
    vp.x + vp.w / 2, vp.y + vp.h / 2, Math.min(vp.w, vp.h) * 0.4,
    vp.x + vp.w / 2, vp.y + vp.h / 2, Math.max(vp.w, vp.h) * 0.8
  );
  vignetteGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignetteGrad.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
  ctx.fillStyle = vignetteGrad;
  ctx.fillRect(vp.x, vp.y, vp.w, vp.h);
  ctx.restore();

  // ── Hairline frame draws sequentially (0-600ms) ──
  ctx.save();
  ctx.strokeStyle = '#4A9EFF';
  ctx.lineWidth = 1;
  ctx.beginPath();

  // Top edge (0-150ms)
  if (lt >= 0) {
    const topProgress = clamp(lt / frameDur, 0, 1);
    ctx.moveTo(vp.x, vp.y);
    ctx.lineTo(vp.x + vp.w * topProgress, vp.y);
  }

  // Right edge (150-300ms)
  if (lt >= frameDur) {
    const rightProgress = clamp((lt - frameDur) / frameDur, 0, 1);
    ctx.moveTo(vp.x + vp.w, vp.y);
    ctx.lineTo(vp.x + vp.w, vp.y + vp.h * rightProgress);
  }

  // Bottom edge (300-450ms)
  if (lt >= frameDur * 2) {
    const bottomProgress = clamp((lt - frameDur * 2) / frameDur, 0, 1);
    ctx.moveTo(vp.x + vp.w, vp.y + vp.h);
    ctx.lineTo(vp.x + vp.w - vp.w * bottomProgress, vp.y + vp.h);
  }

  // Left edge (450-600ms)
  if (lt >= frameDur * 3) {
    const leftProgress = clamp((lt - frameDur * 3) / frameDur, 0, 1);
    ctx.moveTo(vp.x, vp.y + vp.h);
    ctx.lineTo(vp.x, vp.y + vp.h - vp.h * leftProgress);
  }

  ctx.stroke();
  ctx.restore();

  // ── Horizontal scan line (400-700ms) ──
  if (lt >= scanStart && lt < scanStart + scanDur) {
    const scanProgress = (lt - scanStart) / scanDur;
    const scanY = vp.y + vp.h * scanProgress;
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(vp.x, scanY - 1.5, vp.w, 3);
    ctx.restore();
  }

  // ── Label top left (types out after 700ms) ──
  if (lt >= labelStart) {
    const labelLt = lt - labelStart;
    const pulse = 0.5 + 0.5 * Math.sin((lt - labelStart) * 5.2);

    // Pulsing dot appears first
    ctx.save();
    const dotFade = clamp(labelLt / 0.05, 0, 1);
    ctx.globalAlpha = dotFade;
    ctx.shadowColor = '#4A9EFF';
    ctx.shadowBlur = 12 * pulse;
    ctx.fillStyle = '#4A9EFF';
    ctx.beginPath();
    ctx.arc(vp.x + 16, vp.y - 20, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Label text types out (30ms per character after dot)
    const fullLabel = 'CAM-01 · DIRECT OBSERVATION · LIVE';
    const charDelay = 0.03; // 30ms per character
    const typeStart = 0.05; // Start after dot appears
    const charsToShow = Math.floor(Math.max(0, (labelLt - typeStart) / charDelay));
    const visibleLabel = fullLabel.substring(0, charsToShow);

    if (visibleLabel.length > 0) {
      ctx.save();
      ctx.shadowBlur = 0;
      ctx.font = `500 11px ${FONT_MONO}`;
      if ('letterSpacing' in ctx) ctx.letterSpacing = '2.2px';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#4A9EFF';
      ctx.fillText(visibleLabel, vp.x + 28, vp.y - 20);
      ctx.restore();
    }
  }

  // ── Label bottom right (appears after entrance animation) ──
  const bottomLabelFade = clamp((lt - 0.8) / 0.2, 0, 1);
  if (bottomLabelFade > 0.01) {
    ctx.save();
    ctx.globalAlpha = bottomLabelFade;
    ctx.font = `500 10px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '1.8px';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(74, 158, 255, 0.85)';
    ctx.fillText('30 FPS · 1080p', vp.x + vp.w - 12, vp.y + vp.h + 12);
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
  // Stage 21.0 → 27.0 — Four claims stack in on the left while tracking image continues
  if (t < 21.0 || t > 27.0) return;
  const lt = t - 21.0;

  // Don't render if image hasn't loaded
  if (!trackingImageLoaded || !trackingImage) {
    return;
  }

  // Same viewport as Beat 1
  const canvasW = 1920;
  const imgW = canvasW * 0.60;
  const imgH = imgW * (trackingImage.height / trackingImage.width);
  const imgX = canvasW - imgW - 80;
  const imgY = (1080 - imgH) / 2;
  const vp = { x: imgX, y: imgY, w: imgW, h: imgH };

  // Fade for exit transition
  const fadeOut = 1 - clamp((lt - 5.20) / 0.40, 0, 1);

  // Blue keypoint glow
  ctx.save();
  ctx.globalAlpha = fadeOut * 0.06;
  const blueGlow = ctx.createRadialGradient(
    vp.x + vp.w / 2, vp.y + vp.h / 2, vp.w * 0.2,
    vp.x + vp.w / 2, vp.y + vp.h / 2, vp.w * 1.2
  );
  blueGlow.addColorStop(0, '#4A9EFF');
  blueGlow.addColorStop(0.5, 'rgba(74, 158, 255, 0.3)');
  blueGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = blueGlow;
  ctx.fillRect(vp.x - 200, vp.y - 200, vp.w + 400, vp.h + 400);
  ctx.restore();

  // Draw tracking image
  ctx.save();
  ctx.globalAlpha = fadeOut;
  ctx.drawImage(trackingImage, vp.x, vp.y, vp.w, vp.h);
  ctx.restore();

  // Dark vignette
  ctx.save();
  ctx.globalAlpha = fadeOut * 0.5;
  const vignetteGrad = ctx.createRadialGradient(
    vp.x + vp.w / 2, vp.y + vp.h / 2, Math.min(vp.w, vp.h) * 0.4,
    vp.x + vp.w / 2, vp.y + vp.h / 2, Math.max(vp.w, vp.h) * 0.8
  );
  vignetteGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignetteGrad.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
  ctx.fillStyle = vignetteGrad;
  ctx.fillRect(vp.x, vp.y, vp.w, vp.h);
  ctx.restore();

  // Labels
  const pulse = 0.5 + 0.5 * Math.sin((lt + 3.0) * 5.2);
  ctx.save();
  ctx.globalAlpha = fadeOut;
  ctx.shadowColor = '#4A9EFF';
  ctx.shadowBlur = 12 * pulse;
  ctx.fillStyle = '#4A9EFF';
  ctx.beginPath();
  ctx.arc(vp.x + 16, vp.y - 20, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.font = `500 11px ${FONT_MONO}`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = '2.2px';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#4A9EFF';
  ctx.fillText('CAM-01 · DIRECT OBSERVATION · LIVE', vp.x + 28, vp.y - 20);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = fadeOut;
  ctx.font = `500 10px ${FONT_MONO}`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = '1.8px';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(74, 158, 255, 0.85)';
  ctx.fillText('30 FPS · 1080p', vp.x + vp.w - 12, vp.y + vp.h + 12);
  ctx.restore();

  // Hairline frame
  ctx.save();
  ctx.globalAlpha = fadeOut;
  ctx.strokeStyle = '#4A9EFF';
  ctx.lineWidth = 1;
  ctx.strokeRect(vp.x, vp.y, vp.w, vp.h);
  ctx.restore();

  // ── FOUR CLAIMS on the LEFT — Enhanced with gradients and glows ──

  // Tertiary chrome with glow
  let s = slamInState(lt, { inAt: 0.05, dur: 0.28, offsetY: 8 });
  if (s) {
    ctx.save();
    ctx.globalAlpha = s.opacity;
    ctx.translate(120, 220 + s.ty);
    ctx.font = `600 13px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '2.8px';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.shadowColor = '#4A9EFF';
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#4A9EFF';
    ctx.fillText('○ SIGNAL · MULTIMODAL · SYNCHRONIZED', 0, 0);
    ctx.restore();
  }

  // PRIMARY 1 — "21 hand landmarks." with gradient and strong glow
  s = slamInState(lt, { inAt: 0.50, dur: 0.34, offsetY: 26, fromScale: 0.95, blurPx: 3,
                         outAt: 5.20, outDur: 0.35 });
  const c21 = countUpValue(lt, { inAt: 0.55, dur: 0.42, from: 0, to: 21, decimals: 0, punchScale: 1.04 });
  if (s && c21) {
    ctx.save();
    ctx.globalAlpha = s.opacity;
    ctx.translate(120, 290 + s.ty);
    ctx.scale(s.scale * c21.scale, s.scale * c21.scale);
    if (s.blur > 0) ctx.filter = `blur(${s.blur}px)`;

    ctx.font = `900 72px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.44px';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    // Number in electric blue with strong glow
    ctx.shadowColor = '#4A9EFF';
    ctx.shadowBlur = 32;
    ctx.fillStyle = '#4A9EFF';
    ctx.fillText(c21.display, 0, 0);

    // Text in white with subtle glow
    ctx.shadowColor = 'rgba(255,255,255,0.5)';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#ffffff';
    const numWidth = ctx.measureText(c21.display).width;
    ctx.fillText(' hand landmarks.', numWidth, 0);

    ctx.restore();
  }

  // PRIMARY 2 — "468 facial landmarks." with gradient
  s = slamInState(lt, { inAt: 1.70, dur: 0.34, offsetY: 26, fromScale: 0.95, blurPx: 3,
                         outAt: 5.20, outDur: 0.35 });
  const c468 = countUpValue(lt, { inAt: 1.75, dur: 0.50, from: 0, to: 468, decimals: 0, punchScale: 1.04 });
  if (s && c468) {
    ctx.save();
    ctx.globalAlpha = s.opacity;
    ctx.translate(120, 400 + s.ty);
    ctx.scale(s.scale * c468.scale, s.scale * c468.scale);
    if (s.blur > 0) ctx.filter = `blur(${s.blur}px)`;

    ctx.font = `900 72px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.44px';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    // Number in cyan with glow
    ctx.shadowColor = '#00D9FF';
    ctx.shadowBlur = 32;
    ctx.fillStyle = '#00D9FF';
    ctx.fillText(c468.display, 0, 0);

    // Text in white
    ctx.shadowColor = 'rgba(255,255,255,0.5)';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#ffffff';
    const numWidth = ctx.measureText(c468.display).width;
    ctx.fillText(' facial landmarks.', numWidth, 0);

    ctx.restore();
  }

  // PRIMARY 3 — "Gaze. Pinch. Symmetry. Voice." with gradient fill
  s = slamInState(lt, { inAt: 2.90, dur: 0.34, offsetY: 26, fromScale: 0.95, blurPx: 3,
                         outAt: 5.20, outDur: 0.35 });
  if (s) {
    ctx.save();
    ctx.globalAlpha = s.opacity;
    ctx.translate(120, 510 + s.ty);
    ctx.scale(s.scale, s.scale);
    if (s.blur > 0) ctx.filter = `blur(${s.blur}px)`;

    ctx.font = `900 60px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.2px';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    // Gradient from blue to cyan
    const grad = ctx.createLinearGradient(0, 0, 600, 0);
    grad.addColorStop(0, '#4A9EFF');
    grad.addColorStop(0.5, '#00D9FF');
    grad.addColorStop(1, '#4A9EFF');

    ctx.shadowColor = '#4A9EFF';
    ctx.shadowBlur = 28;
    ctx.fillStyle = grad;
    ctx.fillText('Gaze. Pinch. Symmetry. Voice.', 0, 0);

    ctx.restore();
  }

  // Divider with stronger glow
  drawGlowLine(ctx, lt, {
    x: 124, y: 630, length: 700, thickness: 2,
    inAt: 4.00, drawDur: 0.34, color: '#4A9EFF', glow: 16,
    outAt: 5.20, outDur: 0.35,
  });

  // PRIMARY accent — mono with pulsing glow
  s = slamInState(lt, { inAt: 4.10, dur: 0.32, offsetY: 14, fromScale: 0.97, blurPx: 2,
                         outAt: 5.20, outDur: 0.35 });
  if (s) {
    const pulse = 0.7 + 0.3 * Math.sin((lt - 4.10) * 6);
    ctx.save();
    ctx.globalAlpha = s.opacity;
    ctx.translate(120, 656 + s.ty);
    ctx.scale(s.scale, s.scale);
    if (s.blur > 0) ctx.filter = `blur(${s.blur}px)`;

    ctx.font = `700 26px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '5.2px';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.shadowColor = '#4A9EFF';
    ctx.shadowBlur = 24 * pulse;
    ctx.fillStyle = '#4A9EFF';
    ctx.fillText('ALL CAPTURED. SIMULTANEOUSLY.', 0, 0);

    ctx.restore();
  }

  // TERTIARY — with tech glow
  s = slamInState(lt, { inAt: 4.40, dur: 0.30, offsetY: 8 });
  if (s) {
    ctx.save();
    ctx.globalAlpha = s.opacity;
    ctx.translate(120, 700 + s.ty);
    ctx.font = `500 12px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '2.4px';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.shadowColor = '#00D9FF';
    ctx.shadowBlur = 8;
    ctx.fillStyle = 'rgba(0, 217, 255, 0.75)';
    ctx.fillText('[ FRAME-SYNC · 30FPS · CV PIPELINE · LATENCY <40MS ]', 0, 0);
    ctx.restore();
  }
}

function renderBlock3Canvas(ctx, t) {
  if (t < 18.0 || t > 27.0) return;

  // Section label removido

  renderBlock3Beat1(ctx, t);
  renderBlock3Beat2(ctx, t);

  // Closing transition: geometry collapse (3→4)
  drawGeometryCollapse(ctx, t - 26.35, 0.45);
}

Object.assign(window, { renderBlock3Canvas });
