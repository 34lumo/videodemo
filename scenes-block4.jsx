// scenes-block4.jsx — Block 4: The Clinical Report. 0:27 → 0:39
// Five beats: opening, dashboard slide-in, CRI zoom, four metric cards,
// detail screenshot + closer. The most layered block of the video.

const SRC_REPORT = { w: 963, h: 1001 };
const SRC_DETAIL = { w: 970, h: 1016 };

// CRI ring center (approx) in report-full.png source pixels
const CRI_CENTER = [165, 295];
const CRI_RADIUS = 115;

// ── GridBackground ──────────────────────────────────────────────────────────
// Subtle 80×80 graph-paper grid. Only used within Block 4.
function GridBackground({ inAt = 0, outAt = null, opacity = 0.045 }) {
  const { localTime } = useSprite();
  let op = clamp((localTime - inAt) / 0.6, 0, 1);
  if (outAt != null && localTime > outAt) {
    op = Math.min(op, 1 - clamp((localTime - outAt) / 0.6, 0, 1));
  }
  if (op <= 0.01) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage:
        `linear-gradient(to right, rgba(255,255,255,${opacity}) 1px, transparent 1px),` +
        `linear-gradient(to bottom, rgba(255,255,255,${opacity}) 1px, transparent 1px)`,
      backgroundSize: '80px 80px',
      opacity: op,
      pointerEvents: 'none',
      zIndex: 0,
    }} />
  );
}

// ── LineDraw ────────────────────────────────────────────────────────────────
// Horizontal hairline that draws left-to-right with optional brightness pulse.
function LineDraw({
  inAt = 0, dur = 0.45,
  x, y, width, height = 2,
  color = BV_BLUE,
  pulseAt = null, pulseDur = 0.35,
  fadeOutAt = null, fadeOutDur = 0.30,
}) {
  const { localTime } = useSprite();
  if (localTime < inAt) return null;

  const tDraw = clamp((localTime - inAt) / dur, 0, 1);
  const drawAmount = Easing.easeOutExpo(tDraw);

  // Brightness pulse (single 0→1→0 cycle)
  let intensity = 1;
  if (pulseAt != null && localTime >= pulseAt) {
    const tPulse = clamp((localTime - pulseAt) / pulseDur, 0, 1);
    const bell = Math.sin(tPulse * Math.PI);
    intensity = 1 + 1.6 * bell;
  }

  let opacity = 1;
  if (fadeOutAt != null && localTime > fadeOutAt) {
    const tOut = clamp((localTime - fadeOutAt) / fadeOutDur, 0, 1);
    opacity = 1 - Easing.easeInQuad(tOut);
  }

  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      width, height,
      background: color,
      transform: `scaleX(${drawAmount})`,
      transformOrigin: 'left center',
      boxShadow: `0 0 ${10 * intensity}px ${color}, 0 0 ${22 * intensity}px rgba(74,158,255,0.42)`,
      opacity,
      filter: `brightness(${intensity})`,
      willChange: 'transform, filter, box-shadow, opacity',
      zIndex: 2,
    }} />
  );
}

