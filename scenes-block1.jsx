// scenes-block1.jsx — Block 1, v3: editorial serif + mono labels.
// 0:00 → ~0:10. Two beats on pure black, type-driven, asymmetric composition.
//
// Type system:
//   FONT_SERIF (Playfair Display, 900) — hero numbers and display headlines
//   FONT_SERIF italic 500/600         — accent closers (BV_BLUE)
//   FONT_MONO  (JetBrains Mono, 500)  — clinical labels, units, captions
// The serif↔mono tension is the whole identity: editorial weight meets
// clinical instrument.

const BV_BLUE = '#4A9EFF';
const FONT_SERIF = '"Playfair Display", "Times New Roman", serif';
const FONT_MONO = '"JetBrains Mono", ui-monospace, monospace';
const WHITE = '#ffffff';
const MUTED = 'rgba(255,255,255,0.62)';
const DIM = 'rgba(255,255,255,0.36)';
const HAIR = 'rgba(255,255,255,0.16)';

// ── SlamIn ──────────────────────────────────────────────────────────────────
function SlamIn({
  inAt = 0, dur = 0.32,
  outAt = null, outDur = 0.22,
  offsetY = 22, fromScale = 0.96, blurPx = 3,
  origin = 'left center',
  children, style = {}
}) {
  const { localTime } = useSprite();
  if (localTime < inAt) return null;

  const tIn = clamp((localTime - inAt) / dur, 0, 1);
  const easedIn = Easing.easeOutBack(tIn);
  const fadeT = clamp((localTime - inAt) / (dur * 0.45), 0, 1);

  let opacity = fadeT;
  let translateY = (1 - easedIn) * offsetY;
  let scaleVal = fromScale + (1 - fromScale) * easedIn;
  let blurAmt = (1 - clamp(tIn * 1.8, 0, 1)) * blurPx;

  if (outAt != null && localTime > outAt) {
    const tOut = clamp((localTime - outAt) / outDur, 0, 1);
    opacity = Math.min(opacity, 1 - Easing.easeInQuad(tOut));
  }

  return (
    <div style={{
      opacity,
      transform: `translateY(${translateY}px) scale(${scaleVal})`,
      transformOrigin: origin,
      filter: blurAmt > 0.05 ? `blur(${blurAmt}px)` : 'none',
      willChange: 'opacity, transform, filter',
      display: 'inline-block',
      ...style
    }}>
      {children}
    </div>);

}

// ── CountUp ─────────────────────────────────────────────────────────────────
function CountUp({
  inAt = 0, dur = 0.45,
  from = 0, to = 100,
  decimals = 0,
  prefix = '', suffix = '',
  punchScale = 1.045, punchDur = 0.20,
  ease = Easing.easeOutExpo,
  style = {}
}) {
  const { localTime } = useSprite();
  if (localTime < inAt) return null;

  const tCount = clamp((localTime - inAt) / dur, 0, 1);
  const eased = ease(tCount);
  const value = from + (to - from) * eased;
  const display = value.toFixed(decimals);

  let scale = 1;
  if (tCount >= 1) {
    const tPunch = clamp((localTime - inAt - dur) / punchDur, 0, 1);
    scale = 1 + (punchScale - 1) * (1 - Easing.easeOutCubic(tPunch));
  }
  const fade = clamp((localTime - inAt) / 0.12, 0, 1);

  return (
    <span style={{
      display: 'inline-block',
      transform: `scale(${scale})`,
      transformOrigin: 'center',
      fontVariantNumeric: 'tabular-nums',
      opacity: fade,
      willChange: 'transform',
      ...style
    }}>
      {prefix}{display}{suffix}
    </span>);

}

