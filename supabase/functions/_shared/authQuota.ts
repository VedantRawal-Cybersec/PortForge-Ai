import { createClient } from "npm:@supabase/supabase-js@2";

/** Every billable request needs a valid user token and atomic server quota. */
const caps: Record<string, number> = {
  question: 30, evaluate: 24, interview_question: 30,
  interview_evaluate: 24, project_evaluate: 14, oracle: 12, tts: 15,
};
export type GateResult = { ok: true; userId: string } | { ok: false; status: number; message: string };
export function dailyModeLimit(mode: string): number {
  return caps[mode] || 0;
}
export function originAllowed(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // CORS is not the authorization boundary.
  const configured = (Deno.env.get("PORTFORGE_ALLOWED_ORIGINS") || "")
    .split(",").map(x => x.trim()).filter(Boolean);
  const allowed = new Set([
    "https://portforge-ai.vercel.app",
    "http://localhost:5173", "http://127.0.0.1:5173",
    ...configured,
  ]);
  return allowed.has(origin);
}
export function corsFor(req: Request): HeadersInit {
  const origin = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": originAllowed(req) && origin ? origin : "https://portforge-ai.vercel.app",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
    "Cache-Control": "no-store",
  };
}
export async function requireBudget(req: Request, mode: string): Promise<GateResult> {
  const limit = dailyModeLimit(mode);
  if (!limit) return { ok: false, status: 400, message: "Unsupported request mode." };
  const match = /^Bearer\s+(\S+)$/i.exec(req.headers.get("authorization") || "");
  if (!match || match[1].length > 4096) {
    return { ok: false, status: 401, message: "Sign in to use AI-assisted services; offline practice remains available." };
  }
  const url = Deno.env.get("SUPABASE_URL");
  const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !secret) return { ok: false, status: 503, message: "AI authorization service is not configured." };
  try {
    // Service key is used exclusively on the server. Auth resolves the actual user.
    const admin = createClient(url, secret, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await admin.auth.getUser(match[1]);
    if (error || !data.user?.id || data.user.is_anonymous) {
      return { ok: false, status: 401, message: "Sign in to use AI-assisted services." };
    }
    // SQL function is denied to anon/authenticated and atomically increments
    // one row by (verified user, UTC day, mode). Do not trust client user IDs.
    const { data: permitted, error: usageError } = await admin.rpc("portforge_reserve_ai_quota", {
      p_user_id: data.user.id, p_mode: mode, p_limit: limit, p_global_credits: 750,
    });
    if (usageError) {
      console.error("PortForge quota reservation error", usageError.code);
      return { ok: false, status: 503, message: "Usage protection is unavailable. Try later." };
    }
    if (permitted !== true) return { ok: false, status: 429, message: "AI daily usage budget reached. Guided offline practice is still available." };
    return { ok: true, userId: data.user.id };
  } catch {
    return { ok: false, status: 503, message: "Could not verify your session or usage limit." };
  }
}