// ── MonoTypewriter ──────────────────────────────────────────────────────────
// Reveals a monospace string character-by-character. All chars take layout
// space from the start so the centered text doesn't shift while typing.
function MonoTypewriter({
  inAt = 0, text = '',
  charDur = 0.022,
  fontSize = 15, color = BV_BLUE,
  letterSpacing = '0.22em',
  y, x = null, width = null, align = 'center',
  fadeOutAt = null, fadeOutDur = 0.30,
}) {
  const { localTime } = useSprite();
  const chars = React.useMemo(() => Array.from(text), [text]);
  const shown = Math.floor((localTime - inAt) / charDur);

  let containerOp = 1;
  if (fadeOutAt != null && localTime > fadeOutAt) {
    const tOut = clamp((localTime - fadeOutAt) / fadeOutDur, 0, 1);
    containerOp = 1 - Easing.easeInQuad(tOut);
  }
  if (localTime < inAt && shown < 0) {
    // Hide if not yet started — but render container for layout
    containerOp = 0;
  }

  const positioning = x != null
    ? { position: 'absolute', left: x, top: y, ...(width != null ? { width } : {}) }
    : { position: 'absolute', left: 0, right: 0, top: y, textAlign: align };

  return (
    <div style={{
      ...positioning,
      fontFamily: FONT_MONO,
      fontSize,
      fontWeight: 500,
      color,
      letterSpacing,
      textTransform: 'uppercase',
      lineHeight: 1.0,
      opacity: containerOp,
      whiteSpace: 'nowrap',
      zIndex: 3,
    }}>
      {chars.map((ch, i) => (
        <span key={i} style={{
          opacity: i < shown ? 1 : 0,
        }}>
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </div>
  );
}

// ── SlideInRight ────────────────────────────────────────────────────────────
// Wraps content; slides it in from the right with overshoot.
function SlideInRight({ inAt = 0, dur = 0.55, fromX = 220, children, style = {} }) {
  const { localTime } = useSprite();
  if (localTime < inAt) return null;
  const t = clamp((localTime - inAt) / dur, 0, 1);
  const eased = Easing.easeOutBack(t);
  const tx = (1 - eased) * fromX;
  const opacity = clamp((localTime - inAt) / (dur * 0.35), 0, 1);
  return (
    <div style={{
      transform: `translateX(${tx}px)`,
      opacity,
      willChange: 'transform, opacity',
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── DashboardImage ──────────────────────────────────────────────────────────
// Renders report-full.png with a state-based transform (scale, pan, blur).
// When sharpRing=true, a second copy of the image is drawn on top, clipped to
// the CRI ring area, leaving the rest blurred.
function DashboardImage({ vpW, vpH, scale, panX, panY, blur, sharpRing }) {
  const dispW = SRC_REPORT.w * scale;
  const dispH = SRC_REPORT.h * scale;
  const offsetX = vpW / 2 - panX * scale;
  const offsetY = vpH / 2 - panY * scale;

  const ringCx = CRI_CENTER[0] * scale;
  const ringCy = CRI_CENTER[1] * scale;
  const ringR = CRI_RADIUS * scale;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      overflow: 'hidden',
      background: '#0a0a0a',
    }}>
      <img
        src="assets/report-full.png"
        alt=""
        style={{
          position: 'absolute',
          left: offsetX, top: offsetY,
          width: dispW, height: dispH,
          filter: blur > 0.1 ? `blur(${blur}px)` : 'none',
          willChange: 'transform, filter, left, top, width, height',
        }}
      />
      {sharpRing && (
        <img
          src="assets/report-full.png"
          alt=""
          style={{
            position: 'absolute',
            left: offsetX, top: offsetY,
            width: dispW, height: dispH,
            clipPath: `circle(${ringR}px at ${ringCx}px ${ringCy}px)`,
            WebkitClipPath: `circle(${ringR}px at ${ringCx}px ${ringCy}px)`,
            willChange: 'transform, clip-path, left, top, width, height',
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOCK 4
// ─────────────────────────────────────────────────────────────────────────────

// ── Opening (Stage 27.0 → 30.0) ─────────────────────────────────────────────
function Block4Opening() {
  // 0.00 – 0.45  blue line draws across the canvas
  // 0.55 – ~2.10 typewriter reveals mono string under the line
  // 2.45 – 2.80  line pulses (single bell)
  // 2.85 – 3.00  fade-out → cut
  return (
    <Sprite start={27.0} end={30.0}>
      <GridBackground inAt={0.10} outAt={2.85} opacity={0.045} />

      <LineDraw
        inAt={0.05} dur={0.48}
        x={140} y={488} width={1640} height={2}
        color={BV_BLUE}
        pulseAt={2.42} pulseDur={0.36}
        fadeOutAt={2.85} fadeOutDur={0.20}
      />

      <MonoTypewriter
        inAt={0.55}
        text="Generating clinical report · Session complete · 14 biomarkers captured"
        charDur={0.022}
        fontSize={17}
        color={BV_BLUE}
        letterSpacing="0.24em"
        y={528}
        align="center"
        fadeOutAt={2.85} fadeOutDur={0.20}
      />
    </Sprite>
  );
}

// ── Dashboard sequence (Stage 30.0 → 35.0) ──────────────────────────────────
// One continuous viewport that holds the dashboard image across Beat 1 and
// Beat 2. The image state (scale/pan/blur/sharpRing) interpolates between
// Beat 1 (full dashboard, sharp) and Beat 2 (zoomed on CRI, blurred body).
function Block4Dashboard() {
  // Viewport size & position (right-anchored, leaves space on left for text)
  const VP = { x: 1000, y: 70, w: 880, h: 940 };

  // Image keyframes (local time)
  //   0.00 – 0.55  viewport slides in from right (handled by SlideInRight)
  //   0.50 – 0.65  hairline frame snaps in
  //   3.00 – 3.70  zoom: scale 0.94 → 2.5, pan (image center) → CRI center,
  //                blur 0 → 4
  //   3.70 – 5.00  hold zoomed
  const kfs = [
    { t: 0.00, scale: 0.94, panX: 481, panY: 500, blur: 0,   sharpRing: false },
    { t: 3.00, scale: 0.94, panX: 481, panY: 500, blur: 0,   sharpRing: false },
    { t: 3.70, scale: 2.50, panX: 165, panY: 295, blur: 4.5, sharpRing: true,
      ease: Easing.easeInOutCubic },
    { t: 5.00, scale: 2.50, panX: 165, panY: 295, blur: 4.5, sharpRing: true },
  ];

  return (
    <Sprite start={30.0} end={35.0}>
      <GridBackground inAt={0.00} outAt={4.85} opacity={0.045} />

      {/* Viewport: slides in from right at start */}
      <SlideInRight inAt={0.05} dur={0.55} fromX={260}>
        <div style={{
          position: 'absolute', left: VP.x, top: VP.y,
          width: VP.w, height: VP.h, zIndex: 5,
        }}>
          <DashboardKeyframed kfs={kfs} vpW={VP.w} vpH={VP.h} />

          {/* Hairline frame around dashboard */}
          <ClinicalFrame inAt={0.50} inset={0} trace={false} totalDur={0.04} />
          <CornerBrackets color={BV_BLUE} size={11} inAt={0.55} dur={0.30} />
        </div>
      </SlideInRight>

      {/* ── Beat 1 text panel (visible 0.0 – 3.0) ─────────────────── */}
      <div style={{ position: 'absolute', left: 120, top: 320 }}>
        <SlamIn inAt={0.40} dur={0.34} offsetY={28} fromScale={0.95}
                outAt={2.80} outDur={0.30}>
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 108,
            fontWeight: 900,
            color: WHITE,
            lineHeight: 1.0,
            letterSpacing: '-0.025em',
          }}>
            Session ends.
          </div>
        </SlamIn>
      </div>

      <div style={{ position: 'absolute', left: 120, top: 460 }}>
        <SlamIn inAt={0.80} dur={0.34} offsetY={22} outAt={2.80} outDur={0.30}>
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 68,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.88)',
            lineHeight: 1.0,
            letterSpacing: '-0.015em',
          }}>
            Clinician receives this.
          </div>
        </SlamIn>
      </div>

      <HairLine
        inAt={1.20} dur={0.32}
        x={124} y={580}
        width={520} height={1}
        color="rgba(74,158,255,0.45)"
        origin="left"
        outAt={2.80} outDur={0.30}
      />

      <div style={{ position: 'absolute', left: 120, top: 608 }}>
        <SlamIn inAt={1.32} dur={0.30} offsetY={12}
                outAt={2.80} outDur={0.30}>
          <div style={{
            fontFamily: FONT_MONO,
            fontSize: 22,
            fontWeight: 500,
            color: BV_BLUE,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
          }}>
            Automatically · Every session
          </div>
        </SlamIn>
      </div>

      {/* ── Beat 2 text panel (visible 3.0 – 5.0) ─────────────────── */}
      {/* "86." big serif, with brief 1-frame flicker on landing */}
      <Beat2HeroNumber inAt={3.20} flickerAt={3.62} />

      <div style={{ position: 'absolute', left: 120, top: 530 }}>
        <SlamIn inAt={3.55} dur={0.34} offsetY={20}
                outAt={4.85} outDur={0.20}>
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 56,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.92)',
            lineHeight: 1.0,
            letterSpacing: '-0.015em',
          }}>
            Clinical Recovery Index.
          </div>
        </SlamIn>
      </div>

      <HairLine
        inAt={3.85} dur={0.32}
        x={124} y={620}
        width={460} height={1}
        color="rgba(74,158,255,0.45)"
        origin="left"
        outAt={4.85} outDur={0.20}
      />

      <div style={{ position: 'absolute', left: 120, top: 648 }}>
        <SlamIn inAt={3.95} dur={0.30} offsetY={12}
                outAt={4.85} outDur={0.20}>
          <div style={{
            fontFamily: FONT_MONO,
            fontSize: 20,
            fontWeight: 500,
            color: BV_BLUE,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
          }}>
            Composite · Motor + Facial + Voice
          </div>
        </SlamIn>
      </div>
    </Sprite>
  );
}

// "86." with brief 1-frame flicker on landing
function Beat2HeroNumber({ inAt, flickerAt }) {
  const { localTime } = useSprite();
  // 1-frame flicker: ~16ms at flickerAt → opacity dips
  const dt = localTime - flickerAt;
  const inFlicker = dt > 0 && dt < 0.04;
  return (
    <div style={{ position: 'absolute', left: 120, top: 270 }}>
      <SlamIn inAt={inAt} dur={0.36} offsetY={32} fromScale={0.94} blurPx={3}
              outAt={4.85} outDur={0.20}>
        <div style={{
          fontFamily: FONT_SERIF,
          fontSize: 240,
          fontWeight: 900,
          color: WHITE,
          lineHeight: 0.85,
          letterSpacing: '-0.035em',
          opacity: inFlicker ? 0.55 : 1,
          filter: inFlicker ? 'brightness(1.3)' : 'none',
          fontVariantNumeric: 'tabular-nums',
        }}>
          86.
        </div>
      </SlamIn>
    </div>
  );
}

// Helper: wraps DashboardImage and interpolates kfs based on local sprite time.
function DashboardKeyframed({ kfs, vpW, vpH }) {
  const { localTime } = useSprite();
  const state = (() => {
    if (localTime <= kfs[0].t) return kfs[0];
    if (localTime >= kfs[kfs.length - 1].t) return kfs[kfs.length - 1];
    for (let i = 0; i < kfs.length - 1; i++) {
      const a = kfs[i], b = kfs[i + 1];
      if (localTime >= a.t && localTime <= b.t) {
        const span = b.t - a.t;
        const local = span > 0 ? (localTime - a.t) / span : 0;
        const ease = b.ease || Easing.easeInOutCubic;
        const e = ease(local);
        const lerp = (x, y) => x + (y - x) * e;
        return {
          scale: lerp(a.scale, b.scale),
          panX:  lerp(a.panX, b.panX),
          panY:  lerp(a.panY, b.panY),
          blur:  lerp(a.blur, b.blur),
          sharpRing: e > 0.2 ? (b.sharpRing || a.sharpRing) : a.sharpRing,
        };
      }
    }
    return kfs[kfs.length - 1];
  })();
  return (
    <DashboardImage
      vpW={vpW} vpH={vpH}
      scale={state.scale}
      panX={state.panX} panY={state.panY}
      blur={state.blur}
      sharpRing={state.sharpRing}
    />
  );
}

// ── Beat 3 — Four metric cards (Stage 35.0 → 37.0) ──────────────────────────
function Block4Beat3() {
  // Cards print in with snap, one by one. Below: italic closer.
  // Local timeline:
  //   0.10 Card 1 (PINCH · 88)
  //   0.25 Card 2 (HAND OPENING · 84)
  //   0.40 Card 3 (SMILE · 82)
  //   0.55 Card 4 (VOICE · 90)
  //   1.05 Italic closer slams in
  //   1.95 (hold to end)
  const cards = [
    { label: 'Pinch',        value: 88, unit: '/100', desc: 'Thumb-index opposition' },
    { label: 'Hand Opening', value: 84, unit: '/100', desc: 'Finger extension hold' },
    { label: 'Smile',        value: 82, unit: '/100', desc: 'Symmetry & amplitude' },
    { label: 'Voice',        value: 90, unit: '/100', desc: 'Phonation quality' },
  ];

  // Grid layout: 4 cards across, 1920 wide canvas, 120px gutters, 32px gap.
  const gutter = 140;
  const gap = 28;
  const cardW = (1920 - gutter * 2 - gap * 3) / 4;  // ~387
  const cardH = 330;
  const cardY = 300;

  return (
    <Sprite start={35.0} end={37.0}>
      <GridBackground inAt={0.00} outAt={1.85} opacity={0.045} />

      {/* Section eyebrow */}
      <div style={{ position: 'absolute', left: 140, top: 200 }}>
        <SlamIn inAt={0.02} dur={0.28} offsetY={10}>
          <div style={{
            fontFamily: FONT_MONO,
            fontSize: 15,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
          }}>
            §6 · Domain Breakdown · Per-Domain Performance · 0–100
          </div>
        </SlamIn>
      </div>

      {cards.map((c, i) => (
        <MetricCard
          key={c.label}
          label={c.label}
          value={c.value}
          unit={c.unit}
          desc={c.desc}
          x={gutter + i * (cardW + gap)}
          y={cardY}
          w={cardW}
          h={cardH}
          inAt={0.10 + i * 0.15}
        />
      ))}

      {/* Italic closer */}
      <div style={{
        position: 'absolute', left: 140, right: 140,
        top: 720, textAlign: 'left',
      }}>
        <SlamIn inAt={1.05} dur={0.36} offsetY={20}>
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 56,
            fontWeight: 500,
            fontStyle: 'italic',
            color: WHITE,
            letterSpacing: '-0.005em',
            lineHeight: 1.1,
          }}>
            Objective data. Not “how are you feeling?”
          </div>
        </SlamIn>
      </div>
    </Sprite>
  );
}

