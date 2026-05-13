// scenes-block2.jsx — Block 2 v2: The Product Enters. 0:11 → ~0:18
// Cinematic split: text on black at left, cropped image viewport at right.
// Imagery is framed as a clinical instrument window, not a slideshow image.

// Source dimensions of the screenshots (so we can crop precisely)
const SRC_GAME = { w: 899, h: 512 };
const SRC_VOCAL = { w: 895, h: 498 };

// ── ClinicalFrame ───────────────────────────────────────────────────────────
// A 1px hairline rectangle that traces around its bounding box, edge by edge,
// or appears instantly. Used to mark imagery as clinical evidence.
function ClinicalFrame({
  inAt = 0,
  inset = 0,
  color = BV_BLUE,
  strokeWidth = 1,
  trace = true,
  totalDur = 0.42,
  outAt = null,
  outDur = 0.20
}) {
  const { localTime } = useSprite();
  if (localTime < inAt) return null;

  const local = localTime - inAt;
  const segDur = totalDur / 4;

  let topP, rightP, bottomP, leftP;
  if (!trace) {
    const t = clamp(local / 0.06, 0, 1);
    topP = rightP = bottomP = leftP = t;
  } else {
    topP = Easing.easeOutCubic(clamp(local / segDur, 0, 1));
    rightP = Easing.easeOutCubic(clamp((local - segDur) / segDur, 0, 1));
    bottomP = Easing.easeOutCubic(clamp((local - 2 * segDur) / segDur, 0, 1));
    leftP = Easing.easeOutCubic(clamp((local - 3 * segDur) / segDur, 0, 1));
  }

  let opacity = 1;
  if (outAt != null && localTime > outAt) {
    const tOut = clamp((localTime - outAt) / outDur, 0, 1);
    opacity = 1 - tOut;
  }

  const sw = strokeWidth;
  const glow = `0 0 6px ${color}, 0 0 14px rgba(74,158,255,0.32)`;

  return (
    <div style={{
      position: 'absolute',
      left: inset, top: inset, right: inset, bottom: inset,
      pointerEvents: 'none',
      opacity,
      willChange: 'opacity',
      zIndex: 5
    }}>
      <div style={{ position: 'absolute', left: 0, top: 0,
        width: `${topP * 100}%`, height: sw, background: color, boxShadow: glow }} />
      <div style={{ position: 'absolute', right: 0, top: 0,
        width: sw, height: `${rightP * 100}%`, background: color, boxShadow: glow }} />
      <div style={{ position: 'absolute', right: 0, bottom: 0,
        width: `${bottomP * 100}%`, height: sw, background: color, boxShadow: glow }} />
      <div style={{ position: 'absolute', left: 0, bottom: 0,
        width: sw, height: `${leftP * 100}%`, background: color, boxShadow: glow }} />
    </div>);

}

