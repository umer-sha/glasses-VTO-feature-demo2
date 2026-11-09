// Turns the stylist's reply into natural speech with ElevenLabs, in any of the site's languages.
// The API key stays on the server (.env.local), the browser only gets the audio back.
export const runtime = "nodejs";

// A safety net for your credits: after this many characters in a day the site falls back to the
// browser's own voice. Change it with ELEVENLABS_DAILY_CHARS in .env.local.
const DAILY_LIMIT = Number(process.env.ELEVENLABS_DAILY_CHARS || 8000);
let day = "";
let used = 0;

// Warm, friendly default voice ("Sarah"). Change it with ELEVENLABS_VOICE_ID in .env.local,
// or give one language its own voice with ELEVENLABS_VOICE_ID_UR / _AR / _ES / _FR / _EN.
const DEFAULT_VOICE = "EXAVITQu4vr4xnSDxMaL";

function voiceFor(lang: string) {
  return process.env[`ELEVENLABS_VOICE_ID_${lang.toUpperCase()}`] || process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE;
}

async function synth(key: string, voice: string, text: string, withSettings: boolean) {
  return fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      model_id: "eleven_v3", // most expressive model, covers Urdu, Arabic, Spanish and French
      ...(withSettings ? { voice_settings: { stability: 0.5 } } : {}), // v3: 0 creative, 0.5 natural, 1 robust
    }),
  });
}

async function synthWithRetry(key: string, voice: string, text: string) {
  let r = await synth(key, voice, text, true);
  // if ElevenLabs rejects the settings, try again with its own defaults
  if (r.status === 400 || r.status === 422) r = await synth(key, voice, text, false);
  return r;
}

function today() {
  const d = new Date().toISOString().slice(0, 10);
  if (d !== day) {
    day = d;
    used = 0;
  }
}

export async function POST(req: Request) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) return new Response("ELEVENLABS_API_KEY is not set", { status: 501 });

  let text = "";
  let lang = "en";
  try {
    const body = (await req.json()) as { text?: string; lang?: string };
    text = String(body.text ?? "").trim().slice(0, 400);
    lang = String(body.lang ?? "en").toLowerCase().slice(0, 2);
  } catch {
    return new Response("Bad request", { status: 400 });
  }
  if (!text) return new Response("No text", { status: 400 });

  today();
  if (used + text.length > DAILY_LIMIT) {
    return new Response(`Daily voice limit reached (${used}/${DAILY_LIMIT} characters)`, { status: 429 });
  }

  const r = await synthWithRetry(key, voiceFor(lang), text);
  if (!r.ok) return new Response(await r.text(), { status: r.status });
  used += text.length; // only count what ElevenLabs actually spoke

  return new Response(r.body, { headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" } });
}

// Open http://localhost:3000/api/tts in the browser to see whether the voice works and, if not, why.
export async function GET() {
  const key = process.env.ELEVENLABS_API_KEY;
  today();
  const info = { keyFound: !!key, usedToday: used, dailyLimit: DAILY_LIMIT, voice: voiceFor("ur") };
  if (!key) return Response.json({ ...info, ok: false, problem: "ELEVENLABS_API_KEY is not set (check .env.local and restart npm run dev)" });

  const r = await synthWithRetry(key, voiceFor("ur"), "Test");
  if (r.ok) return Response.json({ ...info, ok: true, message: "ElevenLabs is working" });
  const detail = (await r.text()).slice(0, 500);
  return Response.json({ ...info, ok: false, elevenLabsStatus: r.status, detail });
}