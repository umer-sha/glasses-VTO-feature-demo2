"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { Glasses } from "@/lib/glasses";

const METAL = /gold|silver|rose|copper|bronze|gunmetal|chrome|steel|brass|metal/i;
const HOLD_MS = 450; // how long to press before the model starts moving on touch screens
const MOVE_TOL = 10; // moving more than this before the hold finishes = the user is scrolling
const cache = new Map<string, Promise<THREE.Group>>();
function load(url: string) {
  if (!cache.has(url)) {
    cache.set(
      url,
      new GLTFLoader()
        .loadAsync(url)
        .then((g) => g.scene)
        .catch((e) => {
          cache.delete(url); // don't remember a failed download
          throw e;
        }),
    );
  }
  return cache.get(url)!;
}

interface Props {
  product: Glasses;
  color?: { name: string; hex: string; original?: boolean } | null; // null / original = keep the model's own colours
  autoRotate?: boolean;
  className?: string;
}

/** Spinning 3D preview of one frame. Mouse: drag. Touch: press and hold, then drag (so the page can still scroll). */
export default function ModelViewer({ product, color, autoRotate = true, className }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const api = useRef<{ recolor: (c: Props["color"]) => void } | null>(null);
  const inView = useRef(false);
  const [ever, setEver] = useState(false); // has the box been near the screen yet?
  const [touch, setTouch] = useState(false);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  // only start the 3D scene when the box is near the screen, and pause it when it scrolls away
  useEffect(() => {
    const w = wrap.current;
    if (!w) return;
    const io = new IntersectionObserver(
      ([e]) => {
        inView.current = e.isIntersecting;
        if (e.isIntersecting) setEver(true);
      },
      { rootMargin: "150px" },
    );
    io.observe(w);
    return () => io.disconnect();
  }, []);

  // build the scene once per product
  useEffect(() => {
    const el = box.current;
    if (!el || !ever) return;
    let dead = false;
    let raf = 0;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    const canvas = renderer.domElement;
    el.appendChild(canvas);
    canvas.style.display = "block";

    const scene = new THREE.Scene();
    const pm = new THREE.PMREMGenerator(renderer);
    const env = pm.fromScene(new RoomEnvironment(), 0.03).texture;
    pm.dispose();
    scene.environment = env;
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(2, 3, 4);
    scene.add(key);

    // pivot the model sits on: touch "hold and drag" turns this directly
    const pivot = new THREE.Group();
    scene.add(pivot);
    const spin = { y: 0, x: 0 };

    const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 50);
    camera.position.set(0.25, 0.12, 2.6);
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.6;
    controls.minPolarAngle = Math.PI * 0.3;
    controls.maxPolarAngle = Math.PI * 0.7;
    // OrbitControls blocks all touch scrolling by default: give scrolling back, and on touch screens
    // only allow rotating after a press-and-hold
    canvas.style.touchAction = "auto";
    controls.enabled = !coarse;

    // ----- press and hold (touch) -----
    let timer = 0;
    let pid = -1;
    let sx = 0, sy = 0, lx = 0, ly = 0;
    let holding = false;
    let swallowClickUntil = 0;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" || e.pointerType === "pen") {
        controls.enabled = true; // trackpads / mice on hybrid devices rotate straight away
        return;
      }
      pid = e.pointerId;
      sx = lx = e.clientX;
      sy = ly = e.clientY;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        holding = true;
        controls.autoRotate = false;
        setArmed(true);
        try { navigator.vibrate?.(12); } catch { /* not supported */ }
      }, HOLD_MS);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== pid) return;
      if (!holding) {
        if (Math.hypot(e.clientX - sx, e.clientY - sy) > MOVE_TOL) window.clearTimeout(timer); // it's a scroll
        lx = e.clientX;
        ly = e.clientY;
        return;
      }
      spin.y += (e.clientX - lx) * 0.012;
      spin.x = Math.max(-0.5, Math.min(0.5, spin.x + (e.clientY - ly) * 0.006));
      lx = e.clientX;
      ly = e.clientY;
    };
    const onEnd = (e: PointerEvent) => {
      if (e.pointerId !== pid) return;
      window.clearTimeout(timer);
      pid = -1;
      if (holding) {
        holding = false;
        swallowClickUntil = performance.now() + 400; // don't open the product link after a drag
        controls.autoRotate = autoRotate;
        setArmed(false);
      }
    };
    // once the hold has finished, stop the page from scrolling under the finger
    const onTouchMove = (e: TouchEvent) => {
      if (holding && e.cancelable) e.preventDefault();
    };
    const onClick = (e: MouseEvent) => {
      if (performance.now() < swallowClickUntil) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const onMenu = (e: Event) => e.preventDefault(); // no "save image" menu after a long press

    canvas.addEventListener("pointerdown", onDown, true);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onEnd);
    canvas.addEventListener("pointercancel", onEnd);
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("contextmenu", onMenu);
    el.addEventListener("click", onClick, true);

    const fit = () => {
      const w = el.clientWidth || 300;
      const h = el.clientHeight || 220;
      renderer.setSize(w, h, false);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);

    const recolorable: { m: THREE.MeshStandardMaterial; color: THREE.Color; map: THREE.Texture | null; metal: number; rough: number }[] = [];

    load(product.model)
      .then((src) => {
        if (dead) return;
        const model = src.clone(true);
        model.traverse((o) => {
          const mesh = o as THREE.Mesh;
          if (!mesh.isMesh) return;
          const fix = (mat: THREE.Material) => {
            const m = mat.clone() as THREE.MeshStandardMaterial;
            if (product.hide?.includes(m.name)) m.visible = false;
            const name = m.name;
            if (product.recolor?.includes(name)) {
              recolorable.push({ m, color: m.color.clone(), map: m.map, metal: m.metalness, rough: m.roughness });
            }
            return m;
          };
          mesh.material = Array.isArray(mesh.material) ? mesh.material.map(fix) : fix(mesh.material);
        });
        const holder = new THREE.Group();
        holder.rotation.y = product.turn ?? 0;
        holder.add(model);
        const outer = new THREE.Group();
        outer.add(holder);
        outer.updateMatrixWorld(true);
        const b = new THREE.Box3().setFromObject(outer);
        const size = b.getSize(new THREE.Vector3());
        const c = b.getCenter(new THREE.Vector3());
        holder.position.sub(c);
        // frame width (x) fills about 1.5 units, the arms may stick out behind it
        outer.scale.setScalar(1.5 / Math.max(size.x, size.z * 0.9));
        outer.rotation.y = 0.5;
        pivot.add(outer);
        applyColor(color);
      })
      .catch((err) => console.error("Could not load model", product.model, err));

    function applyColor(c: Props["color"]) {
      for (const r of recolorable) {
        if (!c || c.original) {
          r.m.map = r.map;
          r.m.color.copy(r.color);
          r.m.metalness = r.metal;
          r.m.roughness = r.rough;
        } else {
          r.m.map = null;
          r.m.color.set(c.hex);
          const metal = METAL.test(c.name);
          r.m.metalness = metal ? 0.95 : 0.05;
          r.m.roughness = metal ? 0.28 : 0.35;
        }
        r.m.needsUpdate = true;
      }
    }
    api.current = { recolor: applyColor };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      // nothing to draw while the box is off screen or the tab is hidden
      if (!inView.current || document.hidden) return;
      pivot.rotation.y += (spin.y - pivot.rotation.y) * 0.2;
      pivot.rotation.x += (spin.x - pivot.rotation.x) * 0.2;
      controls.update();
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      dead = true;
      api.current = null;
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", onDown, true);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onEnd);
      canvas.removeEventListener("pointercancel", onEnd);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("contextmenu", onMenu);
      el.removeEventListener("click", onClick, true);
      ro.disconnect();
      controls.dispose();
      env.dispose();
      renderer.dispose();
      renderer.forceContextLoss(); // really frees the GPU context (browsers only allow a handful)
      canvas.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, autoRotate, ever]);

  // colour changes only touch the materials
  useEffect(() => {
    api.current?.recolor(color);
  }, [color]);

  return (
    <div
      ref={wrap}
      className={`relative select-none ${className ?? "h-full w-full"}`}
      style={{ WebkitTouchCallout: "none" } as React.CSSProperties}
    >
      <div ref={box} className="h-full w-full" />
      {armed && <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-2 ring-inset ring-accent" />}
      {touch && (
        <span className="pointer-events-none absolute bottom-3 start-3 rounded-lg bg-bg/85 px-3 py-1 text-[11px] font-medium text-muted backdrop-blur">
          {armed ? "Rotating · release to scroll" : "Hold to rotate"}
        </span>
      )}
    </div>
  );
}