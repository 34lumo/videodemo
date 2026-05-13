// scenes-block7.jsx — Block 7: Between Visits (the closer). 0:53 → 1:05.5
// One Sprite. Slow, dignified, inevitable. No popups. The exhale.
//
// Note: this block runs slightly past the 60s mark — by design. The closer
// earns its space.

// ── LiftFromBelow ───────────────────────────────────────────────────────────
// Text rises from below a baseline. Clip-mask reveals the text upward; the
// baseline (the blue line) acts as a curtain. No overshoot — dignified.
function LiftFromBelow({
  inAt = 0, dur = 0.50,
  outAt = null, outDur = 0.50,
  baselineY,                // y-coord of the baseline (the line)
  x = 0,                    // text x position
  fontSize = 280,
  fontFamily = FONT_SERIF,
  fontWeight = 900,
  color = WHITE,
  letterSpacing = '-0.025em',
  lineHeight = 1.0,
  descenderRoom = 0.22,     // % of fontSize allowed for descenders below baseline
  children,
}) {
  const { localTime } = useSprite();
  if (localTime < inAt) return null;

  const t = clamp((localTime - inAt) / dur, 0, 1);
  const eased = Easing.easeOutCubic(t);
  const ty = (1 - eased) * (fontSize * 1.10);  // start fully below the clip

  let containerOp = 1;
  if (outAt != null && localTime > outAt) {
    const tOut = clamp((localTime - outAt) / outDur, 0, 1);
    containerOp = 1 - Easing.easeInOutCubic(tOut);
  }

  // Outer clip: from top:0 to top:baselineY + small descender room.
  // Anything below this clip line is hidden, so the text emerging from below
  // is revealed as it rises.
  const clipHeight = baselineY + fontSize * descenderRoom;

  return (
    <div style={{
      position: 'absolute',
      left: 0, right: 0, top: 0,
      height: clipHeight,
      overflow: 'hidden',
      pointerEvents: 'none',
      opacity: containerOp,
      willChange: 'opacity',
    }}>
      <div style={{
        position: 'absolute',
        left: x,
        bottom: 0,
        transform: `translateY(${ty}px)`,
        willChange: 'transform',
        fontFamily,
        fontSize,
        fontWeight,
        color,
        letterSpacing,
        lineHeight,
        whiteSpace: 'nowrap',
      }}>
        {children}
      </div>
    </div>
  );
}

// ── CyclingLine ─────────────────────────────────────────────────────────────
// One line that fades in, holds, fades out, in absolute sprite-local time.
function CyclingLine({
  text, inAt, perLine = 0.85, fadeIn = 0.20, fadeOut = 0.22,
  x, y, fontSize = 28, color = WHITE, letterSpacing = '0.12em',
  align = 'left',
}) {
  const { localTime } = useSprite();
  const dt = localTime - inAt;
  if (dt < 0 || dt > perLine) return null;

  let op = 1;
  if (dt < fadeIn) op = Easing.easeOutCubic(clamp(dt / fadeIn, 0, 1));
  const outDt = dt - (perLine - fadeOut);
  if (outDt > 0) op = Math.min(op, 1 - Easing.easeInOutCubic(clamp(outDt / fadeOut, 0, 1)));

  const translateX = align === 'right' ? '-100%' : (align === 'center' ? '-50%' : '0');

  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: `translateX(${translateX})`,
      opacity: op,
      fontFamily: FONT_MONO,
      fontSize,
      fontWeight: 500,
      color,
      letterSpacing,
      textTransform: 'uppercase',
      lineHeight: 1.0,
      whiteSpace: 'nowrap',
      willChange: 'opacity',
    }}>
      {text}
    </div>
  );
}

// ── SubtleNoise ─────────────────────────────────────────────────────────────
// 2% film grain — "the screen is still breathing". Reuse FilmGrain pattern.
function SubtleNoise({ inAt = 0, outAt = null, opacity = 0.02 }) {
  const { localTime } = useSprite();
  let op = clamp((localTime - inAt) / 0.40, 0, 1);
  if (outAt != null && localTime > outAt) {
    op = Math.min(op, 1 - clamp((localTime - outAt) / 0.40, 0, 1));
  }
  if (op <= 0.01) return null;
  const grainSvg =
    "<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'>" +
      "<filter id='n'>" +
        "<feTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2' stitchTiles='stitch'/>" +
        "<feColorMatrix type='saturate' values='0'/>" +
      "</filter>" +
      "<rect width='100%' height='100%' filter='url(%23n)'/>" +
    "</svg>";
  const dataUrl = `url("data:image/svg+xml;utf8,${encodeURIComponent(grainSvg)}")`;
  return (
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: dataUrl,
      backgroundRepeat: 'repeat',
      opacity: opacity * op,
      pointerEvents: 'none',
      mixBlendMode: 'screen',
      zIndex: 0,
    }} />
  );
}

