# MotionStudio v0.2 — update and configuration

## Update your existing project without losing keys

1. Save your current drawing as a project JSON. Stop the dev server with Ctrl+C.
2. Extract this ZIP into a separate folder.
3. In your existing project, replace the **src** folder with this download's **src** folder. It includes the new gestureMath.mjs file; do not copy only App.tsx.
4. Copy the updated tests folder, README.md and this guide if wanted.
5. Keep your existing .env, node_modules, package.json and package-lock.json. Dependencies have not changed; no reinstall is needed.
6. Run npm run dev and open the Vite Local URL (usually http://127.0.0.1:5173, NOT port 3001).

Alternatively run this whole project in a new folder with npm ci and copy your existing .env to it. Do not replace a populated .env by running cp .env.example .env.

## New studio interface

Graphite/olive work surface, warm metal accents, paper artboard, recessed color wells, an instrument-style size dial and shaded physical-looking pens. Pens lift on hover and animate when equipped. The artboard and panels enter subtly. Reduced-motion preferences disable animation. The Setup button opens configuration; drawing remains the main workspace.

The original concept images were not available during this revision, so this interprets the agreed tool-rack/left-control layout rather than matching an unseen image exactly.

## Configure gestures first

1. Enable hand tracking. Select the drawing hand (Right by default).
2. Check which cursor follows which hand: outlined brush = drawing; warm small ring = controls. If reversed, enable Swap detected hands and restart the camera.
3. Click **Calibrate control hand** (also available in Setup).
4. Hold your other hand open, thumb/index apart, for four seconds. Then hold a pinch for four seconds when instructed.
5. Open both hands afterward. Hover the control cursor on a color swatch, then pinch.
6. For size, pinch within the size dial and move around its center. The dial lights up while engaged. Release to finish.
7. In Setup, reduce Responsiveness to reduce jitter, increase Pinch confirmation to reject short accidental pinches, or reduce Dial sensitivity for smaller changes.

Calibration saves thresholds locally and applies them to both hands. Your other hand drives the calibration samples. No hand images are stored. Calibration fails rather than saving indistinguishable poses or too few samples. If your hands differ substantially, use defaults and adjust until a per-hand calibration feature is added.

The revised controller smooths both cursors, confirms pinches over time, uses separate pinch/release thresholds, anchors the dial center during a gesture, ignores movement near the center, rejects sudden angle jumps, and requires an open hand after tracking loss. Brief label flips are stabilized by spatial continuity; ambiguous overlapping hands pause input. Crossed hands can still confuse tracking, so keep them apart.

## Configure sponsors one at a time

Use **.env** at the project root, not src/. All keys stay on the local backend. Never share them in chat or screenshots.

### 1. Gemini

Get a key through Google AI Studio: https://aistudio.google.com/apikey
Official instructions: https://ai.google.dev/gemini-api/docs/api-key

Fill the existing lines in .env:

```dotenv
GEMINI_API_KEY=your_actual_key
GEMINI_MODEL=gemini-2.5-flash
```

Use a generateContent-compatible model your account supports if that model is unavailable. Restart npm run dev. Open Setup → Refresh connections. Then open Assist, request “Set the pen to blue at 20 pixels”, review the proposal and Apply. Verify the actual tool settings change. A configured status only means a key is present; this request tests access.

### 2. ElevenLabs

Create a dashboard API key and copy an accessible voice ID from your voice library.
Official quickstart: https://elevenlabs.io/docs/eleven-api/quickstart
Voice IDs: https://help.elevenlabs.io/hc/en-us/articles/14599760033937-How-do-I-find-the-voice-ID-of-my-voices-via-the-website-and-API

```dotenv
ELEVENLABS_API_KEY=your_actual_key
ELEVENLABS_VOICE_ID=your_voice_id
ELEVENLABS_MODEL_ID=eleven_multilingual_v2
```

Restart, open Assist and click Hear gesture guide. If audio plays, enable Speak applied edits. Stop audio cancels playback. This does not recognize spoken commands.

### 3. Tiger Data

Create/open your Tiger Data service and copy its connection string into DATABASE_URL, retaining its required TLS parameters.
Official instructions: https://www.tigerdata.com/docs/integrate/find-connection-details

```dotenv
DATABASE_URL=your_complete_postgresql_connection_string
```

Then run:

```bash
npm run db:init
npm run dev
```

Draw several strokes. Wait five seconds, open Assist and Refresh session insights. Verify that the table contains your session's strokes and inference readings. A database/configuration error appears in the footer; it is not replaced with fake data.

## Verification

Production build and all 8 tests pass, including pinch timing, threshold hysteresis, dial wraparound/jump rejection, calibration rejection and time-normalized smoothing. The revised visual layout and real webcam interactions still require testing in your browser; they were not visually verified here. Live sponsor access requires your credentials.
