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

  // €0 hero — POP center with gradient and glow
  const s = popInState(lt, { inAt: 0.20, dur: 0.10, fromScale: 1.22, outAt: 1.85, outDur: 0.20 });
  if (s) {
    ctx.save();
    ctx.globalAlpha = s.opacity;
    ctx.translate(960, 360);
    ctx.scale(s.scale, s.scale);
    ctx.font = `900 320px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-12.8px';
    ctx.textBaseline = 'top'; ctx.textAlign = 'center';

    const grad = ctx.createLinearGradient(-200, 0, 200, 0);
    grad.addColorStop(0, '#5FE5FF');
    grad.addColorStop(0.5, '#00D9FF');
    grad.addColorStop(1, '#00B8DB');

    ctx.shadowColor = '#00D9FF';
    ctx.shadowBlur = 50;
    ctx.fillStyle = grad;
    ctx.fillText('€0', 0, 0);
    ctx.restore();
  }

  // Enhanced lettered text with stronger glow
  const sLabel = popInState(lt, { inAt: 0.32, dur: 0.08, fromScale: 1.12, outAt: 1.85, outDur: 0.20 });
  if (sLabel) {
    ctx.save();
    ctx.globalAlpha = sLabel.opacity;
    ctx.translate(960, 680);
    ctx.scale(sLabel.scale, sLabel.scale);
    ctx.font = `700 24px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '6.4px';
    ctx.textBaseline = 'top'; ctx.textAlign = 'center';
    ctx.shadowColor = '#4A9EFF';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#4A9EFF';
    ctx.fillText('HARDWARE COST', 0, 0);
    ctx.restore();
  }

  // New line below HARDWARE COST
  const sLabel2 = popInState(lt, { inAt: 0.50, dur: 0.08, fromScale: 1.12, outAt: 1.85, outDur: 0.20 });
  if (sLabel2) {
    ctx.save();
    ctx.globalAlpha = sLabel2.opacity;
    ctx.translate(960, 720);
    ctx.scale(sLabel2.scale, sLabel2.scale);
    ctx.font = `500 14px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '3.2px';
    ctx.textBaseline = 'top'; ctx.textAlign = 'center';
    ctx.shadowColor = '#00D9FF';
    ctx.shadowBlur = 10;
    ctx.fillStyle = 'rgba(0, 217, 255, 0.75)';
    ctx.fillText('NO SUPPLY CHAIN · NO MANUFACTURING · NO LOGISTICS', 0, 0);
    ctx.restore();
  }

  // Scattered labels removidos

  // Tertiary system tag with cyan glow
  const sT = slamInState(lt, { inAt: 0.10, dur: 0.30, offsetY: 8 });
  if (sT) {
    ctx.save();
    ctx.globalAlpha = sT.opacity;
    ctx.translate(960, 920 + sT.ty);
    ctx.font = `600 14px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '3.2px';
    ctx.textBaseline = 'top'; ctx.textAlign = 'center';
    ctx.shadowColor = '#00D9FF';
    ctx.shadowBlur = 14;
    ctx.fillStyle = 'rgba(0, 217, 255, 0.9)';
    ctx.fillText('○ DEPLOYMENT · BROWSER-NATIVE · NO INSTALL', 0, 0);
    ctx.restore();
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

  // "60" slams from above with CINEMATIC IMPACT
  const s = slamFromAboveState(lt, { inAt: 0.10, dur: 0.42, fromY: -110, overshootY: 10 });

  // Pulse wave on impact
  if (lt > 0.50) {
    drawPulseWave(ctx, lt, { cx: 960, cy: 440, inAt: 0.52, speed: 0.8, maxRadius: 600 });
  }

  // Lens flare
  if (lt > 0.52) {
    drawLensFlare(ctx, lt, { x: 960, y: 380, inAt: 0.52, dur: 1.2, intensity: 0.8 });
  }

  // Glitch effect on landing
  if (lt > 0.52 && lt < 0.67) {
    drawGlitchEffect(ctx, lt, { inAt: 0.52, dur: 0.15, intensity: 8 });
  }

  if (s) {
    ctx.save();
    ctx.globalAlpha = s.opacity;
    ctx.translate(880, 280 + s.ty);
    ctx.font = `900 360px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-14.4px';
    ctx.textBaseline = 'top';

    const grad = ctx.createLinearGradient(-150, 0, 150, 0);
    grad.addColorStop(0, '#6BB3FF');
    grad.addColorStop(0.5, '#4A9EFF');
    grad.addColorStop(1, '#3D8FE6');

    ctx.shadowColor = '#4A9EFF';
    ctx.shadowBlur = 60;
    ctx.fillStyle = grad;
    ctx.fillText('60', 0, 0);
    ctx.restore();
  }

  // Light leak
  if (lt < 2.0) {
    drawLightLeak(ctx, lt, { inAt: 0.10, dur: 1.8, side: 'right' });
  }

  // Enhanced label with stronger glow
  const sLabel = popInState(lt, { inAt: 0.50, dur: 0.08, fromScale: 1.12 });
  if (sLabel) {
    ctx.save();
    ctx.globalAlpha = sLabel.opacity;
    ctx.translate(880, 620);
    ctx.scale(sLabel.scale, sLabel.scale);
    ctx.font = `700 24px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '6.0px';
    ctx.textBaseline = 'top'; ctx.textAlign = 'left';
    ctx.shadowColor = '#4A9EFF';
    ctx.shadowBlur = 22;
    ctx.fillStyle = '#4A9EFF';
    ctx.fillText('SECONDS · ONCE A DAY · FROM HOME', 0, 0);
    ctx.restore();
  }

  // Scatter labels removidos para evitar sobreposición

  // Tertiary timestamp with cyan glow
  const sT = slamInState(lt, { inAt: 0.04, dur: 0.30, offsetY: 8 });
  if (sT) {
    ctx.save();
    ctx.globalAlpha = sT.opacity;
    ctx.translate(960, 920 + sT.ty);
    ctx.font = `600 14px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '3.6px';
    ctx.textBaseline = 'top'; ctx.textAlign = 'center';
    ctx.shadowColor = '#00D9FF';
    ctx.shadowBlur = 12;
    ctx.fillStyle = 'rgba(0, 217, 255, 0.85)';
    ctx.fillText('T-MINUS · 00:00 ──── 01:00', 0, 0);
    ctx.restore();
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

  // "14" discrete count with gradient
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
    ctx.font = `900 400px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-16px';
    ctx.textBaseline = 'top'; ctx.textAlign = 'center';

    const grad = ctx.createLinearGradient(-200, 0, 200, 0);
    grad.addColorStop(0, '#5FE5FF');
    grad.addColorStop(0.5, '#00D9FF');
    grad.addColorStop(1, '#00B8DB');

    ctx.shadowColor = '#00D9FF';
    ctx.shadowBlur = 70;
    ctx.fillStyle = grad;
    ctx.fillText(String(val), 0, 0);
    ctx.restore();
  }

  // "clinical biomarkers." italic with gradient
  const cS = popInState(lt, { inAt: 0.50, dur: 0.16, fromScale: 1.08, outAt: 2.85, outDur: 0.20 });
  if (cS) {
    ctx.save();
    ctx.globalAlpha = cS.opacity;
    ctx.translate(960, 660);
    ctx.scale(cS.scale, cS.scale);
    ctx.font = `italic 800 68px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.36px';
    ctx.textBaseline = 'top'; ctx.textAlign = 'center';

    const grad = ctx.createLinearGradient(-300, 0, 300, 0);
    grad.addColorStop(0, '#6BB3FF');
    grad.addColorStop(0.5, '#4A9EFF');
    grad.addColorStop(1, '#3D8FE6');

    ctx.shadowColor = '#4A9EFF';
    ctx.shadowBlur = 26;
    ctx.fillStyle = grad;
    ctx.fillText('clinical biomarkers.', 0, 0);
    ctx.restore();
  }

  // 14 scatter labels removidos

  // Final italic closer with gradient
  const closerS = slamInState(lt, { inAt: 2.12, dur: 0.34, offsetY: 14, fromScale: 0.97, blurPx: 2,
                                      outAt: 2.85, outDur: 0.18 });
  if (closerS) {
    ctx.save();
    ctx.globalAlpha = closerS.opacity;
    ctx.translate(960, 1000 + closerS.ty);
    ctx.scale(closerS.scale, closerS.scale);
    if (closerS.blur > 0) ctx.filter = `blur(${closerS.blur}px)`;
    ctx.font = `italic 700 50px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-1px';
    ctx.textBaseline = 'top'; ctx.textAlign = 'center';

    const grad = ctx.createLinearGradient(-350, 0, 350, 0);
    grad.addColorStop(0, '#6BB3FF');
    grad.addColorStop(0.5, '#4A9EFF');
    grad.addColorStop(1, '#3D8FE6');

    ctx.shadowColor = '#4A9EFF';
    ctx.shadowBlur = 24;
    ctx.fillStyle = grad;
    ctx.fillText("Captured while María thinks she's just playing.", 0, 0);
    ctx.restore();
  }

  // Remove old drawTextBlock call
  if (false && closerS) {
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