// ── BlueLineWithPulse ───────────────────────────────────────────────────────
// Horizontal line at center: slow L→R draw, single-frame white pulse on
// completion, then stays. Color animates to BV_BLUE post-pulse.
function BlueLineWithPulse({
  inAt = 0, drawDur = 1.5,
  pulseAt, pulseDur = 0.06,
  fadeOutAt = null, fadeOutDur = 0.5,
  x = 120, y = 540, width = 1680, height = 2,
}) {
  const { localTime } = useSprite();
  if (localTime < inAt) return null;

  const tDraw = clamp((localTime - inAt) / drawDur, 0, 1);
  const drawAmount = Easing.easeOutCubic(tDraw);

  // Single-frame brightness pulse
  let pulsing = false;
  let pulseT = 0;
  if (pulseAt != null && localTime >= pulseAt && localTime < pulseAt + pulseDur + 0.16) {
    pulseT = clamp((localTime - pulseAt) / pulseDur, 0, 1);
    pulsing = pulseT < 1;
  }
  // Color: white during pulse, BV_BLUE otherwise
  const color = pulsing ? '#ffffff' : BV_BLUE;
  const glow = pulsing ? 30 : 14;

  let opacity = 1;
  if (fadeOutAt != null && localTime > fadeOutAt) {
    const tOut = clamp((localTime - fadeOutAt) / fadeOutDur, 0, 1);
    opacity = 1 - Easing.easeInOutCubic(tOut);
  }

  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      width, height,
      background: color,
      transform: `scaleX(${drawAmount})`,
      transformOrigin: 'left center',
      boxShadow: `0 0 ${glow}px ${color}, 0 0 ${glow * 1.8}px rgba(74,158,255,0.45)`,
      opacity,
      willChange: 'transform, opacity, background, box-shadow',
      zIndex: 4,
    }} />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOCK 7 — The closer.
// ─────────────────────────────────────────────────────────────────────────────
// Sprite local times (Stage start = 53.0):
//   0.00 – 1.50  blue line draws across vertical center
//   1.50 – 1.66  line pulses (white → BV_BLUE)
//   1.66 – 1.95  hold (line alone)
//   1.95 – 2.45  "Between Visits" rises from below the line
//   2.45 – 2.95  hold (name + line)
//   2.95 – 6.95  5 cycling mono lines, 0.80s each
//   6.95 – 7.70  silence (just name + line)  — 0.75s
//   7.70 – 8.55  URL "betweenvisits.com" types char-by-char slowly
//   8.55 – 9.85  hold URL (1.30s)
//   9.85 – 10.40 fade line  (0.55s)
//  10.40 – 10.95 fade URL   (0.55s)
//  10.95 – 11.95 fade name  (1.00s)  — name fades LAST except for URL — wait
//
// Spec says URL is the LAST to fade, name fades second-to-last. Adjusting:
//   9.85 – 10.40 fade line
//  10.40 – 11.40 fade name (1.00s, slow & dignified)
//  11.40 – 11.95 fade URL  (0.55s)
//  11.95 – 12.45 pure black (0.5s)

const BV_NAME_BASELINE_Y = 740;
const BV_NAME_X = 140;

function Block7() {
  return (
    <Sprite start={53.0} end={65.5}>
      {/* Very faint film grain — the screen still breathing */}
      <SubtleNoise inAt={0.10} outAt={12.30} opacity={0.025} />

      {/* The blue line — baseline for the name */}
      <BlueLineWithPulse
        inAt={0.05} drawDur={1.50}
        pulseAt={1.52} pulseDur={0.06}
        fadeOutAt={9.85} fadeOutDur={0.55}
        x={140} y={BV_NAME_BASELINE_Y} width={1640} height={2}
      />

      {/* "Between Visits" — rises from below the line */}
      <LiftFromBelow
        inAt={1.95} dur={0.50}
        outAt={10.40} outDur={1.00}
        baselineY={BV_NAME_BASELINE_Y}
        x={BV_NAME_X}
        fontSize={260}
        fontWeight={900}
        color={WHITE}
        letterSpacing="-0.028em"
      >
        Between Visits
      </LiftFromBelow>

      {/* Five cycling lines — right side, near the baseline */}
      {/* Stacked at a constant y so each line replaces the previous */}
      {[
        'Patients stay monitored.',
        'Clinicians stay informed.',
        "Recovery doesn't pause.",
        'No gap. No blind spot.',
        'Daily data. From home.',
      ].map((text, i) => (
        <CyclingLine
          key={i}
          text={text}
          inAt={2.95 + i * 0.80}
          perLine={0.85}
          fadeIn={0.18}
          fadeOut={0.20}
          x={1780} y={BV_NAME_BASELINE_Y - 50}
          align="right"
          fontSize={26}
          color="rgba(255,255,255,0.92)"
          letterSpacing="0.18em"
        />
      ))}

      {/* URL — types out slowly below the line, mono BV_BLUE */}
      <MonoTypewriter
        inAt={7.70}
        text="betweenvisits.com"
        charDur={0.050}
        fontSize={22}
        color={BV_BLUE}
        letterSpacing="0.30em"
        x={BV_NAME_X}
        y={BV_NAME_BASELINE_Y + 56}
        align="left"
        fadeOutAt={11.40} fadeOutDur={0.55}
      />
    </Sprite>
  );
}

Object.assign(window, {
  Block7,
  LiftFromBelow, CyclingLine, SubtleNoise, BlueLineWithPulse,
  BV_NAME_BASELINE_Y, BV_NAME_X,
});
