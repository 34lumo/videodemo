// canvas-block1.jsx — Block 1: Meet María. 0:00 → 0:11
// Atmosphere: cold dark navy with a left-anchored cool radial.
// Simple, human, emotional opening.

function renderBlock1Beat1(ctx, t) {
  // Beat 1: "Meet María." (0:00 → 0:05) — CLEAN & ELEGANT
  if (t > 5.0) return;
  const lt = t;

  // "Meet María." — upward drift with subtle gradient
  if (lt >= 0.0) {
    const entryDur = 0.80; // 800ms
    const entryT = clamp(lt / entryDur, 0, 1);
    const entryEase = Easing.easeOutCubic(entryT);

    // Upward drift: starts 20px below, rises to final position
    const driftY = 20 * (1 - entryEase);

    // Opacity: 0 to 1 over 800ms
    const opacity = entryEase;

    // Breathing scale after fully visible (3 second cycle, 100% to 101%)
    let breathScale = 1.0;
    if (lt > entryDur) {
      const breathT = (lt - entryDur) / 3.0; // 3 second cycle
      breathScale = 1.0 + 0.01 * Math.sin(breathT * Math.PI * 2);
    }

    const textY = 540 + driftY;

    // ── MAIN TEXT with gradient on "María" only ──
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(960, textY);
    ctx.scale(breathScale, breathScale);
    ctx.font = `900 96px ${FONT_SERIF}`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    // Measure text widths to position each part
    const fullText = 'Meet María.';
    const fullWidth = ctx.measureText(fullText).width;
    const meetWidth = ctx.measureText('Meet ').width;
    const mariaWidth = ctx.measureText('María').width;

    // Starting X position (left-aligned from center)
    const startX = -fullWidth / 2;

    // Draw "Meet " in white
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText('Meet ', startX, 0);

    // Draw "María" with blue gradient
    const grad = ctx.createLinearGradient(0, -48, 0, 48);
    grad.addColorStop(0, '#4A9EFF');
    grad.addColorStop(1, '#00D9FF');
    ctx.fillStyle = grad;
    ctx.fillText('María', startX + meetWidth, 0);

    // Draw "." in white
    ctx.fillStyle = '#ffffff';
    ctx.fillText('.', startX + meetWidth + mariaWidth, 0);

    ctx.restore();
  }
}

