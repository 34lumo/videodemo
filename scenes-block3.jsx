// scenes-block3.jsx — Block 3: Real-Time Tracking. 0:18 → 0:27
// Hero moment. Screenshot 2 (clinical observation view) starts tight on the
// MediaPipe hand mesh, pulls back to reveal the entire screen, then settles
// to the right while four labels stack in on the left.

const SRC_TRACK = { w: 894, h: 503 };

// ── PullbackViewport ────────────────────────────────────────────────────────
// A viewport whose bounds (x/y/w/h), image scale, and pan (source-pixel center)
// all interpolate across a set of time keyframes. Used for the zoom-out reveal
// and the subsequent reposition to a smaller right-anchored window.
function PullbackViewport({
  src, srcW, srcH,
  keyframes, // [{t, vp:{x,y,w,h}, scale, pan:[x,y], ease?}]
  frameInAt = 0, // local time when ClinicalFrame starts tracing
  frameTraceDur = 0.42,
  liveLabel, // string (rendered bottom-left of viewport)
  liveLabelInAt = 0,
  liveLabelOutAt = null
}) {
  const { localTime } = useSprite();

  // Interpolate keyframes
  const state = (() => {
    if (localTime <= keyframes[0].t) return keyframes[0];
    if (localTime >= keyframes[keyframes.length - 1].t) return keyframes[keyframes.length - 1];
    for (let i = 0; i < keyframes.length - 1; i++) {
      const a = keyframes[i],b = keyframes[i + 1];
      if (localTime >= a.t && localTime <= b.t) {
        const span = b.t - a.t;
        const local = span > 0 ? (localTime - a.t) / span : 0;
        const ease = b.ease || Easing.easeInOutCubic;
        const e = ease(local);
        const lerp = (x, y) => x + (y - x) * e;
        return {
          vp: {
            x: lerp(a.vp.x, b.vp.x),
            y: lerp(a.vp.y, b.vp.y),
            w: lerp(a.vp.w, b.vp.w),
            h: lerp(a.vp.h, b.vp.h)
          },
          scale: lerp(a.scale, b.scale),
          pan: [lerp(a.pan[0], b.pan[0]), lerp(a.pan[1], b.pan[1])]
        };
      }
    }
    return keyframes[keyframes.length - 1];
  })();

  const dispW = srcW * state.scale;
  const dispH = srcH * state.scale;
  const offsetX = state.vp.w / 2 - state.pan[0] * state.scale;
  const offsetY = state.vp.h / 2 - state.pan[1] * state.scale;

  return (
    <div style={{
      position: 'absolute',
      left: state.vp.x, top: state.vp.y,
      width: state.vp.w, height: state.vp.h,
      zIndex: 5,
      willChange: 'left, top, width, height'
    }}>
      {/* Image inside clip viewport */}
      <div style={{
        position: 'absolute', inset: 0,
        overflow: 'hidden',
        background: '#080808'
      }}>
        <img
          src={src}
          alt=""
          style={{
            position: 'absolute',
            left: offsetX, top: offsetY,
            width: dispW, height: dispH,
            willChange: 'transform, left, top, width, height'
          }} />
        

        {/* Live label — mono caps, bottom-left */}
        {liveLabel && localTime >= liveLabelInAt &&
        <div style={{ position: 'absolute', left: 12, bottom: 10 }}>
            <SlamIn inAt={liveLabelInAt} dur={0.30} offsetY={10}
          outAt={liveLabelOutAt != null ? liveLabelOutAt : undefined}
          outDur={0.30}>
              <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              fontFamily: FONT_MONO,
              fontSize: 13,
              fontWeight: 500,
              color: BV_BLUE,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              background: 'rgba(0,0,0,0.62)',
              padding: '6px 12px',
              border: '1px solid rgba(74,158,255,0.32)'
            }}>
                <span style={{
                width: 7, height: 7, borderRadius: 999,
                background: BV_BLUE,
                boxShadow: `0 0 10px ${BV_BLUE}`,
                animation: 'bvPulse 1.2s ease-in-out infinite'
              }} />
                {liveLabel}
              </div>
            </SlamIn>
          </div>
        }
      </div>

      {/* Hairline frame */}
      <ClinicalFrame inAt={frameInAt} inset={0} trace={true} totalDur={frameTraceDur} />

      {/* Corner brackets — appear after frame trace */}
      <CornerBrackets
        color={BV_BLUE}
        size={11}
        inAt={frameInAt + frameTraceDur * 0.7}
        dur={0.30} />
      
    </div>);

}