// ── ScanFlash ───────────────────────────────────────────────────────────────
function ScanFlash({ at, scanDur = 0.10, flashDur = 0.08, flashIntensity = 0.92 }) {
  const { time } = useTimeline();
  const total = scanDur + flashDur;
  if (time < at - 0.01 || time > at + total + 0.05) return null;
  const local = time - at;

  let scanOp = 0,scanY = 0;
  if (local >= 0 && local < scanDur) {
    const t = local / scanDur;
    scanY = Easing.easeInQuad(t) * 100;
    scanOp = 1;
  }

  let flashOp = 0;
  if (local >= scanDur && local < scanDur + flashDur) {
    const t = (local - scanDur) / flashDur;
    flashOp = flashIntensity * (1 - Easing.easeOutCubic(t));
  }

  return (
    <React.Fragment>
      {scanOp > 0 &&
      <div style={{
        position: 'absolute', left: 0, right: 0,
        top: `${scanY}%`, height: 2,
        background: '#fff',
        opacity: scanOp,
        boxShadow: '0 0 28px rgba(255,255,255,0.45), 0 0 6px rgba(255,255,255,0.9)',
        pointerEvents: 'none',
        willChange: 'top, opacity',
        zIndex: 50
      }} />
      }
      {flashOp > 0 &&
      <div style={{
        position: 'absolute', inset: 0,
        background: '#fff',
        opacity: flashOp,
        pointerEvents: 'none',
        zIndex: 60
      }} />
      }
    </React.Fragment>);

}

// ── HairLine ────────────────────────────────────────────────────────────────
function HairLine({
  inAt = 0, dur = 0.30,
  outAt = null, outDur = 0.20,
  x = 0, y = 0, width = 800, height = 1,
  color = HAIR,
  origin = 'left'
}) {
  const { localTime } = useSprite();
  if (localTime < inAt) return null;
  const tIn = clamp((localTime - inAt) / dur, 0, 1);
  const easedIn = Easing.easeOutExpo(tIn);

  let scaleX = easedIn;
  let opacity = 1;
  if (outAt != null && localTime > outAt) {
    const tOut = clamp((localTime - outAt) / outDur, 0, 1);
    opacity = 1 - Easing.easeInQuad(tOut);
  }

  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      width, height,
      background: color,
      transform: `scaleX(${scaleX})`,
      transformOrigin: origin === 'right' ? 'right center' : 'left center',
      opacity,
      willChange: 'transform, opacity'
    }} />);

}

// ── SectionLabel ────────────────────────────────────────────────────────────
function SectionLabel({ text, inAt, outAt }) {
  const start = inAt;
  const end = outAt + 0.5;
  return (
    <Sprite start={start} end={end}>
      <div style={{ position: 'absolute', left: 96, top: 84 }}>
        <SlamIn inAt={0} dur={0.26} offsetY={6} outAt={outAt - start} outDur={0.24}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            fontFamily: FONT_MONO,
            fontSize: 16,
            fontWeight: 500,
            color: MUTED,
            letterSpacing: '0.20em',
            textTransform: 'uppercase'
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: 999,
              background: BV_BLUE,
              boxShadow: `0 0 14px ${BV_BLUE}`
            }} />
            {text}
          </div>
        </SlamIn>
      </div>
    </Sprite>);

}

// ── StatLine ────────────────────────────────────────────────────────────────
// "2 visits a week." — digit is large editorial serif with a brief landing
// punch; the rest of the line is set in serif at medium weight. The digit
// and the prose sit on a shared baseline.
function StatLine({ digit, rest, inAt, outAt }) {
  const { localTime } = useSprite();
  const tPunch = clamp((localTime - inAt - 0.18) / 0.22, 0, 1);
  const digitScale = 1 + 0.08 * (1 - Easing.easeOutCubic(tPunch)) * (tPunch > 0 ? 1 : 0);

  return (
    <SlamIn inAt={inAt} dur={0.32} offsetY={22} outAt={outAt} outDur={0.30}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
        <span style={{
          fontFamily: FONT_SERIF,
          fontSize: 148,
          fontWeight: 900,
          color: WHITE,
          lineHeight: 0.9,
          letterSpacing: '-0.02em',
          fontVariantNumeric: 'tabular-nums',
          display: 'inline-block',
          transform: `scale(${digitScale})`,
          transformOrigin: 'left baseline',
          willChange: 'transform'
        }}>
          {digit}
        </span>
        <span style={{
          fontFamily: FONT_SERIF,
          fontSize: 46,
          fontWeight: 500,
          color: WHITE,
          letterSpacing: '0',
          lineHeight: 1.0
        }}>
          {rest}
        </span>
      </div>
    </SlamIn>);

}

