# MotionStudio — local prototype

A complete runnable source project for a gesture-controlled drawing workspace, with optional Gemini, ElevenLabs, and Tiger Data connections. This is a hackathon prototype, not a finished Photoshop replacement.

## Start on your Mac in VS Code

1. Install Node.js 22.12+ (a current LTS version is recommended).
2. Unzip this folder and open **motion-studio** in VS Code.
3. Choose Terminal → New Terminal. Run:

```bash
npm ci
cp .env.example .env
npm run dev
```

4. Open the local address Vite prints, normally http://127.0.0.1:5173.
5. Keep the terminal running. Ctrl+C stops both the frontend and backend.

No Python, virtual environment, global npm install, or Docker is required. Dependencies stay in this folder's node_modules. The ZIP excludes node_modules and generated build output. Delete node_modules when you no longer need the installed packages; restore with npm ci. Keep package-lock.json.

## Included

- Dark workspace, right-side pen/brush/marker/eraser rack, color palette and size dial.
- Mouse/trackpad drawing, smoothed points, opacity, undo/redo (50 project changes), clear ink, PNG export.
- Save/open a project JSON including the photo and strokes. Save explicitly before closing; there is no autosave.
- Webcam hand tracking using MediaPipe; mirrored cursors; drawing-hand selector and label swap.
- Pinch to select tools; release, then pinch on canvas to draw. Tracking loss ends strokes and requires reopening the hand.
- Secondary-hand palette selection and circle-to-adjust size while pinching the size dial.
- Photo import (PNG/JPEG/WebP, under 10 MB); fit to canvas, position, scale, rotation, brightness, contrast, saturation; independently visible photo and drawing layers.
- Gemini text requests → validated, reviewable editor actions.
- ElevenLabs spoken guide and optional spoken applied edits, with stop/mute.
- Tiger Data batched timestamped events and per-minute session insights.

## First test

Draw a line with the mouse. Try undo/redo, marker, and eraser. Export PNG. Save a project, refresh, and reopen it. Import a photo and change its brightness. The eraser only removes drawing ink; it does not damage the photo below it.

Then enable hand tracking in desktop Chrome. Allow camera access and wait for model loading. Keep your hand open first. Hover over a pen and pinch, release, move onto canvas, and pinch again to draw. An outlined circle follows the drawing hand. The green cursor is the other hand.

Use **Swap detected hands** if handedness appears reversed. Changing handedness stops the camera; enable it again. Avoid crossed/overlapping hands. Tracking uses normalized thumb/index distance and a release threshold to avoid rapid pinch toggling. It remains sensitive to lighting and camera angle; test it before a live demo. Mouse drawing is disabled while camera mode is active. Escape stops the camera. Other hand: pinch a color swatch or start a pinch within the visible size ring, then circle around its center. The palette is always visible in this version.

## Credentials (optional)

Edit `.env` in VS Code. Never paste secrets into src/, prefix them with VITE_, or commit .env.

### Gemini

Set GEMINI_API_KEY and a supported GEMINI_MODEL in your Google AI account. The configurable default is gemini-2.5-flash. Restart npm run dev. Use the Assist tab: “Use a violet marker at 24 pixels” or, after importing a photo, “Set saturation to 125”. Review and Apply.

The backend requests JSON and validates every operation with Zod. Unsupported or invalid output is rejected. This prototype sends only your prompt and whether a photo exists; it does NOT send the image. It cannot analyze photo contents, remove backgrounds, generate images, or perform arbitrary edits. Settings affect future strokes. Undo covers canvas/photo changes, not brush settings. Model availability depends on your account.

### ElevenLabs

Set ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID (a voice your account can use). The model is configurable through ELEVENLABS_MODEL_ID. Restart. In Assist, choose Hear gesture guide or enable Speak applied edits. This is text-to-speech, not speech recognition. Audio is generated only on request and can incur provider charges.

### Tiger Data

Create a Tiger Data service and copy its TLS connection string into DATABASE_URL. Use the provider's required TLS configuration; certificate verification is not disabled in this project.

```bash
npm run db:init
npm run dev
```

