# MotionStudio v0.3.4

## Update your existing project
Stop the dev server. Replace your existing src folder with this version's src folder. Keep your existing .env and node_modules. Restart with npm run dev and refresh the browser. The footer should say Studio v0.3.4. No new dependencies are needed for this update from v0.3.3.

The ZIP also includes the complete project. For a fresh folder, run npm install, copy your existing .env into the project root, then run npm run dev.

## Cursor reach
Setup > Cursor reach defaults to 1.7 for both hands. The middle 59% of camera space now covers the screen. Increase toward 2.0 if reaching edges still takes too much hand movement; reduce toward 1.3 if movement feels too sensitive. Keep the whole hand visible. Tracking still hides a cursor when its hand is actually lost.

## Right-hand pickup
Keep Drawing hand set to Right (use Swap labels if the camera labels are reversed). Open your hand, aim the cursor over a pen, brush, marker, eraser, color swatch, tab, or other enabled button. A teal outline shows the current target. Pinch thumb and index finger to activate. Open your hand again, move onto the canvas, then pinch to draw. Holding a pinch does not repeatedly click buttons. File pickers and sliders still use their existing controls.

Left-hand button snapping remains left-only with its existing small capture radius and move-away release.

## Validation
23 automated tests passed, including reach mapping and existing snapping tests. TypeScript and Vite production build passed. Live webcam and visual behavior require testing on your hardware.
