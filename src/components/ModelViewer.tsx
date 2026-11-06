"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { Glasses } from "@/lib/glasses";

const METAL = /gold|silver|rose|copper|bronze|gunmetal|chrome|steel|brass|metal/i;
const cache = new Map<string, Promise<THREE.Group>>();
function load(url: string) {
  if (!cache.has(url)) cache.set(url, new GLTFLoader().loadAsync(url).then((g) => g.scene));
  return cache.get(url)!;
}

interface Props {
  product: Glasses;
  color?: { name: string; hex: string; original?: boolean } | null; // null / original = keep the model's own colours
  autoRotate?: boolean;
  className?: string;
}

/** Spinning 3D preview of one frame. Used on the home page cards and the product page. */
export default function ModelViewer({ product, color, autoRotate = true, className }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const api = useRef<{ recolor: (c: Props["color"]) => void } | null>(null);

  // build the scene once per product
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let dead = false;
    let raf = 0;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    const pm = new THREE.PMREMGenerator(renderer);
    const env = pm.fromScene(new RoomEnvironment(), 0.03).texture;
    pm.dispose();
    scene.environment = env;
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(2, 3, 4);
    scene.add(key);

    const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 50);
    camera.position.set(0.25, 0.12, 2.6);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.6;
    controls.minPolarAngle = Math.PI * 0.3;
    controls.maxPolarAngle = Math.PI * 0.7;

    const fit = () => {
      const w = el.clientWidth || 300;
      const h = el.clientHeight || 220;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);

    const recolorable: { m: THREE.MeshStandardMaterial; color: THREE.Color; map: THREE.Texture | null; metal: number; rough: number }[] = [];

    load(product.model).then((src) => {
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
      scene.add(outer);
      applyColor(color);
    });

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
      controls.update();
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      dead = true;
      api.current = null;
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      env.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, autoRotate]);

  // colour changes only touch the materials
  useEffect(() => {
    api.current?.recolor(color);
  }, [color]);

  return <div ref={box} className={className ?? "h-full w-full"} />;
}
