// canvas-block4.jsx — Block 4: The Clinical Report. 0:27 → 0:39
// Atmosphere: very dark warm amber → WHITE (after notification tap at 29.5s)
// Five sub-beats with procedural CRI ring, metric cards, waveform, all drawn.

// Load dashboard screenshot
let dashboardImage = null;
let dashboardImageLoaded = false;
(function loadDashboardImage() {
  const img = new Image();
  img.onload = function() {
    dashboardImage = img;
    dashboardImageLoaded = true;
    console.log('✅ dashboardmedico.png loaded successfully! Width:', img.width, 'Height:', img.height);
  };
  img.onerror = function() {
    console.error('❌ Failed to load dashboardmedico.png');
  };
  img.src = './dashboardmedico.png';
})();


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

  // Clinical report text removido

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

  // Don't render if image hasn't loaded
  if (!dashboardImageLoaded || !dashboardImage) {
    return;
  }

  // ── APP OPENING EXPANSION ANIMATION ──
  // Dashboard starts small (notification size) and expands to fill screen over 400ms
  // Like tapping a notification on iPhone and the app opens fullscreen

  const canvasW = 1920;
  const canvasH = 1080;

  // Final size: Original aspect ratio, centered, not too big
  // Dashboard image is 1672x941, keep it readable but not stretched
  const finalW = 1200; // Reasonable width to see details
  const finalH = finalW * (dashboardImage.height / dashboardImage.width); // Maintain aspect ratio

  // Starting size: notification card size (small)
  const startW = 420;
  const startH = 180;

  // Expansion animation (0-400ms with ease-out + overshoot)
  const expansionDur = 0.40;
  const overshootStart = 0.40;
  const overshootDur = 0.06;

  let imgW, imgH;

  if (lt < expansionDur) {
    // Expanding phase - ease out
    const progress = lt / expansionDur;
    const eased = Easing.easeOutCubic(progress);
    imgW = startW + (finalW - startW) * eased;
    imgH = startH + (finalH - startH) * eased;
  } else if (lt < overshootStart + overshootDur) {
    // Overshoot phase - tiny 2px bounce
    const overshootProgress = (lt - overshootStart) / overshootDur;
    const overshootAmount = 2 * (1 - overshootProgress); // 2px that reduces to 0
    imgW = finalW + overshootAmount;
    imgH = finalH + overshootAmount;
  } else {
    // Settled at final size
    imgW = finalW;
    imgH = finalH;
  }

  // Always centered
  const imgX = (canvasW - imgW) / 2;
  const imgY = (canvasH - imgH) / 2;
  const vp = { x: imgX, y: imgY, w: imgW, h: imgH };

  // Exit fade for entire dashboard
  const exitFade = 1 - clamp((lt - 4.85) / 0.20, 0, 1);

  // ── Warm cream/beige glow bleeding into background ──
  const glowFade = clamp(lt / 0.5, 0, 1) * exitFade;
  if (glowFade > 0.01) {
    ctx.save();
    ctx.globalAlpha = glowFade * 0.08; // 8% opacity max
    const warmGlow = ctx.createRadialGradient(
      vp.x + vp.w / 2, vp.y + vp.h / 2, vp.w * 0.2,
      vp.x + vp.w / 2, vp.y + vp.h / 2, vp.w * 1.2
    );
    warmGlow.addColorStop(0, '#C8A882');
    warmGlow.addColorStop(0.5, 'rgba(200, 168, 130, 0.3)');
    warmGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = warmGlow;
    ctx.fillRect(vp.x - 200, vp.y - 200, vp.w + 400, vp.h + 400);
    ctx.restore();
  }

  // ── Draw the dashboard image (fully opaque during expansion) ──
  ctx.save();
  ctx.globalAlpha = exitFade;
  ctx.drawImage(dashboardImage, vp.x, vp.y, vp.w, vp.h);
  ctx.restore();

  // ── Large "MEDICAL VIEW" title above dashboard ──
  const titleAppear = frameAppear - 0.1; // Slightly before frame
  if (lt >= titleAppear && exitFade > 0.01) {
    const titleT = lt - titleAppear;
    const titleFade = clamp(titleT / 0.3, 0, 1) * exitFade;
    const titleSlide = (1 - clamp(titleT / 0.35, 0, 1)) * 30; // Slide down

    if (titleFade > 0.01) {
      ctx.save();
      ctx.globalAlpha = titleFade;
      ctx.translate(960, vp.y - 90 + titleSlide);

      // Main title with gradient
      ctx.font = `900 56px ${FONT_SERIF}`;
      if ('letterSpacing' in ctx) ctx.letterSpacing = '-2.24px';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      const grad = ctx.createLinearGradient(-200, 0, 200, 0);
      grad.addColorStop(0, '#6BB3FF');
      grad.addColorStop(0.5, '#4A9EFF');
      grad.addColorStop(1, '#3D8FE6');

      ctx.shadowColor = '#4A9EFF';
      ctx.shadowBlur = 30;
      ctx.fillStyle = grad;
      ctx.fillText('MEDICAL VIEW', 0, 0);

      // Subtitle below
      ctx.shadowBlur = 0;
      ctx.font = `600 14px ${FONT_MONO}`;
      if ('letterSpacing' in ctx) ctx.letterSpacing = '3.6px';
      ctx.fillStyle = 'rgba(74, 158, 255, 0.8)';
      ctx.fillText('SESSION COMPLETE · REPORT GENERATED', 0, 32);

      ctx.restore();
    }
  }

  // ── Enhanced border with glow appears after expansion settles ──
  const frameAppear = overshootStart + overshootDur; // 0.46s
  if (lt >= frameAppear && exitFade > 0.01) {
    ctx.save();
    ctx.globalAlpha = exitFade;

    // Outer glow
    ctx.shadowColor = '#4A9EFF';
    ctx.shadowBlur = 20;
    ctx.strokeStyle = '#4A9EFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(vp.x, vp.y, vp.w, vp.h);

    // Inner border line
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(74, 158, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(vp.x + 3, vp.y + 3, vp.w - 6, vp.h - 6);

    ctx.restore();
  }

  // ── Futuristic data lines emanating from dashboard (after frame appears) ──
  const linesStart = frameAppear + 0.2;
  if (lt >= linesStart && exitFade > 0.01) {
    const linesLt = lt - linesStart;

    // Define data callout lines with labels
    const dataLines = [
      {
        fromX: vp.x + vp.w * 0.18, fromY: vp.y + vp.h * 0.25, // CRI ring area
        toX: vp.x - 180, toY: vp.y + vp.h * 0.15,
        label: 'CLINICAL RECOVERY INDEX', value: '86/100', delay: 0
      },
      {
        fromX: vp.x + vp.w * 0.35, fromY: vp.y + vp.h * 0.65, // Lower metrics
        toX: vp.x - 200, toY: vp.y + vp.h * 0.70,
        label: 'MOTOR FUNCTION', value: '88%', delay: 0.15
      },
      {
        fromX: vp.x + vp.w * 0.85, fromY: vp.y + vp.h * 0.35, // Right side
        toX: vp.x + vp.w + 180, toY: vp.y + vp.h * 0.25,
        label: 'FACIAL SYMMETRY', value: '82%', delay: 0.10
      },
      {
        fromX: vp.x + vp.w * 0.75, fromY: vp.y + vp.h * 0.75, // Bottom right
        toX: vp.x + vp.w + 200, toY: vp.y + vp.h * 0.80,
        label: 'VOICE QUALITY', value: '90%', delay: 0.20
      }
    ];

    dataLines.forEach(line => {
      const lineT = linesLt - line.delay;
      if (lineT < 0) return;

      const lineFade = clamp(lineT / 0.25, 0, 1) * exitFade;
      const lineExtend = clamp(lineT / 0.35, 0, 1);

      if (lineFade > 0.01) {
        ctx.save();
        ctx.globalAlpha = lineFade;

        // Calculate current end point
        const currentX = line.fromX + (line.toX - line.fromX) * lineExtend;
        const currentY = line.fromY + (line.toY - line.fromY) * lineExtend;

        // Draw line
        ctx.strokeStyle = '#4A9EFF';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#4A9EFF';
        ctx.shadowBlur = 8;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(line.fromX, line.fromY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Starting point dot
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#4A9EFF';
        ctx.beginPath();
        ctx.arc(line.fromX, line.fromY, 3, 0, Math.PI * 2);
        ctx.fill();

        // End point glow (when line completes)
        if (lineExtend >= 0.95) {
          ctx.shadowBlur = 16;
          ctx.fillStyle = '#4A9EFF';
          ctx.beginPath();
          ctx.arc(line.toX, line.toY, 5, 0, Math.PI * 2);
          ctx.fill();

          // Label text
          const labelFade = clamp((lineT - 0.35) / 0.2, 0, 1);
          if (labelFade > 0.01) {
            ctx.shadowBlur = 0;
            ctx.globalAlpha = lineFade * labelFade;

            // Label background
            const isLeft = line.toX < vp.x;
            ctx.textAlign = isLeft ? 'right' : 'left';
            ctx.textBaseline = 'middle';

            // Label text
            ctx.font = `600 11px ${FONT_MONO}`;
            if ('letterSpacing' in ctx) ctx.letterSpacing = '1.8px';
            ctx.fillStyle = 'rgba(74, 158, 255, 0.7)';
            ctx.fillText(line.label, line.toX + (isLeft ? -12 : 12), line.toY - 12);

            // Value text
            ctx.font = `900 18px ${FONT_MONO}`;
            ctx.fillStyle = '#4A9EFF';
            ctx.shadowColor = '#4A9EFF';
            ctx.shadowBlur = 10;
            ctx.fillText(line.value, line.toX + (isLeft ? -12 : 12), line.toY + 8);
          }
        }

        ctx.restore();
      }
    });
  }

  // ── Label top left (appears with frame) ──
  if (lt >= frameAppear && exitFade > 0.01) {
    ctx.save();
    ctx.globalAlpha = exitFade;
    ctx.font = `500 11px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '2.2px';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#4A9EFF';
    ctx.fillText('CLINICAL REPORT · SESSION COMPLETE', vp.x + 16, vp.y - 20);
    ctx.restore();
  }

  // ── Label bottom right (appears with frame) ──
  if (lt >= frameAppear && exitFade > 0.01) {
    ctx.save();
    ctx.globalAlpha = exitFade;
    ctx.font = `500 10px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '1.8px';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(74, 158, 255, 0.85)';
    ctx.fillText('REPORT GENERATED AUTOMATICALLY', vp.x + vp.w - 12, vp.y + vp.h + 12);
    ctx.restore();
  }

  // ── OLD CRI CALLOUT DISABLED (replaced by futuristic data lines) ──
  const calloutStart = 0.50;
  if (false && lt >= calloutStart && exitFade > 0.01) {
    const calloutLt = lt - calloutStart;

    // Find approximate position of CRI ring in the dashboard image
    // The CRI ring is in the upper-left quadrant of the dashboard
    const criX = vp.x + vp.w * 0.25; // 25% from left
    const criY = vp.y + vp.h * 0.25; // 25% from top

    // Callout line endpoint (to the left of the dashboard)
    const calloutEndX = vp.x - 200; // Left of dashboard
    const calloutEndY = criY; // Same vertical position

    // Draw callout line (animated over 300ms)
    const lineDur = 0.30;
    const lineProgress = clamp(calloutLt / lineDur, 0, 1);
    if (lineProgress > 0) {
      ctx.save();
      ctx.globalAlpha = exitFade;
      ctx.strokeStyle = '#4A9EFF';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#4A9EFF';
      ctx.shadowBlur = 8;

      const currentX = criX + (calloutEndX - criX) * lineProgress;
      const currentY = criY + (calloutEndY - criY) * lineProgress;

      ctx.beginPath();
      ctx.moveTo(criX, criY);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
      ctx.restore();
    }

    // CRI number and label (appear after line completes) with enhanced styling
    if (calloutLt >= lineDur) {
      const textFade = clamp((calloutLt - lineDur) / 0.25, 0, 1) * exitFade;

      if (textFade > 0.01) {
        // "86" in large white serif with strong glow
        ctx.save();
        ctx.globalAlpha = textFade;
        ctx.font = `900 140px ${FONT_SERIF}`;
        if ('letterSpacing' in ctx) ctx.letterSpacing = '-4.2px';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        ctx.shadowColor = '#4A9EFF';
        ctx.shadowBlur = 40;
        ctx.fillStyle = '#ffffff';
        ctx.fillText('86', calloutEndX - 60, calloutEndY - 20);
        ctx.restore();

        // "CLINICAL RECOVERY INDEX" below with glow
        ctx.save();
        ctx.globalAlpha = textFade;
        ctx.font = `700 16px ${FONT_MONO}`;
        if ('letterSpacing' in ctx) ctx.letterSpacing = '3.2px';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        ctx.shadowColor = '#4A9EFF';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#4A9EFF';
        ctx.fillText('CLINICAL RECOVERY INDEX', calloutEndX - 60, calloutEndY + 50);
        ctx.restore();
      }
    }

    // Domain scores bars (start at 0.8s after callout starts, staggered 0.1s each)
    const barsStart = 0.80;
    if (calloutLt >= barsStart) {
      const bars = [
        { label: 'PINCH', value: 88, delay: 0.00 },
        { label: 'HAND OPENING', value: 84, delay: 0.10 },
        { label: 'SMILE', value: 82, delay: 0.20 },
        { label: 'VOICE', value: 90, delay: 0.30 },
      ];

      const barStartY = calloutEndY + 90;
      const barSpacing = 46;
      const barMaxW = 320;

      bars.forEach((bar, i) => {
        const barLt = calloutLt - barsStart - bar.delay;
        if (barLt < 0) return;

        const barY = barStartY + i * barSpacing;
        const barFade = clamp(barLt / 0.15, 0, 1) * exitFade;
        const barFill = clamp((barLt - 0.10) / 0.40, 0, 1);

        if (barFade > 0.01) {
          ctx.save();
          ctx.globalAlpha = barFade;

          // Label with subtle glow
          ctx.font = `600 12px ${FONT_MONO}`;
          if ('letterSpacing' in ctx) ctx.letterSpacing = '2.4px';
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'left';
          ctx.shadowColor = '#00D9FF';
          ctx.shadowBlur = 6;
          ctx.fillStyle = 'rgba(0, 217, 255, 0.8)';
          ctx.fillText(bar.label, calloutEndX - 60, barY - 10);

          // Value with stronger glow
          ctx.font = `900 18px ${FONT_MONO}`;
          ctx.shadowColor = '#4A9EFF';
          ctx.shadowBlur = 14;
          ctx.fillStyle = '#4A9EFF';
          ctx.fillText(String(bar.value), calloutEndX - 60, barY + 8);

          // Bar track
          ctx.fillStyle = 'rgba(255,255,255,0.1)';
          ctx.fillRect(calloutEndX + 20, barY + 4, barMaxW, 4);

          // Bar fill with glow
          const fillW = barMaxW * (bar.value / 100) * barFill;
          ctx.shadowColor = '#4A9EFF';
          ctx.shadowBlur = 12;
          ctx.fillStyle = '#4A9EFF';
          ctx.fillRect(calloutEndX + 20, barY + 4, fillW, 4);

          // Bright leading edge
          if (fillW > 2) {
            ctx.shadowBlur = 20;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(calloutEndX + 20 + fillW - 2, barY + 3, 2, 6);
          }

          ctx.restore();
        }
      });
    }
  }

  // No left text in this beat — dashboard is fullscreen and centered
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

  // Panel derecho ELIMINADO - solo texto izquierdo
  const panelX = 980, panelY = 180, panelW = 880, panelH = 760;

  // ── LEFT STACK CON MUCHA SAZÓN ──

  // Eyebrow con glow reducido
  let s = slamInState(lt, { inAt: 0.05, dur: 0.28, offsetY: 10 });
  if (s) {
    ctx.save();
    ctx.globalAlpha = s.opacity;
    ctx.translate(120, 220 + s.ty);
    ctx.font = `600 13px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '2.8px';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.shadowColor = '#4A9EFF';
    ctx.shadowBlur = 6;
    ctx.fillStyle = 'rgba(74, 158, 255, 0.85)';
    ctx.fillText('○ MULTIMODAL CAPTURE · REAL-TIME ANALYSIS', 0, 0);
    ctx.restore();
  }

  // "14 biomarkers" con brillo reducido
  s = slamInState(lt, { inAt: 0.15, dur: 0.34, offsetY: 28, fromScale: 0.95, blurPx: 3 });
  const c14 = countUpValue(lt, { inAt: 0.20, dur: 0.30, from: 0, to: 14, decimals: 0, punchScale: 1.04 });
  if (s && c14) {
    ctx.save();
    ctx.globalAlpha = s.opacity;
    ctx.translate(120, 290 + s.ty);
    ctx.scale(s.scale * c14.scale, s.scale * c14.scale);
    if (s.blur > 0) ctx.filter = `blur(${s.blur}px)`;

    ctx.font = `900 100px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-3px';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    // Número sin gradient, solo azul sólido
    ctx.shadowColor = '#4A9EFF';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#4A9EFF';
    ctx.fillText(c14.display, 0, 0);

    // "biomarkers." en blanco con glow reducido
    const num14Width = ctx.measureText(c14.display).width;
    ctx.shadowColor = 'rgba(255,255,255,0.3)';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(' biomarkers.', num14Width, 0);

    ctx.restore();
  }

  // Divider horizontal con glow reducido
  drawGlowLine(ctx, lt, {
    x: 124, y: 425, length: 700, thickness: 1,
    inAt: 0.45, drawDur: 0.30, color: 'rgba(74, 158, 255, 0.4)', glow: 6,
  });

  // "Every session." sin gradient, más simple
  s = slamInState(lt, { inAt: 0.55, dur: 0.32, offsetY: 22 });
  if (s) {
    ctx.save();
    ctx.globalAlpha = s.opacity;
    ctx.translate(120, 460 + s.ty);
    ctx.font = `800 78px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.95px';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    ctx.shadowColor = 'rgba(255,255,255,0.3)';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Every session.', 0, 0);
    ctx.restore();
  }

  // "Every day." en azul simple
  s = slamInState(lt, { inAt: 0.95, dur: 0.32, offsetY: 22 });
  if (s) {
    ctx.save();
    ctx.globalAlpha = s.opacity;
    ctx.translate(120, 565 + s.ty);
    ctx.font = `800 78px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.95px';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    ctx.shadowColor = '#4A9EFF';
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#4A9EFF';
    ctx.fillText('Every day.', 0, 0);
    ctx.restore();
  }

  // Divider bottom con glow reducido
  drawGlowLine(ctx, lt, {
    x: 124, y: 670, length: 650, thickness: 1,
    inAt: 1.20, drawDur: 0.28, color: 'rgba(74, 158, 255, 0.4)', glow: 6,
  });

  // Metadata técnica con brillo muy reducido
  s = slamInState(lt, { inAt: 1.30, dur: 0.30, offsetY: 8 });
  if (s) {
    ctx.save();
    ctx.globalAlpha = s.opacity;
    ctx.translate(120, 698 + s.ty);
    ctx.font = `500 13px ${FONT_MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '2.6px';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.shadowColor = '#4A9EFF';
    ctx.shadowBlur = 4;
    ctx.fillStyle = 'rgba(74, 158, 255, 0.65)';
    ctx.fillText('[ TRAJECTORY · CONTINUOUS · CLINICIAN-FACING ]', 0, 0);
    ctx.restore();
  }

  // ── ELEMENTOS VISUALES ELIMINADOS PARA SIMPLICIDAD ──
  // Anillo pulsante ELIMINADO
  // Partículas flotantes ELIMINADAS
}

function renderBlock4Canvas(ctx, t) {
  if (t < 27.0 || t > 39.05) return;

  renderBlock4Opening(ctx, t);
  renderBlock4Dashboard(ctx, t);
  renderBlock4Beat3(ctx, t);
  renderBlock4Beat4(ctx, t);

  // iOS Notification - appears 0.5s after block starts (at 27.5s)
  // This is the "aha moment" - the clinician receives the report automatically
  drawIOSNotification(ctx, t, { inAt: 27.5, stayDur: 2.5, exitDur: 0.2 });

  // Closing transition: letterbox (4→5)
  drawLetterbox(ctx, t - 38.70, 0.30);
}

Object.assign(window, { renderBlock4Canvas, drawMetricCard });
