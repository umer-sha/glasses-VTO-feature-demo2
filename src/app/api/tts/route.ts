export const runtime = "nodejs";

export async function POST(req: Request) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) return new Response("ELEVENLABS_API_KEY is not set", { status: 501 });

  let text = "";
  try {
    const body = (await req.json()) as { text?: string };
    text = String(body.text ?? "").trim().slice(0, 400);
  } catch {
    return new Response("Bad request", { status: 400 });
  }
  if (!text) return new Response("No text", { status: 400 });

  const voice = process.env.ELEVENLABS_VOICE_ID || "JBFqnCBsd6RMkjVDRZzb";
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_64`, {
    method: "POST",
    headers: { "xi-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({ text, model_id: "eleven_v3" }),
  });
  if (!r.ok) return new Response(await r.text(), { status: r.status });

  return new Response(r.body, { headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" } });
}