# Between Visits — 60s Product Demo

A 60-second motion graphics composition for **Between Visits**, a B2B SaaS platform for post-stroke rehabilitation monitoring.

## Product Overview

Between Visits allows patients to complete a 60-second game at home using their webcam. The platform uses computer vision to capture 14 clinical biomarkers (hand landmarks, facial symmetry, gaze tracking, vocal stability) and automatically sends a clinical report to the neurologist or rehabilitation team. No hardware required.

## Design System

**Tone:** Serious, clinical, human. Linear meets medical journal. Clean, minimal, with weight.

**Visual Style:**
- Black background (`#000000`)
- White typography (Playfair Display for headlines, JetBrains Mono for clinical labels)
- Accent color: `#4A9EFF` (MediaPipe blue) — used only on positive data moments, clinical labels, active biomarker states
- Atmospheric effects: navy, teal, amber, indigo gradients per block
- Kinetic typography with slam-in animations, count-up numbers, overshoot effects

**Composition Structure:**
- 60 seconds total
- 7 blocks:
  1. **Block 1 (0:00-0:11):** The Problem — stroke statistics
  2. **Block 2 (0:11-0:18):** The Product Enters — game screenshots
  3. **Block 3 (0:18-0:27):** Clinical Observation — hand/face tracking
  4. **Block 4 (0:27-0:39):** The Report — clinical data visualization
  5. **Block 5 (0:39-0:46):** Comparison — traditional vs. Between Visits
  6. **Block 6 (0:46-0:53):** Network Effect — care team collaboration
  7. **Block 7 (0:53-0:60):** Close — final message

## Files

- **`Between Visits - Canvas.html`** — Main canvas-based version (pure motion graphics, no images)
- **`Between Visits.html`** — Scene-based version (with product screenshots)
- **`animations.jsx`** — Animation framework (Stage, Sprite, easing functions)
- **`canvas-engine.jsx`** — Canvas rendering helpers (text, atmosphere, effects)
- **`canvas-block[1-7].jsx`** — Individual block implementations for canvas version
- **`scenes-block[1-7].jsx`** — Individual block implementations for scene version
- **`uploads/`** — Product screenshots used in the demo

## Usage

Simply open `Between Visits - Canvas.html` in a modern browser. The composition includes:
- Playback controls (play/pause with spacebar)
- Scrubber for precise timeline navigation
- Loop enabled by default
- All fonts loaded from Google Fonts

## Technical Details

- Built with React 18 + Babel standalone
- Pure canvas rendering at 1920×1080
- 66 seconds total duration (includes buffer)
- Fonts: Playfair Display (900, 700, italic), JetBrains Mono (500), Inter (500-600)
- All animations use custom easing functions (easeOutBack, easeOutExpo, easeOutCubic, etc.)
- Atmospheric effects: radial gradients with particle dust, vignette, film grain
