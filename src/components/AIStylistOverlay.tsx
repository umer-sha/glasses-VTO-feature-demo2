"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { glasses, glassesList, type Glasses } from "@/lib/glasses";
import { cart } from "@/lib/cart";
import { LANGS, translate, type Key, type Lang } from "@/lib/i18n";
import { matchColor, parse, recommend } from "@/lib/stylist";
import { usePrefs } from "@/components/Providers";

interface AIStylistProps {
  currentProduct: Glasses;
  currentKey: string;
  currentColor: string;
  onSelectFrame: (key: string) => void;
  onSelectColor: (colorName: string) => void;
  faceMetrics: { shape: string; skinTone: string } | null;
  started?: boolean; // becomes true when the live camera starts: the stylist then introduces itself
}

/* eslint-disable @typescript-eslint/no-explicit-any */

function pickVoice(speech: string): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  const prefix = speech.split("-")[0].toLowerCase();
  const same = voices.filter((v) => v.lang.toLowerCase().replace("_", "-").startsWith(prefix));
  if (!same.length) return null;
  const score = (v: SpeechSynthesisVoice) =>
    (v.lang.toLowerCase().replace("_", "-") === speech.toLowerCase() ? 3 : 0) +
    (/natural|neural|online|enhanced|premium/i.test(v.name) ? 4 : 0) +
    (/google/i.test(v.name) ? 2 : 0) +
    (v.localService ? 0 : 1);
  return same.sort((a, b) => score(b) - score(a))[0];
}

