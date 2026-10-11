# Upgrade v0.2 → v0.3

1. Save your artwork as project JSON and stop npm run dev with Ctrl+C.
2. Extract this ZIP separately.
3. Replace your existing **src/** and **server/** folders with these versions.
4. Copy the new **shared/** folder into the project root, beside src/ and server/.
5. Optionally replace tests/ and documentation.
6. Keep your .env, node_modules, package.json and package-lock.json. No dependencies changed.
7. Update the existing .env entries (do not replace real keys with placeholders):

```dotenv
GEMINI_MODEL=gemini-3.1-flash-lite
ELEVENLABS_STT_MODEL_ID=scribe_v2
```

Keep GEMINI_API_KEY and ELEVENLABS_API_KEY populated. Enable **Speech to Text → Access** for the ElevenLabs key. The voice ID and TTS model variables are no longer used. Keep DATABASE_URL if already working.

8. Restart npm run dev. Open Vite's Local URL, normally port 5173. Hard refresh the browser if old controls remain.

## Demo checklist

- Draw Start → Process → End as rough boxes/arrows.
- Assist → Clean up diagram → check preview → Use diagram.
- Change a diagram object's label and position in the inspector; verify Undo.
- Export PNG; save/open project JSON and verify diagram objects remain.
- Click Nib, say “change to brush”, click again. Verify tool selection.
- Say “change color to blue”. Verify swatch/brush changes.
- Try an unsupported command; verify it does not change the editor.
- Check Nib's level animation and that browser microphone recording stops after sending.

Old v0.1/v0.2 project files load with an empty diagram layer by default. Avoid opening newly saved diagram projects in older app versions: older schemas do not preserve the shape layer.

Errors now label the affected provider. Existing certificate-trust issues still need fixing on your machine. No TLS verification has been disabled.

Previous UPDATE-v02.md is historical; use this guide for the current release.
