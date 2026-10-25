import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as b64 } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import { InvalidInput, MAX_TTS_BYTES, readBoundedJSON, validateTTSInput } from "../_shared/requestLimits.ts";
import { requireBudget, corsFor, originAllowed } from "../_shared/authQuota.ts";

function json(body: unknown, status = 200, req?: Request) {
  return new Response(JSON.stringify(body), {
    status, headers: { ...(req ? corsFor(req) : {"Access-Control-Allow-Origin":"https://portforge-ai.vercel.app"}), "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
serve(async (req: Request) => {
  if (!originAllowed(req)) return json({fallback:true,error:"Origin not allowed."},403,req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsFor(req) });
  if (req.method !== "POST") return json({ fallback: true, error: "Method not allowed." }, 405);
  try {
    const { text, voiceId } = validateTTSInput(await readBoundedJSON(req, MAX_TTS_BYTES));
    const gate = await requireBudget(req, "tts");
    if (!gate.ok) return json({fallback:true,error:gate.message},gate.status,req);
    const key = Deno.env.get("ELEVENLABS_API_KEY");
    if (!key) return json({ fallback: true, reason: "no_key" });
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
      method: "POST",
      headers: { "xi-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        text, model_id: "eleven_turbo_v2_5",
        voice_settings: { stability: 0.55, similarity_boost: 0.75, style: 0.3, use_speaker_boost: true },
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (!r.ok) {
      console.warn("TTS upstream unavailable:", r.status);
      return json({ fallback: true, reason: "provider_unavailable" });
    }
    const buffer = await r.arrayBuffer();
    // Bound unexpectedly large provider responses before returning a base64 payload.
    if (buffer.byteLength > 3 * 1024 * 1024) return json({ fallback: true, reason: "response_too_large" });
    return json({ audioContent: b64(buffer) });
  } catch (e) {
    if (e instanceof InvalidInput) return json({ fallback: true, error: e.message }, e.status);
    return json({ fallback: true, reason: "provider_unavailable" });
  }
});
