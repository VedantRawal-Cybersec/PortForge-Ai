import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as b64 } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import { InvalidInput, MAX_TTS_BYTES, readBoundedJSON, validateTTSInput } from "../_shared/requestLimits.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status, headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ fallback: true, error: "Method not allowed." }, 405);
  try {
    const { text, voiceId } = validateTTSInput(await readBoundedJSON(req, MAX_TTS_BYTES));
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