export default function AIStylistOverlay({
  currentProduct,
  currentKey,
  currentColor,
  onSelectFrame,
  onSelectColor,
  faceMetrics,
  started = false,
}: AIStylistProps) {
  const router = useRouter();
  const { t, lang, setLang, speechLang, toggleTheme, setTheme } = usePrefs();
  const example = LANGS.find((l) => l.code === lang)?.example ?? "";
  const scriptFont = lang === "ur" || lang === "ar" ? "script-font" : "";

  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [reply, setReply] = useState("");
  const [typed, setTyped] = useState("");
  const [supported, setSupported] = useState(true);
  const [note, setNote] = useState("");

  const wantRef = useRef(false); // the user wants the mic on
  const speakingRef = useRef(false);
  const recRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ttsOff = useRef(false); // true once we know ElevenLabs isn't set up (then the browser voice is used straight away)
  const cacheRef = useRef<Map<string, string>>(new Map()); // sentences already spoken cost nothing the second time
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null); // keeps the sentence alive (Chrome can drop it otherwise)
  const pendingRef = useRef<{ id: string; colorName: string } | null>(null);
  const greetedRef = useRef(false);
  // always-fresh copies, so the speech callbacks never use stale values
  const live = useRef({ currentProduct, currentKey, currentColor, faceMetrics, lang, speechLang });
  useEffect(() => {
    live.current = { currentProduct, currentKey, currentColor, faceMetrics, lang, speechLang };
  });

  // ---------------- speaking ----------------
  // Plan A: natural voice from ElevenLabs through /api/tts (speaks Urdu too).
  // Plan B: the browser's own voice, if the key isn't set up or the request fails.
  const speak = useCallback((text: string, speech?: string) => {
    setReply(text);
    if (typeof window === "undefined") return;
    const code = speech ?? live.current.speechLang;

    // stop whatever is playing, and don't listen to ourselves while talking
    audioRef.current?.pause();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    speakingRef.current = true;
    try { recRef.current?.stop(); } catch { /* not running */ }
    const done = () => {
      speakingRef.current = false;
      if (wantRef.current) setTimeout(() => { try { recRef.current?.start(); } catch { /* already running */ } }, 200);
    };

    const browserVoice = () => {
      if (!("speechSynthesis" in window)) return done();
      const synth = window.speechSynthesis;
      const u = new SpeechSynthesisUtterance(text);
      utterRef.current = u;
      u.lang = code;
      u.volume = 1;
      const v = pickVoice(code);
      if (v) u.voice = v;
      else if (synth.getVoices().length) {
        const name = LANGS.find((l) => l.speech === code)?.label ?? code;
        setNote(translate(live.current.lang, "voice.novoice", { lang: name }));
      }
      u.onend = done;
      u.onerror = done;
      setTimeout(() => { synth.resume(); synth.speak(u); }, 80);
    };

    const play = (url: string) => {
      const au = new Audio(url);
      audioRef.current = au;
      au.onended = done;
      au.onerror = () => browserVoice();
      return au.play();
    };

    const cached = cacheRef.current.get(text);
    if (cached) {
      play(cached).catch(() => browserVoice());
      return;
    }

    if (ttsOff.current) { browserVoice(); return; }
    fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
      .then((r) => {
        if (!r.ok) {
          if (r.status === 501 || r.status === 401 || r.status === 403) ttsOff.current = true;
          throw new Error("tts " + r.status);
        }
        return r.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        cacheRef.current.set(text, url);
        return play(url);
      })
      .catch((err) => {
        setNote("Voice service error: " + String(err.message || err));
        browserVoice();
      });
  }, []);

  const say = useCallback((key: Key, vars?: Record<string, string | number>, l?: Lang) => {
    const useLang = l ?? live.current.lang;
    const code = LANGS.find((x) => x.code === useLang)?.speech;
    speak(translate(useLang, key, vars), code);
  }, [speak]);

  // ---------------- doing what was asked ----------------
  const act = useCallback((text: string) => {
    const L = live.current;
    const p = parse(text);
    const vars = () => ({ name: target.name, color: colorName });

    let target = L.currentProduct;
    let targetId = L.currentKey;
    let colorName = L.currentColor;

    if (p.lang) { setLang(p.lang); say("v.lang", undefined, p.lang); return; }
    if (p.stop) { stopListening(); say("v.stop"); return; }
    if (p.help) { say("v.help"); return; }
    if (p.theme && !p.product && !p.add) {
      setTheme(p.theme);
      say(p.theme === "dark" ? "v.theme.dark" : "v.theme.light");
      return;
    }

    let key: Key | null = null;

    // "yes" accepts the stylist's pick
    if (p.yes && pendingRef.current && !p.product && !p.color) {
      const r = pendingRef.current;
      pendingRef.current = null;
      onSelectFrame(r.id);
      onSelectColor(r.colorName);
      target = glasses[r.id]; targetId = r.id; colorName = r.colorName;
      say("v.switch", vars());
      return;
    }

    // which frame / which colour
    if (p.step) {
      const i = glassesList.findIndex((g) => g.id === targetId);
      const n = glassesList[(i + p.step + glassesList.length) % glassesList.length];
      target = n; targetId = n.id; colorName = n.colors[0].name;
      onSelectFrame(n.id);
      key = "v.switch";
    }
    if (p.product && glasses[p.product]) {
      target = glasses[p.product]; targetId = p.product; colorName = target.colors[0].name;
      onSelectFrame(p.product);
      key = "v.switch";
    }
    if (p.color) {
      const c = matchColor(target, p.color);
      if (c) {
        colorName = c.name;
        onSelectColor(c.name);
        if (!key) key = "v.color";
      } else {
        say("v.nocolor", { name: target.name, options: target.colors.map((x) => x.name).join(", ") });
        return;
      }
    }

    if (p.recommend) {
      if (!L.faceMetrics) { say("v.needscan"); return; }
      const r = recommend(L.faceMetrics.shape, L.faceMetrics.skinTone);
      pendingRef.current = r;
      say("v.recommend", { name: glasses[r.id].name, color: r.colorName });
      return;
    }

    if (p.add) {
      cart.add(targetId, colorName, 1);
      key = "v.added";
    }
    if (p.remove) {
      cart.removeProduct(targetId);
      key = "v.removed";
    }
    if (p.checkout) {
      if (cart.size() === 0) { say("v.checkout.empty"); return; }
      say("v.checkout");
      setTimeout(() => router.push("/checkout"), 900);
      return;
    }
    if (p.viewCart) { say("v.cart"); setTimeout(() => router.push("/cart"), 700); return; }
    if (p.home) { say("v.home"); setTimeout(() => router.push("/"), 700); return; }
    if (p.shop) { say("v.shop"); setTimeout(() => router.push("/#collection"), 700); return; }
    if (p.tryon && !key) { say("v.camera"); return; }
    if (p.price && !key) { say("v.price", { name: target.name, price: `$${target.price}` }); return; }

    if (key) { say(key, vars()); return; }
    if (p.theme) { toggleTheme(); return; }
    say("v.unknown");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSelectFrame, onSelectColor, router, say, setLang, setTheme, toggleTheme]);

  const actRef = useRef(act);
  useEffect(() => { actRef.current = act; });

  // ---------------- microphone ----------------
  function stopListening() {
    wantRef.current = false;
    setListening(false);
    try { recRef.current?.stop(); } catch { /* not running */ }
  }

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSupported(false);
      return;
    }
    const rec = new SR();
    rec.lang = speechLang;
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 3;
    rec.onresult = (e: any) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        const said = r[0].transcript.trim();
        setHeard(said);
        if (!r.isFinal) continue;
        // try the alternatives too: speech engines often put the right word second
        const alts: string[] = [];
        for (let k = 0; k < r.length; k++) alts.push(r[k].transcript);
        const best = alts.find((a) => Object.keys(parse(a)).length > 0) ?? said;
        actRef.current(best);
      }
    };
    rec.onerror = (e: any) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        wantRef.current = false;
        setListening(false);
        setNote(translate(live.current.lang, "voice.denied"));
      }
    };
    rec.onend = () => {
      // Chrome ends the session after a pause: quietly start it again while the mic is "on"
      if (wantRef.current && !speakingRef.current) setTimeout(() => { try { rec.start(); } catch { /* already running */ } }, 250);
    };
    recRef.current = rec;
    if (wantRef.current && !speakingRef.current) { try { rec.start(); } catch { /* ignore */ } }
    return () => {
      rec.onend = null;
      rec.onresult = null;
      try { rec.stop(); } catch { /* ignore */ }
    };
  }, [speechLang]);

  useEffect(() => () => {
    wantRef.current = false;
    audioRef.current?.pause();
  }, []);

  function toggleMic() {
    if (listening) { stopListening(); return; }
    wantRef.current = true;
    setListening(true);
    setNote("");
    setHeard("");
    try { recRef.current?.start(); } catch { /* already running */ }
  }

  // ---------------- the stylist introduces itself when the live camera starts ----------------
  useEffect(() => {
    if (!started || greetedRef.current) return;
    greetedRef.current = true;
    say("v.intro");
  }, [started, say]);

  // ---------------- tell the user the result when the face scan finishes ----------------
  useEffect(() => {
    if (!faceMetrics) return;
    const r = recommend(faceMetrics.shape, faceMetrics.skinTone);
    pendingRef.current = r;
    const tone = /warm/i.test(faceMetrics.skinTone) ? "warm" : /cool/i.test(faceMetrics.skinTone) ? "cool" : "neutral";
    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;
    const talk = () => {
      // wait until the introduction has finished
      if (speakingRef.current && tries++ < 80) { timer = setTimeout(talk, 500); return; }
      const L = live.current.lang;
      say("v.scan", {
        shape: translate(L, `shape.${faceMetrics.shape}` as Key),
        tone: translate(L, `tone.${tone}` as Key),
        name: glasses[r.id].name,
        color: r.colorName,
      });
    };
    timer = setTimeout(talk, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faceMetrics]);

  // changing the voice language: confirm in the new language
  const prevLang = useRef(lang);
  useEffect(() => {
    if (prevLang.current === lang) return;
    prevLang.current = lang;
    say("v.lang");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // voices load late on some browsers
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const f = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener?.("voiceschanged", f);
    f();
    return () => window.speechSynthesis.removeEventListener?.("voiceschanged", f);
  }, []);

  function submitTyped(e: React.FormEvent) {
    e.preventDefault();
    const v = typed.trim();
    if (!v) return;
    setHeard(v);
    setTyped("");
    actRef.current(v);
  }

  return (
    <section className="card p-4 sm:p-5">
      <div className="flex items-start gap-4">
        <button
          onClick={toggleMic}
          aria-pressed={listening}
          aria-label={t("voice.mic")}
          title={t("voice.mic")}
          className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition ${
            listening ? "bg-danger text-white" : "bg-accent text-accent-fg hover:opacity-90"
          }`}
        >
          {listening && <span className="absolute inset-0 animate-ping rounded-full bg-danger/40" />}
          <svg className="relative" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
          </svg>
        </button>

        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">{t("voice.title")}</div>
          <div dir={reply ? "auto" : undefined} className={`mt-1 text-base leading-snug ${reply ? scriptFont : ""}`}>
            {reply || (listening ? t("voice.listening") : t("voice.idle"))}
          </div>
          {heard && (
            <div dir="auto" className="mt-1.5 truncate text-sm text-muted">
              {t("voice.heard")}: “{heard}”
            </div>
          )}
          {!reply && !heard && <div className="mt-1.5 text-sm text-muted">{t("voice.try")}: “{example}”</div>}
          {!supported && <div className="mt-1.5 text-sm text-danger">{t("voice.unsupported")}</div>}
          {note && <div className="mt-1.5 text-sm text-danger">{note}</div>}
        </div>
      </div>

      <form onSubmit={submitTyped} className="mt-4 flex gap-2">
        <input
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder={`${t("voice.type")}, e.g. ${example}`}
          dir="auto"
          aria-label={t("voice.type")}
          className="input min-w-0 flex-1 !rounded-full"
        />
        <button type="submit" className="btn btn-ghost">
          {t("voice.send")}
        </button>
      </form>
    </section>
  );
}
