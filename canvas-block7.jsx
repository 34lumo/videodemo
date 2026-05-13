// canvas-block7.jsx — Block 7: Between Visits. 0:53 → 1:06
// Pure black. Unified centered composition.

function renderBlock7Canvas(ctx, t) {
  if (t < 53.0 || t > 66.0) return;
  const lt = t - 53.0;

  // Faint grain on pure black
  if (lt < 12.0) {
    drawGrain(ctx, lt, 0.022);
  }

  const FONT_SIZE = 72;
  const Y_CENTER = 540;
  const CENTER_X = 960;

  // ── LEFT ANCHOR — "Between Visits" ──
  if (lt > 0.20) {
    let opacity = 1;
    if (lt > 11.0) {
      opacity = 1 - Easing.easeInOutCubic(clamp((lt - 11.0) / 1.2, 0, 1));
    }
    if (opacity > 0.001) {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.font = `700 ${FONT_SIZE}px ${FONT_SERIF}`;
      if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.44px';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Between Visits', 240, Y_CENTER);
      ctx.restore();
    }
  }

  // Measure "Between Visits" width for positioning the changing text
  ctx.save();
  ctx.font = `700 ${FONT_SIZE}px ${FONT_SERIF}`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.44px';
  const bvWidth = ctx.measureText('Between Visits').width;
  ctx.restore();

  const CHANGING_START_X = 240 + bvWidth + 120; // gap after "Between Visits"

  // ── ROTATING STATEMENTS ──

  // Statement 1: "Clinicians no longer operate" (grey) → "blind." (white)
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
      ctx.fillText('Clinicians no longer operate', CHANGING_START_X, Y_CENTER);
      ctx.restore();
    }

    // Measure grey text width
    ctx.save();
    ctx.font = `600 ${FONT_SIZE}px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.44px';
    const greyWidth = ctx.measureText('Clinicians no longer operate').width;
    ctx.restore();

    // White ending word with overshoot
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

  // Statement 2: "Patients no longer recover" (grey) → "alone." (white)
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
      ctx.fillText('Patients no longer recover', CHANGING_START_X, Y_CENTER);
      ctx.restore();
    }

    ctx.save();
    ctx.font = `600 ${FONT_SIZE}px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.44px';
    const greyWidth = ctx.measureText('Patients no longer recover').width;
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

  // Statement 3: "Recovery data no longer stops" (grey) → "at the door." (white)
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
      ctx.fillText('Recovery no longer stops', CHANGING_START_X, Y_CENTER);
      ctx.restore();
    }

    ctx.save();
    ctx.font = `600 ${FONT_SIZE}px ${FONT_SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.44px';
    const greyWidth = ctx.measureText('Recovery no longer stops').width;
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

  // Statement 4 (FINAL): ".com" → joins "Between Visits"
  if (lt >= 6.80) {
    const tLocal = lt - 6.80;

    // First appears where the changing text goes
    if (tLocal < 2.00) {
      const slamT = clamp(tLocal / 0.18, 0, 1);
      const slamEase = Easing.easeOutBack(slamT);
      let scale = 0.92 + slamEase * 0.18;
      if (slamT >= 1.0) {
        const snapT = clamp((tLocal - 0.18) / 0.06, 0, 1);
        scale = 1.10 - snapT * 0.10;
      }

      // Then moves to join "Between Visits"
      const moveT = clamp((tLocal - 0.80) / 0.60, 0, 1);
      const moveEase = Easing.easeInOutCubic(moveT);

      const startX = CHANGING_START_X;
      const endX = 240 + bvWidth;
      const currentX = startX + (endX - startX) * moveEase;

      // Color transition: white → blue
      const blueT = clamp((tLocal - 1.20) / 0.40, 0, 1);
      const r = Math.round(255 - blueT * (255 - 74));
      const g = Math.round(255 - blueT * (255 - 158));
      const b = 255;

      let opacity = 1;
      if (lt > 11.0) {
        opacity = 1 - Easing.easeInOutCubic(clamp((lt - 11.0) / 1.2, 0, 1));
      }

      if (opacity > 0.001) {
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(currentX, Y_CENTER);
        ctx.scale(scale, scale);
        ctx.font = `900 ${FONT_SIZE}px ${FONT_SERIF}`;
        if ('letterSpacing' in ctx) ctx.letterSpacing = '-1.44px';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillText('.com', 0, 0);
        ctx.restore();
      }
    }
  }
}

Object.assign(window, { renderBlock7Canvas });