// MetricCard — single terminal-print card with mono label + serif number.
function MetricCard({ label, value, unit, desc, x, y, w, h, inAt }) {
  const { localTime } = useSprite();
  // Card snap-in:
  //   border-bar (top) draws first  (0.00 – 0.18)
  //   label appears                 (0.10 – 0.30)
  //   number snaps with count-up    (0.20 – 0.55)
  //   desc fades in                 (0.45 – 0.70)
  const t = localTime - inAt;
  if (t < -0.05) return null;
  const op = clamp(t / 0.08, 0, 1);

  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: w, height: h,
      opacity: op,
      willChange: 'opacity',
    }}>
      {/* Top bar (drawn line) */}
      <div style={{
        position: 'absolute', left: 0, top: 0,
        width: '100%', height: 2,
        background: BV_BLUE,
        boxShadow: `0 0 12px ${BV_BLUE}`,
        transform: `scaleX(${clamp(t / 0.20, 0, 1)})`,
        transformOrigin: 'left center',
        willChange: 'transform',
      }} />

      {/* Mono label */}
      <div style={{
        position: 'absolute', left: 0, top: 24,
        fontFamily: FONT_MONO,
        fontSize: 17,
        fontWeight: 500,
        color: BV_BLUE,
        letterSpacing: '0.26em',
        textTransform: 'uppercase',
        opacity: clamp((t - 0.08) / 0.18, 0, 1),
      }}>
        {label}
      </div>

      {/* Serif value + unit */}
      <div style={{
        position: 'absolute', left: 0, top: 76,
        display: 'flex', alignItems: 'baseline', gap: 10,
        opacity: clamp((t - 0.16) / 0.18, 0, 1),
        transform: `translateY(${(1 - clamp((t - 0.16) / 0.24, 0, 1)) * 14}px)`,
        willChange: 'transform, opacity',
      }}>
        <span style={{
          fontFamily: FONT_SERIF,
          fontSize: 168,
          fontWeight: 900,
          color: WHITE,
          lineHeight: 0.9,
          letterSpacing: '-0.035em',
          fontVariantNumeric: 'tabular-nums',
        }}>
          <CountUp inAt={0} dur={0.40} from={0} to={value} decimals={0} punchScale={1.04} />
        </span>
        <span style={{
          fontFamily: FONT_MONO,
          fontSize: 28,
          fontWeight: 500,
          color: 'rgba(255,255,255,0.55)',
          letterSpacing: '0.06em',
        }}>
          {unit}
        </span>
      </div>

      {/* Inline progress bar tied to value */}
      <div style={{
        position: 'absolute', left: 0, top: 260,
        width: '100%', height: 2,
        background: 'rgba(255,255,255,0.10)',
      }}>
        <div style={{
          position: 'absolute', left: 0, top: 0,
          width: `${value}%`, height: '100%',
          background: BV_BLUE,
          transform: `scaleX(${clamp((t - 0.30) / 0.50, 0, 1)})`,
          transformOrigin: 'left center',
          willChange: 'transform',
          boxShadow: `0 0 8px ${BV_BLUE}`,
        }} />
      </div>

      {/* Mono description below */}
      <div style={{
        position: 'absolute', left: 0, top: 280,
        fontFamily: FONT_MONO,
        fontSize: 13,
        fontWeight: 500,
        color: 'rgba(255,255,255,0.55)',
        letterSpacing: '0.20em',
        textTransform: 'uppercase',
        opacity: clamp((t - 0.40) / 0.30, 0, 1),
      }}>
        {desc}
      </div>
    </div>
  );
}