function renderBlock1Beat2(ctx, t) {
  // Beat 2: Two lines staggered (0:05 → 0:11) — BUILD THE CASE
  if (t < 5.0 || t > 11.0) return;
  const lt = t - 5.0;

  // "Meet María." fade out (0:05 → 0:055)
  if (lt < 0.5) {
    const fadeOutProgress = lt / 0.5;
    const opacity = 1.0 - fadeOutProgress;

    // Continue breathing scale during fade
    const breathT = (t - 0.80) / 3.0;
    const breathScale = 1.0 + 0.01 * Math.sin(breathT * Math.PI * 2);

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(960, 540);
    ctx.scale(breathScale, breathScale);
    ctx.font = `900 96px ${FONT_SERIF}`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Meet María.', 0, 0);
    ctx.restore();
  }

  // "Stroke survivor." — upward drift with glitch effect
  if (lt >= 0.60) {
    const entryStart = 0.60;
    const entryDur = 0.50; // 500ms
    const entryT = clamp((lt - entryStart) / entryDur, 0, 1);
    const entryEase = Easing.easeOutCubic(entryT);

    // Upward drift
    const driftY = 20 * (1 - entryEase);

    // Opacity (80% max)
    const opacity = 0.8 * entryEase;
    const textY = 480 + driftY;

    // ── GLITCH on entry ──
    if (entryT < 0.3) {
      const glitchAmount = (1 - entryT / 0.3) * 8;

      // RGB split glitch
      ctx.save();
      ctx.globalAlpha = opacity * 0.5;
      ctx.translate(960 - glitchAmount, textY);
      ctx.font = `900 72px ${FONT_SERIF}`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ff0040';
      ctx.fillText('Stroke survivor.', 0, 0);
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = opacity * 0.5;
      ctx.translate(960 + glitchAmount, textY + Math.sin(lt * 50) * 2);
      ctx.font = `900 72px ${FONT_SERIF}`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#00ffff';
      ctx.fillText('Stroke survivor.', 0, 0);
      ctx.restore();
    }

    // ── MAIN TEXT with subtle gradient ──
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(960, textY);
    ctx.font = `900 72px ${FONT_SERIF}`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    // Gradient fill
    const grad = ctx.createLinearGradient(-200, -36, 200, 36);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.9)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0.8)');

    ctx.shadowColor = 'rgba(74, 158, 255, 0.4)';
    ctx.shadowBlur = 20;
    ctx.fillStyle = grad;
    ctx.fillText('Stroke survivor.', 0, 0);

    ctx.restore();

    // ── SCAN LINES passing over text ──
    if (lt > 1.0) {
      const scanT = ((lt - 1.0) * 0.5) % 1.0;
      const scanY = textY - 50 + scanT * 100;
      const scanAlpha = Math.sin(scanT * Math.PI) * 0.3;

      ctx.save();
      ctx.globalAlpha = opacity * scanAlpha;
      ctx.fillStyle = '#4A9EFF';
      ctx.fillRect(760, scanY, 400, 1);
      ctx.fillRect(760, scanY + 3, 400, 1);
      ctx.restore();
    }
  }

  // "Next appointment: 6 weeks away." — typing effect with hacker terminal vibes
  if (lt >= 1.90) {
    const typeStart = 1.90;
    const typeT = lt - typeStart;
    const fullText = 'Next appointment: 6 weeks away.';
    const charDelay = 0.035; // 35ms per character
    const charsToShow = Math.min(Math.floor(typeT / charDelay), fullText.length);
    const visibleText = fullText.substring(0, charsToShow);
    const typingComplete = charsToShow >= fullText.length;

    // Cursor blinks 3 times after typing completes
    let showCursor = !typingComplete;
    if (typingComplete) {
      const cursorT = typeT - (fullText.length * charDelay);
      const blinkCycle = 0.50;
      const blinkCount = Math.floor(cursorT / blinkCycle);
      if (blinkCount < 3) {
        showCursor = (cursorT % blinkCycle) < (blinkCycle / 2);
      }
    }

    const textY = 600;

    // ── BACKGROUND TERMINAL CARD ──
    const cardFade = clamp(typeT / 0.3, 0, 1);
    ctx.save();
    ctx.globalAlpha = cardFade * 0.15;
    ctx.fillStyle = '#000000';
    ctx.fillRect(560, textY - 30, 800, 60);
    ctx.globalAlpha = cardFade * 0.3;
    ctx.strokeStyle = '#4A9EFF';
    ctx.lineWidth = 1;
    ctx.strokeRect(560, textY - 30, 800, 60);
    ctx.restore();

    // ── MATRIX-STYLE CHARACTERS RAIN behind text ──
    if (typeT > 0.5) {
      const rainFade = clamp((typeT - 0.5) / 0.4, 0, 1);
      ctx.save();
      ctx.globalAlpha = rainFade * 0.15;
      ctx.font = `500 12px ${FONT_MONO}`;
      ctx.fillStyle = '#4A9EFF';
      for (let i = 0; i < 20; i++) {
        const x = 580 + i * 38;
        const y = textY - 20 + ((typeT * 30 + i * 10) % 50);
        ctx.fillText(String.fromCharCode(65 + (i * 7) % 26), x, y);
      }
      ctx.restore();
    }

    // ── TYPING TEXT with glow ──
    ctx.save();
    ctx.font = `600 28px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '3px';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    // Character glow effect - stronger on recently typed chars
    for (let i = 0; i < visibleText.length; i++) {
      const charAge = typeT - i * charDelay;
      const glowIntensity = clamp(1 - charAge / 0.2, 0, 1);

      const charX = 960 - ctx.measureText(visibleText).width / 2 + ctx.measureText(visibleText.substring(0, i)).width;

      ctx.save();
      ctx.shadowColor = '#4A9EFF';
      ctx.shadowBlur = 20 + glowIntensity * 30;
      ctx.fillStyle = '#4A9EFF';
      ctx.fillText(visibleText[i], charX, textY);
      ctx.restore();
    }

    // ── CURSOR with neon glow ──
    if (showCursor) {
      const textWidth = ctx.measureText(visibleText).width;
      const cursorX = 960 + textWidth / 2 + 6;

      ctx.save();
      ctx.shadowColor = '#4A9EFF';
      ctx.shadowBlur = 20;
      ctx.fillStyle = '#4A9EFF';
      ctx.fillRect(cursorX, textY - 14, 3, 28);

      // Cursor glow halo
      ctx.globalAlpha = 0.3;
      ctx.shadowBlur = 40;
      ctx.fillRect(cursorX - 1, textY - 16, 5, 32);
      ctx.restore();
    }

    // ── DATA STREAM LINES ──
    if (typingComplete) {
      const streamT = typeT - fullText.length * charDelay;
      if (streamT < 1.0) {
        const streamAlpha = Math.sin(streamT * Math.PI) * 0.4;
        ctx.save();
        ctx.globalAlpha = streamAlpha;
        ctx.strokeStyle = '#4A9EFF';
        ctx.lineWidth = 1;
        ctx.shadowColor = '#4A9EFF';
        ctx.shadowBlur = 8;

        // Left stream
        ctx.beginPath();
        ctx.moveTo(560, textY);
        ctx.lineTo(560 - streamT * 200, textY + streamT * 100);
        ctx.stroke();

        // Right stream
        ctx.beginPath();
        ctx.moveTo(1360, textY);
        ctx.lineTo(1360 + streamT * 200, textY + streamT * 100);
        ctx.stroke();
        ctx.restore();
      }
    }

    ctx.restore();
  }
}

function renderBlock1Canvas(ctx, t) {
  if (t > 11.0) return;

  // Atmosphere
  drawAtmosphereNavy(ctx, t, 1.0);

  // Background dust (low intensity)
  drawDust(ctx, t, 0.5, '#9bb6d6');

  // Warm vignette at bottom — subtle hospital bed lamp effect for intimacy
  ctx.save();
  const warmGrad = ctx.createRadialGradient(960, 1400, 200, 960, 1400, 900);
  warmGrad.addColorStop(0, 'rgba(255, 230, 200, 0.08)');
  warmGrad.addColorStop(0.6, 'rgba(255, 230, 200, 0.02)');
  warmGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = warmGrad;
  ctx.fillRect(0, 0, 1920, 1080);
  ctx.restore();

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
