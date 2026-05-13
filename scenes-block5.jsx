// scenes-block5.jsx — Block 5: Before / After. 0:39 → 0:46
// Two beats. Pure typography. Color carries the emotional cut.
//   Beat 1: dark blue-grey "before" world, red #FF6B6B (one-time use only)
//   Beat 2: hard-cut pure black "after" world, BV_BLUE alive

const BV_RED = '#FF6B6B';   // ⚠ used ONCE in the whole video — Beat 1 only.
const BEFORE_BG = '#11141A'; // very dark blue-grey, hospital corridor at 3am

// ── FilmGrain ───────────────────────────────────────────────────────────────
// Subtle, tile-able fractal-noise overlay. Used only in Block 5 Beat 1.
function FilmGrain({ opacity = 0.04 }) {
  const grainSvg =
    "<svg xmlns='http://www.w3.org/2000/svg' width='280' height='280'>" +
      "<filter id='n'>" +
        "<feTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='2' stitchTiles='stitch'/>" +
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
      opacity,
      pointerEvents: 'none',
      mixBlendMode: 'overlay',
      zIndex: 2,
    }} />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOCK 5
// ─────────────────────────────────────────────────────────────────────────────

// ── Beat 1 — THE BEFORE (Stage 39.0 → 42.0) ─────────────────────────────────
// Dark warm-grey full canvas, film grain, text anchored to the LEFT.
// "Last data point:" → 0.8s pause → "6 weeks ago." (red) → mono caption.
function Block5Beat1() {
  // Local timing:
  //   0.05  BG fade-up (very fast, ~120ms)
  //   0.25  "Last data point:" slam in (slow)
  //   0.55  lands
  //   1.35  "6 weeks ago." slam in — RED, heavy
  //   1.75  lands
  //   2.05  mono caption slam in (dim)
  //   2.95  hard cut
  return (
    <Sprite start={39.0} end={42.0}>
      {/* Dark warm-grey background */}
      <BeforeBackground />

      {/* Film grain — 4% opacity, overlay blend */}
      <FilmGrain opacity={0.04} />

      {/* "Last data point:" — eyebrow */}
      <div style={{ position: 'absolute', left: 140, top: 380 }}>
        <SlamIn inAt={0.25} dur={0.42} offsetY={16} fromScale={0.98} blurPx={2}>
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 50,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.85)',
            letterSpacing: '-0.005em',
            lineHeight: 1.0,
          }}>
            Last data point:
          </div>
        </SlamIn>
      </div>

      {/* "6 weeks ago." — RED hero, heavy */}
      <div style={{ position: 'absolute', left: 140, top: 470 }}>
        <SlamIn inAt={1.35} dur={0.36} offsetY={32} fromScale={0.94} blurPx={4}>
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 184,
            fontWeight: 900,
            color: BV_RED,
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
            fontVariantNumeric: 'tabular-nums',
          }}>
            6 weeks ago.
          </div>
        </SlamIn>
      </div>

      {/* Mono caption — dim */}
      <div style={{ position: 'absolute', left: 144, top: 720 }}>
        <SlamIn inAt={2.05} dur={0.30} offsetY={12}>
          <div style={{
            fontFamily: FONT_MONO,
            fontSize: 18,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.42)',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
          }}>
            Subjective recall · No objective data
          </div>
        </SlamIn>
      </div>
    </Sprite>
  );
}

// Background with a soft right-side gradient bleed to black (the divide
// between "before" and "after" is light and darkness, not a line).
function BeforeBackground() {
  const { localTime } = useSprite();
  const op = clamp(localTime / 0.12, 0, 1);
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `linear-gradient(90deg, ${BEFORE_BG} 0%, ${BEFORE_BG} 45%, #060709 78%, #000 100%)`,
      opacity: op,
      zIndex: 1,
    }} />
  );
}

// ── Beat 2 — THE AFTER (Stage 42.0 → 46.0) ──────────────────────────────────
// Hard cut to pure black. Same structure, text on the RIGHT, BV_BLUE alive.
// Closes with a center typewriter and a fade to black.
function Block5Beat2() {
  // Local timing:
  //   0.00  hard cut (Stage default black; no BG element rendered)
  //   0.10  "Last data point:" slam in (faster than Beat 1)
  //   0.40  lands
  //   0.80  "This morning." slam in — BV_BLUE, harder
  //         (bigger offsetY, faster reveal, more overshoot)
  //   1.10  lands
  //   1.45  mono caption "OBJECTIVE · CONTINUOUS · AUTOMATIC" slam
  //   1.75  lands
  //   2.85  typewriter "BETWEEN VISITS · CLOSES THIS GAP" begins
  //   3.95  typewriter completes (~33 chars × 33ms)
  //   3.95  fade-out begins (handled by SlamIn outAt on each element)
  //   4.00  sprite ends → pure black
  return (
    <Sprite start={42.0} end={46.0}>
      {/* Right-side "Last data point:" */}
      <div style={{
        position: 'absolute', right: 140, top: 380,
        textAlign: 'right',
      }}>
        <SlamIn inAt={0.10} dur={0.30} offsetY={16} fromScale={0.98} blurPx={2}
                origin="right center" outAt={3.95} outDur={0.35}>
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 50,
            fontWeight: 600,
            color: WHITE,
            letterSpacing: '-0.005em',
            lineHeight: 1.0,
          }}>
            Last data point:
          </div>
        </SlamIn>
      </div>

      {/* "This morning." — BV_BLUE, slams harder */}
      <div style={{
        position: 'absolute', right: 140, top: 470,
        textAlign: 'right',
      }}>
        <SlamIn inAt={0.80} dur={0.28} offsetY={44} fromScale={0.92} blurPx={5}
                origin="right center" outAt={3.95} outDur={0.35}>
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 184,
            fontWeight: 900,
            color: BV_BLUE,
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
          }}>
            This morning.
          </div>
        </SlamIn>
      </div>

      {/* Mono caption — full brightness BV_BLUE */}
      <div style={{
        position: 'absolute', right: 144, top: 720,
        textAlign: 'right',
      }}>
        <SlamIn inAt={1.45} dur={0.30} offsetY={12} origin="right center"
                outAt={3.95} outDur={0.35}>
          <div style={{
            fontFamily: FONT_MONO,
            fontSize: 18,
            fontWeight: 500,
            color: BV_BLUE,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
          }}>
            Objective · Continuous · Automatic
          </div>
        </SlamIn>
      </div>

      {/* Center typewriter — "BETWEEN VISITS · CLOSES THIS GAP" */}
      <MonoTypewriter
        inAt={2.85}
        text="Between Visits · Closes this gap"
        charDur={0.033}
        fontSize={20}
        color={WHITE}
        letterSpacing="0.30em"
        y={920}
        align="center"
        fadeOutAt={3.95} fadeOutDur={0.35}
      />
    </Sprite>
  );
}

// ── Block 5 root ────────────────────────────────────────────────────────────
function Block5() {
  return (
    <React.Fragment>
      <Block5Beat1 />
      <Block5Beat2 />
    </React.Fragment>
  );
}

Object.assign(window, {
  Block5, Block5Beat1, Block5Beat2,
  FilmGrain, BeforeBackground,
  BV_RED, BEFORE_BG,
});