// ─────────────────────────────────────────────────────────────────────────────
// BLOCK 3
// ─────────────────────────────────────────────────────────────────────────────
// Sprite local time runs 0.0 → 9.0 (Stage 18.0 → 27.0).
//
// Keyframe plan for the viewport:
//   t=0.00  tight on hand: vp full-near-bleed (80, 50, 1760, 980), scale 5.0,
//           pan (402, 170)  [hand center in source]
//   t=1.00  hold tight
//   t=2.70  full reveal: same big vp, scale fit (~1.948), pan image center (447, 251)
//   t=3.00  hold (frame trace completes here)
//   t=3.40  reposition: vp (860, 220, 1000, 600), scale fit-for-vp (~1.119),
//           pan image center
//   t=9.00  hold final
//
// Frame begins tracing at t=2.55 (overlaps end of pull-back), completes t=3.00.
// Live label appears at t=3.05, persists across reposition into Beat 2.
//
// Beat 2 labels (left panel, x=120):
//   t=3.50  Line 1 "21 hand landmarks."         serif 56, count-up 0→21
//   t=4.70  Line 2 "468 facial landmarks."      serif 56, count-up 0→468
//   t=5.90  Line 3 "Gaze. Pinch. Symmetry. Voice."  serif 56
//   t=7.10  Line 4 "All captured. Simultaneously."  mono 22 BV_BLUE
//   t=8.20  hold ends, ScanFlash starts
//   t=8.50  cut to black (sprite ends at 8.95)
function Block3() {
  const kfs = [
  { t: 0.00, vp: { x: 80, y: 50, w: 1760, h: 980 }, scale: 5.0, pan: [402, 170] },
  { t: 1.00, vp: { x: 80, y: 50, w: 1760, h: 980 }, scale: 5.0, pan: [402, 170] },
  { t: 2.70, vp: { x: 80, y: 50, w: 1760, h: 980 }, scale: 1.948, pan: [447, 251],
    ease: Easing.easeInOutCubic },
  { t: 3.00, vp: { x: 80, y: 50, w: 1760, h: 980 }, scale: 1.948, pan: [447, 251] },
  { t: 3.40, vp: { x: 860, y: 220, w: 1000, h: 600 }, scale: 1.119, pan: [447, 251],
    ease: Easing.easeInOutCubic },
  { t: 9.00, vp: { x: 860, y: 220, w: 1000, h: 600 }, scale: 1.119, pan: [447, 251] }];


  return (
    <React.Fragment>
      {/* Section chrome (Beat 2 only) */}
      <SectionLabel text="§ 05 · Multimodal" inAt={21.40} outAt={26.10} />

      <Sprite start={18.0} end={26.55}>
        <PullbackViewport
          src="assets/session-tracking.png"
          srcW={SRC_TRACK.w} srcH={SRC_TRACK.h}
          keyframes={kfs}
          frameInAt={2.55}
          frameTraceDur={0.45}
          liveLabel="CAM-01 — Direct observation — Live"
          liveLabelInAt={3.05}
          liveLabelOutAt={8.20} />
        

        {/* ── Beat 2 labels — left panel on black ─────────────────────────── */}

        {/* Line 1 — "21 hand landmarks." */}
        <div style={{ position: 'absolute', left: 120, top: 270 }}>
          <SlamIn inAt={3.50} dur={0.34} offsetY={26} fromScale={0.95} blurPx={3}
          outAt={8.20} outDur={0.35}>
            <div style={{
              fontFamily: FONT_SERIF,
              fontSize: 60,
              fontWeight: 800,
              color: WHITE,
              lineHeight: 1.0,
              letterSpacing: '-0.015em',
              fontVariantNumeric: 'tabular-nums'
            }}>
              <CountUp inAt={3.55} dur={0.42} from={0} to={21} decimals={0} punchScale={1.04} />
              {' hand landmarks.'}
            </div>
          </SlamIn>
        </div>

        {/* Line 2 — "468 facial landmarks." */}
        <div style={{ position: 'absolute', left: 120, top: 376 }}>
          <SlamIn inAt={4.70} dur={0.34} offsetY={26} fromScale={0.95} blurPx={3}
          outAt={8.20} outDur={0.35}>
            <div style={{
              fontFamily: FONT_SERIF,
              fontSize: 60,
              fontWeight: 800,
              color: WHITE,
              lineHeight: 1.0,
              letterSpacing: '-0.015em',
              fontVariantNumeric: 'tabular-nums'
            }}>
              <CountUp inAt={4.75} dur={0.50} from={0} to={468} decimals={0} punchScale={1.04} />
              {' facial landmarks.'}
            </div>
          </SlamIn>
        </div>

        {/* Line 3 — "Gaze. Pinch. Symmetry. Voice." */}
        <div style={{ position: 'absolute', left: 120, top: 482 }}>
          <SlamIn inAt={5.90} dur={0.34} offsetY={26} fromScale={0.95} blurPx={3}
          outAt={8.20} outDur={0.35}>
            <div style={{
              fontFamily: FONT_SERIF,
              fontSize: 56,
              fontWeight: 800,
              color: WHITE,
              lineHeight: 1.0,
              letterSpacing: '-0.015em'
            }}>Gaze. Pinch. Symmetry.

Voice. Eyes.

</div>
          </SlamIn>
        </div>

        {/* Hairline divider before Line 4 */}
        <HairLine inAt={7.00} dur={0.34} x={124} y={606}
          width={520} height={1}
          color="rgba(74,158,255,0.42)"
          origin="left" />
        

        {/* Line 4 — "All captured. Simultaneously." mono BV_BLUE */}
        <div style={{ position: 'absolute', left: 120, top: 632 }}>
          <SlamIn inAt={7.10} dur={0.32} offsetY={14} fromScale={0.97} blurPx={2}
          outAt={8.20} outDur={0.35}>
            <div style={{
              fontFamily: FONT_MONO,
              fontSize: 22,
              fontWeight: 500,
              color: BV_BLUE,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              lineHeight: 1.0
            }}>
              All captured. Simultaneously.
            </div>
          </SlamIn>
        </div>
      </Sprite>

      {/* Closing scan-line flash → cut to black */}
      <ScanFlash at={26.20} scanDur={0.18} flashDur={0.10} flashIntensity={0.96} />
    </React.Fragment>);

}

Object.assign(window, {
  Block3, PullbackViewport, SRC_TRACK
});