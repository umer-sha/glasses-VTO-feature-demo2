import * as THREE from "three";

export interface LiveEnv {
  /** call once per rendered frame: it only does real work a couple of times per second */
  update(nowMs: number): void;
  dispose(): void;
}

/**
 * Real-time reflection map built from the user's own webcam.
 *
 * How it works: every ~450 ms the webcam frame is shrunk to a tiny image (shrinking = free blur),
 * averaged into a room colour and brightness, and painted into a 256x128 equirectangular canvas:
 *   - a vertical gradient (brighter "ceiling", darker "floor") tinted with the room colour,
 *   - the blurred webcam picture on both horizons (what the room looks like),
 *   - a soft box light on top whose strength follows the room brightness.
 * That canvas goes through PMREMGenerator and becomes scene.environment, so metal and lenses reflect
 * a room that matches the user's. Frames are blended over time, so the reflections never flicker.
 *
 * Honest limit: a selfie camera only sees the room BEHIND the user, not the room the glasses face,
 * so this is a convincing approximation of the lighting, not a true capture.
 */
export function createLiveEnvironment(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  video: HTMLVideoElement,
  opts: { intervalMs?: number } = {}
): LiveEnv {
  const interval = opts.intervalMs ?? 450;
  const W = 256, H = 128;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, W, H);

  const tiny = document.createElement("canvas");
  tiny.width = 24;
  tiny.height = 14;
  const tctx = tiny.getContext("2d", { willReadFrequently: true })!;

  const tex = new THREE.CanvasTexture(canvas);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;

  const pmrem = new THREE.PMREMGenerator(renderer);
  let target: THREE.WebGLRenderTarget | null = null;
  let last = -1e9;
  const avg = { r: 128, g: 128, b: 128 };

  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const css = (r: number, g: number, b: number) => `rgb(${clamp(r)},${clamp(g)},${clamp(b)})`;

  function update(now: number) {
    if (now - last < interval || video.readyState < 2 || !video.videoWidth) return;
    last = now;

    // 1. room colour + brightness from a tiny copy of the frame
    tctx.drawImage(video, 0, 0, tiny.width, tiny.height);
    const d = tctx.getImageData(0, 0, tiny.width, tiny.height).data;
    let r = 0, g = 0, b = 0;
    const n = d.length / 4;
    for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
    avg.r += 0.4 * (r / n - avg.r);
    avg.g += 0.4 * (g / n - avg.g);
    avg.b += 0.4 * (b / n - avg.b);
    const luma = (0.2126 * avg.r + 0.7152 * avg.g + 0.0722 * avg.b) / 255; // 0..1

    // 2. paint the equirectangular map, blended over the last one for smooth changes
    ctx.globalAlpha = 0.45;
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, css(avg.r * 1.55 + 25, avg.g * 1.55 + 25, avg.b * 1.55 + 25)); // ceiling
    grad.addColorStop(0.5, css(avg.r, avg.g, avg.b)); // horizon
    grad.addColorStop(1, css(avg.r * 0.45, avg.g * 0.42, avg.b * 0.4)); // floor
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.globalAlpha = 0.5;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(tiny, W * 0.12, H * 0.2, W * 0.26, H * 0.6); // behind the user  (-Z)
    ctx.drawImage(tiny, W * 0.62, H * 0.2, W * 0.26, H * 0.6); // in front          (+Z)

    // a soft window / ceiling light, stronger in bright rooms, gives frames a clean highlight
    ctx.globalAlpha = 0.5;
    const sx = W * 0.75, sy = H * 0.16;
    const soft = ctx.createRadialGradient(sx, sy, 0, sx, sy, H * 0.34);
    const lum = 200 + 55 * luma;
    soft.addColorStop(0, css(lum, lum, lum));
    soft.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = soft;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;

    // 3. turn it into a PBR reflection map and swap it in
    tex.needsUpdate = true;
    const next = pmrem.fromEquirectangular(tex);
    scene.environment = next.texture;
    target?.dispose();
    target = next;
    (scene as unknown as { environmentIntensity: number }).environmentIntensity = 0.55 + 0.7 * luma;
  }

  return {
    update,
    dispose() {
      target?.dispose();
      tex.dispose();
      pmrem.dispose();
    },
  };
}