// ─────────────────────────────────────────────────────────────────────────────
// BLOCK 1
// ─────────────────────────────────────────────────────────────────────────────

function Beat1() {
  return (
    <Sprite start={0} end={3.62}>
      {/* "EVERY" — mono caps eyebrow */}
      <div style={{ position: 'absolute', left: 144, top: 296 }}>
        <SlamIn inAt={0.15} dur={0.28} offsetY={14}>
          <div style={{
            fontFamily: FONT_MONO,
            fontSize: 24,
            fontWeight: 500,
            color: MUTED,
            letterSpacing: '0.28em',
            textTransform: 'uppercase'
          }}>
            Every
          </div>
        </SlamIn>
      </div>

      {/* Hero row: 40 (serif) + SECONDS, (mono) */}
      <div style={{
        position: 'absolute', left: 144, top: 330,
        display: 'flex', alignItems: 'flex-end', gap: 28
      }}>
        <SlamIn inAt={0.22} dur={0.34} offsetY={28} fromScale={0.94} blurPx={4}>
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 320,
            fontWeight: 900,
            color: WHITE,
            lineHeight: 0.9,
            letterSpacing: '-0.025em',
            fontVariantNumeric: 'tabular-nums'
          }}>
            <CountUp inAt={0.25} dur={0.38} from={13} to={40} decimals={0} />
          </div>
        </SlamIn>
        <SlamIn inAt={0.66} dur={0.28} offsetY={18} fromScale={0.96}>
          <div style={{
            fontFamily: FONT_MONO,
            fontSize: 48,
            fontWeight: 500,
            color: WHITE,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            paddingBottom: 36
          }}>
            Seconds,
          </div>
        </SlamIn>
      </div>

      {/* Prose line — editorial serif, offset right & down */}
      <div style={{ position: 'absolute', left: 580, top: 700 }}>
        <SlamIn inAt={0.94} dur={0.34} offsetY={22}>
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 64,
            fontWeight: 700,
            color: WHITE,
            letterSpacing: '-0.005em',
            lineHeight: 1.0, width: "837.471px", height: "94.0039px"
          }}>
            someone has a stroke.
          </div>
        </SlamIn>
      </div>

      {/* Line 2 zone — anchored right. Hairline rule draws first. */}
      <HairLine
        inAt={1.50} dur={0.32}
        x={1180} y={846}
        width={600} height={1}
        color={HAIR}
        origin="right" />
      

      {/* 7.8M hero — serif, right-anchored */}
      <div style={{
        position: 'absolute', right: 140, top: 866,
        display: 'flex', alignItems: 'baseline', gap: 4
      }}>
        <SlamIn inAt={1.62} dur={0.32} offsetY={22} fromScale={0.94} origin="right center">
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 156,
            fontWeight: 900,
            color: WHITE,
            lineHeight: 0.9,
            letterSpacing: '-0.025em',
            fontVariantNumeric: 'tabular-nums'
          }}>
            <CountUp inAt={1.65} dur={0.38} from={3.2} to={7.8} decimals={1} />
          </div>
        </SlamIn>
        <SlamIn inAt={1.98} dur={0.26} offsetY={12}>
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 108,
            fontWeight: 900,
            color: WHITE,
            lineHeight: 0.9,
            letterSpacing: '-0.02em'
          }}>
            M
          </div>
        </SlamIn>
      </div>

      {/* "survivors in the US alone." — serif italic caption, right-aligned */}
      <div style={{
        position: 'absolute', right: 140, top: 1030,
        textAlign: 'right'
      }}>
        <SlamIn inAt={2.18} dur={0.30} offsetY={16} origin="right center">
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 30,
            fontWeight: 500,
            fontStyle: 'italic',
            color: MUTED,
            letterSpacing: '0.005em',
            lineHeight: 1.0
          }}>
            survivors in the US alone.
          </div>
        </SlamIn>
      </div>
    </Sprite>);

}

