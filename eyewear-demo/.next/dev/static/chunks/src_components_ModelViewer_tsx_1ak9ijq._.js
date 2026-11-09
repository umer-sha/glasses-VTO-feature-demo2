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
const HOLD_MS = 450; // how long to press before the model starts moving on touch screens
const MOVE_TOL = 10; // moving more than this before the hold finishes = the user is scrolling
const cache = new Map();
function load(url) {
    if (!cache.has(url)) {
        cache.set(url, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$loaders$2f$GLTFLoader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GLTFLoader"]().loadAsync(url).then((g)=>g.scene).catch((e)=>{
            cache.delete(url); // don't remember a failed download
            throw e;
        }));
    }
    return cache.get(url);
}
function ModelViewer({ product, color, autoRotate = true, className }) {
    _s();
    const wrap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const box = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const inView = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const [ever, setEver] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // has the box been near the screen yet?
    const [touch, setTouch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [armed, setArmed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ModelViewer.useEffect": ()=>{
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTouch(window.matchMedia("(pointer: coarse)").matches);
        }
    }["ModelViewer.useEffect"], []);
    // only start the 3D scene when the box is near the screen, and pause it when it scrolls away
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ModelViewer.useEffect": ()=>{
            const w = wrap.current;
            if (!w) return;
            const io = new IntersectionObserver({
                "ModelViewer.useEffect": ([e])=>{
                    inView.current = e.isIntersecting;
                    if (e.isIntersecting) setEver(true);
                }
            }["ModelViewer.useEffect"], {
                rootMargin: "150px"
            });
            io.observe(w);
            return ({
                "ModelViewer.useEffect": ()=>io.disconnect()
            })["ModelViewer.useEffect"];
        }
    }["ModelViewer.useEffect"], []);
    // build the scene once per product
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ModelViewer.useEffect": ()=>{
            const el = box.current;
            if (!el || !ever) return;
            let dead = false;
            let raf = 0;
            const coarse = window.matchMedia("(pointer: coarse)").matches;
            const renderer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WebGLRenderer"]({
                antialias: true,
                alpha: true
            });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 1.75));
            renderer.outputColorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
            renderer.toneMapping = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ACESFilmicToneMapping"];
            renderer.toneMappingExposure = 1.05;
            const canvas = renderer.domElement;
            el.appendChild(canvas);
            canvas.style.display = "block";
            const scene = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Scene"]();
            const pm = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["PMREMGenerator"](renderer);
            const env = pm.fromScene(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$environments$2f$RoomEnvironment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RoomEnvironment"](), 0.03).texture;
            pm.dispose();
            scene.environment = env;
            const key = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectionalLight"](0xffffff, 1.2);
            key.position.set(2, 3, 4);
            scene.add(key);
            // pivot the model sits on: touch "hold and drag" turns this directly
            const pivot = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
            scene.add(pivot);
            const spin = {
                y: 0,
                x: 0
            };
            const camera = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PerspectiveCamera"](30, 1, 0.01, 50);
            camera.position.set(0.25, 0.12, 2.6);
            const controls = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$controls$2f$OrbitControls$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrbitControls"](camera, canvas);
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
            const onDown = {
                "ModelViewer.useEffect.onDown": (e)=>{
                    if (e.pointerType === "mouse" || e.pointerType === "pen") {
                        controls.enabled = true; // trackpads / mice on hybrid devices rotate straight away
                        return;
                    }
                    pid = e.pointerId;
                    sx = lx = e.clientX;
                    sy = ly = e.clientY;
                    window.clearTimeout(timer);
                    timer = window.setTimeout({
                        "ModelViewer.useEffect.onDown": ()=>{
                            holding = true;
                            controls.autoRotate = false;
                            setArmed(true);
                            try {
                                navigator.vibrate?.(12);
                            } catch  {}
                        }
                    }["ModelViewer.useEffect.onDown"], HOLD_MS);
                }
            }["ModelViewer.useEffect.onDown"];
            const onMove = {
                "ModelViewer.useEffect.onMove": (e)=>{
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
                }
            }["ModelViewer.useEffect.onMove"];
            const onEnd = {
                "ModelViewer.useEffect.onEnd": (e)=>{
                    if (e.pointerId !== pid) return;
                    window.clearTimeout(timer);
                    pid = -1;
                    if (holding) {
                        holding = false;
                        swallowClickUntil = performance.now() + 400; // don't open the product link after a drag
                        controls.autoRotate = autoRotate;
                        setArmed(false);
                    }
                }
            }["ModelViewer.useEffect.onEnd"];
            // once the hold has finished, stop the page from scrolling under the finger
            const onTouchMove = {
                "ModelViewer.useEffect.onTouchMove": (e)=>{
                    if (holding && e.cancelable) e.preventDefault();
                }
            }["ModelViewer.useEffect.onTouchMove"];
            const onClick = {
                "ModelViewer.useEffect.onClick": (e)=>{
                    if (performance.now() < swallowClickUntil) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            }["ModelViewer.useEffect.onClick"];
            const onMenu = {
                "ModelViewer.useEffect.onMenu": (e)=>e.preventDefault()
            }["ModelViewer.useEffect.onMenu"]; // no "save image" menu after a long press
            canvas.addEventListener("pointerdown", onDown, true);
            canvas.addEventListener("pointermove", onMove);
            canvas.addEventListener("pointerup", onEnd);
            canvas.addEventListener("pointercancel", onEnd);
            canvas.addEventListener("touchmove", onTouchMove, {
                passive: false
            });
            canvas.addEventListener("contextmenu", onMenu);
            el.addEventListener("click", onClick, true);
            const fit = {
                "ModelViewer.useEffect.fit": ()=>{
                    const w = el.clientWidth || 300;
                    const h = el.clientHeight || 220;
                    renderer.setSize(w, h, false);
                    canvas.style.width = "100%";
                    canvas.style.height = "100%";
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
                    pivot.add(outer);
                    applyColor(color);
                }
            }["ModelViewer.useEffect"]).catch({
                "ModelViewer.useEffect": (err)=>console.error("Could not load model", product.model, err)
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
                    // nothing to draw while the box is off screen or the tab is hidden
                    if (!inView.current || document.hidden) return;
                    pivot.rotation.y += (spin.y - pivot.rotation.y) * 0.2;
                    pivot.rotation.x += (spin.x - pivot.rotation.x) * 0.2;
                    controls.update();
                    renderer.render(scene, camera);
                }
            }["ModelViewer.useEffect.tick"];
            tick();
            return ({
                "ModelViewer.useEffect": ()=>{
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
                }
            })["ModelViewer.useEffect"];
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["ModelViewer.useEffect"], [
        product,
        autoRotate,
        ever
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
        ref: wrap,
        className: `relative select-none ${className ?? "h-full w-full"}`,
        style: {
            WebkitTouchCallout: "none"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: box,
                className: "h-full w-full"
            }, void 0, false, {
                fileName: "[project]/src/components/ModelViewer.tsx",
                lineNumber: 294,
                columnNumber: 7
            }, this),
            armed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none absolute inset-0 rounded-[inherit] ring-2 ring-inset ring-accent"
            }, void 0, false, {
                fileName: "[project]/src/components/ModelViewer.tsx",
                lineNumber: 295,
                columnNumber: 17
            }, this),
            touch && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "pointer-events-none absolute bottom-3 start-3 rounded-lg bg-bg/85 px-3 py-1 text-[11px] font-medium text-muted backdrop-blur",
                children: armed ? "Rotating · release to scroll" : "Hold to rotate"
            }, void 0, false, {
                fileName: "[project]/src/components/ModelViewer.tsx",
                lineNumber: 297,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ModelViewer.tsx",
        lineNumber: 289,
        columnNumber: 5
    }, this);
}
_s(ModelViewer, "X7NNU0HOLb7R/YIpU6084ok7dJw=");
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