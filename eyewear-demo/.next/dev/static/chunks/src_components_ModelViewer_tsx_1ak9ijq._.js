(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/ModelViewer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ModelViewer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.module.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$loaders$2f$GLTFLoader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/loaders/GLTFLoader.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$controls$2f$OrbitControls$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/controls/OrbitControls.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$environments$2f$RoomEnvironment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/environments/RoomEnvironment.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const METAL = /gold|silver|rose|copper|bronze|gunmetal|chrome|steel|brass|metal/i;
const cache = new Map();
function load(url) {
    if (!cache.has(url)) cache.set(url, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$loaders$2f$GLTFLoader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GLTFLoader"]().loadAsync(url).then((g)=>g.scene));
    return cache.get(url);
}
function ModelViewer({ product, color, autoRotate = true, className }) {
    _s();
    const box = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // build the scene once per product
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ModelViewer.useEffect": ()=>{
            const el = box.current;
            if (!el) return;
            let dead = false;
            let raf = 0;
            const renderer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WebGLRenderer"]({
                antialias: true,
                alpha: true
            });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            renderer.outputColorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
            renderer.toneMapping = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ACESFilmicToneMapping"];
            renderer.toneMappingExposure = 1.05;
            el.appendChild(renderer.domElement);
            renderer.domElement.style.display = "block";
            const scene = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Scene"]();
            const pm = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["PMREMGenerator"](renderer);
            const env = pm.fromScene(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$environments$2f$RoomEnvironment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RoomEnvironment"](), 0.03).texture;
            pm.dispose();
            scene.environment = env;
            const key = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectionalLight"](0xffffff, 1.2);
            key.position.set(2, 3, 4);
            scene.add(key);
            const camera = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PerspectiveCamera"](30, 1, 0.01, 50);
            camera.position.set(0.25, 0.12, 2.6);
            const controls = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$controls$2f$OrbitControls$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrbitControls"](camera, renderer.domElement);
            controls.enableDamping = true;
            controls.enablePan = false;
            controls.enableZoom = false;
            controls.autoRotate = autoRotate;
            controls.autoRotateSpeed = 1.6;
            controls.minPolarAngle = Math.PI * 0.3;
            controls.maxPolarAngle = Math.PI * 0.7;
            const fit = {
                "ModelViewer.useEffect.fit": ()=>{
                    const w = el.clientWidth || 300;
                    const h = el.clientHeight || 220;
                    renderer.setSize(w, h, false);
                    renderer.domElement.style.width = "100%";
                    renderer.domElement.style.height = "100%";
                    camera.aspect = w / h;
                    camera.updateProjectionMatrix();
                }
            }["ModelViewer.useEffect.fit"];
            fit();
            const ro = new ResizeObserver(fit);
            ro.observe(el);
            const recolorable = [];
            load(product.model).then({
                "ModelViewer.useEffect": (src)=>{
                    if (dead) return;
                    const model = src.clone(true);
                    model.traverse({
                        "ModelViewer.useEffect": (o)=>{
                            const mesh = o;
                            if (!mesh.isMesh) return;
                            const fix = {
                                "ModelViewer.useEffect.fix": (mat)=>{
                                    const m = mat.clone();
                                    if (product.hide?.includes(m.name)) m.visible = false;
                                    const name = m.name;
                                    if (product.recolor?.includes(name)) {
                                        recolorable.push({
                                            m,
                                            color: m.color.clone(),
                                            map: m.map,
                                            metal: m.metalness,
                                            rough: m.roughness
                                        });
                                    }
                                    return m;
                                }
                            }["ModelViewer.useEffect.fix"];
                            mesh.material = Array.isArray(mesh.material) ? mesh.material.map(fix) : fix(mesh.material);
                        }
                    }["ModelViewer.useEffect"]);
                    const holder = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
                    holder.rotation.y = product.turn ?? 0;
                    holder.add(model);
                    const outer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
                    outer.add(holder);
                    outer.updateMatrixWorld(true);
                    const b = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Box3"]().setFromObject(outer);
                    const size = b.getSize(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]());
                    const c = b.getCenter(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]());
                    holder.position.sub(c);
                    // frame width (x) fills about 1.5 units, the arms may stick out behind it
                    outer.scale.setScalar(1.5 / Math.max(size.x, size.z * 0.9));
                    outer.rotation.y = 0.5;
                    scene.add(outer);
                    applyColor(color);
                }
            }["ModelViewer.useEffect"]);
            function applyColor(c) {
                for (const r of recolorable){
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
            api.current = {
                recolor: applyColor
            };
            const tick = {
                "ModelViewer.useEffect.tick": ()=>{
                    raf = requestAnimationFrame(tick);
                    controls.update();
                    renderer.render(scene, camera);
                }
            }["ModelViewer.useEffect.tick"];
            tick();
            return ({
                "ModelViewer.useEffect": ()=>{
                    dead = true;
                    api.current = null;
                    cancelAnimationFrame(raf);
                    ro.disconnect();
                    controls.dispose();
                    env.dispose();
                    renderer.dispose();
                    renderer.domElement.remove();
                }
            })["ModelViewer.useEffect"];
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["ModelViewer.useEffect"], [
        product,
        autoRotate
    ]);
    // colour changes only touch the materials
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ModelViewer.useEffect": ()=>{
            api.current?.recolor(color);
        }
    }["ModelViewer.useEffect"], [
        color
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: box,
        className: className ?? "h-full w-full"
    }, void 0, false, {
        fileName: "[project]/src/components/ModelViewer.tsx",
        lineNumber: 157,
        columnNumber: 10
    }, this);
}
_s(ModelViewer, "SaOHYUra8I7JGFOb0+Bzok0n0Jc=");
_c = ModelViewer;
var _c;
__turbopack_context__.k.register(_c, "ModelViewer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ModelViewer.tsx [app-client] (ecmascript, next/dynamic entry)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/ModelViewer.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_components_ModelViewer_tsx_1ak9ijq._.js.map