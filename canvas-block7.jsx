// canvas-block7.jsx — Block 7: The Fixed Gap with SLOT MACHINE effect
// Three sentences with "GAP" anchored in red, slot machine vertical flow

function renderBlock7Canvas(ctx, t) {
  if (t < 53.0 || t > 66.0) return;
  const lt = t - 53.0;

  // Pure black — no atmosphere, the problem speaks for itself

  // Manual easing function to replace Easing.easeOut
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const centerY = 540; // Vertical center of 1080px canvas
  const baseFontSize = 110; // HUGE - slot machine needs to be visible
  const heavyFont = `900 ${baseFontSize}px ${FONT_SERIF}`;

  // ── PHASE 1: Three sentences with SLOT MACHINE vertical flow ──
  const sentences = [
    { left: '673 patients per clinician. No one is watching at home. There is a', gap: 'GAP' },
    { left: 'Stroke recovery happens in 12 weeks. Clinicians see 2 of them. There is a', gap: 'GAP' },
    { left: 'The data exists. The camera exists. The patient exists. There is a', gap: 'GAP' }
  ];

  const holdDur = 2.0; // Each sentence holds 2s
  const slideDur = 0.5; // 500ms vertical slide
  const sentencesPhaseDur = sentences.length * (holdDur + slideDur);

  // ── GAP is STATIC at fixed position — never moves ──
  const GAP_X = 1920 * 0.75; // Fixed position - 75% of canvas width
  const GAP_Y = centerY; // Vertical center

  if (lt < sentencesPhaseDur) {
    // Calculate shared font size that works for ALL three sentences
    let sharedFontSize = baseFontSize;
    let sharedFont = heavyFont;

    // Test all sentences to find the size that fits the longest one
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      let currentFontSize = baseFontSize;

      // Loop to find fitting font size for this sentence
      while (currentFontSize > 30) {
        const testFont = `900 ${currentFontSize}px ${FONT_SERIF}`;
        ctx.font = testFont;

        const whiteTextWidth = ctx.measureText(sentence.left).width;
        const spaceWidth = ctx.measureText(' ').width;

        // White text must end exactly one space before GAP_X
        const whiteTextMaxEndX = GAP_X - spaceWidth;
        const whiteTextStartX = whiteTextMaxEndX - whiteTextWidth;

        // Check if white text starts on screen
        if (whiteTextStartX >= 40) {
          break; // This size works
        }

        currentFontSize -= 2; // Too big, reduce
      }

      // Use the smallest size needed across all sentences
      if (currentFontSize < sharedFontSize) {
        sharedFontSize = currentFontSize;
        sharedFont = `900 ${currentFontSize}px ${FONT_SERIF}`;
      }
    }

    // Draw GAP at FIXED position - always visible, never moves
    ctx.save();
    ctx.font = sharedFont;
    const gapWidth = ctx.measureText('GAP').width;

    // GAP pulsing red glow + chromatic aberration
    const gapGlowPulse = 0.7 + Math.sin(lt * 3) * 0.3;

    // Chromatic aberration on GAP (RGB split)
    const aberration = 3;
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = '#FF0000';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillText('GAP', GAP_X - aberration, GAP_Y);
    ctx.fillStyle = '#00FF00';
    ctx.fillText('GAP', GAP_X, GAP_Y);
    ctx.fillStyle = '#0000FF';
    ctx.fillText('GAP', GAP_X + aberration, GAP_Y);

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1.0;

    // Main GAP text with intense red glow
    ctx.shadowColor = '#FF6B6B';
    ctx.shadowBlur = 50 * gapGlowPulse;
    ctx.fillStyle = '#FF6B6B';
    ctx.fillText('GAP', GAP_X, GAP_Y);

    ctx.shadowBlur = 0;

    // Particles around GAP
    const particleCount = 8;
    for (let i = 0; i < particleCount; i++) {
      const angle = (lt * 2 + i / particleCount * Math.PI * 2);
      const radius = 25 + Math.sin(lt * 4 + i) * 10;
      const px = GAP_X + gapWidth / 2 + Math.cos(angle) * radius;
      const py = GAP_Y + Math.sin(angle) * radius;
      const particleSize = 2 + Math.sin(lt * 5 + i) * 1;

      ctx.globalAlpha = 0.5 + Math.sin(lt * 6 + i) * 0.3;
      ctx.fillStyle = '#FF6B6B';
      ctx.beginPath();
      ctx.arc(px, py, particleSize, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // ── SLOT MACHINE LOGIC ──
    const cycleTime = holdDur + slideDur;
    const currentCycle = Math.floor(lt / cycleTime);
    const cycleProgress = lt % cycleTime;

    // Calculate vertical slot offset (0 to 1 during slide)
    let slotOffset = 0;
    if (cycleProgress > holdDur) {
      const slideProgress = (cycleProgress - holdDur) / slideDur;
      slotOffset = Easing.easeInOutCubic(slideProgress);
    }

    const lineHeight = sharedFontSize * 2.2; // More space between lines for slot effect

    // Draw 3 visible sentences: previous (above), current (center), next (below)
    const currentIndex = Math.min(currentCycle, sentences.length - 1);

    // Motion blur during slide for slot machine effect
    const motionBlurIntensity = slotOffset * 15;

    ctx.font = sharedFont;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';

    for (let offset = -1; offset <= 1; offset++) {
      const sentenceIndex = currentIndex + offset;
      if (sentenceIndex < 0 || sentenceIndex >= sentences.length) continue;

      const sentence = sentences[sentenceIndex];

      // Calculate Y position with slot offset
      const baseY = GAP_Y + (offset * lineHeight) - (slotOffset * lineHeight);

      // Calculate opacity: center is bright (1.0), others are dim (0.3)
      let opacity = 0.3;
      if (offset === 0) {
        // Current sentence - bright white
        opacity = 1.0;
      } else if (offset === -1 && slotOffset > 0) {
        // Previous sliding out - fade out as it moves up
        opacity = 0.3 * (1 - slotOffset);
      } else if (offset === 1 && slotOffset > 0) {
        // Next sliding in - fade in as it moves up
        opacity = 0.3 + (0.7 * slotOffset);
      }

      if (opacity < 0.05) continue; // Skip if nearly invisible

      // Calculate white text position
      const whiteTextWidth = ctx.measureText(sentence.left).width;
      const spaceWidth = ctx.measureText(' ').width;
      const whiteTextMaxEndX = GAP_X - spaceWidth;
      const whiteTextStartX = whiteTextMaxEndX - whiteTextWidth;

      ctx.save();
      ctx.globalAlpha = opacity;

      // Motion blur effect during slide
      if (slotOffset > 0 && slotOffset < 1) {
        // Draw multiple copies with slight offset for motion blur
        for (let blur = 0; blur < 3; blur++) {
          const blurOffset = blur * motionBlurIntensity / 3;
          ctx.globalAlpha = opacity * (0.3 - blur * 0.1);
          ctx.fillStyle = '#ffffff';
          ctx.fillText(sentence.left, whiteTextStartX, baseY + blurOffset);
        }
      }

      // Main text
      ctx.globalAlpha = opacity;
      ctx.fillStyle = '#ffffff';

      // Add glow to center sentence
      if (offset === 0) {
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 20;
      }

      ctx.fillText(sentence.left, whiteTextStartX, baseY);
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    // Slot machine frame indicator lines (horizontal guides)
    if (slotOffset > 0) {
      ctx.save();
      ctx.globalAlpha = 0.1 * slotOffset;
      ctx.strokeStyle = '#4A9EFF';
      ctx.lineWidth = 2;

      // Top guide line
      ctx.beginPath();
      ctx.moveTo(0, GAP_Y - lineHeight * 0.7);
      ctx.lineTo(1920, GAP_Y - lineHeight * 0.7);
      ctx.stroke();

      // Bottom guide line
      ctx.beginPath();
      ctx.moveTo(0, GAP_Y + lineHeight * 0.7);
      ctx.lineTo(1920, GAP_Y + lineHeight * 0.7);
      ctx.stroke();
      ctx.restore();
    }
  }

  // ── PHASE 2: GAP alone, then FIXED slides in ──
  const gapAloneStart = sentencesPhaseDur;
  const gapAloneDur = 0.8;

  const fixedSlideStart = gapAloneStart + gapAloneDur;
  const fixedSlideDur = 0.6;

  const healStart = fixedSlideStart + fixedSlideDur;
  const healDur = 0.4;

  const pulseStart = healStart + healDur;
  const pulseDur = 0.5;

  const dotComStart = pulseStart + pulseDur;
  const dotComTypeDur = 0.16;

  const scaleStart = dotComStart + dotComTypeDur;
  const scaleDur = 0.8;

  const explosionStart = scaleStart + scaleDur;
  const explosionDur = 0.5;

  const holdStart = explosionStart + explosionDur;
  const holdEnd = holdStart + 2.0;

  const fadeBlackStart = holdEnd;
  const fadeBlackDur = 1.2;

  if (lt >= gapAloneStart) {
    const phaseT = lt - gapAloneStart;

    ctx.font = heavyFont;

    const fixedWidth = ctx.measureText('FIXED').width;
    const gapWidth = ctx.measureText('GAP').width;
    const comWidth = ctx.measureText('.com').width;

    const GAP_X = 1920 * 0.75;

    const fixedStartX = -fixedWidth - 100;
    const fixedEndX = GAP_X - fixedWidth;

    let fixedX = fixedStartX;
    let fixedVisible = false;
    let fixedSlideProgress = 0;

    if (phaseT >= (fixedSlideStart - gapAloneStart)) {
      fixedVisible = true;
      const slideT = Math.min((phaseT - (fixedSlideStart - gapAloneStart)) / fixedSlideDur, 1);
      const slideEase = easeOut(slideT);
      fixedX = fixedStartX + (fixedEndX - fixedStartX) * slideEase;
      fixedSlideProgress = slideT;
    }

    let shakeX = 0;
    let shakeY = 0;
    if (fixedSlideProgress > 0.8 && fixedSlideProgress < 1.0) {
      const shakeIntensity = 8 * (1 - (fixedSlideProgress - 0.8) / 0.2);
      shakeX = (Math.random() - 0.5) * shakeIntensity;
      shakeY = (Math.random() - 0.5) * shakeIntensity;
    }

    let gapColor = '#FF6B6B';
    if (phaseT >= (healStart - gapAloneStart)) {
      const healT = Math.min((phaseT - (healStart - gapAloneStart)) / healDur, 1);
      const r = Math.floor(255 + (255 - 255) * healT);
      const g = Math.floor(107 + (255 - 107) * healT);
      const b = Math.floor(107 + (255 - 107) * healT);
      gapColor = `rgb(${r}, ${g}, ${b})`;
    }

    let pulseIntensity = 0;
    if (phaseT >= (pulseStart - gapAloneStart) && phaseT < (pulseStart - gapAloneStart + pulseDur)) {
      const pulseT = (phaseT - (pulseStart - gapAloneStart)) / pulseDur;
      pulseIntensity = Math.sin(pulseT * Math.PI);
    }

    let dotComText = '';
    let dotComVisible = false;
    if (phaseT >= (dotComStart - gapAloneStart)) {
      dotComVisible = true;
      const typeT = phaseT - (dotComStart - gapAloneStart);
      const charsTyped = Math.min(Math.floor(typeT / 0.04), 4);
      dotComText = '.com'.substring(0, charsTyped);
    }

    const totalWidth = fixedWidth + gapWidth + (dotComVisible ? comWidth : 0);
    const centerStartX = 960 - totalWidth / 2;

    let currentFixedX = fixedX;
    let currentGapX = GAP_X;
    let currentComX = GAP_X + gapWidth;

    let scale = 1.0;
    if (phaseT >= (scaleStart - gapAloneStart)) {
      const scaleT = Math.min((phaseT - (scaleStart - gapAloneStart)) / scaleDur, 1);
      const scaleEase = Easing.easeOutCubic(scaleT);
      scale = 1.0 + scaleEase * 0.15;

      currentFixedX = fixedX + (centerStartX - fixedX) * scaleEase;
      currentGapX = GAP_X + (centerStartX + fixedWidth - GAP_X) * scaleEase;
      currentComX = currentGapX + gapWidth;
    }

    let explosionIntensity = 0;
    let particles = [];
    if (phaseT >= (explosionStart - gapAloneStart)) {
      const expT = Math.min((phaseT - (explosionStart - gapAloneStart)) / explosionDur, 1);
      explosionIntensity = Math.sin(expT * Math.PI);

      const particleCount = 30;
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = expT * 400;
        particles.push({
          x: 960 + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          opacity: (1 - expT) * 0.7
        });
      }
    }

    let finalOpacity = 1.0;
    if (phaseT >= (fadeBlackStart - gapAloneStart)) {
      const fadeT = Math.min((phaseT - (fadeBlackStart - gapAloneStart)) / fadeBlackDur, 1);
      finalOpacity = 1 - Easing.easeInCubic(fadeT);
    }

    if (finalOpacity > 0.01) {
      if (particles.length > 0) {
        ctx.save();
        particles.forEach((p, idx) => {
          const trailLength = 30;
          const angle = Math.atan2(p.y - centerY, p.x - 960);
          ctx.globalAlpha = p.opacity * 0.3 * finalOpacity;
          ctx.strokeStyle = '#4A9EFF';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - Math.cos(angle) * trailLength, p.y - Math.sin(angle) * trailLength);
          ctx.stroke();

          ctx.globalAlpha = p.opacity * finalOpacity;
          ctx.fillStyle = '#4A9EFF';
          ctx.shadowColor = '#4A9EFF';
          ctx.shadowBlur = 30;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }

      if (explosionIntensity > 0) {
        for (let i = 0; i < 5; i++) {
          const ringT = (phaseT - (explosionStart - gapAloneStart) - i * 0.08) / explosionDur;
          if (ringT > 0 && ringT < 1) {
            const radius = Easing.easeOutCubic(ringT) * (600 + i * 100);
            const ringAlpha = (1 - ringT) * 0.5 * finalOpacity;

            ctx.save();
            ctx.globalAlpha = ringAlpha;
            ctx.strokeStyle = '#4A9EFF';
            ctx.lineWidth = 6 - i * 0.8;
            ctx.shadowColor = '#4A9EFF';
            ctx.shadowBlur = 60;
            ctx.beginPath();
            ctx.arc(960, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      if (explosionIntensity > 0.7) {
        ctx.save();
        ctx.globalAlpha = (explosionIntensity - 0.7) * 0.3 * finalOpacity;
        ctx.fillStyle = '#4A9EFF';
        ctx.fillRect(0, 0, 1920, 1080);
        ctx.restore();
      }

      ctx.save();
      ctx.globalAlpha = finalOpacity;
      ctx.translate(960 + shakeX, centerY + shakeY);
      ctx.scale(scale, scale);
      ctx.translate(-960, -centerY);

      ctx.font = heavyFont;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';

      if (fixedVisible) {
        ctx.fillStyle = '#ffffff';
        ctx.fillText('FIXED', currentFixedX, centerY);
      }

      if (explosionIntensity > 0.1) {
        ctx.shadowColor = '#4A9EFF';
        ctx.shadowBlur = 80 * explosionIntensity;
      }

      ctx.fillStyle = gapColor;
      ctx.fillText('GAP', currentGapX, centerY);

      ctx.shadowBlur = 0;

      if (dotComVisible && dotComText.length > 0) {
        ctx.shadowColor = '#4A9EFF';
        ctx.shadowBlur = 25;
        ctx.fillStyle = '#4A9EFF';
        ctx.fillText(dotComText, currentComX, centerY);
      }

      ctx.restore();
    }
  }
}

Object.assign(window, { renderBlock7Canvas });
