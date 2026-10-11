# v0.3.1 — Gemini output fix

Stop npm run dev. Replace your existing server folder with this archive's server folder, including the new diagram-output.mjs. Keep src, shared, .env and node_modules. Restart npm run dev and retry Clean up diagram.

This fix requests a JSON schema from Gemini, tolerates unused endpoint omissions and numeric strings, handles zero-height/width arrows, and fits modest overflow to the artboard. Adjustments are disclosed in the preview. Unknown shapes, missing meaningful coordinates and extreme geometry are still rejected. Errors specify failed fields instead of blaming sketch complexity. Duplicate provider prefixes were removed.

Production build and 15 tests pass. Live output was not tested with your credentials; the specific response that caused your error was unavailable.
