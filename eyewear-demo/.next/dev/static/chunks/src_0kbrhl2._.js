(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/TryOnView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TryOnView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mediapipe$2f$tasks$2d$vision$2f$vision_bundle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mediapipe/tasks-vision/vision_bundle.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$arScene$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/arScene.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Providers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Providers.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
// Hides the harmless "XNNPACK delegate" info line Chrome shows as an "issue"
if (("TURBOPACK compile-time value", "object") !== "undefined" && !window.__xnn) {
    window.__xnn = true;
    const originalError = console.error;
    console.error = (...args)=>{
        if (typeof args[0] === "string" && args[0].includes("XNNPACK")) return;
        originalError(...args);
    };
}
;
;
;
;
;
const WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";
const MODEL_URL = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";
// =============================== face shape + skin tone ===============================
const AVG = {
    length: 1.153,
    forehead: 0.819,
    jaw: 0.775
};
const med = (xs)=>{
    const s = [
        ...xs
    ].sort((a, b)=>a - b);
    const n = s.length;
    return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
};
const dist = (p, q, W, H)=>Math.hypot((p.x - q.x) * W, (p.y - q.y) * H);
function measure(lm, W, H) {
    const cheek = dist(lm[234], lm[454], W, H);
    const len = dist(lm[10], lm[152], W, H);
    return {
        length: len / cheek / AVG.length,
        forehead: dist(lm[54], lm[284], W, H) / cheek / AVG.forehead,
        jaw: dist(lm[172], lm[397], W, H) / cheek / AVG.jaw,
        mouthOpen: dist(lm[13], lm[14], W, H) / len
    };
}
function classify({ length: L, forehead: F, jaw: J }) {
    if (L >= 1.1) return "Oblong";
    if (L <= 0.95) return J >= 1.04 ? "Square" : "Round";
    if (F < 0.94 && J < 0.94) return "Diamond";
    if (F - J >= 0.1 && F >= 0.96) return "Heart";
    if (J >= 1.05 && F >= 0.96) return "Square";
    return "Oval";
}
const lin = (c)=>(c /= 255) <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
function toLab(r, g, b) {
    const R = lin(r), G = lin(g), B = lin(b);
    const X = (0.4124 * R + 0.3576 * G + 0.1805 * B) / 0.95047;
    const Y = 0.2126 * R + 0.7152 * G + 0.0722 * B;
    const Z = (0.0193 * R + 0.1192 * G + 0.9505 * B) / 1.08883;
    const f = (t)=>t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
    return [
        116 * f(Y) - 16,
        500 * (f(X) - f(Y)),
        200 * (f(Y) - f(Z))
    ];
}
function skinLabel(rgb) {
    const labs = rgb.map(([r, g, b])=>toLab(r, g, b));
    const L = med(labs.map((x)=>x[0]));
    const hue = Math.atan2(med(labs.map((x)=>x[2])), med(labs.map((x)=>x[1]))) * 180 / Math.PI;
    const depth = L >= 70 ? "Fair" : L >= 60 ? "Light" : L >= 50 ? "Medium" : L >= 40 ? "Tan" : "Deep";
    const under = hue >= 58 ? "warm" : hue <= 49 ? "cool" : "neutral";
    return `${depth}, ${under} undertone`;
}
function skinPatches(video, lm, c) {
    const W = video.videoWidth, H = video.videoHeight;
    const side = Math.max(6, dist(lm[234], lm[454], W, H) * 0.07);
    c.width = 8;
    c.height = 8;
    const ctx = c.getContext("2d", {
        willReadFrequently: true
    });
    const out = [];
    if (!ctx) return out;
    for (const i of [
        50,
        280,
        205,
        425,
        151
    ]){
        const sx = Math.min(Math.max(0, lm[i].x * W - side / 2), W - side);
        const sy = Math.min(Math.max(0, lm[i].y * H - side / 2), H - side);
        ctx.drawImage(video, sx, sy, side, side, 0, 0, 8, 8);
        const d = ctx.getImageData(0, 0, 8, 8).data;
        const r = [], g = [], b = [];
        for(let p = 0; p < d.length; p += 4){
            r.push(d[p]);
            g.push(d[p + 1]);
            b.push(d[p + 2]);
        }
        out.push([
            med(r),
            med(g),
            med(b)
        ]);
    }
    return out;
}
const FIT_DEFAULTS = {
    width: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$arScene$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TUNE"].width,
    y: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$arScene$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TUNE"].y,
    z: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$arScene$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TUNE"].z,
    pitch: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$arScene$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TUNE"].pitch,
    lensOpacity: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$arScene$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TUNE"].lensOpacity
};
const FIT_SLIDERS = [
    {
        key: "width",
        label: "Size",
        min: 11,
        max: 17,
        step: 0.1
    },
    {
        key: "y",
        label: "Up / down",
        min: 0,
        max: 5,
        step: 0.05
    },
    {
        key: "z",
        label: "Closer / further",
        min: 2,
        max: 8,
        step: 0.05
    },
    {
        key: "pitch",
        label: "Tilt",
        min: -0.3,
        max: 0.3,
        step: 0.01
    },
    {
        key: "lensOpacity",
        label: "Lens tint",
        min: 0,
        max: 0.8,
        step: 0.01
    }
];
function TryOnView({ product, color, productKey, currentColorName, onFaceScanned, onStarted }) {
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Providers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrefs"])();
    const boxRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const videoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const hudCanvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const sceneRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const landmarkerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const streamRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const stopRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const roRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("idle");
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [aspect, setAspect] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(4 / 3);
    const [faceMetrics, setFaceMetrics] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [scan, setScan] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [fitOpen, setFitOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [fit, setFit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(FIT_DEFAULTS);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TryOnView.useEffect": ()=>{
            try {
                const s = window.localStorage.getItem("lumiere-fit-v2");
                if (s) {
                    const o = JSON.parse(s);
                    Object.assign(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$arScene$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TUNE"], o);
                    setFit({
                        "TryOnView.useEffect": (f)=>({
                                ...f,
                                ...o
                            })
                    }["TryOnView.useEffect"]);
                }
            } catch  {}
        }
    }["TryOnView.useEffect"], []);
    function setFitValue(k, v) {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$arScene$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TUNE"][k] = v;
        setFit((f)=>{
            const n = {
                ...f,
                [k]: v
            };
            try {
                window.localStorage.setItem("lumiere-fit-v2", JSON.stringify(n));
            } catch  {}
            return n;
        });
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TryOnView.useEffect": ()=>{
            sceneRef.current?.setProduct(product, color, currentColorName);
        }
    }["TryOnView.useEffect"], [
        productKey,
        status
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TryOnView.useEffect": ()=>{
            sceneRef.current?.setColor(color, currentColorName);
        }
    }["TryOnView.useEffect"], [
        color,
        currentColorName
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TryOnView.useEffect": ()=>{
            return ({
                "TryOnView.useEffect": ()=>{
                    stopRef.current = true;
                    roRef.current?.disconnect();
                    streamRef.current?.getTracks().forEach({
                        "TryOnView.useEffect": (t)=>t.stop()
                    }["TryOnView.useEffect"]);
                    landmarkerRef.current?.close();
                    sceneRef.current?.dispose();
                    sceneRef.current = null;
                }
            })["TryOnView.useEffect"];
        }
    }["TryOnView.useEffect"], []);
    async function start() {
        setStatus("loading");
        setMessage("");
        stopRef.current = false;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user",
                    width: {
                        ideal: 1280
                    },
                    height: {
                        ideal: 720
                    }
                },
                audio: false
            });
            streamRef.current = stream;
            const video = videoRef.current;
            video.srcObject = stream;
            await video.play();
            const vw = video.videoWidth, vh = video.videoHeight;
            setAspect(vw / vh);
            if (hudCanvasRef.current) {
                hudCanvasRef.current.width = vw;
                hudCanvasRef.current.height = vh;
            }
            const fileset = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mediapipe$2f$tasks$2d$vision$2f$vision_bundle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FilesetResolver"].forVisionTasks(WASM_URL);
            const make = (delegate)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mediapipe$2f$tasks$2d$vision$2f$vision_bundle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaceLandmarker"].createFromOptions(fileset, {
                    baseOptions: {
                        modelAssetPath: MODEL_URL,
                        delegate
                    },
                    runningMode: "VIDEO",
                    numFaces: 1,
                    outputFacialTransformationMatrixes: true
                });
            try {
                landmarkerRef.current = await make("GPU");
            } catch  {
                landmarkerRef.current = await make("CPU");
            }
            const scene = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$arScene$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ARScene"](canvasRef.current);
            sceneRef.current = scene;
            const fitScene = ()=>{
                const b = boxRef.current;
                scene.resize(b.clientWidth, b.clientHeight);
            };
            await new Promise((r)=>requestAnimationFrame(r));
            fitScene();
            roRef.current = new ResizeObserver(fitScene);
            roRef.current.observe(boxRef.current);
            setStatus("running");
            onStarted?.();
            runLoop(video, landmarkerRef.current, scene);
        } catch (e) {
            setStatus("error");
            setMessage("Couldn't start the camera or face tracking.");
            console.error(e);
        }
    }
    // Draw the face wireframe, aligned with the mirrored video
    const drawFaceMeshHUD = (lm, time)=>{
        const canvas = hudCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!lm || lm.length === 0) return;
        const W = canvas.width;
        const H = canvas.height;
        const pulse = 0.7 + Math.sin(time * 0.006) * 0.25;
        ctx.strokeStyle = `rgba(255, 255, 255, ${pulse})`;
        ctx.fillStyle = `rgba(255, 255, 255, ${pulse})`;
        ctx.lineWidth = 1.25;
        const meshLinks = [
            [
                10,
                338
            ],
            [
                338,
                297
            ],
            [
                297,
                332
            ],
            [
                332,
                284
            ],
            [
                284,
                251
            ],
            [
                251,
                389
            ],
            [
                389,
                356
            ],
            [
                356,
                454
            ],
            [
                454,
                323
            ],
            [
                323,
                361
            ],
            [
                361,
                288
            ],
            [
                288,
                397
            ],
            [
                397,
                365
            ],
            [
                365,
                379
            ],
            [
                379,
                378
            ],
            [
                378,
                400
            ],
            [
                400,
                377
            ],
            [
                377,
                152
            ],
            [
                10,
                109
            ],
            [
                109,
                67
            ],
            [
                67,
                103
            ],
            [
                103,
                54
            ],
            [
                54,
                21
            ],
            [
                21,
                162
            ],
            [
                162,
                127
            ],
            [
                127,
                234
            ],
            [
                234,
                93
            ],
            [
                93,
                132
            ],
            [
                132,
                58
            ],
            [
                58,
                172
            ],
            [
                172,
                136
            ],
            [
                136,
                150
            ],
            [
                150,
                149
            ],
            [
                149,
                176
            ],
            [
                176,
                148
            ],
            [
                148,
                152
            ],
            [
                1,
                4
            ],
            [
                4,
                5
            ],
            [
                5,
                195
            ],
            [
                195,
                197
            ],
            [
                197,
                6
            ],
            [
                6,
                168
            ],
            [
                168,
                8
            ],
            [
                8,
                9
            ],
            [
                9,
                10
            ],
            [
                152,
                148
            ],
            [
                33,
                246
            ],
            [
                246,
                161
            ],
            [
                161,
                160
            ],
            [
                160,
                159
            ],
            [
                159,
                158
            ],
            [
                158,
                133
            ],
            [
                133,
                173
            ],
            [
                173,
                157
            ],
            [
                157,
                158
            ],
            [
                133,
                7
            ],
            [
                7,
                163
            ],
            [
                163,
                144
            ],
            [
                144,
                145
            ],
            [
                145,
                153
            ],
            [
                153,
                154
            ],
            [
                154,
                155
            ],
            [
                155,
                133
            ],
            [
                33,
                7
            ],
            [
                70,
                63
            ],
            [
                63,
                105
            ],
            [
                105,
                66
            ],
            [
                66,
                107
            ],
            [
                107,
                55
            ],
            [
                55,
                65
            ],
            [
                52,
                53
            ],
            [
                46,
                53
            ],
            [
                70,
                55
            ],
            [
                263,
                466
            ],
            [
                466,
                388
            ],
            [
                388,
                387
            ],
            [
                387,
                386
            ],
            [
                386,
                385
            ],
            [
                385,
                362
            ],
            [
                362,
                398
            ],
            [
                398,
                384
            ],
            [
                384,
                385
            ],
            [
                362,
                249
            ],
            [
                249,
                390
            ],
            [
                390,
                373
            ],
            [
                373,
                374
            ],
            [
                374,
                380
            ],
            [
                380,
                381
            ],
            [
                381,
                382
            ],
            [
                382,
                362
            ],
            [
                263,
                249
            ],
            [
                300,
                293
            ],
            [
                293,
                334
            ],
            [
                334,
                296
            ],
            [
                296,
                336
            ],
            [
                336,
                285
            ],
            [
                285,
                295
            ],
            [
                282,
                283
            ],
            [
                276,
                283
            ],
            [
                300,
                285
            ],
            [
                168,
                6
            ],
            [
                6,
                197
            ],
            [
                197,
                195
            ],
            [
                195,
                5
            ],
            [
                5,
                4
            ],
            [
                4,
                1
            ],
            [
                1,
                2
            ],
            [
                2,
                98
            ],
            [
                98,
                327
            ],
            [
                2,
                326
            ],
            [
                326,
                327
            ],
            [
                2,
                94
            ],
            [
                94,
                371
            ],
            [
                371,
                327
            ],
            [
                94,
                141
            ],
            [
                141,
                98
            ],
            [
                61,
                185
            ],
            [
                185,
                40
            ],
            [
                40,
                39
            ],
            [
                39,
                37
            ],
            [
                37,
                0
            ],
            [
                0,
                267
            ],
            [
                267,
                269
            ],
            [
                269,
                270
            ],
            [
                270,
                409
            ],
            [
                409,
                291
            ],
            [
                61,
                146
            ],
            [
                146,
                91
            ],
            [
                91,
                181
            ],
            [
                181,
                84
            ],
            [
                84,
                17
            ],
            [
                17,
                314
            ],
            [
                314,
                405
            ],
            [
                405,
                321
            ],
            [
                321,
                375
            ],
            [
                375,
                291
            ],
            [
                78,
                95
            ],
            [
                95,
                88
            ],
            [
                88,
                178
            ],
            [
                178,
                87
            ],
            [
                87,
                14
            ],
            [
                14,
                317
            ],
            [
                317,
                402
            ],
            [
                402,
                318
            ],
            [
                318,
                324
            ],
            [
                324,
                308
            ],
            [
                308,
                415
            ],
            [
                415,
                310
            ],
            [
                310,
                311
            ],
            [
                311,
                312
            ],
            [
                312,
                13
            ],
            [
                13,
                82
            ],
            [
                82,
                81
            ],
            [
                81,
                42
            ],
            [
                42,
                183
            ],
            [
                183,
                78
            ],
            [
                234,
                127
            ],
            [
                127,
                162
            ],
            [
                162,
                21
            ],
            [
                21,
                54
            ],
            [
                54,
                103
            ],
            [
                103,
                67
            ],
            [
                67,
                109
            ],
            [
                454,
                356
            ],
            [
                356,
                389
            ],
            [
                389,
                251
            ],
            [
                251,
                284
            ],
            [
                284,
                332
            ],
            [
                332,
                297
            ],
            [
                297,
                338
            ],
            [
                234,
                93
            ],
            [
                93,
                58
            ],
            [
                58,
                132
            ],
            [
                132,
                150
            ],
            [
                454,
                323
            ],
            [
                323,
                288
            ],
            [
                288,
                361
            ],
            [
                361,
                379
            ]
        ];
        meshLinks.forEach(([i, j])=>{
            const p1 = lm[i];
            const p2 = lm[j];
            if (p1 && p2) {
                ctx.beginPath();
                ctx.moveTo(p1.x * W, p1.y * H);
                ctx.lineTo(p2.x * W, p2.y * H);
                ctx.stroke();
            }
        });
        const nodes = [
            10,
            152,
            234,
            454,
            1,
            4,
            33,
            263,
            61,
            291,
            199,
            168,
            109,
            338,
            58,
            288,
            6,
            168,
            0,
            17
        ];
        nodes.forEach((idx)=>{
            const pt = lm[idx];
            if (pt) {
                ctx.beginPath();
                ctx.arc(pt.x * W, pt.y * H, 2.2, 0, 2 * Math.PI);
                ctx.fill();
            }
        });
    };
    function runLoop(video, landmarker, scene) {
        const m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Matrix4"]();
        const scratch = document.createElement("canvas");
        const samples = [];
        const skin = [];
        let scanned = false;
        let frame = 0;
        let luma = 0.5;
        let lastTime = -1;
        const onFrame = (time)=>{
            if (stopRef.current) return;
            schedule();
            if (video.readyState < 2 || video.currentTime === lastTime) return;
            lastTime = video.currentTime;
            const now = performance.now();
            const res = landmarker.detectForVideo(video, now);
            const lm = res.faceLandmarks?.[0];
            const mat = res.facialTransformationMatrixes?.[0];
            if (!lm || !mat) {
                scene.setPose(null, now / 1000);
                scene.render();
                return;
            }
            m.fromArray(mat.data);
            if (Math.abs(mat.data[3]) + Math.abs(mat.data[7]) + Math.abs(mat.data[11]) > 0.01) m.transpose();
            scene.setPose(m, now / 1000);
            scene.render();
            frame++;
            if (!scanned) {
                drawFaceMeshHUD(lm, time);
            } else {
                const canvas = hudCanvasRef.current;
                if (canvas) {
                    const ctx = canvas.getContext("2d");
                    ctx?.clearRect(0, 0, canvas.width, canvas.height);
                }
            }
            if (frame % 12 === 0) {
                const p = skinPatches(video, lm, scratch);
                if (p.length) {
                    const r = p.reduce((a, x)=>a + x[0], 0) / p.length;
                    const g = p.reduce((a, x)=>a + x[1], 0) / p.length;
                    const b = p.reduce((a, x)=>a + x[2], 0) / p.length;
                    luma += 0.3 * ((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 - luma);
                    scene.setLight(luma, [
                        r,
                        g,
                        b
                    ]);
                }
            }
            const e = m.elements;
            const n = Math.hypot(e[8], e[9], e[10]) || 1;
            const yaw = Math.atan2(e[8] / n, e[10] / n) * 180 / Math.PI;
            const pitch = Math.asin(e[9] / n) * 180 / Math.PI;
            const q = measure(lm, video.videoWidth, video.videoHeight);
            if (scanned || Math.abs(yaw) > 12 || Math.abs(pitch) > 14 || q.mouthOpen > 0.045) return;
            samples.push({
                length: q.length,
                forehead: q.forehead,
                jaw: q.jaw
            });
            if (samples.length % 3 === 0) skin.push(...skinPatches(video, lm, scratch));
            setScan(Math.min(1, samples.length / 25));
            if (samples.length >= 25 && skin.length >= 8) {
                scanned = true;
                const metrics = {
                    shape: classify({
                        length: med(samples.map((s)=>s.length)),
                        forehead: med(samples.map((s)=>s.forehead)),
                        jaw: med(samples.map((s)=>s.jaw))
                    }),
                    skinTone: skinLabel(skin)
                };
                setFaceMetrics(metrics);
                if (onFaceScanned) onFaceScanned(metrics);
            }
        };
        const vv = video;
        const schedule = ()=>{
            if (vv.requestVideoFrameCallback) vv.requestVideoFrameCallback(onFrame);
            else requestAnimationFrame((t)=>onFrame(t));
        };
        schedule();
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: boxRef,
        className: "relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-neutral-800",
        style: {
            aspectRatio: aspect
        },
        children: [
            status === "running" && faceMetrics && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute left-4 top-4 z-20 rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 text-[11px] text-white backdrop-blur-md",
                children: [
                    t("tryon.shape"),
                    ": ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-semibold text-emerald-400",
                        children: faceMetrics.shape
                    }, void 0, false, {
                        fileName: "[project]/src/components/TryOnView.tsx",
                        lineNumber: 400,
                        columnNumber: 31
                    }, this),
                    " ",
                    t("tryon.tone"),
                    ":",
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-semibold text-amber-400",
                        children: faceMetrics.skinTone
                    }, void 0, false, {
                        fileName: "[project]/src/components/TryOnView.tsx",
                        lineNumber: 401,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/TryOnView.tsx",
                lineNumber: 399,
                columnNumber: 9
            }, this),
            status === "running" && !faceMetrics && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute left-4 top-4 z-20 rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 text-[11px] text-white backdrop-blur-md",
                children: [
                    t("tryon.look"),
                    " ",
                    Math.round(scan * 100),
                    "%"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/TryOnView.tsx",
                lineNumber: 405,
                columnNumber: 9
            }, this),
            status === "running" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute right-3 top-3 z-30 flex flex-col items-end gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setFitOpen((o)=>!o),
                        className: "rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[11px] text-white backdrop-blur-md hover:bg-black/80",
                        children: "⚙ Fit"
                    }, void 0, false, {
                        fileName: "[project]/src/components/TryOnView.tsx",
                        lineNumber: 412,
                        columnNumber: 11
                    }, this),
                    fitOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-56 rounded-xl border border-white/10 bg-black/75 p-3 text-[11px] text-white backdrop-blur-md",
                        children: [
                            FIT_SLIDERS.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "mb-2 block",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex justify-between text-neutral-300",
                                            children: [
                                                s.label,
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: fit[s.key].toFixed(2)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/TryOnView.tsx",
                                                    lineNumber: 424,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/TryOnView.tsx",
                                            lineNumber: 422,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "range",
                                            min: s.min,
                                            max: s.max,
                                            step: s.step,
                                            value: fit[s.key],
                                            onChange: (e)=>setFitValue(s.key, parseFloat(e.target.value)),
                                            className: "w-full"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/TryOnView.tsx",
                                            lineNumber: 426,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, s.key, true, {
                                    fileName: "[project]/src/components/TryOnView.tsx",
                                    lineNumber: 421,
                                    columnNumber: 17
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>Object.keys(FIT_DEFAULTS).forEach((k)=>setFitValue(k, FIT_DEFAULTS[k])),
                                className: "mt-1 text-neutral-400 underline hover:text-white",
                                children: "Reset"
                            }, void 0, false, {
                                fileName: "[project]/src/components/TryOnView.tsx",
                                lineNumber: 437,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/TryOnView.tsx",
                        lineNumber: 419,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/TryOnView.tsx",
                lineNumber: 411,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0",
                style: {
                    transform: "scaleX(-1)"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                        ref: videoRef,
                        playsInline: true,
                        muted: true,
                        className: "absolute inset-0 h-full w-full object-fill"
                    }, void 0, false, {
                        fileName: "[project]/src/components/TryOnView.tsx",
                        lineNumber: 450,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                        ref: canvasRef,
                        className: "absolute inset-0 h-full w-full",
                        style: {
                            filter: "blur(0.4px)"
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/TryOnView.tsx",
                        lineNumber: 451,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/TryOnView.tsx",
                lineNumber: 449,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: hudCanvasRef,
                className: "pointer-events-none absolute inset-0 z-20 h-full w-full",
                style: {
                    transform: "scaleX(-1)"
                }
            }, void 0, false, {
                fileName: "[project]/src/components/TryOnView.tsx",
                lineNumber: 455,
                columnNumber: 7
            }, this),
            status !== "running" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 flex flex-col items-center justify-center gap-4 bg-neutral-900/80 p-6 text-center",
                children: [
                    status === "loading" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-neutral-300",
                        children: t("tryon.starting")
                    }, void 0, false, {
                        fileName: "[project]/src/components/TryOnView.tsx",
                        lineNumber: 464,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: start,
                        className: "rounded-full bg-white px-8 py-4 font-medium text-neutral-950 transition hover:bg-neutral-200",
                        children: [
                            "📷 ",
                            t("tryon.start")
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/TryOnView.tsx",
                        lineNumber: 466,
                        columnNumber: 13
                    }, this),
                    message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "max-w-md text-sm text-red-400",
                        children: message
                    }, void 0, false, {
                        fileName: "[project]/src/components/TryOnView.tsx",
                        lineNumber: 473,
                        columnNumber: 23
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/TryOnView.tsx",
                lineNumber: 462,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/TryOnView.tsx",
        lineNumber: 393,
        columnNumber: 5
    }, this);
}
_s(TryOnView, "oJ+izVqnoJDJ850p9S7MXvP+ROY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Providers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrefs"]
    ];
});
_c = TryOnView;
var _c;
__turbopack_context__.k.register(_c, "TryOnView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/TryOnView.tsx [app-client] (ecmascript, next/dynamic entry)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/TryOnView.tsx [app-client] (ecmascript)"));
}),
"[project]/src/lib/arScene.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ARScene",
    ()=>ARScene,
    "TUNE",
    ()=>TUNE
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.module.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$loaders$2f$GLTFLoader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/loaders/GLTFLoader.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$environments$2f$RoomEnvironment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/environments/RoomEnvironment.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$faceMesh$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/faceMesh.ts [app-client] (ecmascript)");
;
;
;
;
const TUNE = {
    width: 13.8,
    y: 2.5,
    z: 4.6,
    pitch: 0.06,
    occluderScale: 0.96,
    skullX: 6.0,
    lensColor: "#3b3f44",
    lensOpacity: 0.22,
    shadowOpacity: 0.2,
    fov: 63,
    straighten: true,
    armX: 7.4,
    maskWidth: 0.86,
    earZ: -5.2,
    earFade: 2.8
};
// =================================================================================
// ---------------------- One-Euro filter (smooth when still, quick when moving) ----------------------
const alpha = (cutoff, dt)=>1 / (1 + 1 / (2 * Math.PI * cutoff) / dt);
class OneEuro {
    minCutoff;
    beta;
    dCutoff;
    x;
    dx;
    t;
    ready;
    constructor(minCutoff, beta, dCutoff = 1){
        this.minCutoff = minCutoff;
        this.beta = beta;
        this.dCutoff = dCutoff;
        this.x = 0;
        this.dx = 0;
        this.t = 0;
        this.ready = false;
    }
    reset() {
        this.ready = false;
    }
    filter(v, t) {
        if (!this.ready) {
            this.ready = true;
            this.x = v;
            this.dx = 0;
            this.t = t;
            return v;
        }
        const dt = Math.max(1e-3, t - this.t);
        this.t = t;
        this.dx += alpha(this.dCutoff, dt) * ((v - this.x) / dt - this.dx);
        this.x += alpha(this.minCutoff + this.beta * Math.abs(this.dx), dt) * (v - this.x);
        return this.x;
    }
}
// ---------------------- helpers ----------------------
const METAL_NAME = /gold|silver|rose|copper|bronze|gunmetal|chrome|steel|titan|platinum|brass|metal/i;
const PART_METAL = /metal|hrom|chrom|steel|hinge|screw/i;
function toPhysical(src) {
    if (src.isMeshPhysicalMaterial) return src;
    const p = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.MeshPhysicalMaterial();
    p.name = src.name;
    p.color.copy(src.color);
    p.map = src.map;
    p.roughness = src.roughness;
    p.metalness = src.metalness;
    p.roughnessMap = src.roughnessMap;
    p.metalnessMap = src.metalnessMap;
    p.normalMap = src.normalMap;
    p.normalScale.copy(src.normalScale);
    p.aoMap = src.aoMap;
    p.emissive.copy(src.emissive);
    p.emissiveMap = src.emissiveMap;
    p.emissiveIntensity = src.emissiveIntensity;
    p.side = src.side;
    p.transparent = src.transparent;
    p.opacity = src.opacity;
    p.alphaTest = src.alphaTest;
    p.vertexColors = src.vertexColors;
    return p;
}
function isLens(m, extra) {
    const x = m;
    return (x.transmission ?? 0) > 0 || x.transparent && x.opacity < 0.5 || /glass|lens|verre|lente|cristal|visor|shade|tint|transparent/i.test(x.name) || extra.includes(x.name);
}
// ---------------------- models with ONE baked texture (AI-generated) ----------------------
function findLens(mesh) {
    const g = mesh.geometry;
    const pos = g.attributes.position;
    const uv = g.attributes.uv;
    const idx = g.index;
    const map = mesh.material.map;
    const img = map?.image;
    if (!uv || !idx || !map || !img) return null;
    const n = pos.count;
    const M = mesh.matrixWorld;
    const P = new Float32Array(n * 3);
    const v = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Vector3();
    let minx = 1e9, maxx = -1e9, miny = 1e9, maxy = -1e9, maxz = -1e9;
    for(let i = 0; i < n; i++){
        v.fromBufferAttribute(pos, i).applyMatrix4(M);
        P[i * 3] = v.x;
        P[i * 3 + 1] = v.y;
        P[i * 3 + 2] = v.z;
        if (v.x < minx) minx = v.x;
        if (v.x > maxx) maxx = v.x;
        if (v.y < miny) miny = v.y;
        if (v.y > maxy) maxy = v.y;
        if (v.z > maxz) maxz = v.z;
    }
    const W = maxx - minx, cx = (maxx + minx) / 2, cy = (maxy + miny) / 2;
    const S = 1024;
    const cv = document.createElement("canvas");
    cv.width = S;
    cv.height = S;
    const ctx = cv.getContext("2d", {
        willReadFrequently: true
    });
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, S, S);
    const px = ctx.getImageData(0, 0, S, S).data;
    const C = new Float32Array(n * 3);
    for(let i = 0; i < n; i++){
        const u = uv.getX(i), w = uv.getY(i);
        const X = Math.min(S - 1, Math.max(0, Math.floor((u % 1 + 1) % 1 * S)));
        let Y = (w % 1 + 1) % 1;
        if (map.flipY) Y = 1 - Y;
        Y = Math.min(S - 1, Math.max(0, Math.floor(Y * S)));
        const o = (Y * S + X) * 4;
        C[i * 3] = px[o];
        C[i * 3 + 1] = px[o + 1];
        C[i * 3 + 2] = px[o + 2];
    }
    const q = 1 / (W * 1e-4);
    const key = new Map();
    const canon = new Uint32Array(n);
    let m = 0;
    for(let i = 0; i < n; i++){
        const k = Math.round(P[i * 3] * q) + "," + Math.round(P[i * 3 + 1] * q) + "," + Math.round(P[i * 3 + 2] * q);
        let id = key.get(k);
        if (id === undefined) {
            id = m++;
            key.set(k, id);
        }
        canon[i] = id;
    }
    const cc = new Float32Array(m * 3), cn = new Uint32Array(m), cp = new Float32Array(m * 3);
    for(let i = 0; i < n; i++){
        const c = canon[i];
        cc[c * 3] += C[i * 3];
        cc[c * 3 + 1] += C[i * 3 + 1];
        cc[c * 3 + 2] += C[i * 3 + 2];
        cn[c]++;
        cp[c * 3] = P[i * 3];
        cp[c * 3 + 1] = P[i * 3 + 1];
        cp[c * 3 + 2] = P[i * 3 + 2];
    }
    const f = (c)=>{
        c /= 255;
        return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    const h = (t)=>t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
    const L = new Float32Array(m * 3);
    for(let c = 0; c < m; c++){
        const R = f(cc[c * 3] / cn[c]), G = f(cc[c * 3 + 1] / cn[c]), B = f(cc[c * 3 + 2] / cn[c]);
        const X = (0.4124 * R + 0.3576 * G + 0.1805 * B) / 0.95047;
        const Y = 0.2126 * R + 0.7152 * G + 0.0722 * B;
        const Z = (0.0193 * R + 0.1192 * G + 0.9505 * B) / 1.08883;
        L[c * 3] = 116 * h(Y) - 16;
        L[c * 3 + 1] = 500 * (h(X) - h(Y));
        L[c * 3 + 2] = 200 * (h(Y) - h(Z));
    }
    const dE = (a, b)=>Math.hypot(L[a * 3] - L[b * 3], L[a * 3 + 1] - L[b * 3 + 1], L[a * 3 + 2] - L[b * 3 + 2]);
    const ia = idx.array;
    const deg = new Uint32Array(m + 1);
    for(let t = 0; t < ia.length; t++)deg[canon[ia[t]] + 1] += 2;
    for(let i = 0; i < m; i++)deg[i + 1] += deg[i];
    const adj = new Uint32Array(deg[m]);
    const fill = deg.slice(0, m);
    for(let t = 0; t < ia.length; t += 3)for(let k = 0; k < 3; k++){
        const a = canon[ia[t + k]], b = canon[ia[t + (k + 1) % 3]];
        adj[fill[a]++] = b;
        adj[fill[b]++] = a;
    }
    const slab = 0.08 * W;
    const seeds = [], seedX = [];
    for (const sx of [
        -1,
        1
    ])for (const oy of [
        -0.14,
        -0.105,
        -0.07,
        -0.035,
        0,
        0.035,
        0.07,
        0.105,
        0.14
    ]){
        const tx = cx + sx * 0.26 * W, ty = cy + oy * W;
        let best = -1, bd = 1e9;
        for(let i = 0; i < m; i++){
            if (cp[i * 3 + 2] < maxz - slab) continue;
            const d = Math.hypot(cp[i * 3] - tx, cp[i * 3 + 1] - ty);
            if (d < bd) {
                bd = d;
                best = i;
            }
        }
        if (best >= 0) {
            seeds.push(best);
            seedX.push(cx + sx * 0.26 * W);
        }
    }
    const out = new Uint8Array(m);
    for(let si = 0; si < seeds.length; si++){
        const s = seeds[si], sideX = seedX[si], zs = cp[s * 3 + 2];
        const stack = [
            s
        ];
        out[s] = 1;
        while(stack.length){
            const a = stack.pop();
            for(let k = deg[a]; k < deg[a + 1]; k++){
                const b = adj[k];
                if (out[b]) continue;
                if (Math.abs(cp[b * 3] - sideX) > 0.21 * W || Math.abs(cp[b * 3 + 1] - cy) > 0.3 * W) continue;
                if (Math.abs(cp[b * 3 + 2] - zs) > 0.04 * W) continue;
                if (dE(a, b) > 5 || dE(s, b) > 45) continue;
                out[b] = 1;
                stack.push(b);
            }
        }
    }
    const flag = new Uint8Array(n);
    let count = 0;
    for(let i = 0; i < n; i++){
        flag[i] = out[canon[i]];
        count += flag[i];
    }
    return count > 300 ? flag : null;
}
function subGeometry(g, flag, wantLens) {
    const ia = g.index.array;
    const n = g.attributes.position.count;
    const remap = new Int32Array(n).fill(-1);
    const out = [];
    let cnt = 0;
    for(let t = 0; t < ia.length; t += 3){
        const a = ia[t], b = ia[t + 1], c = ia[t + 2];
        if (flag[a] + flag[b] + flag[c] >= 2 !== wantLens) continue;
        for (const vtx of [
            a,
            b,
            c
        ]){
            if (remap[vtx] < 0) remap[vtx] = cnt++;
            out.push(remap[vtx]);
        }
    }
    const ng = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.BufferGeometry();
    for (const name of [
        "position",
        "normal",
        "uv"
    ]){
        const attr = g.attributes[name];
        if (!attr) continue;
        const arr = new Float32Array(cnt * attr.itemSize);
        for(let i = 0; i < n; i++){
            const j = remap[i];
            if (j < 0) continue;
            for(let k = 0; k < attr.itemSize; k++)arr[j * attr.itemSize + k] = attr.getComponent(i, k);
        }
        ng.setAttribute(name, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.BufferAttribute(arr, attr.itemSize));
    }
    ng.setIndex(out);
    return ng;
}
const loader = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$loaders$2f$GLTFLoader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GLTFLoader"]();
const cache = new Map();
function loadGLB(url) {
    if (!cache.has(url)) cache.set(url, loader.loadAsync(url).then((g)=>g.scene));
    return cache.get(url);
}
class ARScene {
    renderer;
    scene = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Scene();
    camera;
    anchor = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Group();
    glassesHolder = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Group();
    key;
    fill;
    built = null;
    token = 0;
    envTex = null;
    lastSeen = -1;
    fu = new OneEuro(1.2, 20);
    fv = new OneEuro(1.2, 20);
    fd = new OneEuro(0.9, 0.1);
    fq = [
        0,
        1,
        2,
        3
    ].map(()=>new OneEuro(1.8, 4));
    fs = new OneEuro(0.5, 0);
    fade = {
        uHeadInv: {
            value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Matrix4()
        },
        uFadeA: {
            value: TUNE.earZ
        },
        uFadeB: {
            value: TUNE.earZ - TUNE.earFade
        }
    };
    prevQ = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Quaternion();
    hasPrev = false;
    tmp = {
        m: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Matrix4(),
        p: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Vector3(),
        s: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Vector3(),
        q: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Quaternion()
    };
    color = null;
    colorName = "Original";
    constructor(canvas){
        const r = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });
        r.setClearColor(0x000000, 0);
        r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        r.outputColorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.SRGBColorSpace;
        r.toneMapping = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.NeutralToneMapping ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.ACESFilmicToneMapping;
        r.toneMappingExposure = 1;
        r.shadowMap.enabled = true;
        r.shadowMap.type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.VSMShadowMap;
        this.renderer = r;
        this.camera = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.PerspectiveCamera(TUNE.fov, 4 / 3, 1, 2000);
        this.camera.position.set(0, 0, 0);
        const pm = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.PMREMGenerator(r);
        this.envTex = pm.fromScene(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$environments$2f$RoomEnvironment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RoomEnvironment"](), 0.04).texture;
        pm.dispose();
        this.scene.environment = this.envTex;
        this.scene.environmentIntensity = 0.9;
        this.fill = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.HemisphereLight(0xffffff, 0x8a7566, 0.35);
        this.scene.add(this.fill);
        this.key = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.DirectionalLight(0xffffff, 1.5);
        this.key.castShadow = true;
        this.key.shadow.mapSize.set(1024, 1024);
        const sc = this.key.shadow.camera;
        sc.left = -12;
        sc.right = 12;
        sc.top = 12;
        sc.bottom = -12;
        sc.near = 5;
        sc.far = 90;
        this.key.shadow.radius = 7;
        this.key.shadow.blurSamples = 16;
        this.key.shadow.bias = -0.0004;
        this.scene.add(this.key, this.key.target);
        const geo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.BufferGeometry();
        geo.setAttribute("position", new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Float32BufferAttribute(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$faceMesh$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FACE_POSITIONS"], 3));
        geo.setIndex(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$faceMesh$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FACE_INDICES"]);
        geo.computeVertexNormals();
        const depthOnly = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.MeshBasicMaterial({
            colorWrite: false
        });
        this.depthOnly = depthOnly;
        const face = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Mesh(geo, depthOnly);
        face.scale.set(TUNE.occluderScale * TUNE.maskWidth, TUNE.occluderScale, TUNE.occluderScale);
        face.renderOrder = -2;
        this.face = face;
        const skull = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Mesh(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.SphereGeometry(1, 32, 24), depthOnly);
        skull.position.set(0, 0.5, -3.5);
        skull.scale.set(TUNE.skullX, 9, 8.5);
        skull.renderOrder = -2;
        const catcher = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Mesh(geo, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.ShadowMaterial({
            color: 0x1a0f08,
            opacity: TUNE.shadowOpacity,
            depthWrite: false
        }));
        catcher.material.polygonOffset = true;
        catcher.material.polygonOffsetFactor = -2;
        catcher.receiveShadow = true;
        catcher.renderOrder = -1;
        this.catcher = catcher;
        this.skull = skull;
        this.anchor.matrixAutoUpdate = false;
        this.anchor.visible = false;
        this.anchor.add(face, skull, catcher, this.glassesHolder);
        this.scene.add(this.anchor);
    }
    face;
    catcher;
    skull;
    depthOnly;
    showMask(on) {
        const m = this.depthOnly;
        m.colorWrite = on;
        m.transparent = on;
        m.opacity = on ? 0.35 : 1;
        m.color.set(on ? 0xff2020 : 0xffffff);
        m.needsUpdate = true;
    }
    resize(w, h) {
        this.renderer.setSize(w, h, false);
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
    }
    setFov(fov) {
        TUNE.fov = fov;
        this.camera.fov = fov;
        this.camera.updateProjectionMatrix();
    }
    setLight(luma, rgb) {
        const k = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.MathUtils.clamp(0.45 + luma * 1.1, 0.6, 1.35);
        this.renderer.toneMappingExposure = k;
        const m = Math.max(rgb[0], rgb[1], rgb[2]) || 1;
        const tint = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Color(0.75 + 0.25 * (rgb[0] / m), 0.75 + 0.25 * (rgb[1] / m), 0.75 + 0.25 * (rgb[2] / m));
        this.key.color.copy(tint);
        this.fill.color.copy(tint);
    }
    async setProduct(product, color, colorName) {
        const my = ++this.token;
        this.color = color;
        this.colorName = colorName;
        const src = await loadGLB(product.model);
        if (my !== this.token) return;
        const built = this.build(src, product);
        if (my !== this.token) return;
        if (this.built) {
            this.glassesHolder.remove(this.built.group);
            this.built.materials.forEach((m)=>m.dispose());
        }
        this.built = built;
        this.glassesHolder.add(built.group);
        this.applyColor();
    }
    setColor(color, name) {
        this.color = color;
        this.colorName = name;
        this.applyColor();
    }
    applyColor() {
        if (!this.built) return;
        const color = this.color;
        const metal = color ? METAL_NAME.test(this.colorName) : null;
        for (const r of this.built.recolor){
            const m = r.mat;
            const tint = m.userData.tint;
            if (color) {
                if (this.built.baked && tint) {
                    m.map = r.origMap;
                    m.color.set(0xffffff);
                    tint.uTint.value.set(color);
                    tint.uTintAmt.value = 1;
                } else {
                    m.map = null;
                    m.color.set(color);
                }
                if (metal) {
                    m.metalness = 0.95;
                    m.roughness = 0.3;
                    m.clearcoat = 0;
                } else {
                    m.metalness = 0;
                    m.roughness = 0.4;
                    m.clearcoat = 0.5;
                    m.clearcoatRoughness = 0.18;
                }
            } else {
                m.map = r.origMap;
                m.color.copy(r.origColor);
                if (tint) tint.uTintAmt.value = 0;
                if (r.origMetal > 0.5) {
                    m.metalness = 0.95;
                    m.roughness = Math.min(Math.max(r.origRough, 0.2), 0.4);
                    m.clearcoat = 0;
                } else {
                    m.metalness = 0;
                    m.roughness = Math.min(Math.max(r.origRough, 0.3), 0.45);
                    m.clearcoat = 0.5;
                    m.clearcoatRoughness = 0.18;
                }
            }
            m.needsUpdate = true;
        }
    }
    build(source, product) {
        const lensExtra = product.lens ?? [];
        const hide = product.hide ?? [];
        const recolorNames = product.recolor ?? [];
        const clone = source.clone(true);
        clone.updateMatrixWorld(true);
        let baked = false;
        {
            const ms = [];
            clone.traverse((o)=>{
                if (o.isMesh) ms.push(o);
            });
            const only = ms.length === 1 ? ms[0] : null;
            const om = only && !Array.isArray(only.material) ? only.material : null;
            if (only && om && om.map && !isLens(om, lensExtra) && only.geometry.index) {
                const flag = findLens(only);
                if (flag) {
                    const lensMesh = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Mesh(subGeometry(only.geometry, flag, true), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.MeshBasicMaterial({
                        name: "Lens",
                        map: om.map
                    }));
                    lensMesh.name = "LensSplit";
                    lensMesh.position.copy(only.position);
                    lensMesh.quaternion.copy(only.quaternion);
                    lensMesh.scale.copy(only.scale);
                    only.geometry = subGeometry(only.geometry, flag, false);
                    only.parent.add(lensMesh);
                    baked = true;
                }
            }
        }
        const recolor = [];
        const materials = [];
        const lensMeshes = [];
        const lensMats = [];
        const frameMats = new Map();
        clone.traverse((obj)=>{
            const mesh = obj;
            if (!mesh.isMesh) return;
            const fix = (mat)=>{
                if (hide.includes(mat.name)) {
                    mesh.visible = false;
                    return mat;
                }
                if (isLens(mat, lensExtra)) {
                    lensMeshes.push(mesh);
                    const lensTex = mat.map;
                    const absorb = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.MeshBasicMaterial({
                        color: lensTex ? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Color(0xffffff) : new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Color(TUNE.lensColor),
                        map: lensTex ?? null,
                        transparent: true,
                        opacity: lensTex ? Math.min(0.9, TUNE.lensOpacity * 2.2) : TUNE.lensOpacity,
                        depthWrite: false
                    });
                    absorb.userData.baked = !!lensTex;
                    materials.push(absorb);
                    lensMats.push(absorb);
                    return absorb;
                }
                const std = toPhysical(mat);
                const p = std === mat ? mat.clone() : std;
                materials.push(p);
                p.envMapIntensity = 1;
                p.transparent = true;
                const tint = {
                    uTint: {
                        value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Color(1, 1, 1)
                    },
                    uTintAmt: {
                        value: 0
                    }
                };
                p.userData.tint = tint;
                p.onBeforeCompile = (sh)=>{
                    sh.uniforms.uTint = tint.uTint;
                    sh.uniforms.uTintAmt = tint.uTintAmt;
                    sh.uniforms.uHeadInv = this.fade.uHeadInv;
                    sh.uniforms.uFadeA = this.fade.uFadeA;
                    sh.uniforms.uFadeB = this.fade.uFadeB;
                    sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nuniform mat4 uHeadInv;\nvarying float vHeadZ;").replace("#include <project_vertex>", "#include <project_vertex>\nvHeadZ = (uHeadInv * modelMatrix * vec4(transformed, 1.0)).z;");
                    sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nuniform float uFadeA;\nuniform float uFadeB;\nvarying float vHeadZ;\nuniform vec3 uTint;\nuniform float uTintAmt;").replace("#include <map_fragment>", "#include <map_fragment>\nif (uTintAmt > 0.5) { float lum = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722)); diffuseColor.rgb = uTint * clamp(lum / 0.5, 0.0, 1.5); }").replace("#include <alphamap_fragment>", "#include <alphamap_fragment>\ndiffuseColor.a *= smoothstep(uFadeB, uFadeA, vHeadZ);");
                };
                p.customProgramCacheKey = ()=>"earfade";
                frameMats.set(p, {
                    name: mat.name,
                    verts: mesh.geometry.attributes.position.count
                });
                return p;
            };
            mesh.material = Array.isArray(mesh.material) ? mesh.material.map(fix) : fix(mesh.material);
            mesh.castShadow = mesh.visible;
        });
        const groups = new Map();
        frameMats.forEach((fm)=>groups.set(fm.name, (groups.get(fm.name) ?? 0) + fm.verts));
        const chosen = new Set(recolorNames.filter((n)=>groups.has(n)));
        if (!chosen.size) {
            let best = "", bestV = -1;
            groups.forEach((vv, nn)=>{
                if (!PART_METAL.test(nn) && vv > bestV) {
                    best = nn;
                    bestV = vv;
                }
            });
            if (bestV >= 0) chosen.add(best);
        }
        frameMats.forEach((fm, p)=>{
            if (chosen.has(fm.name)) {
                recolor.push({
                    mat: p,
                    origColor: p.color.clone(),
                    origMap: p.map,
                    origMetal: p.metalness,
                    origRough: p.roughness
                });
            } else if (PART_METAL.test(fm.name)) {
                p.metalness = 0.9;
                p.roughness = Math.min(p.roughness, 0.3);
            } else {
                p.roughness = Math.min(p.roughness, 0.45);
            }
        });
        const refl = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.MeshPhysicalMaterial({
            color: 0x000000,
            roughness: 0.04,
            metalness: 0,
            ior: 2.0,
            envMapIntensity: 1.1,
            transparent: true,
            blending: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.CustomBlending,
            blendEquation: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.AddEquation,
            blendSrc: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.OneFactor,
            blendDst: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.OneFactor,
            blendSrcAlpha: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.ZeroFactor,
            blendDstAlpha: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.OneFactor,
            depthWrite: false
        });
        materials.push(refl);
        for (const lm of lensMeshes){
            lm.castShadow = false;
            lm.renderOrder = 2;
            const r = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Mesh(lm.geometry, refl);
            r.renderOrder = 3;
            lm.add(r);
        }
        const holder = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Group();
        holder.rotation.y = product.turn ?? 0;
        ;
        holder.add(clone);
        const outer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Group();
        outer.add(holder);
        outer.updateMatrixWorld(true);
        const all = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Box3().setFromObject(outer);
        const slabMin = all.max.z - 0.12 * (all.max.z - all.min.z);
        const front = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Box3();
        const v = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Vector3();
        outer.traverse((obj)=>{
            const mesh = obj;
            if (!mesh.isMesh) return;
            const pos = mesh.geometry.attributes.position;
            for(let i = 0; i < pos.count; i++){
                v.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
                if (v.z >= slabMin) front.expandByPoint(v);
            }
        });
        const fw = front.max.x - front.min.x;
        const cx = (front.min.x + front.max.x) / 2;
        const cy = (front.min.y + front.max.y) / 2;
        holder.position.set(-cx, -cy, -all.max.z + 0.08 * fw);
        outer.scale.setScalar(1 / fw);
        outer.updateMatrixWorld(true);
        if (TUNE.straighten) this.fitArms(outer);
        return {
            group: outer,
            recolor,
            materials,
            lensMats,
            baked
        };
    }
    fitArms(outer) {
        const v = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Vector3();
        const meshes = [];
        const N = 9;
        const slices = Array.from({
            length: N
        }, ()=>[]);
        const hinge = [];
        outer.traverse((o)=>{
            const mesh = o;
            if (!mesh.isMesh || !mesh.visible) return;
            const M = mesh.matrixWorld.clone();
            meshes.push({
                mesh,
                M
            });
            const pos = mesh.geometry.attributes.position;
            const step = Math.max(1, Math.floor(pos.count / 6000));
            for(let i = 0; i < pos.count; i += step){
                v.fromBufferAttribute(pos, i).applyMatrix4(M);
                const ax = Math.abs(v.x);
                if (v.z <= 0.02 && v.z > -0.12 && ax > 0.44) hinge.push(ax);
                const k = Math.floor((-v.z - 0.1) / 0.1);
                if (k >= 0 && k < N && ax > 0.3) slices[k].push(ax);
            }
        });
        const med = (a)=>a.sort((x, y)=>x - y)[Math.floor(a.length / 2)];
        const xh = hinge.length > 10 ? med(hinge) : 0.49;
        const m = slices.map((s)=>s.length >= 6 ? med(s) : null);
        if (m.filter((x)=>x !== null).length < 2) return;
        for(let k = 0; k < N; k++){
            if (m[k] !== null) continue;
            let lo = k - 1, hi = k + 1;
            while(lo >= 0 && m[lo] === null)lo--;
            while(hi < N && m[hi] === null)hi++;
            if (lo >= 0 && hi < N) m[k] = (m[lo] * (hi - k) + m[hi] * (k - lo)) / (hi - lo);
            else m[k] = lo >= 0 ? m[lo] : m[hi];
        }
        const earX = TUNE.armX / TUNE.width;
        const sm = (a, b, x)=>{
            const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
            return t * t * (3 - 2 * t);
        };
        const shift = m.map((x, k)=>xh + (earX - xh) * sm(0.1, 0.55, 0.15 + 0.1 * k) - x);
        const shiftAt = (z)=>{
            const f = Math.min(N - 1, Math.max(0, (-z - 0.15) / 0.1));
            const i = Math.floor(f);
            const j = Math.min(N - 1, i + 1);
            return shift[i] + (shift[j] - shift[i]) * (f - i);
        };
        const zh = -0.05;
        const Minv = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Matrix4();
        for (const { mesh, M } of meshes){
            mesh.geometry = mesh.geometry.clone();
            Minv.copy(M).invert();
            const pos = mesh.geometry.attributes.position;
            for(let i = 0; i < pos.count; i++){
                v.fromBufferAttribute(pos, i).applyMatrix4(M);
                if (v.z < zh && Math.abs(v.x) > 0.25) {
                    v.x += Math.sign(v.x) * shiftAt(v.z) * Math.min(1, (zh - v.z) / 0.05);
                    v.applyMatrix4(Minv);
                    pos.setXYZ(i, v.x, v.y, v.z);
                }
            }
            pos.needsUpdate = true;
            mesh.geometry.computeBoundingSphere();
            mesh.geometry.computeBoundingBox();
        }
    }
    setPose(m, t) {
        if (!m) {
            if (this.lastSeen >= 0 && t - this.lastSeen > 0.25) {
                this.anchor.visible = false;
                this.fu.reset();
                this.fv.reset();
                this.fd.reset();
                this.fq.forEach((f)=>f.reset());
                this.fs.reset();
                this.hasPrev = false;
            }
            return;
        }
        const { p, s, q } = this.tmp;
        m.decompose(p, q, s);
        const d = -p.z;
        if (d < 5) return;
        this.lastSeen = t;
        if (this.hasPrev && q.dot(this.prevQ) < 0) q.set(-q.x, -q.y, -q.z, -q.w);
        const th = Math.tan(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.MathUtils.degToRad(this.camera.fov / 2));
        const ax = th * this.camera.aspect;
        const u = this.fu.filter(p.x / d / ax, t);
        const v = this.fv.filter(p.y / d / th, t);
        const dd = this.fd.filter(d, t);
        p.set(u * dd * ax, v * dd * th, -dd);
        q.set(this.fq[0].filter(q.x, t), this.fq[1].filter(q.y, t), this.fq[2].filter(q.z, t), this.fq[3].filter(q.w, t)).normalize();
        this.prevQ.copy(q);
        this.hasPrev = true;
        const k = this.fs.filter(s.x, t);
        this.anchor.matrix.compose(p, q, s.set(k, k, k));
        this.anchor.matrixWorldNeedsUpdate = true;
        this.anchor.visible = true;
    }
    render() {
        this.glassesHolder.position.set(0, TUNE.y, TUNE.z);
        this.glassesHolder.rotation.x = TUNE.pitch;
        this.glassesHolder.scale.setScalar(TUNE.width);
        this.skull.scale.x = TUNE.skullX;
        this.face.scale.set(TUNE.occluderScale * TUNE.maskWidth, TUNE.occluderScale, TUNE.occluderScale);
        this.fade.uFadeA.value = TUNE.earZ;
        this.fade.uFadeB.value = TUNE.earZ - TUNE.earFade;
        this.fade.uHeadInv.value.copy(this.anchor.matrix).invert();
        this.catcher.material.opacity = TUNE.shadowOpacity;
        if (this.built) {
            for (const lm of this.built.lensMats){
                if (lm.userData.baked) {
                    lm.opacity = Math.min(0.9, TUNE.lensOpacity * 2.2);
                } else {
                    lm.opacity = TUNE.lensOpacity;
                    lm.color.set(TUNE.lensColor);
                }
            }
        }
        if (this.anchor.visible) {
            const hp = this.tmp.p.setFromMatrixPosition(this.anchor.matrix);
            this.key.position.set(hp.x + 4, hp.y + 15, hp.z + 28);
            this.key.target.position.copy(hp);
            this.key.target.updateMatrixWorld();
        }
        this.renderer.render(this.scene, this.camera);
    }
    dispose() {
        this.token++;
        this.built?.materials.forEach((m)=>m.dispose());
        this.envTex?.dispose();
        this.renderer.dispose();
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/faceMesh.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Canonical face mesh (468 vertices, 898 triangles) from MediaPipe / MindAR (Apache-2.0 / MIT).
// Used only as an invisible "occluder" so the far arm of the glasses hides behind your face.
__turbopack_context__.s([
    "FACE_INDICES",
    ()=>FACE_INDICES,
    "FACE_POSITIONS",
    ()=>FACE_POSITIONS
]);
const FACE_POSITIONS = [
    0,
    -3.41,
    5.98,
    0,
    -1.13,
    7.48,
    0,
    -2.09,
    6.06,
    -0.46,
    0.96,
    6.63,
    0,
    -0.46,
    7.59,
    0,
    0.37,
    7.24,
    0,
    2.47,
    5.79,
    -4.25,
    2.58,
    3.28,
    0,
    4.02,
    5.28,
    0,
    4.89,
    5.39,
    0,
    8.26,
    4.48,
    0,
    -3.71,
    5.86,
    0,
    -3.92,
    5.57,
    0,
    -3.99,
    5.22,
    0,
    -4.54,
    5.4,
    0,
    -4.75,
    5.53,
    0,
    -5.02,
    5.6,
    0,
    -5.37,
    5.54,
    0,
    -6.15,
    5.07,
    0,
    -1.5,
    7.11,
    -0.42,
    -1.47,
    6.45,
    -7.09,
    5.43,
    0.1,
    -2.63,
    2.04,
    3.85,
    -3.2,
    1.99,
    3.8,
    -3.78,
    2.04,
    3.65,
    -4.47,
    2.42,
    3.16,
    -2.16,
    2.19,
    3.85,
    -3.21,
    3.22,
    4.12,
    -2.67,
    3.21,
    4.09,
    -3.75,
    3.17,
    3.97,
    -4.16,
    3.06,
    3.72,
    -5.06,
    1.93,
    2.78,
    -2.27,
    -7.43,
    4.39,
    -4.45,
    2.66,
    3.17,
    -7.21,
    2.26,
    0.07,
    -5.8,
    2.35,
    2.2,
    -2.84,
    -0.72,
    4.43,
    -0.71,
    -3.33,
    5.88,
    -0.61,
    -3.92,
    5.44,
    -1.43,
    -3.5,
    5.5,
    -1.91,
    -3.8,
    5.03,
    -1.13,
    -3.97,
    5.19,
    -1.56,
    -4.08,
    4.84,
    -2.65,
    -5,
    4.19,
    -0.43,
    -1.09,
    7.36,
    -0.5,
    -0.48,
    7.44,
    -5.25,
    3.88,
    3.36,
    -1.72,
    0.97,
    4.56,
    -1.61,
    -0.94,
    5.81,
    -1.65,
    -0.61,
    5.58,
    -4.77,
    -0.7,
    3.53,
    -0.48,
    0.3,
    7.1,
    -3.73,
    4.51,
    4.55,
    -4.59,
    4.3,
    4.05,
    -6.28,
    6.62,
    1.43,
    -1.22,
    4.14,
    5.11,
    -2.19,
    3.1,
    4,
    -3.1,
    -4.35,
    4.1,
    -6.72,
    -4.79,
    -1.75,
    -1.19,
    -1.31,
    5.74,
    -0.73,
    -1.59,
    5.83,
    -2.46,
    -4.34,
    4.28,
    -2.2,
    -4.3,
    4.16,
    -4.99,
    4.8,
    3.75,
    -1.59,
    -1.26,
    5.46,
    -2.64,
    4.52,
    4.92,
    -2.76,
    5.1,
    5.02,
    -3.52,
    8.01,
    3.73,
    -5.6,
    5.72,
    2.72,
    -3.06,
    6.57,
    4.53,
    -5.72,
    4.25,
    2.83,
    -6.37,
    4.79,
    1.59,
    -0.67,
    -3.69,
    5.74,
    -1.26,
    -3.79,
    5.42,
    -1.73,
    -3.95,
    5,
    -1.04,
    -1.46,
    5.66,
    -2.32,
    -4.33,
    4.26,
    -2.06,
    -4.48,
    4.52,
    -2.15,
    -4.28,
    4.04,
    -0.95,
    -1.04,
    6.51,
    -1.47,
    -4.04,
    4.6,
    -1.02,
    -3.99,
    4.93,
    -0.53,
    -3.99,
    5.14,
    -0.77,
    -6.1,
    4.99,
    -0.7,
    -5.29,
    5.45,
    -0.67,
    -4.95,
    5.51,
    -0.63,
    -4.7,
    5.45,
    -0.58,
    -4.52,
    5.34,
    -1.54,
    -4.42,
    4.75,
    -1.62,
    -4.48,
    4.81,
    -1.73,
    -4.62,
    4.85,
    -1.84,
    -4.83,
    4.82,
    -2.37,
    -3.11,
    4.87,
    -7.54,
    -1.05,
    -2.43,
    0,
    -1.72,
    6.6,
    -1.83,
    -4.4,
    4.4,
    -1.93,
    -4.41,
    4.5,
    -0.6,
    -2.01,
    5.87,
    -1.41,
    -1.71,
    5.24,
    -0.66,
    -1.82,
    5.86,
    -2.34,
    0.57,
    4.29,
    -3.33,
    0.1,
    4.11,
    -1.73,
    -0.92,
    5.27,
    -5.13,
    7.49,
    2.66,
    -4.54,
    6.32,
    3.68,
    -3.99,
    5.11,
    4.47,
    -2.17,
    -5.44,
    4.46,
    -1.4,
    5.01,
    5.32,
    -1.62,
    6.6,
    4.92,
    -1.89,
    8.24,
    4.27,
    -4.2,
    2.24,
    3.38,
    -5.73,
    1.41,
    2.43,
    -1.86,
    2.36,
    3.84,
    -4.99,
    3.07,
    3.08,
    -1.3,
    1.42,
    4.83,
    -1.31,
    -0.67,
    6.42,
    -6.47,
    0.94,
    1.69,
    -5.26,
    0.95,
    2.97,
    -4.43,
    0.72,
    3.52,
    -3.3,
    0.86,
    3.87,
    -2.43,
    1.13,
    4.04,
    -1.82,
    1.47,
    4.22,
    -0.56,
    2.31,
    5.57,
    -6.34,
    -0.53,
    1.88,
    -5.59,
    3.21,
    2.69,
    -0.24,
    -1.46,
    7.07,
    -1.61,
    0.34,
    4.9,
    -7.74,
    2.36,
    -2.01,
    -1.39,
    1.85,
    4.45,
    -1.79,
    -0.98,
    4.85,
    -4.67,
    2.66,
    3.08,
    -1.33,
    -0.28,
    6.1,
    -7.27,
    -2.89,
    -2.25,
    -1.86,
    2.59,
    3.76,
    -0.92,
    0.07,
    6.67,
    -5,
    -6.14,
    1.89,
    -5.09,
    -7.18,
    0.71,
    -7.16,
    -0.81,
    -0.07,
    -5.84,
    -5.25,
    0.92,
    -6.85,
    3.66,
    0.72,
    -2.41,
    -8.26,
    4.12,
    -0.18,
    -1.69,
    6.57,
    -2.1,
    -0.16,
    4.57,
    -6.41,
    2.24,
    1.56,
    -3.67,
    2.36,
    3.64,
    -3.18,
    2.29,
    3.78,
    -2.2,
    -4.6,
    4.48,
    -6.23,
    -1.94,
    1.66,
    -1.29,
    -9.3,
    4.09,
    -3.21,
    -8.53,
    2.8,
    -4.07,
    -7.99,
    1.93,
    0,
    6.55,
    5.03,
    0,
    -9.4,
    4.26,
    -2.72,
    2.32,
    3.78,
    -2.29,
    2.4,
    3.7,
    -2,
    2.5,
    3.69,
    -6.13,
    3.4,
    2.04,
    -2.29,
    2.89,
    3.78,
    -2.72,
    2.96,
    3.87,
    -3.18,
    2.96,
    3.88,
    -3.67,
    2.93,
    3.72,
    -4.02,
    2.86,
    3.48,
    -7.56,
    4.11,
    -0.99,
    -4.02,
    2.48,
    3.44,
    0,
    -2.52,
    5.93,
    -1.78,
    -2.68,
    5.21,
    -1.22,
    -1.18,
    5.95,
    -0.73,
    -2.54,
    5.82,
    0,
    3.27,
    5.24,
    -4.14,
    -7,
    2.67,
    -3.31,
    -7.66,
    3.38,
    -1.31,
    -8.64,
    4.7,
    -5.94,
    -6.22,
    -0.63,
    -2,
    2.74,
    3.74,
    -0.9,
    1.24,
    5.75,
    0,
    -8.77,
    4.89,
    -2.31,
    -8.97,
    3.61,
    -6.95,
    -2.44,
    -0.13,
    -1.1,
    -4.46,
    5.12,
    -1.18,
    -4.58,
    5.19,
    -1.26,
    -4.79,
    5.24,
    -1.33,
    -5.11,
    5.21,
    -1.55,
    -5.82,
    4.76,
    -1.95,
    -4.18,
    4.43,
    -2.12,
    -4.14,
    4.56,
    -2.29,
    -4.05,
    4.58,
    -2.85,
    -3.67,
    4.48,
    -5.28,
    -2.24,
    2.86,
    -0.95,
    1.91,
    5.2,
    -1.31,
    3.1,
    4.23,
    -1.78,
    2.86,
    3.88,
    -1.85,
    -4.1,
    4.25,
    -5.44,
    -4.03,
    2.11,
    -0.77,
    3.18,
    4.86,
    -1.94,
    -6.61,
    4.52,
    0,
    1.06,
    6.77,
    -0.52,
    1.58,
    6.15,
    0,
    1.73,
    6.32,
    -1.25,
    0.23,
    5.68,
    0,
    -7.94,
    5.18,
    0,
    -6.99,
    5.15,
    -1,
    -6.93,
    4.98,
    -3.29,
    -5.38,
    3.8,
    -2.31,
    -1.57,
    4.59,
    -2.68,
    -6.11,
    4.1,
    -3.83,
    -1.54,
    4.14,
    -2.96,
    -2.27,
    4.44,
    -4.39,
    -2.68,
    3.64,
    -1.22,
    -7.83,
    4.97,
    -1.54,
    -0.14,
    5.2,
    -3.88,
    -6.04,
    3.31,
    -3.08,
    -6.81,
    3.81,
    -3.75,
    -4.5,
    3.73,
    -6.09,
    -3.21,
    1.47,
    -4.59,
    -4.73,
    2.98,
    -6.58,
    -3.94,
    0.07,
    -3.49,
    -3.2,
    4.13,
    -1.26,
    0.8,
    5.31,
    -1.13,
    -0.93,
    6.54,
    -1.44,
    -1.14,
    5.91,
    -0.92,
    -0.53,
    7,
    -1.76,
    3.53,
    4.33,
    -2.63,
    3.71,
    4.36,
    -3.39,
    3.72,
    4.31,
    -4.08,
    3.68,
    4.08,
    -4.62,
    3.47,
    3.65,
    -5.17,
    2.54,
    2.67,
    -7.3,
    0.76,
    -0.05,
    -4.71,
    1.65,
    3.11,
    -4.07,
    1.48,
    3.48,
    -3.27,
    1.47,
    3.73,
    -2.53,
    1.62,
    3.87,
    -1.97,
    1.86,
    3.96,
    -1.58,
    2.1,
    4.08,
    -7.66,
    0.67,
    -2.44,
    -1.4,
    -1.34,
    5.63,
    -0.88,
    0.66,
    6.23,
    -0.77,
    -0.97,
    7.08,
    -0.46,
    -1.33,
    6.79,
    -0.75,
    -1.07,
    6.8,
    -1.24,
    -1.59,
    5.48,
    -0.39,
    -1.41,
    6.96,
    -0.32,
    -1.61,
    6.51,
    -1.64,
    2.56,
    3.86,
    -1.26,
    2.47,
    4.2,
    -1.03,
    2.38,
    4.62,
    -4.25,
    2.77,
    3.32,
    -4.53,
    2.91,
    3.34,
    0.46,
    0.96,
    6.63,
    4.25,
    2.58,
    3.28,
    0.42,
    -1.47,
    6.45,
    7.09,
    5.43,
    0.1,
    2.63,
    2.04,
    3.85,
    3.2,
    1.99,
    3.8,
    3.78,
    2.04,
    3.65,
    4.47,
    2.42,
    3.16,
    2.16,
    2.19,
    3.85,
    3.21,
    3.22,
    4.12,
    2.67,
    3.21,
    4.09,
    3.75,
    3.17,
    3.97,
    4.16,
    3.06,
    3.72,
    5.06,
    1.93,
    2.78,
    2.27,
    -7.43,
    4.39,
    4.45,
    2.66,
    3.17,
    7.21,
    2.26,
    0.07,
    5.8,
    2.35,
    2.2,
    2.84,
    -0.72,
    4.43,
    0.71,
    -3.33,
    5.88,
    0.61,
    -3.92,
    5.44,
    1.43,
    -3.5,
    5.5,
    1.91,
    -3.8,
    5.03,
    1.13,
    -3.97,
    5.19,
    1.56,
    -4.08,
    4.84,
    2.65,
    -5,
    4.19,
    0.43,
    -1.09,
    7.36,
    0.5,
    -0.48,
    7.44,
    5.25,
    3.88,
    3.36,
    1.72,
    0.97,
    4.56,
    1.61,
    -0.94,
    5.81,
    1.65,
    -0.61,
    5.58,
    4.77,
    -0.7,
    3.53,
    0.48,
    0.3,
    7.1,
    3.73,
    4.51,
    4.55,
    4.59,
    4.3,
    4.05,
    6.28,
    6.62,
    1.43,
    1.22,
    4.14,
    5.11,
    2.19,
    3.1,
    4,
    3.1,
    -4.35,
    4.1,
    6.72,
    -4.79,
    -1.75,
    1.19,
    -1.31,
    5.74,
    0.73,
    -1.59,
    5.83,
    2.46,
    -4.34,
    4.28,
    2.2,
    -4.3,
    4.16,
    4.99,
    4.8,
    3.75,
    1.59,
    -1.26,
    5.46,
    2.64,
    4.52,
    4.92,
    2.76,
    5.1,
    5.02,
    3.52,
    8.01,
    3.73,
    5.6,
    5.72,
    2.72,
    3.06,
    6.57,
    4.53,
    5.72,
    4.25,
    2.83,
    6.37,
    4.79,
    1.59,
    0.67,
    -3.69,
    5.74,
    1.26,
    -3.79,
    5.42,
    1.73,
    -3.95,
    5,
    1.04,
    -1.46,
    5.66,
    2.32,
    -4.33,
    4.26,
    2.06,
    -4.48,
    4.52,
    2.15,
    -4.28,
    4.04,
    0.95,
    -1.04,
    6.51,
    1.47,
    -4.04,
    4.6,
    1.02,
    -3.99,
    4.93,
    0.53,
    -3.99,
    5.14,
    0.77,
    -6.1,
    4.99,
    0.7,
    -5.29,
    5.45,
    0.67,
    -4.95,
    5.51,
    0.63,
    -4.7,
    5.45,
    0.58,
    -4.52,
    5.34,
    1.54,
    -4.42,
    4.75,
    1.62,
    -4.48,
    4.81,
    1.73,
    -4.62,
    4.85,
    1.84,
    -4.83,
    4.82,
    2.37,
    -3.11,
    4.87,
    7.54,
    -1.05,
    -2.43,
    1.83,
    -4.4,
    4.4,
    1.93,
    -4.41,
    4.5,
    0.6,
    -2.01,
    5.87,
    1.41,
    -1.71,
    5.24,
    0.66,
    -1.82,
    5.86,
    2.34,
    0.57,
    4.29,
    3.33,
    0.1,
    4.11,
    1.73,
    -0.92,
    5.27,
    5.13,
    7.49,
    2.66,
    4.54,
    6.32,
    3.68,
    3.99,
    5.11,
    4.47,
    2.17,
    -5.44,
    4.46,
    1.4,
    5.01,
    5.32,
    1.62,
    6.6,
    4.92,
    1.89,
    8.24,
    4.27,
    4.2,
    2.24,
    3.38,
    5.73,
    1.41,
    2.43,
    1.86,
    2.36,
    3.84,
    4.99,
    3.07,
    3.08,
    1.3,
    1.42,
    4.83,
    1.31,
    -0.67,
    6.42,
    6.47,
    0.94,
    1.69,
    5.26,
    0.95,
    2.97,
    4.43,
    0.72,
    3.52,
    3.3,
    0.86,
    3.87,
    2.43,
    1.13,
    4.04,
    1.82,
    1.47,
    4.22,
    0.56,
    2.31,
    5.57,
    6.34,
    -0.53,
    1.88,
    5.59,
    3.21,
    2.69,
    0.24,
    -1.46,
    7.07,
    1.61,
    0.34,
    4.9,
    7.74,
    2.36,
    -2.01,
    1.39,
    1.85,
    4.45,
    1.79,
    -0.98,
    4.85,
    4.67,
    2.66,
    3.08,
    1.33,
    -0.28,
    6.1,
    7.27,
    -2.89,
    -2.25,
    1.86,
    2.59,
    3.76,
    0.92,
    0.07,
    6.67,
    5,
    -6.14,
    1.89,
    5.09,
    -7.18,
    0.71,
    7.16,
    -0.81,
    -0.07,
    5.84,
    -5.25,
    0.92,
    6.85,
    3.66,
    0.72,
    2.41,
    -8.26,
    4.12,
    0.18,
    -1.69,
    6.57,
    2.1,
    -0.16,
    4.57,
    6.41,
    2.24,
    1.56,
    3.67,
    2.36,
    3.64,
    3.18,
    2.29,
    3.78,
    2.2,
    -4.6,
    4.48,
    6.23,
    -1.94,
    1.66,
    1.29,
    -9.3,
    4.09,
    3.21,
    -8.53,
    2.8,
    4.07,
    -7.99,
    1.93,
    2.72,
    2.32,
    3.78,
    2.29,
    2.4,
    3.7,
    2,
    2.5,
    3.69,
    6.13,
    3.4,
    2.04,
    2.29,
    2.89,
    3.78,
    2.72,
    2.96,
    3.87,
    3.18,
    2.96,
    3.88,
    3.67,
    2.93,
    3.72,
    4.02,
    2.86,
    3.48,
    7.56,
    4.11,
    -0.99,
    4.02,
    2.48,
    3.44,
    1.78,
    -2.68,
    5.21,
    1.22,
    -1.18,
    5.95,
    0.73,
    -2.54,
    5.82,
    4.14,
    -7,
    2.67,
    3.31,
    -7.66,
    3.38,
    1.31,
    -8.64,
    4.7,
    5.94,
    -6.22,
    -0.63,
    2,
    2.74,
    3.74,
    0.9,
    1.24,
    5.75,
    2.31,
    -8.97,
    3.61,
    6.95,
    -2.44,
    -0.13,
    1.1,
    -4.46,
    5.12,
    1.18,
    -4.58,
    5.19,
    1.26,
    -4.79,
    5.24,
    1.33,
    -5.11,
    5.21,
    1.55,
    -5.82,
    4.76,
    1.95,
    -4.18,
    4.43,
    2.12,
    -4.14,
    4.56,
    2.29,
    -4.05,
    4.58,
    2.85,
    -3.67,
    4.48,
    5.28,
    -2.24,
    2.86,
    0.95,
    1.91,
    5.2,
    1.31,
    3.1,
    4.23,
    1.78,
    2.86,
    3.88,
    1.85,
    -4.1,
    4.25,
    5.44,
    -4.03,
    2.11,
    0.77,
    3.18,
    4.86,
    1.94,
    -6.61,
    4.52,
    0.52,
    1.58,
    6.15,
    1.25,
    0.23,
    5.68,
    1,
    -6.93,
    4.98,
    3.29,
    -5.38,
    3.8,
    2.31,
    -1.57,
    4.59,
    2.68,
    -6.11,
    4.1,
    3.83,
    -1.54,
    4.14,
    2.96,
    -2.27,
    4.44,
    4.39,
    -2.68,
    3.64,
    1.22,
    -7.83,
    4.97,
    1.54,
    -0.14,
    5.2,
    3.88,
    -6.04,
    3.31,
    3.08,
    -6.81,
    3.81,
    3.75,
    -4.5,
    3.73,
    6.09,
    -3.21,
    1.47,
    4.59,
    -4.73,
    2.98,
    6.58,
    -3.94,
    0.07,
    3.49,
    -3.2,
    4.13,
    1.26,
    0.8,
    5.31,
    1.13,
    -0.93,
    6.54,
    1.44,
    -1.14,
    5.91,
    0.92,
    -0.53,
    7,
    1.76,
    3.53,
    4.33,
    2.63,
    3.71,
    4.36,
    3.39,
    3.72,
    4.31,
    4.08,
    3.68,
    4.08,
    4.62,
    3.47,
    3.65,
    5.17,
    2.54,
    2.67,
    7.3,
    0.76,
    -0.05,
    4.71,
    1.65,
    3.11,
    4.07,
    1.48,
    3.48,
    3.27,
    1.47,
    3.73,
    2.53,
    1.62,
    3.87,
    1.97,
    1.86,
    3.96,
    1.58,
    2.1,
    4.08,
    7.66,
    0.67,
    -2.44,
    1.4,
    -1.34,
    5.63,
    0.88,
    0.66,
    6.23,
    0.77,
    -0.97,
    7.08,
    0.46,
    -1.33,
    6.79,
    0.75,
    -1.07,
    6.8,
    1.24,
    -1.59,
    5.48,
    0.39,
    -1.41,
    6.96,
    0.32,
    -1.61,
    6.51,
    1.64,
    2.56,
    3.86,
    1.26,
    2.47,
    4.2,
    1.03,
    2.38,
    4.62,
    4.25,
    2.77,
    3.32,
    4.53,
    2.91,
    3.34
];
const FACE_INDICES = [
    173,
    155,
    133,
    246,
    33,
    7,
    382,
    398,
    362,
    263,
    466,
    249,
    308,
    415,
    324,
    78,
    95,
    191,
    356,
    389,
    264,
    127,
    34,
    162,
    368,
    264,
    389,
    139,
    162,
    34,
    267,
    0,
    302,
    37,
    72,
    0,
    11,
    302,
    0,
    11,
    0,
    72,
    349,
    451,
    350,
    120,
    121,
    231,
    452,
    350,
    451,
    232,
    231,
    121,
    267,
    302,
    269,
    37,
    39,
    72,
    303,
    269,
    302,
    73,
    72,
    39,
    357,
    343,
    350,
    128,
    121,
    114,
    277,
    350,
    343,
    47,
    114,
    121,
    350,
    452,
    357,
    121,
    128,
    232,
    453,
    357,
    452,
    233,
    232,
    128,
    299,
    333,
    297,
    69,
    67,
    104,
    332,
    297,
    333,
    103,
    104,
    67,
    175,
    152,
    396,
    175,
    171,
    152,
    377,
    396,
    152,
    148,
    152,
    171,
    381,
    384,
    382,
    154,
    155,
    157,
    398,
    382,
    384,
    173,
    157,
    155,
    280,
    347,
    330,
    50,
    101,
    118,
    348,
    330,
    347,
    119,
    118,
    101,
    269,
    303,
    270,
    39,
    40,
    73,
    304,
    270,
    303,
    74,
    73,
    40,
    9,
    336,
    151,
    9,
    151,
    107,
    337,
    151,
    336,
    108,
    107,
    151,
    344,
    278,
    360,
    115,
    131,
    48,
    279,
    360,
    278,
    49,
    48,
    131,
    262,
    431,
    418,
    32,
    194,
    211,
    424,
    418,
    431,
    204,
    211,
    194,
    304,
    408,
    270,
    74,
    40,
    184,
    409,
    270,
    408,
    185,
    184,
    40,
    272,
    310,
    407,
    42,
    183,
    80,
    415,
    407,
    310,
    191,
    80,
    183,
    322,
    270,
    410,
    92,
    186,
    40,
    409,
    410,
    270,
    185,
    40,
    186,
    347,
    449,
    348,
    118,
    119,
    229,
    450,
    348,
    449,
    230,
    229,
    119,
    434,
    432,
    430,
    214,
    210,
    212,
    422,
    430,
    432,
    202,
    212,
    210,
    313,
    314,
    18,
    83,
    18,
    84,
    17,
    18,
    314,
    17,
    84,
    18,
    307,
    375,
    306,
    77,
    76,
    146,
    291,
    306,
    375,
    61,
    146,
    76,
    259,
    387,
    260,
    29,
    30,
    160,
    388,
    260,
    387,
    161,
    160,
    30,
    286,
    414,
    384,
    56,
    157,
    190,
    398,
    384,
    414,
    173,
    190,
    157,
    418,
    424,
    406,
    194,
    182,
    204,
    335,
    406,
    424,
    106,
    204,
    182,
    367,
    416,
    364,
    138,
    135,
    192,
    434,
    364,
    416,
    214,
    192,
    135,
    391,
    423,
    327,
    165,
    98,
    203,
    358,
    327,
    423,
    129,
    203,
    98,
    298,
    301,
    284,
    68,
    54,
    71,
    251,
    284,
    301,
    21,
    71,
    54,
    4,
    275,
    5,
    4,
    5,
    45,
    281,
    5,
    275,
    51,
    45,
    5,
    254,
    373,
    253,
    24,
    23,
    144,
    374,
    253,
    373,
    145,
    144,
    23,
    320,
    321,
    307,
    90,
    77,
    91,
    375,
    307,
    321,
    146,
    91,
    77,
    280,
    425,
    411,
    50,
    187,
    205,
    427,
    411,
    425,
    207,
    205,
    187,
    421,
    313,
    200,
    201,
    200,
    83,
    18,
    200,
    313,
    18,
    83,
    200,
    335,
    321,
    406,
    106,
    182,
    91,
    405,
    406,
    321,
    181,
    91,
    182,
    405,
    321,
    404,
    181,
    180,
    91,
    320,
    404,
    321,
    90,
    91,
    180,
    17,
    314,
    16,
    17,
    16,
    84,
    315,
    16,
    314,
    85,
    84,
    16,
    425,
    266,
    426,
    205,
    206,
    36,
    423,
    426,
    266,
    203,
    36,
    206,
    369,
    396,
    400,
    140,
    176,
    171,
    377,
    400,
    396,
    148,
    171,
    176,
    391,
    269,
    322,
    165,
    92,
    39,
    270,
    322,
    269,
    40,
    39,
    92,
    417,
    465,
    413,
    193,
    189,
    245,
    464,
    413,
    465,
    244,
    245,
    189,
    257,
    258,
    386,
    27,
    159,
    28,
    385,
    386,
    258,
    158,
    28,
    159,
    260,
    388,
    467,
    30,
    247,
    161,
    466,
    467,
    388,
    246,
    161,
    247,
    248,
    456,
    419,
    3,
    196,
    236,
    399,
    419,
    456,
    174,
    236,
    196,
    333,
    298,
    332,
    104,
    103,
    68,
    284,
    332,
    298,
    54,
    68,
    103,
    285,
    8,
    417,
    55,
    193,
    8,
    168,
    417,
    8,
    168,
    8,
    193,
    340,
    261,
    346,
    111,
    117,
    31,
    448,
    346,
    261,
    228,
    31,
    117,
    285,
    417,
    441,
    55,
    221,
    193,
    413,
    441,
    417,
    189,
    193,
    221,
    327,
    460,
    326,
    98,
    97,
    240,
    328,
    326,
    460,
    99,
    240,
    97,
    277,
    355,
    329,
    47,
    100,
    126,
    371,
    329,
    355,
    142,
    126,
    100,
    309,
    392,
    438,
    79,
    218,
    166,
    439,
    438,
    392,
    219,
    166,
    218,
    381,
    382,
    256,
    154,
    26,
    155,
    341,
    256,
    382,
    112,
    155,
    26,
    360,
    279,
    420,
    131,
    198,
    49,
    429,
    420,
    279,
    209,
    49,
    198,
    365,
    364,
    379,
    136,
    150,
    135,
    394,
    379,
    364,
    169,
    135,
    150,
    355,
    277,
    437,
    126,
    217,
    47,
    343,
    437,
    277,
    114,
    47,
    217,
    443,
    444,
    282,
    223,
    52,
    224,
    283,
    282,
    444,
    53,
    224,
    52,
    281,
    275,
    363,
    51,
    134,
    45,
    440,
    363,
    275,
    220,
    45,
    134,
    431,
    262,
    395,
    211,
    170,
    32,
    369,
    395,
    262,
    140,
    32,
    170,
    337,
    299,
    338,
    108,
    109,
    69,
    297,
    338,
    299,
    67,
    69,
    109,
    335,
    273,
    321,
    106,
    91,
    43,
    375,
    321,
    273,
    146,
    43,
    91,
    348,
    450,
    349,
    119,
    120,
    230,
    451,
    349,
    450,
    231,
    230,
    120,
    467,
    359,
    342,
    247,
    113,
    130,
    446,
    342,
    359,
    226,
    130,
    113,
    282,
    283,
    334,
    52,
    105,
    53,
    293,
    334,
    283,
    63,
    53,
    105,
    250,
    458,
    462,
    20,
    242,
    238,
    461,
    462,
    458,
    241,
    238,
    242,
    276,
    353,
    300,
    46,
    70,
    124,
    383,
    300,
    353,
    156,
    124,
    70,
    325,
    292,
    324,
    96,
    95,
    62,
    308,
    324,
    292,
    78,
    62,
    95,
    283,
    276,
    293,
    53,
    63,
    46,
    300,
    293,
    276,
    70,
    46,
    63,
    447,
    264,
    345,
    227,
    116,
    34,
    372,
    345,
    264,
    143,
    34,
    116,
    352,
    345,
    346,
    123,
    117,
    116,
    340,
    346,
    345,
    111,
    116,
    117,
    1,
    19,
    274,
    1,
    44,
    19,
    354,
    274,
    19,
    125,
    19,
    44,
    248,
    281,
    456,
    3,
    236,
    51,
    363,
    456,
    281,
    134,
    51,
    236,
    425,
    426,
    427,
    205,
    207,
    206,
    436,
    427,
    426,
    216,
    206,
    207,
    380,
    381,
    252,
    153,
    22,
    154,
    256,
    252,
    381,
    26,
    154,
    22,
    391,
    393,
    269,
    165,
    39,
    167,
    267,
    269,
    393,
    37,
    167,
    39,
    199,
    428,
    200,
    199,
    200,
    208,
    421,
    200,
    428,
    201,
    208,
    200,
    330,
    329,
    266,
    101,
    36,
    100,
    371,
    266,
    329,
    142,
    100,
    36,
    422,
    432,
    273,
    202,
    43,
    212,
    287,
    273,
    432,
    57,
    212,
    43,
    290,
    250,
    328,
    60,
    99,
    20,
    462,
    328,
    250,
    242,
    20,
    99,
    258,
    286,
    385,
    28,
    158,
    56,
    384,
    385,
    286,
    157,
    56,
    158,
    342,
    446,
    353,
    113,
    124,
    226,
    265,
    353,
    446,
    35,
    226,
    124,
    257,
    386,
    259,
    27,
    29,
    159,
    387,
    259,
    386,
    160,
    159,
    29,
    430,
    422,
    431,
    210,
    211,
    202,
    424,
    431,
    422,
    204,
    202,
    211,
    445,
    342,
    276,
    225,
    46,
    113,
    353,
    276,
    342,
    124,
    113,
    46,
    424,
    422,
    335,
    204,
    106,
    202,
    273,
    335,
    422,
    43,
    202,
    106,
    306,
    292,
    307,
    76,
    77,
    62,
    325,
    307,
    292,
    96,
    62,
    77,
    366,
    447,
    352,
    137,
    123,
    227,
    345,
    352,
    447,
    116,
    227,
    123,
    302,
    268,
    303,
    72,
    73,
    38,
    271,
    303,
    268,
    41,
    38,
    73,
    371,
    358,
    266,
    142,
    36,
    129,
    423,
    266,
    358,
    203,
    129,
    36,
    327,
    294,
    460,
    98,
    240,
    64,
    455,
    460,
    294,
    235,
    64,
    240,
    294,
    331,
    278,
    64,
    48,
    102,
    279,
    278,
    331,
    49,
    102,
    48,
    303,
    271,
    304,
    73,
    74,
    41,
    272,
    304,
    271,
    42,
    41,
    74,
    427,
    436,
    434,
    207,
    214,
    216,
    432,
    434,
    436,
    212,
    216,
    214,
    304,
    272,
    408,
    74,
    184,
    42,
    407,
    408,
    272,
    183,
    42,
    184,
    394,
    430,
    395,
    169,
    170,
    210,
    431,
    395,
    430,
    211,
    210,
    170,
    395,
    369,
    378,
    170,
    149,
    140,
    400,
    378,
    369,
    176,
    140,
    149,
    296,
    334,
    299,
    66,
    69,
    105,
    333,
    299,
    334,
    104,
    105,
    69,
    417,
    168,
    351,
    193,
    122,
    168,
    6,
    351,
    168,
    6,
    168,
    122,
    280,
    411,
    352,
    50,
    123,
    187,
    376,
    352,
    411,
    147,
    187,
    123,
    319,
    320,
    325,
    89,
    96,
    90,
    307,
    325,
    320,
    77,
    90,
    96,
    285,
    295,
    336,
    55,
    107,
    65,
    296,
    336,
    295,
    66,
    65,
    107,
    404,
    320,
    403,
    180,
    179,
    90,
    319,
    403,
    320,
    89,
    90,
    179,
    330,
    348,
    329,
    101,
    100,
    119,
    349,
    329,
    348,
    120,
    119,
    100,
    334,
    293,
    333,
    105,
    104,
    63,
    298,
    333,
    293,
    68,
    63,
    104,
    323,
    454,
    366,
    93,
    137,
    234,
    447,
    366,
    454,
    227,
    234,
    137,
    16,
    315,
    15,
    16,
    15,
    85,
    316,
    15,
    315,
    86,
    85,
    15,
    429,
    279,
    358,
    209,
    129,
    49,
    331,
    358,
    279,
    102,
    49,
    129,
    15,
    316,
    14,
    15,
    14,
    86,
    317,
    14,
    316,
    87,
    86,
    14,
    8,
    285,
    9,
    8,
    9,
    55,
    336,
    9,
    285,
    107,
    55,
    9,
    329,
    349,
    277,
    100,
    47,
    120,
    350,
    277,
    349,
    121,
    120,
    47,
    252,
    253,
    380,
    22,
    153,
    23,
    374,
    380,
    253,
    145,
    23,
    153,
    402,
    403,
    318,
    178,
    88,
    179,
    319,
    318,
    403,
    89,
    179,
    88,
    351,
    6,
    419,
    122,
    196,
    6,
    197,
    419,
    6,
    197,
    6,
    196,
    324,
    318,
    325,
    95,
    96,
    88,
    319,
    325,
    318,
    89,
    88,
    96,
    397,
    367,
    365,
    172,
    136,
    138,
    364,
    365,
    367,
    135,
    138,
    136,
    288,
    435,
    397,
    58,
    172,
    215,
    367,
    397,
    435,
    138,
    215,
    172,
    438,
    439,
    344,
    218,
    115,
    219,
    278,
    344,
    439,
    48,
    219,
    115,
    271,
    311,
    272,
    41,
    42,
    81,
    310,
    272,
    311,
    80,
    81,
    42,
    5,
    281,
    195,
    5,
    195,
    51,
    248,
    195,
    281,
    3,
    51,
    195,
    273,
    287,
    375,
    43,
    146,
    57,
    291,
    375,
    287,
    61,
    57,
    146,
    396,
    428,
    175,
    171,
    175,
    208,
    199,
    175,
    428,
    199,
    208,
    175,
    268,
    312,
    271,
    38,
    41,
    82,
    311,
    271,
    312,
    81,
    82,
    41,
    444,
    445,
    283,
    224,
    53,
    225,
    276,
    283,
    445,
    46,
    225,
    53,
    254,
    339,
    373,
    24,
    144,
    110,
    390,
    373,
    339,
    163,
    110,
    144,
    295,
    282,
    296,
    65,
    66,
    52,
    334,
    296,
    282,
    105,
    52,
    66,
    346,
    448,
    347,
    117,
    118,
    228,
    449,
    347,
    448,
    229,
    228,
    118,
    454,
    356,
    447,
    234,
    227,
    127,
    264,
    447,
    356,
    34,
    127,
    227,
    336,
    296,
    337,
    107,
    108,
    66,
    299,
    337,
    296,
    69,
    66,
    108,
    151,
    337,
    10,
    151,
    10,
    108,
    338,
    10,
    337,
    109,
    108,
    10,
    278,
    439,
    294,
    48,
    64,
    219,
    455,
    294,
    439,
    235,
    219,
    64,
    407,
    415,
    292,
    183,
    62,
    191,
    308,
    292,
    415,
    78,
    191,
    62,
    358,
    371,
    429,
    129,
    209,
    142,
    355,
    429,
    371,
    126,
    142,
    209,
    345,
    372,
    340,
    116,
    111,
    143,
    265,
    340,
    372,
    35,
    143,
    111,
    388,
    390,
    466,
    161,
    246,
    163,
    249,
    466,
    390,
    7,
    163,
    246,
    352,
    346,
    280,
    123,
    50,
    117,
    347,
    280,
    346,
    118,
    117,
    50,
    295,
    442,
    282,
    65,
    52,
    222,
    443,
    282,
    442,
    223,
    222,
    52,
    19,
    94,
    354,
    19,
    125,
    94,
    370,
    354,
    94,
    141,
    94,
    125,
    295,
    285,
    442,
    65,
    222,
    55,
    441,
    442,
    285,
    221,
    55,
    222,
    419,
    197,
    248,
    196,
    3,
    197,
    195,
    248,
    197,
    195,
    197,
    3,
    359,
    263,
    255,
    130,
    25,
    33,
    249,
    255,
    263,
    7,
    33,
    25,
    275,
    274,
    440,
    45,
    220,
    44,
    457,
    440,
    274,
    237,
    44,
    220,
    300,
    383,
    301,
    70,
    71,
    156,
    368,
    301,
    383,
    139,
    156,
    71,
    417,
    351,
    465,
    193,
    245,
    122,
    412,
    465,
    351,
    188,
    122,
    245,
    466,
    263,
    467,
    246,
    247,
    33,
    359,
    467,
    263,
    130,
    33,
    247,
    389,
    251,
    368,
    162,
    139,
    21,
    301,
    368,
    251,
    71,
    21,
    139,
    374,
    386,
    380,
    145,
    153,
    159,
    385,
    380,
    386,
    158,
    159,
    153,
    379,
    394,
    378,
    150,
    149,
    169,
    395,
    378,
    394,
    170,
    169,
    149,
    351,
    419,
    412,
    122,
    188,
    196,
    399,
    412,
    419,
    174,
    196,
    188,
    426,
    322,
    436,
    206,
    216,
    92,
    410,
    436,
    322,
    186,
    92,
    216,
    387,
    373,
    388,
    160,
    161,
    144,
    390,
    388,
    373,
    163,
    144,
    161,
    393,
    326,
    164,
    167,
    164,
    97,
    2,
    164,
    326,
    2,
    97,
    164,
    354,
    370,
    461,
    125,
    241,
    141,
    462,
    461,
    370,
    242,
    141,
    241,
    0,
    267,
    164,
    0,
    164,
    37,
    393,
    164,
    267,
    167,
    37,
    164,
    11,
    12,
    302,
    11,
    72,
    12,
    268,
    302,
    12,
    38,
    12,
    72,
    386,
    374,
    387,
    159,
    160,
    145,
    373,
    387,
    374,
    144,
    145,
    160,
    12,
    13,
    268,
    12,
    38,
    13,
    312,
    268,
    13,
    82,
    13,
    38,
    293,
    300,
    298,
    63,
    68,
    70,
    301,
    298,
    300,
    71,
    70,
    68,
    340,
    265,
    261,
    111,
    31,
    35,
    446,
    261,
    265,
    226,
    35,
    31,
    380,
    385,
    381,
    153,
    154,
    158,
    384,
    381,
    385,
    157,
    158,
    154,
    280,
    330,
    425,
    50,
    205,
    101,
    266,
    425,
    330,
    36,
    101,
    205,
    423,
    391,
    426,
    203,
    206,
    165,
    322,
    426,
    391,
    92,
    165,
    206,
    429,
    355,
    420,
    209,
    198,
    126,
    437,
    420,
    355,
    217,
    126,
    198,
    391,
    327,
    393,
    165,
    167,
    98,
    326,
    393,
    327,
    97,
    98,
    167,
    457,
    438,
    440,
    237,
    220,
    218,
    344,
    440,
    438,
    115,
    218,
    220,
    382,
    362,
    341,
    155,
    112,
    133,
    463,
    341,
    362,
    243,
    133,
    112,
    457,
    461,
    459,
    237,
    239,
    241,
    458,
    459,
    461,
    238,
    241,
    239,
    434,
    430,
    364,
    214,
    135,
    210,
    394,
    364,
    430,
    169,
    210,
    135,
    414,
    463,
    398,
    190,
    173,
    243,
    362,
    398,
    463,
    133,
    243,
    173,
    262,
    428,
    369,
    32,
    140,
    208,
    396,
    369,
    428,
    171,
    208,
    140,
    457,
    274,
    461,
    237,
    241,
    44,
    354,
    461,
    274,
    125,
    44,
    241,
    316,
    403,
    317,
    86,
    87,
    179,
    402,
    317,
    403,
    178,
    179,
    87,
    315,
    404,
    316,
    85,
    86,
    180,
    403,
    316,
    404,
    179,
    180,
    86,
    314,
    405,
    315,
    84,
    85,
    181,
    404,
    315,
    405,
    180,
    181,
    85,
    313,
    406,
    314,
    83,
    84,
    182,
    405,
    314,
    406,
    181,
    182,
    84,
    418,
    406,
    421,
    194,
    201,
    182,
    313,
    421,
    406,
    83,
    182,
    201,
    366,
    401,
    323,
    137,
    93,
    177,
    361,
    323,
    401,
    132,
    177,
    93,
    408,
    407,
    306,
    184,
    76,
    183,
    292,
    306,
    407,
    62,
    183,
    76,
    408,
    306,
    409,
    184,
    185,
    76,
    291,
    409,
    306,
    61,
    76,
    185,
    410,
    409,
    287,
    186,
    57,
    185,
    291,
    287,
    409,
    61,
    185,
    57,
    436,
    410,
    432,
    216,
    212,
    186,
    287,
    432,
    410,
    57,
    186,
    212,
    434,
    416,
    427,
    214,
    207,
    192,
    411,
    427,
    416,
    187,
    192,
    207,
    264,
    368,
    372,
    34,
    143,
    139,
    383,
    372,
    368,
    156,
    139,
    143,
    457,
    459,
    438,
    237,
    218,
    239,
    309,
    438,
    459,
    79,
    239,
    218,
    352,
    376,
    366,
    123,
    137,
    147,
    401,
    366,
    376,
    177,
    147,
    137,
    4,
    1,
    275,
    4,
    45,
    1,
    274,
    275,
    1,
    44,
    1,
    45,
    428,
    262,
    421,
    208,
    201,
    32,
    418,
    421,
    262,
    194,
    32,
    201,
    327,
    358,
    294,
    98,
    64,
    129,
    331,
    294,
    358,
    102,
    129,
    64,
    367,
    435,
    416,
    138,
    192,
    215,
    433,
    416,
    435,
    213,
    215,
    192,
    455,
    439,
    289,
    235,
    59,
    219,
    392,
    289,
    439,
    166,
    219,
    59,
    328,
    462,
    326,
    99,
    97,
    242,
    370,
    326,
    462,
    141,
    242,
    97,
    326,
    370,
    2,
    97,
    2,
    141,
    94,
    2,
    370,
    94,
    141,
    2,
    460,
    455,
    305,
    240,
    75,
    235,
    289,
    305,
    455,
    59,
    235,
    75,
    448,
    339,
    449,
    228,
    229,
    110,
    254,
    449,
    339,
    24,
    110,
    229,
    261,
    446,
    255,
    31,
    25,
    226,
    359,
    255,
    446,
    130,
    226,
    25,
    449,
    254,
    450,
    229,
    230,
    24,
    253,
    450,
    254,
    23,
    24,
    230,
    450,
    253,
    451,
    230,
    231,
    23,
    252,
    451,
    253,
    22,
    23,
    231,
    451,
    252,
    452,
    231,
    232,
    22,
    256,
    452,
    252,
    26,
    22,
    232,
    256,
    341,
    452,
    26,
    232,
    112,
    453,
    452,
    341,
    233,
    112,
    232,
    413,
    464,
    414,
    189,
    190,
    244,
    463,
    414,
    464,
    243,
    244,
    190,
    441,
    413,
    286,
    221,
    56,
    189,
    414,
    286,
    413,
    190,
    189,
    56,
    441,
    286,
    442,
    221,
    222,
    56,
    258,
    442,
    286,
    28,
    56,
    222,
    442,
    258,
    443,
    222,
    223,
    28,
    257,
    443,
    258,
    27,
    28,
    223,
    444,
    443,
    259,
    224,
    29,
    223,
    257,
    259,
    443,
    27,
    223,
    29,
    259,
    260,
    444,
    29,
    224,
    30,
    445,
    444,
    260,
    225,
    30,
    224,
    260,
    467,
    445,
    30,
    225,
    247,
    342,
    445,
    467,
    113,
    247,
    225,
    250,
    309,
    458,
    20,
    238,
    79,
    459,
    458,
    309,
    239,
    79,
    238,
    290,
    305,
    392,
    60,
    166,
    75,
    289,
    392,
    305,
    59,
    75,
    166,
    460,
    305,
    328,
    240,
    99,
    75,
    290,
    328,
    305,
    60,
    75,
    99,
    376,
    433,
    401,
    147,
    177,
    213,
    435,
    401,
    433,
    215,
    213,
    177,
    250,
    290,
    309,
    20,
    79,
    60,
    392,
    309,
    290,
    166,
    60,
    79,
    411,
    416,
    376,
    187,
    147,
    192,
    433,
    376,
    416,
    213,
    192,
    147,
    341,
    463,
    453,
    112,
    233,
    243,
    464,
    453,
    463,
    244,
    243,
    233,
    453,
    464,
    357,
    233,
    128,
    244,
    465,
    357,
    464,
    245,
    244,
    128,
    412,
    343,
    465,
    188,
    245,
    114,
    357,
    465,
    343,
    128,
    114,
    245,
    437,
    343,
    399,
    217,
    174,
    114,
    412,
    399,
    343,
    188,
    114,
    174,
    363,
    440,
    360,
    134,
    131,
    220,
    344,
    360,
    440,
    115,
    220,
    131,
    456,
    420,
    399,
    236,
    174,
    198,
    437,
    399,
    420,
    217,
    198,
    174,
    456,
    363,
    420,
    236,
    198,
    134,
    360,
    420,
    363,
    131,
    134,
    198,
    361,
    401,
    288,
    132,
    58,
    177,
    435,
    288,
    401,
    215,
    177,
    58,
    353,
    265,
    383,
    124,
    156,
    35,
    372,
    383,
    265,
    143,
    35,
    156,
    255,
    249,
    339,
    25,
    110,
    7,
    390,
    339,
    249,
    163,
    7,
    110,
    261,
    255,
    448,
    31,
    228,
    25,
    339,
    448,
    255,
    110,
    25,
    228,
    14,
    317,
    13,
    14,
    13,
    87,
    312,
    13,
    317,
    82,
    87,
    13,
    317,
    402,
    312,
    87,
    82,
    178,
    311,
    312,
    402,
    81,
    178,
    82,
    402,
    318,
    311,
    178,
    81,
    88,
    310,
    311,
    318,
    80,
    88,
    81,
    318,
    324,
    310,
    88,
    80,
    95,
    415,
    310,
    324,
    191,
    95,
    80
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0kbrhl2._.js.map