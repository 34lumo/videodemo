// scenes-block6.jsx — Block 6: The Numbers. 0:46 → 0:53
// Three beats. Fastest, most kinetic block in the video.
//   Beat 1 (0:46–0:48): €0 hardware cost — clean
//   Beat 2 (0:48–0:50): 60 seconds — urgent
//   Beat 3 (0:50–0:53): 14 biomarkers — overwhelming
// Every number lands heavier than the last.

// ── PopIn ───────────────────────────────────────────────────────────────────
// Element pops into existence at fromScale, snaps to 1.0 in `dur`. No slide.
function PopIn({
  inAt = 0, dur = 0.10,
  fromScale = 1.20,
  outAt = null, outDur = 0.18,
  origin = 'center',
  children, style = {},
}) {
  const { localTime } = useSprite();
  if (localTime < inAt) return null;

  const t = clamp((localTime - inAt) / dur, 0, 1);
  const eased = Easing.easeOutCubic(t);
  const scale = fromScale + (1 - fromScale) * eased;
  const opIn = clamp((localTime - inAt) / Math.max(dur * 0.25, 0.02), 0, 1);

  let opacity = opIn;
  if (outAt != null && localTime > outAt) {
    const tOut = clamp((localTime - outAt) / outDur, 0, 1);
    opacity = Math.min(opacity, 1 - Easing.easeInQuad(tOut));
  }

  return (
    <div style={{
      transform: `scale(${scale})`,
      transformOrigin: origin,
      opacity,
      willChange: 'transform, opacity',
      display: 'inline-block',
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── SlamFromAbove ───────────────────────────────────────────────────────────
// Drops from above the final position, overshoots `overshootY` past final, snaps back.
function SlamFromAbove({
  inAt = 0, dur = 0.40,
  fromY = -90, overshootY = 8,
  children, style = {},
}) {
  const { localTime } = useSprite();
  if (localTime < inAt) return null;

  const t = clamp((localTime - inAt) / dur, 0, 1);

  let ty;
  if (t < 0.70) {
    const lt = t / 0.70;
    ty = fromY + (overshootY - fromY) * Easing.easeOutCubic(lt);
  } else {
    const lt = (t - 0.70) / 0.30;
    ty = overshootY + (0 - overshootY) * Easing.easeOutCubic(lt);
  }

  const opacity = clamp((localTime - inAt) / (dur * 0.15), 0, 1);

  return (
    <div style={{
      transform: `translateY(${ty}px)`,
      opacity,
      willChange: 'transform, opacity',
      display: 'inline-block',
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── ShootingLine ────────────────────────────────────────────────────────────
// Horizontal line drawn fast L→R (or T→B for vertical), leaves a brief glowing
// trail that fades out.
function ShootingLine({
  inAt = 0, dur = 0.10, trailDur = 0.20,
  y = 0, x = 0,
  width = '100%', height = 2,
  color = BV_BLUE,
  vertical = false,
}) {
  const { localTime } = useSprite();
  const dt = localTime - inAt;
  if (dt < 0 || dt > dur + trailDur) return null;

  const drawT = dt < dur ? Easing.easeOutExpo(dt / dur) : 1;
  const trailT = dt > dur ? clamp((dt - dur) / trailDur, 0, 1) : 0;
  const opacity = 1 - trailT;
  const blur = trailT * 3;
  const glow = (1 - trailT) * 14;

  const sty = vertical
    ? {
        position: 'absolute', left: x, top: y,
        width: height, height: width,
        background: color,
        transform: `scaleY(${drawT})`,
        transformOrigin: 'top center',
      }
    : {
        position: 'absolute', left: x, top: y,
        width, height,
        background: color,
        transform: `scaleX(${drawT})`,
        transformOrigin: 'left center',
      };

  return (
    <div style={{
      ...sty,
      opacity,
      filter: blur > 0.1 ? `blur(${blur}px)` : 'none',
      boxShadow: `0 0 ${glow}px ${color}, 0 0 ${glow * 2}px rgba(74,158,255,0.4)`,
      pointerEvents: 'none',
      willChange: 'transform, opacity, filter',
      zIndex: 30,
    }} />
  );
}

// ── DiscreteCount ───────────────────────────────────────────────────────────
// Frame-by-frame count display. Cycles through `values` at `frameDur` intervals.
function DiscreteCount({ inAt, values, frameDur = 0.06, style = {} }) {
  const { localTime } = useSprite();
  if (localTime < inAt) return null;
  const idx = Math.min(Math.floor((localTime - inAt) / frameDur), values.length - 1);
  return (
    <span style={{ fontVariantNumeric: 'tabular-nums', ...style }}>
      {values[idx]}
    </span>
  );
}

// ── ScatterLabel ────────────────────────────────────────────────────────────
// Small mono caps label that pops in at an absolute (x, y) position.
function ScatterLabel({
  text, x, y, align = 'left',
  inAt, outAt = null, outDur = 0.20,
  fontSize = 15, color = BV_BLUE, letterSpacing = '0.22em',
}) {
  const translateX = align === 'right' ? '-100%' : (align === 'center' ? '-50%' : '0');
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: `translateX(${translateX})`,
      zIndex: 12,
    }}>
      <PopIn inAt={inAt} dur={0.10} fromScale={1.18}
             outAt={outAt} outDur={outDur} origin="center">
        <div style={{
          fontFamily: FONT_MONO,
          fontSize,
          fontWeight: 500,
          color,
          letterSpacing,
          textTransform: 'uppercase',
          lineHeight: 1.0,
          whiteSpace: 'nowrap',
        }}>
          {text}
        </div>
      </PopIn>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOCK 6
// ─────────────────────────────────────────────────────────────────────────────

// ── Beat 1 — €0 HARDWARE (Stage 46.0 → 48.0) ────────────────────────────────
function Block6Beat1() {
  // Local timing:
  //   0.00 grid bg fades up (from Block 4's GridBackground)
  //   0.05 blue line shoots across (draw 0.10s, trail 0.20s)
  //   0.20 "€0" POPS center
  //   0.32 "HARDWARE COST" mono types (~13 chars × 22ms = 0.29s)
  //   0.55, 0.65, 0.75, 0.85: four mini-labels pop in around €0
  //   1.40 labels fade out simultaneously
  //   1.85 sprite ends (hard cut)
  return (
    <Sprite start={46.0} end={48.0}>
      <GridBackground inAt={0.00} outAt={1.85} opacity={0.045} />

      {/* Shooting line at top */}
      <ShootingLine inAt={0.04} dur={0.10} trailDur={0.22}
                    y={210} height={2} color={BV_BLUE} />

      {/* Center "€0" — POP */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center' }}>
        <PopIn inAt={0.20} dur={0.10} fromScale={1.22}
               outAt={1.85} outDur={0.20} origin="center">
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 280,
            fontWeight: 900,
            color: WHITE,
            lineHeight: 0.9,
            letterSpacing: '-0.04em',
          }}>
            €0
          </div>
        </PopIn>
      </div>

      {/* "HARDWARE COST" mono types below */}
      <MonoTypewriter
        inAt={0.32}
        text="Hardware cost"
        charDur={0.025}
        fontSize={20}
        color={BV_BLUE}
        letterSpacing="0.28em"
        y={680}
        align="center"
        fadeOutAt={1.85} fadeOutDur={0.20}
      />

      {/* Four scattered labels around €0 */}
      <ScatterLabel text="No wearables"   x={520}  y={400} inAt={0.55} outAt={1.30} outDur={0.18} fontSize={16} />
      <ScatterLabel text="No sensors"     x={1400} y={400} inAt={0.65} outAt={1.30} outDur={0.18} fontSize={16} />
      <ScatterLabel text="No setup"       x={520}  y={620} inAt={0.75} outAt={1.30} outDur={0.18} fontSize={16} />
      <ScatterLabel text="No installation" x={1400} y={620} inAt={0.85} outAt={1.30} outDur={0.18} fontSize={16} />
    </Sprite>
  );
}

// ── Beat 2 — 60 SECONDS (Stage 48.0 → 50.0) ─────────────────────────────────
function Block6Beat2() {
  // Local timing:
  //   0.00 scan flash (between-beat)
  //   0.10 "60" slams from above, overshoots, snaps
  //   0.50 "SECONDS PER SESSION" mono types
  //   0.40 vertical hairline draws on left
  //   0.60, 0.75, 0.90, 1.05 — four stacked labels right of vertical line
  //   1.40 hold (all visible)
  //   1.85 brief scan
  //   2.00 hard cut
  return (
    <Sprite start={48.0} end={50.0}>
      <GridBackground inAt={0.00} outAt={1.85} opacity={0.045} />

      {/* Vertical hairline drawn top → bottom on the left */}
      <ShootingLine inAt={0.40} dur={0.30} trailDur={0.00}
                    x={780} y={200} width={580} height={1}
                    color={BV_BLUE} vertical={true} />

      {/* Big "60" center — slam from above */}
      <div style={{ position: 'absolute', left: 880, top: 280 }}>
        <SlamFromAbove inAt={0.10} dur={0.42} fromY={-110} overshootY={10}>
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 320,
            fontWeight: 900,
            color: WHITE,
            lineHeight: 0.85,
            letterSpacing: '-0.04em',
            fontVariantNumeric: 'tabular-nums',
          }}>
            60
          </div>
        </SlamFromAbove>
      </div>

      {/* "SECONDS PER SESSION" mono — types below "60" */}
      <MonoTypewriter
        inAt={0.50}
        text="Seconds per session"
        charDur={0.022}
        fontSize={20}
        color={BV_BLUE}
        letterSpacing="0.26em"
        x={880} y={620}
      />

      {/* Four stacked labels right of vertical line */}
      <ScatterLabel text="Daily adherence"        x={830} y={300} inAt={0.65} fontSize={20} letterSpacing="0.22em" />
      <ScatterLabel text="Home environment"       x={830} y={372} inAt={0.80} fontSize={20} letterSpacing="0.22em" />
      <ScatterLabel text="No clinician present"   x={830} y={444} inAt={0.95} fontSize={20} letterSpacing="0.22em" />
      <ScatterLabel text="Full biomarker capture" x={830} y={516} inAt={1.10} fontSize={20} letterSpacing="0.22em" />

      {/* Between-beat scan-line flash */}
    </Sprite>
  );
}

// ── Beat 3 — 14 BIOMARKERS (Stage 50.0 → 53.0) ──────────────────────────────
// Most space. Core claim. 14 labels scatter around the number "14".
function Block6Beat3() {
  // Local timing:
  //   0.00 hard cut + radial bg gradient fades in
  //   0.10 "14" discrete count: 0,3,7,11,14 @ 0.06s/frame → lands 0.40
  //   0.45 "clinical biomarkers." pops below
  //   0.55 14 scatter labels pop in (0.075s apart × 14 = 1.05s) → last at 1.55
  //   1.60 brief hold
  //   2.05 labels disappear simultaneously (instant fade ~0.04s)
  //   2.12 white italic serif "Captured in a 60-second game." fades in
  //   2.50 italic at full
  //   2.50 – 2.85 hold ~0.35s
  //   2.85 – 3.00 fade to black
  const labels = [
    { text: 'Pinch precision',      x: 280,  y: 250 },
    { text: 'Hand opening',         x: 1640, y: 270 },
    { text: 'Palm speed',           x: 220,  y: 440 },
    { text: 'Movement smoothness',  x: 1720, y: 420 },
    { text: 'Finger individuation', x: 440,  y: 195 },
    { text: 'Range of motion',      x: 1500, y: 175 },
    { text: 'Facial symmetry',      x: 740,  y: 130 },
    { text: 'Smile symmetry',       x: 1200, y: 145 },
    { text: 'Fixation heatmap',     x: 340,  y: 750 },
    { text: 'Gaze asymmetry',       x: 1580, y: 720 },
    { text: 'Dwell time',           x: 540,  y: 820 },
    { text: 'Vocal stability',      x: 1420, y: 840 },
    { text: 'Phonation quality',    x: 760,  y: 920 },
    { text: 'Blink asymmetry',      x: 1200, y: 900 },
  ];
  const LABELS_OUT = 2.05;

  return (
    <Sprite start={50.0} end={53.0}>
      {/* Radial gradient — frozen radar sweep */}
      <RadialBG inAt={0.00} outAt={2.85} />

      {/* Between-beat scan flash handled at Block level */}

      {/* "14" center — discrete count 0,3,7,11,14 */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 280, textAlign: 'center' }}>
        <PopIn inAt={0.10} dur={0.08} fromScale={1.15}
               outAt={2.85} outDur={0.20} origin="center">
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 360,
            fontWeight: 900,
            color: WHITE,
            lineHeight: 0.85,
            letterSpacing: '-0.04em',
            fontVariantNumeric: 'tabular-nums',
          }}>
            <DiscreteCount inAt={0.10} values={[0, 3, 7, 11, 14]} frameDur={0.07} />
          </div>
        </PopIn>
      </div>

      {/* "clinical biomarkers." — serif italic */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 660, textAlign: 'center' }}>
        <PopIn inAt={0.50} dur={0.16} fromScale={1.08}
               outAt={2.85} outDur={0.20} origin="center">
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 60,
            fontWeight: 600,
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.78)',
            lineHeight: 1.0,
            letterSpacing: '-0.005em',
          }}>
            clinical biomarkers.
          </div>
        </PopIn>
      </div>

      {/* 14 scattered labels */}
      {labels.map((lbl, i) => (
        <ScatterLabel
          key={lbl.text}
          text={lbl.text}
          x={lbl.x} y={lbl.y}
          inAt={0.55 + i * 0.075}
          outAt={LABELS_OUT} outDur={0.04}
          fontSize={15}
          letterSpacing="0.22em"
        />
      ))}

      {/* Final italic line — "Captured in a 60-second game." */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 820, textAlign: 'center' }}>
        <SlamIn inAt={2.12} dur={0.34} offsetY={14} fromScale={0.97} blurPx={2}
                outAt={2.85} outDur={0.18} origin="center">
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 42,
            fontWeight: 500,
            fontStyle: 'italic',
            color: WHITE,
            letterSpacing: '-0.005em',
            lineHeight: 1.1,
          }}>
            Captured in a 60-second game.
          </div>
        </SlamIn>
      </div>
    </Sprite>
  );
}

