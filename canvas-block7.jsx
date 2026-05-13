// canvas-block7.jsx — Block 7: The Heartbeat. 0:53 → 1:06
// "Between Visits" anchored static — only right text changes, then unification.

function renderBlock7Canvas(ctx, t) {
  if (t < 53.0 || t > 66.0) return;
  const lt = t - 53.0;

  // Pure black — no atmosphere, silence is earned

  const centerY = 540;
  const fontSize = 72;
  const anchorFont = `800 ${fontSize}px ${FONT_SERIF}`;
  const restFont = `600 ${fontSize}px ${FONT_SERIF}`;

  // Calculate anchor position dynamically for better balance
  ctx.font = anchorFont;
  const betweenVisitsWidth = ctx.measureText('Between Visits').width;
  ctx.font = restFont;
  const longestText = ', deterioration gets caught early.'; // Longest right text
  const longestWidth = ctx.measureText(longestText).width;
  const totalWidth = betweenVisitsWidth + longestWidth;
  const anchorX = 960 - totalWidth / 2 - 50; // Center the whole phrase, slight left adjustment

  // Right-side texts that change
  const rightTexts = [
    ', recovery is now tracked.',
    ', deterioration gets caught early.',
    ', clinicians are never blind.',
    ', nothing gets missed.',
    '.com' // The final reveal - triggers EPIC finale
  ];

  const holdDur = 2.0; // Each text holds for 2s
  const crossDur = 0.2; // 200ms cross-dissolve

  // Calculate which text and fade states
  let currentIndex = -1;
  let fadeIn = 0;
  let fadeOut = 0;

  for (let i = 0; i < rightTexts.length; i++) {
    const textStart = i * (holdDur + crossDur);
    const textEnd = textStart + holdDur;
    const fadeOutStart = textEnd;
    const fadeOutEnd = fadeOutStart + crossDur;

    if (lt >= textStart && lt < fadeOutEnd) {
      currentIndex = i;

      // Fade in
      if (lt < textStart + crossDur) {
        fadeIn = (lt - textStart) / crossDur;
      } else {
        fadeIn = 1;
      }

      // Fade out
      if (lt >= fadeOutStart) {
        fadeOut = (lt - fadeOutStart) / crossDur;
      } else {
        fadeOut = 0;
      }
      break;
    }
  }

  // ── PHASE 1: Static "Between Visits" with changing right text ──
  const unificationStart = rightTexts.length * (holdDur + crossDur);

  if (lt < unificationStart) {
    // Draw static "Between Visits"
    ctx.save();
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.font = anchorFont;
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Between Visits', anchorX, centerY);
    ctx.restore();

    // Draw changing right text
    if (currentIndex >= 0) {
      const rightText = rightTexts[currentIndex];
      const opacity = fadeIn * (1 - fadeOut);

      if (opacity > 0.01) {
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';

        // Measure "Between Visits" to know where right text starts
        ctx.font = anchorFont;
        const anchorWidth = ctx.measureText('Between Visits').width;

        ctx.font = restFont;
        ctx.fillStyle = '#AEAEB2';
        ctx.fillText(rightText, anchorX + anchorWidth, centerY);
        ctx.restore();
      }
    }
  }

  // ── PHASE 2: Unification sequence ──
  if (lt >= unificationStart) {
    const unifyLt = lt - unificationStart;

    // Step 1: Brief flash/impact when .com appears (150ms)
    const flashDur = 0.15;

    // Step 2: Words join together quickly (250ms)
    const joinWordsStart = flashDur;
    const joinWordsDur = 0.25;

    // Step 3: Move to center + scale up simultaneously (400ms) - EPIC
    const epicStart = joinWordsStart + joinWordsDur;
    const epicDur = 0.4;

    // Step 4: Explosion of effects at center (500ms)
    const explosionStart = epicStart + epicDur;
    const explosionDur = 0.5;

    // Step 5: Hold large with pulsing glow (2.5s)
    const holdStart = explosionStart + explosionDur;
    const holdEnd = holdStart + 2.5;

    // Step 6: Fade to black (1.2s)
    const fadeBlackStart = holdEnd;
    const fadeBlackDur = 1.2;

    // Initial flash when .com appears
    let flashIntensity = 0;
    if (unifyLt < flashDur) {
      flashIntensity = Math.sin((unifyLt / flashDur) * Math.PI) * 0.4;
    }

    // Measure widths
    ctx.font = anchorFont;
    const betweenWidth = ctx.measureText('Between').width;
    const visitsWidth = ctx.measureText('Visits').width;
    const spaceWidth = ctx.measureText(' ').width;
    ctx.font = restFont;
    const comWidth = ctx.measureText('.com').width;

    // Calculate join progress
    const joinT = Math.min(Math.max((unifyLt - joinWordsStart) / joinWordsDur, 0), 1);
    const joinEase = Easing.easeInOutCubic(joinT);

    // Initial positions
    const betweenInitialX = anchorX;
    const visitsInitialX = betweenInitialX + betweenWidth + spaceWidth;
    const comInitialX = visitsInitialX + visitsWidth;

    // Joined positions (tight together)
    const betweenJoinedX = anchorX;
    const visitsJoinedX = betweenJoinedX + betweenWidth - 5;
    const comJoinedX = visitsJoinedX + visitsWidth - 5;

    // Interpolate during join
    const betweenX = betweenInitialX + (betweenJoinedX - betweenInitialX) * joinEase;
    const visitsX = visitsInitialX + (visitsJoinedX - visitsInitialX) * joinEase;
    const comX = comInitialX + (comJoinedX - comInitialX) * joinEase;

    // EPIC transformation - move to center + scale up simultaneously
    const epicT = Math.min(Math.max((unifyLt - epicStart) / epicDur, 0), 1);
    const epicEase = Easing.easeOutCubic(epicT);

    // Calculate center position
    const joinedWidth = betweenWidth + visitsWidth + comWidth - 10;
    const targetCenterX = 960 - joinedWidth / 2;

    const currentBetweenX = betweenX + (targetCenterX - betweenX) * epicEase;
    const currentVisitsX = visitsX + (targetCenterX + betweenWidth - 5 - visitsX) * epicEase;
    const currentComX = comX + (targetCenterX + betweenWidth + visitsWidth - 10 - comX) * epicEase;

    // Scale grows during epic moment
    let scale = 1.0 + epicEase * 0.25; // 100% → 125%

    // Explosion effects at center
    let explosionIntensity = 0;
    let particles = [];
    if (unifyLt >= explosionStart) {
      const expT = Math.min((unifyLt - explosionStart) / explosionDur, 1);
      explosionIntensity = Math.sin(expT * Math.PI);

      // Continue scaling during explosion
      scale = 1.25 + Easing.easeOutCubic(expT) * 0.25; // 125% → 150%

      // Generate particles for explosion
      const particleCount = 20;
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = expT * 300;
        particles.push({
          x: 960 + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          opacity: (1 - expT) * 0.6
        });
      }
    }

    // Pulsing during hold
    let pulseScale = 1.0;
    if (unifyLt >= holdStart && unifyLt < holdEnd) {
      const holdT = (unifyLt - holdStart) / (holdEnd - holdStart);
      pulseScale = 1.0 + Math.sin(holdT * Math.PI * 6) * 0.03; // Subtle pulse
    }

    scale *= pulseScale;

    // Color transformation
    const unifiedColor = unifyLt >= joinWordsStart;

    // Final fade
    let finalOpacity = 1.0;
    if (unifyLt >= fadeBlackStart) {
      const fadeT = Math.min((unifyLt - fadeBlackStart) / fadeBlackDur, 1);
      finalOpacity = 1 - Easing.easeInCubic(fadeT);
    }

    if (finalOpacity > 0.01) {
      // Initial flash across screen
      if (flashIntensity > 0) {
        ctx.save();
        ctx.globalAlpha = flashIntensity * finalOpacity;
        ctx.fillStyle = '#4A9EFF';
        ctx.fillRect(0, 0, 1920, 1080);
        ctx.restore();
      }

      // Explosion particles
      if (particles.length > 0) {
        ctx.save();
        particles.forEach(p => {
          ctx.globalAlpha = p.opacity * finalOpacity;
          ctx.fillStyle = '#4A9EFF';
          ctx.shadowColor = '#4A9EFF';
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }

      // Multiple expanding rings during explosion
      if (explosionIntensity > 0) {
        for (let i = 0; i < 4; i++) {
          const ringT = (unifyLt - explosionStart - i * 0.1) / explosionDur;
          if (ringT > 0 && ringT < 1) {
            const radius = Easing.easeOutCubic(ringT) * (600 + i * 100);
            const ringAlpha = (1 - ringT) * 0.35 * finalOpacity;

            ctx.save();
            ctx.globalAlpha = ringAlpha;
            ctx.strokeStyle = '#4A9EFF';
            ctx.lineWidth = 4 - i * 0.5;
            ctx.shadowColor = '#4A9EFF';
            ctx.shadowBlur = 40;
            ctx.beginPath();
            ctx.arc(960, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // Radial gradient glow behind text during hold
      if (unifyLt >= holdStart && unifyLt < holdEnd) {
        const holdT = (unifyLt - holdStart) / (holdEnd - holdStart);
        const glowPulse = 0.3 + Math.sin(holdT * Math.PI * 6) * 0.15;

        ctx.save();
        ctx.globalAlpha = glowPulse * finalOpacity;
        const grad = ctx.createRadialGradient(960, centerY, 0, 960, centerY, 500);
        grad.addColorStop(0, 'rgba(74, 158, 255, 0.3)');
        grad.addColorStop(0.5, 'rgba(74, 158, 255, 0.1)');
        grad.addColorStop(1, 'rgba(74, 158, 255, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1920, 1080);
        ctx.restore();
      }

      // Main text
      ctx.save();
      ctx.globalAlpha = finalOpacity;

      ctx.translate(960, centerY);
      ctx.scale(scale, scale);
      ctx.translate(-960, -centerY);
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';

      // Strong glow during epic + explosion
      const glowStrength = Math.max(epicT, explosionIntensity);
      if (glowStrength > 0) {
        ctx.shadowColor = '#4A9EFF';
        ctx.shadowBlur = 50 * glowStrength;
      }

      // Color choice
      const textColor = unifiedColor ? '#ffffff' : '#ffffff';
      ctx.font = anchorFont;

      // Draw "Between"
      ctx.fillStyle = textColor;
      ctx.fillText('Between', currentBetweenX, centerY);

      // Draw "Visits"
      ctx.fillStyle = textColor;
      ctx.fillText('Visits', currentVisitsX, centerY);

      // Draw ".com" in gradient during explosion, solid blue otherwise
      ctx.font = restFont;
      if (explosionIntensity > 0.1) {
        // Gradient .com during explosion
        const grad = ctx.createLinearGradient(currentComX, 0, currentComX + comWidth, 0);
        grad.addColorStop(0, '#00D9FF');
        grad.addColorStop(0.5, '#4A9EFF');
        grad.addColorStop(1, '#6BB3FF');
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = '#4A9EFF';
      }
      ctx.fillText('.com', currentComX, centerY);

      ctx.restore();
    }
  }
}

Object.assign(window, { renderBlock7Canvas });
