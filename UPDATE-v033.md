# v0.3.3 — left-hand button snapping

Save your project and stop npm run dev. Replace your existing src folder with this archive's src folder, including buttonSnap.ts and buttonSnapMath.mjs. Keep .env, node_modules, server and shared. Restart npm run dev. No dependencies changed.

With Right selected as the drawing hand, the left control cursor now:
- Captures within at most 16 CSS pixels of an actual button center (less for tiny buttons).
- Requires 70 ms near the target, with the hand open, before locking.
- Stays centered through small movements; the button gets a gold outline.
- Activates only when you pinch. Snapping alone never activates a button.
- Releases when the smoothed hand position moves more than 40 CSS pixels from center.
- Waits 180 ms after release before capturing another button.
- Clears the lock if the button disappears, becomes disabled/covered, tracking is lost, calibration begins or the camera stops.

Only actual visible, enabled HTML buttons are candidates. The left hand can now pinch those buttons as well as color swatches. Inputs, sliders, custom color picker, labels, canvas and size dial do not snap. While the size dial is engaged the cursor remains free-moving. The drawing hand never snaps; in left-handed drawing mode the secondary right hand does not get magnetic snapping.

Test with mouse idle: hover the left cursor near a color button, observe the gold lock, wiggle slightly, pinch, then move deliberately away. Try neighboring colors. Confirm the drawing cursor and size dial remain free. Build and 21 unit tests pass, including dwell, capture/release hysteresis, cooldown, target disappearance and no acquisition during pinch. Live webcam usability is not verified here.

You can tune SNAP.capture/release/dwell/cooldown in src/buttonSnapMath.mjs; values above are the shipped defaults.