// ── RadialBG ────────────────────────────────────────────────────────────────
// Very faint blue radial gradient centered on the stage — like a radar sweep
// caught mid-frame. Used only in Beat 3.
function RadialBG({ inAt = 0, outAt = null }) {
  const { localTime } = useSprite();
  let op = clamp((localTime - inAt) / 0.30, 0, 1);
  if (outAt != null && localTime > outAt) {
    op = Math.min(op, 1 - clamp((localTime - outAt) / 0.30, 0, 1));
  }
  if (op <= 0.01) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(ellipse at center, rgba(74,158,255,0.085) 0%, rgba(74,158,255,0.03) 28%, rgba(74,158,255,0) 60%)',
      opacity: op,
      pointerEvents: 'none',
      zIndex: 0,
    }} />
  );
}

// ── Block 6 root ────────────────────────────────────────────────────────────
function Block6() {
  return (
    <React.Fragment>
      <Block6Beat1 />
      <Block6Beat2 />
      <Block6Beat3 />

      {/* Mandatory scan-line punctuation between beats */}
      <ScanFlash at={47.85} scanDur={0.10} flashDur={0.05} flashIntensity={0.85} />
      <ScanFlash at={49.85} scanDur={0.10} flashDur={0.05} flashIntensity={0.85} />
      {/* Block-closer fade to black is built into Beat 3's outAt timings */}
    </React.Fragment>
  );
}

Object.assign(window, {
  Block6, Block6Beat1, Block6Beat2, Block6Beat3,
  PopIn, SlamFromAbove, ShootingLine, DiscreteCount, ScatterLabel, RadialBG,
});