// ── MonitorViewport ─────────────────────────────────────────────────────────
// A rectangular viewport that shows a precise crop of a source image.
// Includes: hairline frame (#4A9EFF), corner brackets, a monitor-style
// title bar with mono chrome, optional bottom-right readout, and Ken Burns.
//
// Crop semantics: cropX/Y/W/H are in source-image pixel coords. The viewport's
// aspect should match cropW/cropH for the crop to fill exactly.
function MonitorViewport({
  // image
  src, srcW, srcH,
  cropX = 0, cropY = 0, cropW, cropH,
  // placement & size in stage coords
  x, y, width, height,
  // motion
  scaleFrom = 1.0, scaleTo = 1.025, kenBurnsDur = 3.0,
  // frame entry
  frameInAt = 0, trace = true, frameTraceDur = 0.42,
  // topbar
  topbarLeft = 'CAM-01 · OBSERVATION',
  topbarRight = '30 FPS',
  pulseRight = false,
  // bottom-right readout (small mono, e.g. "T+00:43 / 01:00")
  readout = null,
  // children render inside viewport (e.g. crosshair, extra overlays)
  children
}) {
  const { localTime } = useSprite();

  // Ken Burns
  const kbT = clamp(localTime / kenBurnsDur, 0, 1);
  const kb = scaleFrom + (scaleTo - scaleFrom) * kbT;

  // Scale factor — fit the cropped region to fill the viewport
  const fitScale = width / cropW; // aspect-locked: width/cropW == height/cropH
  const dispW = srcW * fitScale * kb;
  const dispH = srcH * fitScale * kb;
  // Position so the crop region centers in the viewport
  const offsetX = (width - cropW * fitScale * kb) / 2 - cropX * fitScale * kb;
  const offsetY = (height - cropH * fitScale * kb) / 2 - cropY * fitScale * kb;

  // Image fade-in (separate from frame trace — image arrives first)
  const imgFade = clamp((localTime - frameInAt) / 0.20, 0, 1);

  return (
    <div style={{
      position: 'absolute', left: x, top: y, width, height,
      zIndex: 5
    }}>
      {/* Image inside clip viewport */}
      <div style={{
        position: 'absolute', inset: 0,
        overflow: 'hidden',
        background: '#080808',
        opacity: imgFade,
        willChange: 'opacity'
      }}>
        <img
          src={src}
          alt=""
          style={{ ...{
              position: 'absolute',
              left: offsetX,
              top: offsetY,
              width: dispW,
              height: dispH,
              willChange: 'transform, left, top, width, height', objectFit: "cover"
            }, height: "830.713px", width: "1458.62px" }} />
        

        {/* Monitor topbar — baked in, covers any source-image branding */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 0,
          height: 32,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 14px',
          fontFamily: FONT_MONO,
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          borderBottom: '1px solid rgba(74,158,255,0.22)'
        }}>
          <span style={{
            color: BV_BLUE,
            display: 'flex', alignItems: 'center', gap: 8
          }}>
            <span style={{
              width: 6, height: 6, background: BV_BLUE,
              boxShadow: `0 0 8px ${BV_BLUE}`
            }} />
            {topbarLeft}
          </span>
          <span style={{
            color: 'rgba(255,255,255,0.65)',
            display: 'flex', alignItems: 'center', gap: 8
          }}>
            {pulseRight &&
            <span style={{
              width: 7, height: 7, borderRadius: 999,
              background: BV_BLUE,
              boxShadow: `0 0 10px ${BV_BLUE}`,
              animation: 'bvPulse 1.4s ease-in-out infinite'
            }} />
            }
            {topbarRight}
          </span>
        </div>

        {/* Bottom-right readout */}
        {readout &&
        <div style={{
          position: 'absolute', right: 14, bottom: 12,
          fontFamily: FONT_MONO,
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.85)',
          background: 'rgba(0,0,0,0.55)',
          padding: '4px 8px',
          border: '1px solid rgba(74,158,255,0.25)'
        }}>
            {readout}
          </div>
        }

        {children}
      </div>

      {/* Hairline frame, traced or instant */}
      <ClinicalFrame
        inAt={frameInAt}
        inset={0}
        trace={trace}
        totalDur={frameTraceDur} />
      

      {/* Corner brackets — appear after frame trace completes */}
      <CornerBrackets
        color={BV_BLUE}
        size={11}
        inAt={frameInAt + (trace ? frameTraceDur * 0.7 : 0.04)}
        dur={0.30} />
      
    </div>);

}

