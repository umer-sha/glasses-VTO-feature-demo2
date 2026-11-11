// Turns the stylist's reply into natural speech with ElevenLabs, in any of the site's languages.
// The API key stays on the server, the browser only gets the audio back.
export const runtime = "nodejs";

// Safety net for your credits (per server instance). Change with ELEVENLABS_DAILY_CHARS.
const DAILY_LIMIT = Number(process.env.ELEVENLABS_DAILY_CHARS || 8000);
let day = "";
let used = 0;

// "Jessica": bright and conversational. Change with ELEVENLABS_VOICE_ID, or per language with
// ELEVENLABS_VOICE_ID_UR / _AR / _ES / _FR / _EN.
const DEFAULT_VOICE = "cgSgspJ2msm6clMCkdW9";

const FAST = process.env.ELEVENLABS_MODEL || "eleven_flash_v2_5"; // quick replies, good for chatting
const EXPRESSIVE = "eleven_v3"; // the one that covers Urdu

// removes spaces and quote marks that sometimes get pasted around a key
function getKey() {
  return (process.env.ELEVENLABS_API_KEY || "").trim().replace(/^["']+|["']+$/g, "");
}

function voiceFor(lang: string) {
  return process.env[`ELEVENLABS_VOICE_ID_${lang.toUpperCase()}`] || process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE;
}

async function synth(key: string, voice: string, text: string, model: string, withSettings: boolean) {
  const settings =
    model === EXPRESSIVE
      ? { stability: 0.5 } // v3 only accepts 0, 0.5 or 1
      : { stability: 0.42, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true, speed: 1.05 };
  return fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({ text, model_id: model, ...(withSettings ? { voice_settings: settings } : {}) }),
  });
}

async function speak(key: string, voice: string, text: string, lang: string) {
  // Urdu needs v3. Everything else uses the fast conversational model first, with v3 as the backup.
  const models = lang === "ur" ? [EXPRESSIVE] : [FAST, EXPRESSIVE];
  let r!: Response;
  for (const model of models) {
    r = await synth(key, voice, text, model, true);
    if (r.status === 400 || r.status === 422) r = await synth(key, voice, text, model, false); // settings refused
    if (r.ok || (r.status !== 400 && r.status !== 422)) break; // only try the next model on a "can't do that" error
  }
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
  const key = getKey();
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

  const r = await speak(key, voiceFor(lang), text, lang);
  if (!r.ok) return new Response(await r.text(), { status: r.status });
  used += text.length;

  return new Response(r.body, { headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" } });
}

// Open /api/tts in the browser to see what this server can see (names only, never the key itself).
export async function GET() {
  const key = getKey();
  today();
  const info = {
    keyFound: !!key,
    keyLength: key.length, // a real ElevenLabs key is usually around 50+ characters
    vercelEnvironment: process.env.VERCEL_ENV ?? "local", // production / preview / development
    variablesWithElevenInTheName: Object.keys(process.env).filter((k) => /eleven/i.test(k)),
    usedToday: used,
    dailyLimit: DAILY_LIMIT,
  };
  if (!key) {
    return Response.json({
      ...info,
      ok: false,
      problem:
        "No ELEVENLABS_API_KEY on this server. If variablesWithElevenInTheName is empty the variable was never saved for this environment; if it lists a different spelling, rename it exactly to ELEVENLABS_API_KEY. Then redeploy.",
    });
  }

  const en = await speak(key, voiceFor("en"), "Test", "en");
  const ur = await speak(key, voiceFor("ur"), "Test", "ur");
  return Response.json({
    ...info,
    ok: en.ok && ur.ok,
    english: en.ok ? "working" : { status: en.status, detail: (await en.text()).slice(0, 300) },
    urdu: ur.ok ? "working" : { status: ur.status, detail: (await ur.text()).slice(0, 300) },
  });
}