The init command creates a Timescale hypertable and an index; it does not delete data. Once configured, editor events upload every five seconds, up to 100 per batch. Open Assist and Refresh session insights to query strokes, tracking gaps and mean sampled inference duration per minute. Status dots indicate credentials exist, not verified service health. Errors appear in the footer.

The queue is in memory, capped at 2,000 events. Failed uploads retry; events can be lost on page close or queue overflow. Events use UUIDs and a time/id key to deduplicate retries. Refresh starts a new session. Stored events contain no photos, webcam video, hand coordinates or prompts. This is telemetry, not full session replay. SQL uses time_bucket directly; continuous aggregate materialization is not implemented.

## Project structure

```text
motion-studio/
  src/
    App.tsx              Workspace and shared interaction handlers
    model.ts             Project schema, image cache, canvas renderer
    gestures.ts          Webcam lifecycle and MediaPipe inference
    api.ts               API helper and batched telemetry queue
    main.tsx             React entry
    style.css            Workspace styling
  server/
    index.mjs            Loopback-only API and provider adapters
    validation.mjs       Bounded edit and event schemas
    init-db.mjs          Database initialization command
    schema.sql           Timescale schema
  tests/
    validation.test.mjs  Invalid model output and event validation
  .env.example
  package.json
  package-lock.json
  tsconfig.json
  vite.config.ts
  index.html
```

The server uses JavaScript ES modules; the frontend uses TypeScript. React, MediaPipe, Express, pg, dotenv and Zod are installed by npm ci, together with the development tools. No API SDK is required: Gemini and ElevenLabs use server-side HTTP requests.

## Architecture

Mouse and MediaPipe → editor operations → project state/undo → Canvas → PNG/JSON.
Assistant panel → local API → Gemini → validated preview → editor operations.
Guide/applied response → local API → ElevenLabs → browser audio.
Session events → in-memory batch → local API → Tiger Data → session insights.

Drawing remains local and is independent of provider response times. MediaPipe inference currently runs on the main thread and may stutter on slower devices. A worker/offscreen-rendering implementation is future work.

## Verification

```bash
npm test
npm run build
```

The TypeScript/production build and three backend-validation tests were run successfully during creation. Backend status and missing-credential handling were also checked. Automated visual/browser testing could not be completed because the environment could not obtain a browser binary. Webcam tracking and real provider requests were not tested with a camera or credentials. Run the first-test checklist above on your Mac.

## Current limits / next work

- Fixed 1200 × 800 artboard and two layers. No arbitrary layer ordering, layer masks, crop tool, canvas zoom/pan, or full replay yet.
- Photo sliders handle positioning/resizing/rotation; direct manipulation handles are future work.
- No automatic shape recognition, pressure-sensitive input, image-aware AI, or voice commands.
- Rendering replays strokes per frame and retains photo images/history in memory. Very long drawings or many large images can consume RAM; save and reopen a project to clear history.
- Only supported editor buttons and color swatches respond to gestures. Other controls use mouse/keyboard.
- Internet needed for npm installation, MediaPipe WASM/model downloads, optional Google Fonts, and sponsor APIs. Webcam frames stay in your browser.
- Camera permission requires localhost or HTTPS. This project is configured for local development. Do not expose its API publicly without authentication, user-specific authorization, and production deployment work.
- npm run build checks and creates frontend assets; npm run dev is the supported full-stack local launch. Preview serves frontend only.

## Troubleshooting

- npm not found: install Node LTS and restart VS Code.
- Wrong folder: the terminal must be in the folder containing package.json.
- Camera fails: close other camera apps, check browser permission, internet/model access, and use desktop Chrome on localhost.
- Slow tracking: close intensive apps, improve lighting, reduce canvas complexity.
- API 503: missing .env credentials or database setup. Restart after editing .env.
- API 502: check provider key, quota/model permissions or database connection; no simulated success is substituted.
- Port busy: close the other dev server. If changing backend PORT, also change the proxy target in vite.config.ts.

## Official references

- https://vite.dev/guide/
- https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker/web_js
- https://ai.google.dev/gemini-api/docs/structured-output
- https://elevenlabs.io/docs/api-reference/text-to-speech/convert
- https://www.tigerdata.com/docs/learn/hypertables/creating-and-configuring-hypertables