// ── CornerBrackets ──────────────────────────────────────────────────────────
function CornerBrackets({ color = BV_BLUE, size = 10, inAt = 0, dur = 0.30 }) {
  const { localTime } = useSprite();
  if (localTime < inAt) return null;
  const t = clamp((localTime - inAt) / dur, 0, 1);
  const op = Easing.easeOutCubic(t);
  const sw = 1;
  const out = 4; // sticks out from corner by 4px
  const armStyle = (extra) => ({
    position: 'absolute',
    background: color,
    boxShadow: `0 0 6px ${color}`,
    opacity: op,
    ...extra
  });
  return (
    <React.Fragment>
      {/* TL */}
      <div style={armStyle({ left: -out, top: -out, width: size, height: sw })} />
      <div style={armStyle({ left: -out, top: -out, width: sw, height: size })} />
      {/* TR */}
      <div style={armStyle({ right: -out, top: -out, width: size, height: sw })} />
      <div style={armStyle({ right: -out, top: -out, width: sw, height: size })} />
      {/* BL */}
      <div style={armStyle({ left: -out, bottom: -out, width: size, height: sw })} />
      <div style={armStyle({ left: -out, bottom: -out, width: sw, height: size })} />
      {/* BR */}
      <div style={armStyle({ right: -out, bottom: -out, width: size, height: sw })} />
      <div style={armStyle({ right: -out, bottom: -out, width: sw, height: size })} />
    </React.Fragment>);

}

// ─────────────────────────────────────────────────────────────────────────────
// BLOCK 2
// ─────────────────────────────────────────────────────────────────────────────

// Layout grid (1920×1080):
//   Left text panel:  x=120 → ~820 (700px wide)
//   Right viewport:   x=880 → ~1820 (940px wide, ~560px tall, centered y≈260)

// ── Beat 1 — Patient session (Stage 11.0 → 14.0) ────────────────────────────
function Block2Beat1() {
  // Crop region of session-game.png: bottom strip including webcam pip,
  // boat with fisherman, water, left island. SteadyArc title is OUT of this crop.
  // Source 899×512 — crop: x=0, y=200, w=524, h=312 → aspect 1.679.
  // Viewport: 940×560 → aspect 1.679. Scale ≈ 1.794×.
  return (
    <Sprite start={11.0} end={14.0}>
      {/* Right viewport */}
      <MonitorViewport
        src="assets/session-game.png"
        srcW={SRC_GAME.w} srcH={SRC_GAME.h}
        cropX={0} cropY={200} cropW={524} cropH={312}
        x={880} y={260} width={940} height={560}
        scaleFrom={1.00} scaleTo={1.045} kenBurnsDur={3.0}
        frameInAt={0.05} trace={true} frameTraceDur={0.46}
        topbarLeft="Patient session · Home environment"
        topbarRight="CAM-01 · 30 fps"
        readout="T+00:43 / 01:00" />
      

      {/* LEFT text panel */}
      {/* Big "60" — count-up serif */}
      <div style={{ position: 'absolute', left: 120, top: 274 }}>
        <SlamIn inAt={0.40} dur={0.34} offsetY={28} fromScale={0.94} blurPx={4}>
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 280,
            fontWeight: 900,
            color: WHITE,
            lineHeight: 0.9,
            letterSpacing: '-0.025em',
            fontVariantNumeric: 'tabular-nums'
          }}>
            <CountUp inAt={0.45} dur={0.55} from={17} to={60} decimals={0} punchScale={1.05} />
          </div>
        </SlamIn>
      </div>

      {/* "SECONDS." mono unit label */}
      <div style={{ position: 'absolute', left: 124, top: 558 }}>
        <SlamIn inAt={1.05} dur={0.30} offsetY={14}>
          <div style={{
            fontFamily: FONT_MONO,
            fontSize: 36,
            fontWeight: 500,
            color: WHITE,
            letterSpacing: '0.20em',
            textTransform: 'uppercase'
          }}>
            Seconds.
          </div>
        </SlamIn>
      </div>

      {/* Hairline divider */}
      <HairLine
        inAt={1.30} dur={0.34}
        x={124} y={660}
        width={520} height={1}
        color="rgba(255,255,255,0.22)"
        origin="left" />
      

      {/* "Any camera. Any device." italic sub */}
      <div style={{ position: 'absolute', left: 124, top: 690 }}>
        <SlamIn inAt={1.45} dur={0.38} offsetY={18}>
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 42,
            fontWeight: 500,
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.78)',
            letterSpacing: '0'
          }}>
            Any camera. Any device.
          </div>
        </SlamIn>
      </div>
    </Sprite>);

}

