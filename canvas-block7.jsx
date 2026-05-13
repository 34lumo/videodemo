// canvas-block7.jsx — Block 7: Between Visits. 0:53 → 1:06
// Pure black. Symmetric layout → converge to center → bounce → zoom to camera.

function renderBlock7Canvas(ctx, t) {
  if (t < 53.0 || t > 66.0) return;
  const lt = t - 53.0;

  // Faint grain on pure black
  if (lt < 12.0) {
    drawGrain(ctx, lt, 0.022);
  }

  const FONT_SIZE = 72;
  const Y_CENTER = 540;
  const LEFT_START_X = 140;

  // ── LEFT ANCHOR — "Between Visits" ──
  // Stays on left until it's time to join
  const joinStartTime = 7.40; // when both move to center

  if (lt > 0.20 && lt < joinStartTime) {
    ctx.save();
    ctx.font = `700 ${FONT_SIZE}px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.44px';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Between Visits', LEFT_START_X, Y_CENTER);
    ctx.restore();
  }

  // Measure "Between Visits" width
  ctx.save();
  ctx.font = `700 ${FONT_SIZE}px ${FONT_SERIF}`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.44px';
  const bvWidth = ctx.measureText('Between Visits').width;
  ctx.restore();

  const CHANGING_START_X = LEFT_START_X + bvWidth + 100;

  // ── ROTATING STATEMENTS (shorter to avoid cutting) ──

  // Statement 1: "Clinicians operate" → "blind."
  if (lt >= 0.60 && lt < 2.50) {
    const tLocal = lt - 0.60;
    const fadeIn = clamp(tLocal / 0.30, 0, 1);
    const fadeOut = clamp((tLocal - 1.60) / 0.30, 0, 1);
    const fade = Easing.easeInOutCubic(fadeIn) * (1 - Easing.easeInOutCubic(fadeOut));

    if (fade > 0.001) {
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.font = `600 ${FONT_SIZE}px ${FONT_SERIF}`;
      if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.44px';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fillText('Clinicians operate', CHANGING_START_X, Y_CENTER);
      ctx.restore();
    }

    ctx.save();
    ctx.font = `600 ${FONT_SIZE}px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.44px';
    const greyWidth = ctx.measureText('Clinicians operate').width;
    ctx.restore();

    if (tLocal >= 0.08 && tLocal < 1.90) {
      const slamT = clamp((tLocal - 0.08) / 0.18, 0, 1);
      const slamEase = Easing.easeOutBack(slamT);
      let scale = 0.92 + slamEase * 0.18;
      if (slamT >= 1.0) {
        const snapT = clamp((tLocal - 0.26) / 0.06, 0, 1);
        scale = 1.10 - snapT * 0.10;
      }
      const fadeOut2 = clamp((tLocal - 1.60) / 0.30, 0, 1);
      const opacity = (1 - fadeOut2);

      if (opacity > 0.001) {
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(CHANGING_START_X + greyWidth + 20, Y_CENTER);
        ctx.scale(scale, scale);
        ctx.font = `900 ${FONT_SIZE}px ${FONT_SERIF}`;
        if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.44px';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('blind.', 0, 0);
        ctx.restore();
      }
    }
  }

  // Statement 2: "Patients recover" → "alone."
  if (lt >= 2.50 && lt < 4.40) {
    const tLocal = lt - 2.50;
    const fadeIn = clamp(tLocal / 0.30, 0, 1);
    const fadeOut = clamp((tLocal - 1.60) / 0.30, 0, 1);
    const fade = Easing.easeInOutCubic(fadeIn) * (1 - Easing.easeInOutCubic(fadeOut));

    if (fade > 0.001) {
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.font = `600 ${FONT_SIZE}px ${FONT_SERIF}`;
      if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.44px';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fillText('Patients recover', CHANGING_START_X, Y_CENTER);
      ctx.restore();
    }

    ctx.save();
    ctx.font = `600 ${FONT_SIZE}px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.44px';
    const greyWidth = ctx.measureText('Patients recover').width;
    ctx.restore();

    if (tLocal >= 0.08 && tLocal < 1.90) {
      const slamT = clamp((tLocal - 0.08) / 0.18, 0, 1);
      const slamEase = Easing.easeOutBack(slamT);
      let scale = 0.92 + slamEase * 0.18;
      if (slamT >= 1.0) {
        const snapT = clamp((tLocal - 0.26) / 0.06, 0, 1);
        scale = 1.10 - snapT * 0.10;
      }
      const fadeOut2 = clamp((tLocal - 1.60) / 0.30, 0, 1);
      const opacity = (1 - fadeOut2);

      if (opacity > 0.001) {
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(CHANGING_START_X + greyWidth + 20, Y_CENTER);
        ctx.scale(scale, scale);
        ctx.font = `900 ${FONT_SIZE}px ${FONT_SERIF}`;
        if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.44px';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('alone.', 0, 0);
        ctx.restore();
      }
    }
  }

  // Statement 3: "Recovery stops" → "at the door."
  if (lt >= 4.40 && lt < 6.60) {
    const tLocal = lt - 4.40;
    const fadeIn = clamp(tLocal / 0.30, 0, 1);
    const fadeOut = clamp((tLocal - 1.80) / 0.40, 0, 1);
    const fade = Easing.easeInOutCubic(fadeIn) * (1 - Easing.easeInOutCubic(fadeOut));

    if (fade > 0.001) {
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.font = `600 ${FONT_SIZE}px ${FONT_SERIF}`;
      if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.44px';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fillText('Recovery stops', CHANGING_START_X, Y_CENTER);
      ctx.restore();
    }

    ctx.save();
    ctx.font = `600 ${FONT_SIZE}px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.44px';
    const greyWidth = ctx.measureText('Recovery stops').width;
    ctx.restore();

    if (tLocal >= 0.08 && tLocal < 2.00) {
      const slamT = clamp((tLocal - 0.08) / 0.18, 0, 1);
      const slamEase = Easing.easeOutBack(slamT);
      let scale = 0.92 + slamEase * 0.18;
      if (slamT >= 1.0) {
        const snapT = clamp((tLocal - 0.26) / 0.06, 0, 1);
        scale = 1.10 - snapT * 0.10;
      }
      const fadeOut2 = clamp((tLocal - 1.80) / 0.40, 0, 1);
      const opacity = (1 - fadeOut2);

      if (opacity > 0.001) {
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(CHANGING_START_X + greyWidth + 20, Y_CENTER);
        ctx.scale(scale, scale);
        ctx.font = `900 ${FONT_SIZE}px ${FONT_SERIF}`;
        if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.44px';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('at the door.', 0, 0);
        ctx.restore();
      }
    }
  }

  // ── THE CONVERGENCE + ZOOM FINALE ──
  if (lt >= 6.80) {
    const tLocal = lt - 6.80;

    // Phase 1: ".com" appears on right (0.00 - 0.60)
    // Phase 2: Both move to center (0.60 - 1.20)
    // Phase 3: Bounce on join (1.20 - 1.35)
    // Phase 4: Zoom to camera (1.35 - 3.00)

    // Movement to center
    const moveT = clamp((tLocal - 0.60) / 0.60, 0, 1);
    const moveEase = Easing.easeInOutCubic(moveT);

    // Calculate positions
    const fullText = 'betweenvisits.com';
    ctx.save();
    ctx.font = `900 ${FONT_SIZE}px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.44px';
    const fullWidth = ctx.measureText(fullText).width;
    ctx.restore();

    const CENTER_X = 960;
    const finalX = CENTER_X - fullWidth / 2; // center the full text

    // "Between Visits" movement
    const bvStartX = LEFT_START_X;
    const bvEndX = finalX;
    const bvCurrentX = bvStartX + (bvEndX - bvStartX) * moveEase;

    // ".com" movement
    const comStartX = CHANGING_START_X;
    const comEndX = finalX + bvWidth;
    const comCurrentX = comStartX + (comEndX - comStartX) * moveEase;

    // Bounce on join
    let bounceScale = 1.0;
    if (tLocal >= 1.20 && tLocal < 1.35) {
      const bounceT = (tLocal - 1.20) / 0.15;
      bounceScale = 1.0 + Math.sin(bounceT * Math.PI) * 0.08;
    }

    // Zoom to camera (dramatic scale up)
    let zoomScale = 1.0;
    if (tLocal >= 1.35) {
      const zoomT = clamp((tLocal - 1.35) / 1.65, 0, 1);
      const zoomEase = Easing.easeInCubic(zoomT);
      zoomScale = 1.0 + zoomEase * 3.5; // scale up to 4.5x
    }

    // Fade out at the very end
    let opacity = 1;
    if (tLocal > 2.60) {
      opacity = 1 - clamp((tLocal - 2.60) / 0.40, 0, 1);
    }

    // Color transition for ".com": white → blue during movement
    const blueT = clamp((tLocal - 0.80) / 0.40, 0, 1);
    const r = Math.round(255 - blueT * (255 - 74));
    const g = Math.round(255 - blueT * (255 - 158));
    const b = 255;

    if (opacity > 0.001) {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.translate(CENTER_X, Y_CENTER);
      ctx.scale(bounceScale * zoomScale, bounceScale * zoomScale);
      ctx.translate(-CENTER_X, -Y_CENTER);

      // Draw "Between Visits"
      ctx.font = `700 ${FONT_SIZE}px ${FONT_SERIF}`;
      if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.44px';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Between Visits', bvCurrentX, Y_CENTER);

      // Draw ".com"
      ctx.font = `900 ${FONT_SIZE}px ${FONT_SERIF}`;
      if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.44px';
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillText('.com', comCurrentX, Y_CENTER);

      ctx.restore();
    }
  }
}

Object.assign(window, { renderBlock7Canvas });
