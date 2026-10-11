# v0.3.2 — Gemini HTTP 400 diagnostics

Stop npm run dev. Replace your entire server folder with this archive's server folder. Include provider-http.mjs and diagram-output.mjs. Keep .env and all frontend files. Restart npm run dev and retry Clean up diagram.

This removes the new responseJsonSchema request parameter while retaining JSON mode, explicit output instructions, local validation and geometry normalization. Google's actual error message is now returned with known credentials redacted. A 400 does not itself prove the schema parameter caused the failure; the new message identifies any remaining issue.

All 17 unit tests pass and backend syntax checks pass. No live Gemini call was performed with your key.