// ── Beat 2 — Active challenge (Stage 14.0 → 17.60) ──────────────────────────
function Block2Beat2() {
  // Crop region of session-vocal.png: top-center chunk showing the challenge
  // panel and the audio waveform (+ a slice of the game below for context).
  // Source 895×498 — crop: x=200, y=4, w=520, h=310 → aspect 1.677.
  // Viewport: 940×560 → aspect 1.679. Scale ≈ 1.808×.
  return (
    <Sprite start={14.0} end={17.62}>
      <MonitorViewport
        src="assets/session-vocal.png"
        srcW={SRC_VOCAL.w} srcH={SRC_VOCAL.h}
        cropX={200} cropY={4} cropW={520} cropH={310}
        x={880} y={260} width={940} height={560}
        scaleFrom={1.00} scaleTo={1.040} kenBurnsDur={3.4}
        frameInAt={0.04} trace={false}
        topbarLeft="Active challenge · Vocal stability"
        topbarRight="REC · 16 kHz"
        pulseRight={true}
        readout="f₀ 132 Hz · SNR 24.8 dB" />
      

      {/* LEFT text panel */}
      {/* "Zero" — serif slam */}
      <div style={{ position: 'absolute', left: 120, top: 290 }}>
        <SlamIn inAt={0.18} dur={0.36} offsetY={28} fromScale={0.94} blurPx={4}>
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 280,
            fontWeight: 900,
            color: WHITE,
            lineHeight: 0.9,
            letterSpacing: '-0.025em'
          }}>
            Zero
          </div>
        </SlamIn>
      </div>

      {/* "HARDWARE." mono unit label */}
      <div style={{ position: 'absolute', left: 124, top: 558 }}>
        <SlamIn inAt={0.58} dur={0.30} offsetY={14}>
          <div style={{
            fontFamily: FONT_MONO,
            fontSize: 36,
            fontWeight: 500,
            color: WHITE,
            letterSpacing: '0.20em',
            textTransform: 'uppercase'
          }}>
            Hardware.
          </div>
        </SlamIn>
      </div>

      {/* Hairline divider */}
      <HairLine
        inAt={0.86} dur={0.34}
        x={124} y={660}
        width={520} height={1}
        color="rgba(255,255,255,0.22)"
        origin="left" />
      

      {/* "From home." italic accent in BV_BLUE — spec calls for fade-in */}
      <div style={{ position: 'absolute', left: 124, top: 690 }}>
        <SlamIn inAt={1.05} dur={0.46} offsetY={14} fromScale={0.98} blurPx={2}>
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 50,
            fontWeight: 500,
            fontStyle: 'italic',
            color: BV_BLUE,
            letterSpacing: '0'
          }}>
            From home.
          </div>
        </SlamIn>
      </div>
    </Sprite>);

}

// ── Block 2 root ────────────────────────────────────────────────────────────
function Block2() {
  return (
    <React.Fragment>
      {/* Section chrome — continuation from Block 1 */}
      <SectionLabel text="§ 03 · Capture" inAt={11.05} outAt={13.85} />
      <SectionLabel text="§ 04 · Signal" inAt={14.05} outAt={17.20} />

      <Block2Beat1 />
      <Block2Beat2 />

      {/* Closing scan + flash → cut to black */}
      <ScanFlash at={17.32} scanDur={0.18} flashDur={0.10} flashIntensity={0.96} />
    </React.Fragment>);

}

Object.assign(window, {
  Block2, Block2Beat1, Block2Beat2,
  MonitorViewport, CornerBrackets, ClinicalFrame
});