function Beat2() {
  return (
    <Sprite start={4.00} end={9.95}>
      {/* "673" — serif, left-anchored */}
      <div style={{ position: 'absolute', left: 144, top: 300 }}>
        <SlamIn inAt={0.02} dur={0.34} offsetY={28} fromScale={0.94} blurPx={4} outAt={5.30} outDur={0.55}>
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 320,
            fontWeight: 900,
            color: WHITE,
            lineHeight: 0.9,
            letterSpacing: '-0.025em',
            fontVariantNumeric: 'tabular-nums'
          }}>
            <CountUp inAt={0.05} dur={0.55} from={0} to={673} decimals={0} punchScale={1.05} />
          </div>
        </SlamIn>
      </div>

      {/* "patients per clinician." — serif prose, offset right & down */}
      <div style={{ position: 'absolute', left: 880, top: 540 }}>
        <SlamIn inAt={0.62} dur={0.34} offsetY={22} outAt={5.30} outDur={0.55}>
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 64,
            fontWeight: 700,
            color: WHITE,
            letterSpacing: '-0.005em',
            lineHeight: 1.0
          }}>patients per clinician.

          </div>
        </SlamIn>
      </div>

      {/* Hairline divider before stats row */}
      <HairLine
        inAt={1.38} dur={0.34}
        x={144} y={720}
        width={1632} height={1}
        color={HAIR}
        origin="left" />
      

      {/* Two stat lines */}
      <div style={{ position: 'absolute', left: 144, top: 752 }}>
        <StatLine digit="2" rest={<>visits a week.</>} inAt={1.52} outAt={3.10} />
      </div>
      <div style={{ position: 'absolute', left: 1020, top: 752 }}>
        <StatLine digit="5" rest={<>days blind.</>} inAt={1.72} outAt={3.10} />
      </div>

      {/* Accent: two-line closer in BV_BLUE, serif italic. */}
      <div style={{
        position: 'absolute', left: 144, right: 144,
        top: 880,
        textAlign: 'center'
      }}>
        <SlamIn inAt={3.28} dur={0.34} offsetY={20} outAt={5.30} outDur={0.55} origin="center">
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 60,
            fontWeight: 500,
            fontStyle: 'italic',
            color: BV_BLUE,
            letterSpacing: '-0.005em',
            lineHeight: 1.15
          }}>
            Recovery happens every day.
          </div>
        </SlamIn>
        <div style={{ height: 4 }} />
        <SlamIn inAt={3.62} dur={0.34} offsetY={20} outAt={5.30} outDur={0.55} origin="center">
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 60,
            fontWeight: 500,
            fontStyle: 'italic',
            color: BV_BLUE,
            letterSpacing: '-0.005em',
            lineHeight: 1.15
          }}>
            Clinical insight doesn't.
          </div>
        </SlamIn>
      </div>
    </Sprite>);

}

// ── Block 1 root ────────────────────────────────────────────────────────────
function Block1() {
  return (
    <React.Fragment>
      <SectionLabel text="§ 01 · Incidence" inAt={0.05} outAt={3.25} />
      <SectionLabel text="§ 02 · Access" inAt={4.05} outAt={9.30} />

      <Beat1 />
      <Beat2 />

      <ScanFlash at={3.42} scanDur={0.12} flashDur={0.08} flashIntensity={0.95} />
    </React.Fragment>);

}

Object.assign(window, {
  Block1, Beat1, Beat2,
  SlamIn, CountUp, ScanFlash, HairLine, SectionLabel, StatLine,
  BV_BLUE, FONT_SERIF, FONT_MONO
});