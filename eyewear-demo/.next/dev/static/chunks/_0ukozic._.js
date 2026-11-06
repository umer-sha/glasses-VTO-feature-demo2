(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/node_modules/next/dist/server/app-render/async-local-storage.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    bindSnapshot: null,
    createAsyncLocalStorage: null,
    createSnapshot: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    bindSnapshot: function() {
        return bindSnapshot;
    },
    createAsyncLocalStorage: function() {
        return createAsyncLocalStorage;
    },
    createSnapshot: function() {
        return createSnapshot;
    }
});
const sharedAsyncLocalStorageNotAvailableError = Object.defineProperty(new Error('Invariant: AsyncLocalStorage accessed in runtime where it is not available'), "__NEXT_ERROR_CODE", {
    value: "E504",
    enumerable: false,
    configurable: true
});
class FakeAsyncLocalStorage {
    disable() {
        throw sharedAsyncLocalStorageNotAvailableError;
    }
    getStore() {
        // This fake implementation of AsyncLocalStorage always returns `undefined`.
        return undefined;
    }
    run() {
        throw sharedAsyncLocalStorageNotAvailableError;
    }
    exit() {
        throw sharedAsyncLocalStorageNotAvailableError;
    }
    enterWith() {
        throw sharedAsyncLocalStorageNotAvailableError;
    }
    static bind(fn) {
        return fn;
    }
}
const maybeGlobalAsyncLocalStorage = typeof globalThis !== 'undefined' && globalThis.AsyncLocalStorage;
function createAsyncLocalStorage() {
    if (maybeGlobalAsyncLocalStorage) {
        return new maybeGlobalAsyncLocalStorage();
    }
    return new FakeAsyncLocalStorage();
}
function bindSnapshot(fn) {
    if (maybeGlobalAsyncLocalStorage) {
        return maybeGlobalAsyncLocalStorage.bind(fn);
    }
    return FakeAsyncLocalStorage.bind(fn);
}
function createSnapshot() {
    if (maybeGlobalAsyncLocalStorage) {
        return maybeGlobalAsyncLocalStorage.snapshot();
    }
    return function(fn, ...args) {
        return fn(...args);
    };
}
}),
"[project]/node_modules/next/dist/server/app-render/work-async-storage-instance.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "workAsyncStorageInstance", {
    enumerable: true,
    get: function() {
        return workAsyncStorageInstance;
    }
});
const _asynclocalstorage = __turbopack_context__.r("[project]/node_modules/next/dist/server/app-render/async-local-storage.js [app-client] (ecmascript)");
const workAsyncStorageInstance = (0, _asynclocalstorage.createAsyncLocalStorage)();
}),
"[project]/node_modules/next/dist/server/app-render/work-async-storage.external.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "workAsyncStorage", {
    enumerable: true,
    get: function() {
        return _workasyncstorageinstance.workAsyncStorageInstance;
    }
});
const _workasyncstorageinstance = __turbopack_context__.r("[project]/node_modules/next/dist/server/app-render/work-async-storage-instance.js [app-client] (ecmascript)");
}),
"[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return dynamic;
    }
});
const _interop_require_default = __turbopack_context__.r("[project]/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-client] (ecmascript)");
const _loadable = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/lazy-dynamic/loadable.js [app-client] (ecmascript)"));
function dynamic(dynamicOptions, options) {
    const loadableOptions = {};
    if (typeof dynamicOptions === 'function') {
        loadableOptions.loader = dynamicOptions;
    }
    const mergedOptions = {
        ...loadableOptions,
        ...options
    };
    return (0, _loadable.default)({
        ...mergedOptions,
        modules: mergedOptions.loadableGenerated?.modules
    });
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/node_modules/next/dist/shared/lib/encode-uri-path.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "encodeURIPath", {
    enumerable: true,
    get: function() {
        return encodeURIPath;
    }
});
function encodeURIPath(file) {
    return file.split('/').map((p)=>encodeURIComponent(p)).join('/');
}
}),
"[project]/node_modules/next/dist/shared/lib/lazy-dynamic/dynamic-bailout-to-csr.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BailoutToCSR", {
    enumerable: true,
    get: function() {
        return BailoutToCSR;
    }
});
const _bailouttocsr = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/lazy-dynamic/bailout-to-csr.js [app-client] (ecmascript)");
function BailoutToCSR({ reason, children }) {
    if (typeof window === 'undefined') {
        throw Object.defineProperty(new _bailouttocsr.BailoutToCSRError(reason), "__NEXT_ERROR_CODE", {
            value: "E394",
            enumerable: false,
            configurable: true
        });
    }
    return children;
}
}),
"[project]/node_modules/next/dist/shared/lib/lazy-dynamic/loadable.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _react = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
const _dynamicbailouttocsr = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/lazy-dynamic/dynamic-bailout-to-csr.js [app-client] (ecmascript)");
const _preloadchunks = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/lazy-dynamic/preload-chunks.js [app-client] (ecmascript)");
// Normalize loader to return the module as form { default: Component } for `React.lazy`.
// Also for backward compatible since next/dynamic allows to resolve a component directly with loader
// Client component reference proxy need to be converted to a module.
function convertModule(mod) {
    // Check "default" prop before accessing it, as it could be client reference proxy that could break it reference.
    // Cases:
    // mod: { default: Component }
    // mod: Component
    // mod: { default: proxy(Component) }
    // mod: proxy(Component)
    const hasDefault = mod && 'default' in mod;
    return {
        default: hasDefault ? mod.default : mod
    };
}
const defaultOptions = {
    loader: ()=>Promise.resolve(convertModule(()=>null)),
    loading: null,
    ssr: true
};
function Loadable(options) {
    const opts = {
        ...defaultOptions,
        ...options
    };
    const Lazy = /*#__PURE__*/ (0, _react.lazy)(()=>opts.loader().then(convertModule));
    const Loading = opts.loading;
    function LoadableComponent(props) {
        const fallbackElement = Loading ? /*#__PURE__*/ (0, _jsxruntime.jsx)(Loading, {
            isLoading: true,
            pastDelay: true,
            error: null
        }) : null;
        // If it's non-SSR or provided a loading component, wrap it in a suspense boundary
        const hasSuspenseBoundary = !opts.ssr || !!opts.loading;
        const Wrap = hasSuspenseBoundary ? _react.Suspense : _react.Fragment;
        const wrapProps = hasSuspenseBoundary ? {
            fallback: fallbackElement
        } : {};
        const children = opts.ssr ? /*#__PURE__*/ (0, _jsxruntime.jsxs)(_jsxruntime.Fragment, {
            children: [
                typeof window === 'undefined' ? /*#__PURE__*/ (0, _jsxruntime.jsx)(_preloadchunks.PreloadChunks, {
                    moduleIds: opts.modules
                }) : null,
                /*#__PURE__*/ (0, _jsxruntime.jsx)(Lazy, {
                    ...props
                })
            ]
        }) : /*#__PURE__*/ (0, _jsxruntime.jsx)(_dynamicbailouttocsr.BailoutToCSR, {
            reason: "next/dynamic",
            children: /*#__PURE__*/ (0, _jsxruntime.jsx)(Lazy, {
                ...props
            })
        });
        return /*#__PURE__*/ (0, _jsxruntime.jsx)(Wrap, {
            ...wrapProps,
            children: children
        });
    }
    LoadableComponent.displayName = 'LoadableComponent';
    return LoadableComponent;
}
const _default = Loadable;
}),
"[project]/node_modules/next/dist/shared/lib/lazy-dynamic/preload-chunks.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PreloadChunks", {
    enumerable: true,
    get: function() {
        return PreloadChunks;
    }
});
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _reactdom = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
const _workasyncstorageexternal = __turbopack_context__.r("[project]/node_modules/next/dist/server/app-render/work-async-storage.external.js [app-client] (ecmascript)");
const _encodeuripath = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/encode-uri-path.js [app-client] (ecmascript)");
const _deploymentid = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/deployment-id.js [app-client] (ecmascript)");
function PreloadChunks({ moduleIds }) {
    // Early return in client compilation and only load requestStore on server side
    if (typeof window !== 'undefined') {
        return null;
    }
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    if (workStore === undefined) {
        return null;
    }
    const allFiles = [];
    // Search the current dynamic call unique key id in react loadable manifest,
    // and find the corresponding CSS files to preload
    if (workStore.reactLoadableManifest && moduleIds) {
        const manifest = workStore.reactLoadableManifest;
        for (const key of moduleIds){
            if (!manifest[key]) continue;
            const chunks = manifest[key].files;
            allFiles.push(...chunks);
        }
    }
    if (allFiles.length === 0) {
        return null;
    }
    const query = (0, _deploymentid.getAssetTokenQuery)();
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(_jsxruntime.Fragment, {
        children: allFiles.map((chunk)=>{
            const href = `${workStore.assetPrefix}/_next/${(0, _encodeuripath.encodeURIPath)(chunk)}${query}`;
            const isCss = chunk.endsWith('.css');
            // If it's stylesheet we use `precedence` o help hoist with React Float.
            // For stylesheets we actually need to render the CSS because nothing else is going to do it so it needs to be part of the component tree.
            // The `preload` for stylesheet is not optional.
            if (isCss) {
                return /*#__PURE__*/ (0, _jsxruntime.jsx)("link", {
                    // @ts-ignore
                    precedence: "dynamic",
                    href: href,
                    rel: "stylesheet",
                    as: "style",
                    nonce: workStore.nonce
                }, chunk);
            } else {
                // If it's script we use ReactDOM.preload to preload the resources
                (0, _reactdom.preload)(href, {
                    as: 'script',
                    fetchPriority: 'low',
                    nonce: workStore.nonce
                });
                return null;
            }
        })
    });
}
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
"[project]/src/app/try-on/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TryOnPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$glasses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/glasses.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cart$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cart.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$stylist$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/stylist.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Providers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Providers.tsx [app-client] (ecmascript)");
;
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
const TryOnView = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/src/components/TryOnView.tsx [app-client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/src/components/TryOnView.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c = TryOnView;
function TryOnContent({ searchParams }) {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["use"])(searchParams);
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Providers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrefs"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { count } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cart$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"])();
    const [frameKey, setFrameKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(params.id && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$glasses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["glasses"][params.id] ? params.id : "bold");
    const [colorName, setColorName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(params.color ?? "");
    const [faceMetrics, setFaceMetrics] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showPick, setShowPick] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const product = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$glasses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["glasses"][frameKey];
    const active = product.colors.find((c)=>c.name.toLowerCase() === colorName.toLowerCase()) ?? product.colors[0];
    const rec = faceMetrics ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$stylist$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["recommend"])(faceMetrics.shape, faceMetrics.skinTone) : null;
    function pickFrame(key) {
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$glasses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["glasses"][key]) return;
        setFrameKey(key);
        setColorName(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$glasses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["glasses"][key].colors[0].name);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "container-x py-6 md:py-10",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6 flex flex-wrap items-end justify-between gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "font-display text-3xl tracking-tight sm:text-4xl",
                        children: t("tryon.title")
                    }, void 0, false, {
                        fileName: "[project]/src/app/try-on/page.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/cart",
                        className: "text-sm text-muted transition hover:text-fg",
                        children: [
                            t("nav.cart"),
                            " (",
                            count,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/try-on/page.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/try-on/page.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-6 lg:grid-cols-[1fr_380px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TryOnView, {
                                product: product,
                                color: active.original ? null : active.hex,
                                productKey: frameKey,
                                currentColorName: active.name,
                                onSelectFrame: pickFrame,
                                onSelectColor: setColorName,
                                onFaceScanned: setFaceMetrics
                            }, void 0, false, {
                                fileName: "[project]/src/app/try-on/page.tsx",
                                lineNumber: 49,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-3 text-center text-xs text-muted",
                                children: t("tryon.hint")
                            }, void 0, false, {
                                fileName: "[project]/src/app/try-on/page.tsx",
                                lineNumber: 58,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/try-on/page.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "flex flex-col gap-4",
                        children: [
                            rec && showPick && faceMetrics && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "card border-accent/40 p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start justify-between gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-[11px] font-semibold uppercase tracking-[0.18em] text-accent",
                                                children: [
                                                    "✦ ",
                                                    t("tryon.match")
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/try-on/page.tsx",
                                                lineNumber: 66,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowPick(false),
                                                className: "text-muted hover:text-fg",
                                                "aria-label": "Close",
                                                children: "✕"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/try-on/page.tsx",
                                                lineNumber: 67,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/try-on/page.tsx",
                                        lineNumber: 65,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-1 text-xs text-muted",
                                        children: [
                                            t(`shape.${faceMetrics.shape}`),
                                            " · ",
                                            t(`tone.${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$stylist$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toneKey"])(faceMetrics.skinTone)}`)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/try-on/page.tsx",
                                        lineNumber: 69,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2 font-display text-lg",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$glasses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["glasses"][rec.id].name
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/try-on/page.tsx",
                                        lineNumber: 72,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-muted",
                                        children: rec.colorName
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/try-on/page.tsx",
                                        lineNumber: 73,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setFrameKey(rec.id);
                                            setColorName(rec.colorName);
                                        },
                                        className: "btn btn-primary mt-3 w-full !py-2.5",
                                        children: t("tryon.apply")
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/try-on/page.tsx",
                                        lineNumber: 74,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/try-on/page.tsx",
                                lineNumber: 64,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "card p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-3 text-xs uppercase tracking-[0.18em] text-muted",
                                        children: t("tryon.frames")
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/try-on/page.tsx",
                                        lineNumber: 87,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col gap-2",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$glasses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["glassesList"].map((g)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>pickFrame(g.id),
                                                className: `flex items-center justify-between rounded-xl border px-4 py-3 text-start transition ${g.id === frameKey ? "border-accent bg-accent/10" : "border-line hover:border-muted"}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "block text-sm font-semibold",
                                                                children: g.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/try-on/page.tsx",
                                                                lineNumber: 98,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "block text-xs text-muted",
                                                                children: g.tagline
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/try-on/page.tsx",
                                                                lineNumber: 99,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/try-on/page.tsx",
                                                        lineNumber: 97,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-mono text-sm text-accent",
                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cart$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["money"])(g.price)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/try-on/page.tsx",
                                                        lineNumber: 101,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, g.id, true, {
                                                fileName: "[project]/src/app/try-on/page.tsx",
                                                lineNumber: 90,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/try-on/page.tsx",
                                        lineNumber: 88,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/try-on/page.tsx",
                                lineNumber: 86,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "card p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-3 text-xs uppercase tracking-[0.18em] text-muted",
                                        children: [
                                            t("tryon.finish"),
                                            ": ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-fg",
                                                children: active.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/try-on/page.tsx",
                                                lineNumber: 109,
                                                columnNumber: 36
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/try-on/page.tsx",
                                        lineNumber: 108,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap gap-3",
                                        children: product.colors.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setColorName(c.name),
                                                title: c.name,
                                                "aria-label": c.name,
                                                className: `h-10 w-10 rounded-full border-2 transition ${active.name === c.name ? "scale-110 border-accent ring-4 ring-accent/20" : "border-line hover:border-muted"}`,
                                                style: {
                                                    background: c.hex
                                                }
                                            }, c.name, false, {
                                                fileName: "[project]/src/app/try-on/page.tsx",
                                                lineNumber: 113,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/try-on/page.tsx",
                                        lineNumber: 111,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/try-on/page.tsx",
                                lineNumber: 107,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "card p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-3 flex items-baseline justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-display text-lg",
                                                children: product.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/try-on/page.tsx",
                                                lineNumber: 129,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-mono text-xl text-accent",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cart$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["money"])(product.price)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/try-on/page.tsx",
                                                lineNumber: 130,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/try-on/page.tsx",
                                        lineNumber: 128,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cart$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cart"].add(frameKey, active.name),
                                                className: "btn btn-primary",
                                                children: t("shop.add")
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/try-on/page.tsx",
                                                lineNumber: 133,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cart$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cart"].add(frameKey, active.name);
                                                    router.push("/checkout");
                                                },
                                                className: "btn btn-ghost",
                                                children: t("product.buy")
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/try-on/page.tsx",
                                                lineNumber: 134,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/try-on/page.tsx",
                                        lineNumber: 132,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/try-on/page.tsx",
                                lineNumber: 127,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/try-on/page.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/try-on/page.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/try-on/page.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_s(TryOnContent, "ZmlQBIHR4wFT7Z0pHsTT0Kzos74=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Providers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrefs"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cart$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"]
    ];
});
_c1 = TryOnContent;
function TryOnPage({ searchParams }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container-x py-24 text-center text-muted",
            children: "…"
        }, void 0, false, {
            fileName: "[project]/src/app/try-on/page.tsx",
            lineNumber: 153,
            columnNumber: 25
        }, this),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TryOnContent, {
            searchParams: searchParams
        }, void 0, false, {
            fileName: "[project]/src/app/try-on/page.tsx",
            lineNumber: 154,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/try-on/page.tsx",
        lineNumber: 153,
        columnNumber: 5
    }, this);
}
_c2 = TryOnPage;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "TryOnView");
__turbopack_context__.k.register(_c1, "TryOnContent");
__turbopack_context__.k.register(_c2, "TryOnPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/stylist.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "matchColor",
    ()=>matchColor,
    "norm",
    ()=>norm,
    "parse",
    ()=>parse,
    "recommend",
    ()=>recommend,
    "toneKey",
    ()=>toneKey
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$glasses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/glasses.ts [app-client] (ecmascript)");
;
function norm(s) {
    return " " + s.toLowerCase().normalize("NFKD").replace(/[ً-ٰٟ̀-ͯ]/g, "") // arabic marks + latin accents
    .replace(/[يى]/g, "ی").replace(/ك/g, "ک").replace(/[ةۃ]/g, "ہ").replace(/[أإآٱ]/g, "ا").replace(/ۓ/g, "ے").replace(/[.,!?؟،;:"“”«»()\-–—_/\\]/g, " ").replace(/\s+/g, " ").trim() + " ";
}
function lev(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    const dp = Array.from({
        length: a.length + 1
    }, (_, i)=>[
            i,
            ...Array(b.length).fill(0)
        ]);
    for(let j = 1; j <= b.length; j++)dp[0][j] = j;
    for(let i = 1; i <= a.length; i++)for(let j = 1; j <= b.length; j++)dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return dp[a.length][b.length];
}
const LATIN = /^[a-z]+$/;
function hit(text, tokens, phrase) {
    const p = norm(phrase).trim();
    if (!p) return false;
    if (p.includes(" ")) return text.includes(" " + p + " ") || text.includes(p);
    for (const tk of tokens){
        if (tk === p) return true;
        if (tk.startsWith(p) && p.length >= (LATIN.test(p) ? 4 : 3)) return true; // plurals, Urdu/Hindi suffixes, "rounds"
        if (p.length >= 5 && LATIN.test(p) && LATIN.test(tk)) {
            const max = p.length >= 9 ? 2 : 1;
            if (lev(tk, p, max) <= max) return true;
        }
    }
    return false;
}
const any = (text, tokens, list)=>list.some((p)=>hit(text, tokens, p));
// ---------------- vocabulary ----------------
const PRODUCT_KW = {
    bold: [
        "heritage",
        "bold",
        "thick",
        "chunky",
        "acetate",
        "wood",
        "wooden",
        "mota",
        "mote",
        "moti",
        "motay",
        "samik",
        "sameek",
        "موٹے",
        "موٹا",
        "موٹی",
        "ہیریٹیج",
        "بولڈ",
        "मोटे",
        "मोटा",
        "बोल्ड",
        "हेरिटेज",
        "سميك",
        "عريض",
        "هيريتج",
        "gruesa",
        "gruesas",
        "grueso",
        "pasta",
        "épaisse",
        "épaisses",
        "epais",
        "epaisse",
        "acétate"
    ],
    rect: [
        "slim",
        "rectangle",
        "rectangular",
        "rectangles",
        "sleek",
        "everyday",
        "light weight",
        "lightweight",
        "chokor",
        "chaukor",
        "chokore",
        "chaukore",
        "patla",
        "patle",
        "patli",
        "mustateel",
        "mostateel",
        "مستطیل",
        "چوکور",
        "سلم",
        "पतले",
        "आयताकार",
        "चौकोर",
        "स्लिम",
        "مستطيل",
        "مربع",
        "نحيف",
        "رفيع",
        "delgada",
        "delgadas",
        "rectangulares",
        "fine",
        "fines",
        "rectangulaire",
        "rectangulaires"
    ],
    wire: [
        "wire",
        "round",
        "rounds",
        "circle",
        "circular",
        "vintage",
        "retro",
        "lennon",
        "aviator",
        "aviators",
        "metal",
        "gol",
        "gole",
        "taar",
        "daeri",
        "dairi",
        "daaeri",
        "mudawar",
        "mudawwar",
        "گول",
        "وائر",
        "تار",
        "دائرہ",
        "गोल",
        "वायर",
        "दायरा",
        "دائري",
        "دائریہ",
        "مدور",
        "دائرية",
        "سلك",
        "redonda",
        "redondas",
        "alambre",
        "ronde",
        "rondes",
        "fil"
    ]
};
const ORD = [
    [
        "bold",
        [
            "first",
            "pehla",
            "پہلا",
            "پہلے",
            "पहला",
            "الاول",
            "الأول",
            "primera",
            "primero",
            "première",
            "premier",
            "1",
            "one"
        ]
    ],
    [
        "rect",
        [
            "second",
            "dusra",
            "دوسرا",
            "دوسری",
            "दूसरा",
            "الثاني",
            "الثانی",
            "segunda",
            "segundo",
            "deuxième",
            "deuxieme",
            "2",
            "two"
        ]
    ],
    [
        "wire",
        [
            "third",
            "teesra",
            "تیسرا",
            "تیسری",
            "तीसरा",
            "الثالث",
            "tercera",
            "tercero",
            "troisième",
            "troisieme",
            "3",
            "three"
        ]
    ]
];
const COLOR_KW = {
    black: [
        "black",
        "dark black",
        "kala",
        "kaala",
        "kale",
        "kaale",
        "kali",
        "siyah",
        "aswad",
        "eswed",
        "کالا",
        "کالے",
        "کالی",
        "سیاہ",
        "काला",
        "काले",
        "काली",
        "اسود",
        "negro",
        "negra",
        "negras",
        "negros",
        "noir",
        "noire",
        "noirs"
    ],
    navy: [
        "navy",
        "blue",
        "neela",
        "neele",
        "neeli",
        "nila",
        "nile",
        "azraq",
        "kuhli",
        "نیلا",
        "نیلے",
        "نیلی",
        "نیوی",
        "नीला",
        "नीले",
        "नेवी",
        "ازرق",
        "کحلی",
        "azul",
        "bleu",
        "marine"
    ],
    burgundy: [
        "burgundy",
        "wine",
        "maroon",
        "annabi",
        "بروگنڈی",
        "مرون",
        "बरगंडी",
        "मैरून",
        "عنابی",
        "burdeos",
        "granate",
        "bordeaux",
        "bordeau"
    ],
    forest: [
        "forest",
        "green",
        "hara",
        "hare",
        "hari",
        "akhdar",
        "سبز",
        "ہرا",
        "ہرے",
        "ہری",
        "हरा",
        "हरे",
        "फॉरेस्ट",
        "اخضر",
        "verde",
        "verdes",
        "vert",
        "verte"
    ],
    tortoise: [
        "tortoise",
        "tortoiseshell",
        "brown",
        "bhura",
        "bhure",
        "bhoora",
        "bhoore",
        "bunni",
        "bonni",
        "بھورا",
        "بھورے",
        "بنی",
        "भूरा",
        "भूरे",
        "بنی",
        "بني",
        "carey",
        "marron",
        "écaille",
        "ecaille",
        "marrón"
    ],
    crimson: [
        "crimson",
        "red",
        "laal",
        "lal",
        "ahmar",
        "لال",
        "سرخ",
        "लाल",
        "احمر",
        "rojo",
        "roja",
        "rouge"
    ],
    gold: [
        "gold",
        "golden",
        "sunehri",
        "sunehra",
        "sunehre",
        "dahabi",
        "zahabi",
        "dhahabi",
        "سنہری",
        "سونے",
        "گولڈ",
        "सुनहरा",
        "सुनहरे",
        "गोल्ड",
        "ذهبی",
        "ذهب",
        "dorado",
        "dorada",
        "oro",
        "doré",
        "dore"
    ],
    silver: [
        "silver",
        "chandi",
        "chaandi",
        "fiddi",
        "fidi",
        "fiddy",
        "چاندی",
        "سلور",
        "چاندی",
        "सिल्वर",
        "चांदी",
        "फ्रॉस्ट",
        "فضی",
        "فضه",
        "plata",
        "plateado",
        "argent",
        "argenté"
    ],
    copper: [
        "copper",
        "bronze",
        "tamba",
        "tambe",
        "تانبا",
        "تانبے",
        "तांबा",
        "تانبی",
        "نحاسی",
        "cobre",
        "cuivre"
    ]
};
const COLOR_RX = {
    black: /black/i,
    navy: /navy/i,
    burgundy: /burgundy/i,
    forest: /forest/i,
    tortoise: /tortoise/i,
    crimson: /crimson/i,
    gold: /gold/i,
    silver: /silver/i,
    copper: /copper/i
};
const W = {
    add: [
        "add",
        "cart",
        "bag",
        "basket",
        "buy",
        "daalo",
        "dalo",
        "daal",
        "dal do",
        "daldo",
        "shamil",
        "khareed",
        "khareedo",
        "kharid",
        "kharido",
        "lelo",
        "le lo",
        "adif",
        "adef",
        "adeef",
        "aschtari",
        "ishtari",
        "take it",
        "take this",
        "i want",
        "i'll take",
        "order",
        "کارٹ",
        "ٹوکری",
        "شامل",
        "ڈال",
        "ڈالو",
        "ڈالیں",
        "ڈالنا",
        "خرید",
        "कार्ट",
        "डालो",
        "डाल",
        "जोड़",
        "जोड़ो",
        "खरीद",
        "لسلہ",
        "اضف",
        "سلہ",
        "السلہ",
        "اشتری",
        "اشتر",
        "añade",
        "añadir",
        "agrega",
        "agregar",
        "carrito",
        "comprar",
        "ajoute",
        "ajouter",
        "panier",
        "acheter"
    ],
    strongAdd: [
        "add",
        "daalo",
        "dalo",
        "daal",
        "daldo",
        "shamil",
        "khareed",
        "khareedo",
        "kharid",
        "kharido",
        "lelo",
        "adif",
        "adef",
        "adeef",
        "ishtari",
        "ڈال",
        "ڈالو",
        "ڈالیں",
        "ڈالنا",
        "شامل",
        "डालो",
        "डाल",
        "जोड़",
        "جوڑ",
        "اضف",
        "اشتری",
        "añade",
        "añadir",
        "agrega",
        "agregar",
        "ajoute",
        "ajouter",
        "buy",
        "خرید",
        "खरीद",
        "comprar",
        "acheter",
        "take",
        "want"
    ],
    cartWord: [
        "cart",
        "salla",
        "sallah",
        "kart",
        "bag",
        "basket",
        "کارٹ",
        "ٹوکری",
        "कार्ट",
        "سلہ",
        "السلہ",
        "carrito",
        "panier"
    ],
    open: [
        "open",
        "show",
        "view",
        "see",
        "go",
        "check",
        "dikhao",
        "dikha",
        "dikhana",
        "dikhaye",
        "dikhayein",
        "dekhao",
        "dekho",
        "dekhna",
        "kholo",
        "khol",
        "kholna",
        "warini",
        "wareeni",
        "arini",
        "afta7",
        "iftah",
        "iftaah",
        "کھول",
        "دکھا",
        "دکھاؤ",
        "دیکھ",
        "دیکھو",
        "खोल",
        "खोलो",
        "दिखा",
        "दिखाओ",
        "देख",
        "افتح",
        "اعرض",
        "ارنی",
        "abre",
        "abrir",
        "muestra",
        "muéstrame",
        "ver",
        "ouvre",
        "ouvrir",
        "affiche",
        "voir"
    ],
    remove: [
        "remove",
        "delete",
        "clear",
        "take out",
        "hata",
        "hatao",
        "hatado",
        "nikalo",
        "nikal",
        "azil",
        "ahzef",
        "ہٹا",
        "ہٹاؤ",
        "نکال",
        "हटा",
        "हटाओ",
        "निकाल",
        "ازل",
        "احذف",
        "quita",
        "quitar",
        "elimina",
        "retire",
        "retirer",
        "supprime"
    ],
    checkout: [
        "checkout",
        "check out",
        "pay",
        "payment",
        "purchase",
        "proceed",
        "paisay",
        "paise",
        "adaigi",
        "ada karo",
        "idfa",
        "dfa3",
        "ekhtam",
        "چیک آؤٹ",
        "چیکاؤٹ",
        "چیک اوٹ",
        "ادائیگی",
        "پیمنٹ",
        "پے",
        "चेकआउट",
        "चेक आउट",
        "पेमेंट",
        "भुगतान",
        "الدفع",
        "ادفع",
        "اتمام الشراء",
        "pagar",
        "pago",
        "finalizar",
        "commander",
        "payer",
        "paiement",
        "caisse"
    ],
    recommend: [
        "suit",
        "suits",
        "recommend",
        "mashwara",
        "mashwarah",
        "konsa",
        "kaunsa",
        "kaun sa",
        "behtar",
        "acha lagega",
        "achha lagega",
        "yonasibni",
        "yunasibni",
        "yunasebni",
        "recommendation",
        "suggest",
        "suggestion",
        "best for me",
        "what should",
        "which one",
        "look good",
        "looks good",
        "سوٹ",
        "مشورہ",
        "تجویز",
        "کون سا",
        "کونسا",
        "کیا اچھا",
        "जँचेगा",
        "जंचेगा",
        "सूट",
        "सुझाव",
        "कौन सा",
        "क्या अच्छा",
        "يناسبني",
        "یناسبنی",
        "اقتراح",
        "انصح",
        "ای",
        "favorece",
        "recomienda",
        "recomiéndame",
        "sugiere",
        "queda",
        "va bien",
        "conseille",
        "recommande",
        "suggère",
        "me va"
    ],
    next: [
        "next",
        "another",
        "following",
        "different",
        "change",
        "agla",
        "agli",
        "agle",
        "doosra",
        "dusra",
        "dusri",
        "doosri",
        "badlo",
        "badal",
        "tali",
        "altali",
        "اگلا",
        "اگلی",
        "دوسرا",
        "بدلو",
        "बदलो",
        "अगला",
        "दूसरा",
        "التالی",
        "التالى",
        "siguiente",
        "otra",
        "otro",
        "cambia",
        "suivante",
        "suivant",
        "autre",
        "change"
    ],
    prev: [
        "previous",
        "prev",
        "before",
        "pichla",
        "pichli",
        "pichle",
        "sabiq",
        "alsabiq",
        "پچھلا",
        "پچھلی",
        "پہلے والا",
        "पिछला",
        "पिछली",
        "السابق",
        "anterior",
        "précédente",
        "précédent",
        "precedente"
    ],
    home: [
        "home",
        "homepage",
        "main page",
        "ghar",
        "ہوم",
        "مرکزی",
        "होम",
        "الرئیسیہ",
        "inicio",
        "accueil"
    ],
    shop: [
        "shop",
        "collection",
        "catalog",
        "catalogue",
        "store",
        "all frames",
        "شاپ",
        "کلیکشن",
        "دکان",
        "शॉप",
        "कलेक्शन",
        "المتجر",
        "المجموعہ",
        "tienda",
        "colección",
        "coleccion",
        "boutique"
    ],
    tryon: [
        "try on",
        "try-on",
        "tryon",
        "camera",
        "live",
        "ٹرائی آن",
        "ٹرائی",
        "کیمرا",
        "ट्राई",
        "कैमरा",
        "تجربہ",
        "الکامیرا",
        "probar",
        "prueba",
        "cámara",
        "camara",
        "essayer",
        "essayage",
        "caméra"
    ],
    price: [
        "price",
        "cost",
        "how much",
        "kitne",
        "kitna",
        "kitni",
        "qeemat",
        "keemat",
        "qimat",
        "قیمت",
        "کتنے",
        "کتنا",
        "کتنی",
        "कीमत",
        "कितना",
        "कितने",
        "السعر",
        "کم",
        "precio",
        "cuánto",
        "cuanto",
        "prix",
        "combien"
    ],
    dark: [
        "dark",
        "night",
        "ڈارک",
        "डार्क",
        "داکن",
        "oscuro",
        "sombre"
    ],
    light: [
        "light mode",
        "light theme",
        "day mode",
        "bright mode",
        "لائٹ",
        "लाइट",
        "الفاتح",
        "modo claro",
        "mode clair",
        "tema claro"
    ],
    help: [
        "help",
        "what can you do",
        "commands",
        "madad",
        "madat",
        "musaada",
        "musaadah",
        "مدد",
        "کیا کر سکتے",
        "मदद",
        "क्या कर सकते",
        "مساعدہ",
        "ayuda",
        "aide"
    ],
    yes: [
        "yes",
        "yeah",
        "yep",
        "sure",
        "okay",
        "ok",
        "do it",
        "go ahead",
        "please",
        "haan",
        "han",
        "haa",
        "ji",
        "theek",
        "thik",
        "zaroor",
        "bilkul",
        "aywa",
        "aiwa",
        "naam",
        "tamam",
        "ہاں",
        "جی",
        "ٹھیک",
        "ضرور",
        "हाँ",
        "हां",
        "जी",
        "ठीक",
        "नعم",
        "نعم",
        "sí",
        "si",
        "claro",
        "vale",
        "oui",
        "d'accord"
    ],
    stop: [
        "stop listening",
        "stop",
        "enough",
        "that's all",
        "bas",
        "band",
        "khatam",
        "بس",
        "بند",
        "रुको",
        "बस",
        "توقف",
        "para",
        "arrête",
        "arrete"
    ],
    original: [
        "original",
        "default",
        "اصل",
        "اصلی",
        "मूल",
        "اصلي",
        "original",
        "d'origine"
    ],
    langMarker: [
        "speak",
        "bolo",
        "bol",
        "baat",
        "baat karo",
        "zaban",
        "zuban",
        "tahadath",
        "kallimni",
        "kalimni",
        "hablame",
        "parlez",
        "language",
        "switch",
        "talk",
        "answer",
        "بولو",
        "زبان",
        "بات",
        "बोलो",
        "भाषा",
        "लैंग्वेज",
        "لغہ",
        "تحدث",
        "habla",
        "idioma",
        "parle",
        "langue"
    ]
};
const LANG_KW = {
    en: [
        "english",
        "angrezi",
        "angraizi",
        "ingliz",
        "inglisi",
        "انگریزی",
        "انگلش",
        "अंग्रेज़ी",
        "अंग्रेजी",
        "इंग्लिश",
        "الانجلیزیہ",
        "inglés",
        "ingles",
        "anglais"
    ],
    ur: [
        "urdu",
        "ordu",
        "ourdou",
        "اردو",
        "उर्दू",
        "الاردیہ",
        "ourdou"
    ],
    ar: [
        "arabic",
        "arabi",
        "3arabi",
        "arabiya",
        "عربی",
        "عربي",
        "अरबी",
        "árabe",
        "arabe",
        "العربیہ"
    ],
    es: [
        "spanish",
        "espanyol",
        "ispani",
        "ہسپانوی",
        "سپینش",
        "स्पेनिश",
        "الاسبانیہ",
        "español",
        "espanol",
        "espagnol"
    ],
    fr: [
        "french",
        "faransi",
        "francisi",
        "fransi",
        "فرانسیسی",
        "فرنچ",
        "फ्रेंच",
        "الفرنسیہ",
        "francés",
        "frances",
        "français",
        "francais"
    ]
};
function parse(raw) {
    const text = norm(raw);
    const base = text.trim().split(" ").filter(Boolean);
    // Arabic "al-" article: الدائرية -> دائرية
    const tokens = base.concat(base.filter((t)=>t.startsWith("ال") && t.length > 4).map((t)=>t.slice(2)));
    const p = {};
    if (!tokens.length) return p;
    // language switch needs a marker word so "english" alone inside a sentence doesn't switch
    const langHit = Object.keys(LANG_KW).find((l)=>any(text, tokens, LANG_KW[l]));
    if (langHit && (any(text, tokens, W.langMarker) || tokens.length <= 2)) p.lang = langHit;
    // product by name / shape
    let best = 0;
    for (const [id, kws] of Object.entries(PRODUCT_KW)){
        const n = kws.filter((k)=>hit(text, tokens, k)).length;
        if (n > best) {
            best = n;
            p.product = id;
        }
    }
    if (!p.product) {
        for (const [id, kws] of ORD)if (kws.some((k)=>tokens.includes(norm(k).trim()))) p.product = id;
    }
    // colour
    for (const [id, kws] of Object.entries(COLOR_KW))if (any(text, tokens, kws)) {
        p.color = id;
        break;
    }
    if (!p.color && any(text, tokens, W.original)) p.color = "original";
    // "rose gold" is handled as gold, "navy blue" as navy
    // a colour word that is really the product ("round" never is a colour) - nothing to clash
    const cartWord = any(text, tokens, W.cartWord);
    const open = any(text, tokens, W.open);
    const strongAdd = any(text, tokens, W.strongAdd);
    const wantsCheckout = any(text, tokens, W.checkout);
    if (any(text, tokens, W.remove) && (cartWord || p.product)) p.remove = true;
    else if (wantsCheckout && !strongAdd) p.checkout = true;
    else if (cartWord && open && !strongAdd) p.viewCart = true;
    else if (cartWord && !strongAdd && !open && tokens.length <= 3) p.viewCart = true; // just "cart"
    else if (any(text, tokens, W.add)) p.add = true;
    if (wantsCheckout && strongAdd) p.checkout = true; // "add it and check out"
    if (any(text, tokens, W.prev)) p.step = -1;
    else if (any(text, tokens, W.next) && !p.product && !p.color) p.step = 1;
    if (any(text, tokens, W.home)) p.home = true;
    if (any(text, tokens, W.shop) && !p.add && !p.viewCart) p.shop = true;
    if (any(text, tokens, W.tryon) && !p.product) p.tryon = true;
    if (any(text, tokens, W.price)) p.price = true;
    if (any(text, tokens, W.recommend)) p.recommend = true;
    if (any(text, tokens, W.help)) p.help = true;
    if (any(text, tokens, W.stop) && tokens.length <= 3) p.stop = true;
    if (any(text, tokens, W.light)) p.theme = "light";
    else if (any(text, tokens, W.dark)) p.theme = "dark";
    if (tokens.length <= 3 && any(text, tokens, W.yes)) p.yes = true;
    // "buy this" style words shouldn't also trigger checkout/add twice
    if (p.checkout) p.viewCart = false;
    return p;
}
function matchColor(product, id) {
    if (id === "original") return product.colors.find((c)=>c.original) ?? product.colors[0];
    const rx = COLOR_RX[id];
    return rx ? product.colors.find((c)=>rx.test(c.name)) : undefined;
}
function recommend(shape, skinTone) {
    // contrast the face: round/oblong -> angular, square/diamond -> round, oval/heart -> bold
    let id = "bold";
    if (shape === "Square" || shape === "Diamond") id = "wire";
    else if (shape === "Round" || shape === "Oblong") id = "rect";
    else if (shape === "Heart") id = "wire";
    const p = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$glasses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["glasses"][id];
    const tone = /warm/i.test(skinTone) ? "warm" : /cool/i.test(skinTone) ? "cool" : "neutral";
    const pick = {
        bold: {
            warm: "Burgundy",
            cool: "Navy",
            neutral: "Original Black"
        },
        rect: {
            warm: "Tortoise",
            cool: "Navy",
            neutral: "Original Black"
        },
        wire: {
            warm: "Gold",
            cool: "Silver",
            neutral: "Original Copper"
        }
    };
    const wanted = pick[id][tone];
    const c = p.colors.find((x)=>x.name === wanted) ?? p.colors[0];
    return {
        id,
        colorName: c.name
    };
}
function toneKey(skinTone) {
    return /warm/i.test(skinTone) ? "warm" : /cool/i.test(skinTone) ? "cool" : "neutral";
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_0ukozic._.js.map