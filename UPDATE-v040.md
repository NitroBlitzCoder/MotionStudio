# MotionStudio v0.4.0 — Atelier

## What changed
- The control-hand cursor is captured on the brush wheel rim while pinched. Angular motion changes size; moving outward does not pull the cursor off the wheel. Open the hand to release. Tracking loss and camera shutdown also release capture.
- New warm-paper Atelier design, cobalt accents, illustrated animated empty artboard, tactile tool pickup, wheel indicator, animated panel entrances, responsive layout, and reduced-motion support.
- Classic / Atelier switch in the top bar saves your preference without changing artwork.
- Cursor reach and left-hand button snapping from v0.3.4 remain available.
- Backend now supports Render's production host/port and exact allowed origins. Frontend supports VITE_API_BASE_URL.

## Update locally
Stop your development server. Copy src, server, shared, package.json, package-lock.json, index.html, vercel.json, and render.yaml from this project into your existing project. Keep your own .env. Run npm install, then npm run dev. No new dependencies were added. The footer should show v0.4.0.

For the previous appearance, click Classic. For a full code rollback, extract rollback/MotionStudio-v0.3.4.zip included in this download. Keep your .env and project JSON artwork separately.

## Hosting status
Frontend: https://motionstudio-atelier-nitroblitzcoders-projects.vercel.app/
The frontend was deployed from source through Vercel. There is no Git auto-deploy connection yet.
Backend: prepared but not deployed. Render requires confirmation of the target workspace and a Git repository it can access. No API credentials are included in this download or frontend build.

To finish hosting:
1. Provide the project GitHub repository URL and ensure Render can access it. The app source must be pushed there.
2. Confirm Render workspace "My Workspace".
3. Create the Node service with npm ci --omit=dev as build, npm start as start, and /health as health check (or use render.yaml).
4. Set NODE_ENV=production and ALLOWED_ORIGINS=https://motionstudio-atelier-nitroblitzcoders-projects.vercel.app on Render.
5. Set GEMINI_API_KEY, ELEVENLABS_API_KEY, and DATABASE_URL privately on Render; use GEMINI_MODEL=gemini-3.1-flash-lite. Run npm run db:init against the chosen Tiger Data database if its schema has not been created.
6. Set VITE_API_BASE_URL to the actual Render backend origin in Vercel, then rebuild the frontend.
7. Verify a real diagram request, voice transcription, and event upload. Configured status only means a key exists, not that a provider request succeeds.

CORS is a browser restriction, not authentication. The API retains a coarse process-local rate limit; a wider public rollout should add per-user access and durable quotas. Never put provider secrets into VITE_ variables.

## Verification
27 automated tests passed, including wheel capture geometry, angle wrap, cursor reach, button snapping, and production origin restrictions. Production build passed. HTTP smoke checks passed for /health, allowed preflight, and rejected origin. Live browser checks verified selecting a brush, drawing, undo, and switching themes while keeping artwork. Real webcam gestures and iPhone behavior still need device testing. External AI/database requests cannot be tested until the backend credentials are configured.

## iPhone scope recommendation
For the hackathon, use responsive Safari first; skip native Swift/React Native work. A useful mobile flow is finger sketching or importing a photographed sketch, converting it to an editable diagram, then exporting it. Add larger touch targets and a dedicated mobile toolbar in a later pass. Home Screen installation is possible as a web app; this release does not claim offline support or native iPhone camera tracking validation.

Design research: https://linear.app/now/behind-the-latest-design-refresh and https://www.awwwards.com/websites/web-interactive/ informed hierarchy and motion; https://bruno-simon.com/ provided an interaction-led portfolio reference. All studio visuals here are original CSS/SVG.