// ── Beat 4 — Detail screenshot + closer (Stage 37.0 → 39.0) ─────────────────
function Block4Beat4() {
  // Crop report-detail to skip the YouTube ESC overlay and show motor + face panels
  // Source 970×1016. Useful range y=300 → y=1016 (716 tall). Width 970.
  // Viewport: 940×720 on the right.
  return (
    <Sprite start={37.0} end={39.0}>
      <GridBackground inAt={0.00} outAt={1.75} opacity={0.045} />

      {/* Right-anchored detail screenshot with vignette */}
      <div style={{
        position: 'absolute', left: 900, top: 180,
        width: 940, height: 720,
        zIndex: 5,
      }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0a0a0a' }}>
          <img
            src="assets/report-detail.png"
            alt=""
            style={{
              position: 'absolute',
              left: 0, top: -300 * (940 / 970),
              width: 940,
              height: SRC_DETAIL.h * (940 / SRC_DETAIL.w),
              willChange: 'transform',
            }}
          />
          {/* Edge vignette */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)',
            pointerEvents: 'none',
          }} />
        </div>
        <ClinicalFrame inAt={0.02} inset={0} trace={false} />
        <CornerBrackets color={BV_BLUE} size={11} inAt={0.08} dur={0.28} />
      </div>

      {/* Left stack — three lines, 0.4s apart, last in BV_BLUE */}
      <div style={{ position: 'absolute', left: 120, top: 270 }}>
        <SlamIn inAt={0.15} dur={0.34} offsetY={28} fromScale={0.95} blurPx={3}>
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 96,
            fontWeight: 900,
            color: WHITE,
            lineHeight: 1.0,
            letterSpacing: '-0.025em',
            fontVariantNumeric: 'tabular-nums',
          }}>
            <CountUp inAt={0.20} dur={0.30} from={0} to={14} decimals={0} punchScale={1.04} />{' biomarkers.'}
          </div>
        </SlamIn>
      </div>

      <div style={{ position: 'absolute', left: 120, top: 410 }}>
        <SlamIn inAt={0.55} dur={0.32} offsetY={22}>
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 78,
            fontWeight: 800,
            color: WHITE,
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
          }}>
            Every session.
          </div>
        </SlamIn>
      </div>

      <div style={{ position: 'absolute', left: 120, top: 530 }}>
        <SlamIn inAt={0.95} dur={0.32} offsetY={22}>
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 78,
            fontWeight: 800,
            color: BV_BLUE,
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
          }}>
            Every day.
          </div>
        </SlamIn>
      </div>
    </Sprite>
  );
}

// ── Block 4 root ────────────────────────────────────────────────────────────
function Block4() {
  return (
    <React.Fragment>
      <Block4Opening />
      <Block4Dashboard />
      <Block4Beat3 />
      <Block4Beat4 />

      {/* Closing scan + flash → cut to black at Stage 38.85 */}
      <ScanFlash at={38.65} scanDur={0.16} flashDur={0.10} flashIntensity={0.96} />
    </React.Fragment>
  );
}

Object.assign(window, {
  Block4, Block4Opening, Block4Dashboard, Block4Beat3, Block4Beat4,
  GridBackground, LineDraw, MonoTypewriter, SlideInRight,
  DashboardImage, DashboardKeyframed, MetricCard, Beat2HeroNumber,
  SRC_REPORT, SRC_DETAIL, CRI_CENTER, CRI_RADIUS,
});
