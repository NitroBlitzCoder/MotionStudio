# MotionStudio v0.3

Gesture drawing, Gemini sketch-to-diagram, and ElevenLabs voice commands with Nib, an animated studio companion. This is a local hackathon prototype.

## Start

Use Node.js 22.12+ (recent LTS preferred). Open this folder in VS Code:

```bash
npm ci
cp .env.example .env
npm run dev
```

Only copy .env.example if you do NOT already have .env. Open the Vite Local URL, normally http://127.0.0.1:5173. Port 3001 is the backend and will show Cannot GET / at its root. Keep the terminal running.

Updating an existing project? See UPDATE-v03.md. No packages were added since v0.2, but both the frontend and backend changed, and the new shared folder is required.

## What works

- Pen, marker, brush and eraser; color/size/opacity; undo/redo; clear ink; PNG export.
- Save/open JSON projects including photos, strokes and diagram objects. Save explicitly before closing. No autosave.
- MediaPipe webcam gestures, calibrated pinch thresholds, smoothed two-hand cursors, tool pickup, secondary-hand colors and circular size control.
- Photo import (PNG/JPEG/WebP under 10 MB), position/scale/rotation, brightness/contrast/saturation and layer visibility.
- Gemini sends a canvas snapshot for interpretation into clean rectangles, ellipses, arrows and labels. Review a preview before applying; inspect/edit each accepted object's label, geometry and colors.
- ElevenLabs transcribes an explicitly started microphone recording; a limited command parser applies supported tool/color/size/opacity commands.
- Nib responds visually to listening, actual microphone level, processing, success and errors. It is a code-drawn animated UI character, not an AI conversation agent.
- Tiger Data stores event batches and exposes per-minute session insights.

## Gemini configuration

Get a key: https://aistudio.google.com/apikey

```dotenv
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-3.1-flash-lite
```

Restart the server. Draw a simple flowchart. In Assist, add optional clarification and click Clean up diagram. This sends the visible canvas as JPEG plus your note to Google. No continuous camera frames are sent. Preview and uncertainty notes appear before Use diagram. Applying replaces the diagram layer and hides original ink without deleting it. Undo restores the prior project. To see/add original ink again, enable Drawing in Photo.

Accepted objects are edited through the Assist inspector dropdown and fields, not by direct dragging yet. Arrows have separate end coordinates x2/y2. Labels and connections can be misinterpreted: review them. Invalid geometry is rejected rather than drawn. If the project changes while Gemini is working, generate a new preview before applying. A snapshot can contain an imported photo: do not click if you do not want the visible image sent.

The old text-based Suggest an edit feature has been replaced. Model availability depends on your Google account. Official model code: https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-lite

## ElevenLabs voice configuration

In your ElevenLabs API key settings enable **Speech to Text → Access**. Text-to-Speech access is no longer required for this version.

```dotenv
ELEVENLABS_API_KEY=your_key
ELEVENLABS_STT_MODEL_ID=scribe_v2
```

No voice ID is needed. Old ELEVENLABS_VOICE_ID and ELEVENLABS_MODEL_ID values are ignored and may be removed. Restart the server. Click Nib (the small robot above the lower-right footer), allow microphone access, speak, and click again to send. Recording stops after eight seconds at most. Nib can also be clicked with a drawing-hand pinch. The microphone is released after recording, before transcription. There is no always-on recording or wake word.

Supported examples (one command per recording):

- Change to brush / switch to pen / use the eraser / select marker.
- Change color to blue / set color to red / use green.
- Set size to twenty pixels / set brush size to 40. Range 1–120.
- Set opacity to fifty percent / set opacity to 80 percent. Range 5–100%.

Colors: red, blue, green, yellow, orange, purple/violet, pink, black, white, brown, gray/grey, teal.

Recordings are uploaded to ElevenLabs via the backend. The app does not store the audio file. ElevenLabs' provider data policies still apply. Nib displays the transcript and applies recognized non-destructive settings; unknown, negated, compound or out-of-range commands do nothing. This is batch transcription, so settings change after recording/upload/transcription, not continuously as you speak. Text-to-speech narration and spoken onboarding have been removed.

Official STT docs: https://elevenlabs.io/docs/eleven-api/guides/cookbooks/speech-to-text

## Tiger Data

Set DATABASE_URL to your service's actual PostgreSQL connection string, retaining required TLS parameters. Then:

```bash
npm run db:init
npm run dev
```

Draw several strokes, wait five seconds, then Assist → Refresh session insights. Events include strokes, settings, tracking gaps and sampled model inference time. Inference time is NOT end-to-end camera latency. Batches run independently of drawing. An in-memory queue retries failed uploads and is capped at 2,000 events; closing the page can lose unuploaded events. Session identifiers reset on reload. Events do not include audio, pictures or canvas snapshots. Full replay/continuous aggregate materialization is not implemented.

## Hands and calibration

Enable camera, choose drawing hand, swap detected labels if needed, then restart tracking. Calibrate control hand: open thumb/index for four seconds, then pinch for four seconds. Open both hands afterward. Calibration and sensitivity settings persist in this browser. Low Responsiveness smooths jitter with added lag; greater Pinch confirmation requires a steadier pinch. Calibration samples the secondary hand and uses the thresholds for both hands.

Hover a tool and pinch; release before pinching on the canvas. Secondary hand: pinch a color swatch or the dial, then circle. Dial center movement and sudden angular jumps are ignored. Tracking loss stops drawing and requires an open hand before reactivation. Spatial continuity reduces brief handedness flips; overlapping hands pause input. Keep both hands in view and separated. Mouse drawing is disabled during camera mode. Escape stops camera.

## Structure

- src/App.tsx: editor state, undo/history, gestures and workspace.
- src/model.ts: project validation and canvas renderer.
- src/DiagramPanel.tsx: snapshot, preview and shape inspector.
- src/VoiceCompanion.tsx: microphone lifecycle, transcription and Nib.
- src/gestures.ts + gestureMath.mjs: MediaPipe and gesture math.
- src/api.ts: backend requests and telemetry queue.
- shared/diagram.mjs: schema used by client and server.
- shared/commands.mjs: explicit supported voice grammar.
- server/index.mjs: local routes, Gemini, ElevenLabs and PostgreSQL.
- server/schema.sql + init-db.mjs: Tiger Data initialization.
- tests/: gesture, command and schema validation.

## Verification and limits

npm run build passes. All 11 unit tests pass. Mocked-provider route checks verified diagram JSON/image payloads, multipart STT uploads, and invalid-request rejection. Those are not live provider tests. No credentials or microphone/webcam were available to test actual recognition or model output. Browser rendering/animation has not been visually verified in this environment. Test on your Mac before presenting.

Fixed 1200×800 canvas; two raster layers plus one diagram layer. No arbitrary layer ordering, masks, crop tool, zoom/pan, pressure or background removal. Shape labels can require manual correction. Large stroke/photo histories consume memory; history is capped at 50 changes. Inference and rendering are main-thread work and can stutter on slower hardware. Internet needed for installation, model/WASM downloads and sponsor APIs. Canvas/gesture math runs locally. API keys remain on the backend.

API errors are now labeled Gemini, ElevenLabs or Tiger Data. A self-signed certificate error still requires fixing certificate trust in your own Node/network/database setup; this revision does not disable TLS verification. Repeated Tiger Data errors can occur from background uploads. Temporarily comment DATABASE_URL and restart to isolate services. Recent Node releases can use NODE_OPTIONS=--use-system-ca npm run dev if the necessary certificate is trusted by your OS. Never set NODE_TLS_REJECT_UNAUTHORIZED=0.

Local development only: backend binds to 127.0.0.1, with no public authentication/deployment setup. Do not expose it publicly without implementing those controls. Keep .env ignored in Git. npm run build builds frontend assets; npm run dev is the full-stack local launcher.
