import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { mode, skill, question, answer, code, description } = await req.json();
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const payload = buildPayload(mode, { skill, question, answer, code, description });
    const r = await fetch(URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (r.status === 429) return json({ error: "Rate limit exceeded. Try again in a moment." }, 429);
    if (r.status === 402) return json({ error: "AI credits exhausted. Add credits in workspace settings." }, 402);
    if (!r.ok) {
      const t = await r.text(); console.error("AI error", r.status, t);
      return json({ error: "AI gateway error" }, 500);
    }
    const data = await r.json();
    const tc = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!tc) return json({ error: "No structured output" }, 500);
    const args = JSON.parse(tc.function.arguments);
    return json(args);
  } catch (e) {
    console.error(e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function buildPayload(mode: string, p: any) {
  if (mode === "question") {
    return {
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: "You are a strict technical interviewer. Generate ONE precise, real-world question for the given skill. Coding or conceptual. Concise (1-2 sentences)." },
        { role: "user", content: `Skill: ${p.skill}\nGenerate one precise question.` },
      ],
      tools: [{
        type: "function",
        function: {
          name: "emit_question",
          description: "Return one precise interview question",
          parameters: {
            type: "object",
            properties: { question: { type: "string" }, type: { type: "string", enum: ["coding", "conceptual"] } },
            required: ["question", "type"], additionalProperties: false,
          },
        },
      }],
      tool_choice: { type: "function", function: { name: "emit_question" } },
    };
  }
  if (mode === "evaluate") {
    return {
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: "You are a structured AI evaluator. Grade with logic/clarity/depth (0-5). Identify mistakes, give an ideal answer, suggest 2-4 high-quality learning resources (free+paid mix), and 3 project ideas (beginner/intermediate/advanced)." },
        { role: "user", content: `Skill: ${p.skill}\nQuestion: ${p.question}\nUser's answer: ${p.answer}` },
      ],
      tools: [{
        type: "function",
        function: {
          name: "emit_evaluation",
          parameters: {
            type: "object",
            properties: {
              scores: { type: "object", properties: { logic: { type: "number" }, clarity: { type: "number" }, depth: { type: "number" } }, required: ["logic","clarity","depth"], additionalProperties: false },
              level: { type: "string", enum: ["Beginner","Intermediate","Strong"] },
              verdict: { type: "string" },
              whatWentWrong: { type: "string" },
              idealAnswer: { type: "string" },
              resources: {
                type: "array",
                items: {
                  type: "object",
                  properties: { title: { type: "string" }, why: { type: "string" }, kind: { type: "string", enum: ["free","paid"] }, url: { type: "string" } },
                  required: ["title","why","kind","url"], additionalProperties: false,
                },
              },
              projects: {
                type: "array",
                items: {
                  type: "object",
                  properties: { tier: { type: "string", enum: ["beginner","intermediate","advanced"] }, name: { type: "string" }, description: { type: "string" }, improves: { type: "string" } },
                  required: ["tier","name","description","improves"], additionalProperties: false,
                },
              },
              probeFollowUp: { type: "string" },
            },
            required: ["scores","level","verdict","whatWentWrong","idealAnswer","resources","projects","probeFollowUp"],
            additionalProperties: false,
          },
        },
      }],
      tool_choice: { type: "function", function: { name: "emit_evaluation" } },
    };
  }
  if (mode === "interview_question") {
    return {
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: "You are a calm, direct, slightly strict technical interviewer. Generate ONE precise spoken question (max 30 words). No preamble." },
        { role: "user", content: `Skill: ${p.skill}\nQuestion #${(p as any).index ?? 1} of 3.` },
      ],
      tools: [{
        type: "function",
        function: {
          name: "emit_iq",
          parameters: { type: "object", properties: { question: { type: "string" } }, required: ["question"], additionalProperties: false },
        },
      }],
      tool_choice: { type: "function", function: { name: "emit_iq" } },
    };
  }
  if (mode === "interview_evaluate") {
    return {
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: "You are a strict technical interviewer evaluating a spoken answer. Score logic/clarity/depth/confidence (0-5). Give a one-line verdict, brief feedback, and an improved ideal answer (2-3 sentences)." },
        { role: "user", content: `Skill: ${p.skill}\nQuestion: ${p.question}\nAnswer (transcript): ${p.answer}` },
      ],
      tools: [{
        type: "function",
        function: {
          name: "emit_ie",
          parameters: {
            type: "object",
            properties: {
              scores: { type: "object", properties: { logic: { type: "number" }, clarity: { type: "number" }, depth: { type: "number" }, confidence: { type: "number" } }, required: ["logic","clarity","depth","confidence"], additionalProperties: false },
              verdict: { type: "string" },
              feedback: { type: "string" },
              idealAnswer: { type: "string" },
              cognitiveLoadDelta: { type: "number" },
            },
            required: ["scores","verdict","feedback","idealAnswer","cognitiveLoadDelta"], additionalProperties: false,
          },
        },
      }],
      tool_choice: { type: "function", function: { name: "emit_ie" } },
    };
  }
  if (mode === "project_evaluate") {
    return {
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: "You are an AI code grader. Score logic/quality/structure/creativity (0-5). Identify what's wrong, give improved code (concise snippet), 2-3 learning resources, and three upgrade tiers." },
        { role: "user", content: `Description: ${p.description}\nCode:\n${p.code}` },
      ],
      tools: [{
        type: "function",
        function: {
          name: "emit_pe",
          parameters: {
            type: "object",
            properties: {
              scores: { type: "object", properties: { logic: { type: "number" }, quality: { type: "number" }, structure: { type: "number" }, creativity: { type: "number" } }, required: ["logic","quality","structure","creativity"], additionalProperties: false },
              level: { type: "string", enum: ["Beginner","Intermediate","Strong"] },
              verdict: { type: "string" },
              whatWentWrong: { type: "string" },
              improvedCode: { type: "string" },
              resources: { type: "array", items: { type: "object", properties: { title: { type: "string" }, why: { type: "string" }, kind: { type: "string", enum: ["free","paid"] }, url: { type: "string" } }, required: ["title","why","kind","url"], additionalProperties: false } },
              upgrades: { type: "array", items: { type: "object", properties: { tier: { type: "string", enum: ["beginner","intermediate","advanced"] }, name: { type: "string" }, description: { type: "string" } }, required: ["tier","name","description"], additionalProperties: false } },
            },
            required: ["scores","level","verdict","whatWentWrong","improvedCode","resources","upgrades"], additionalProperties: false,
          },
        },
      }],
      tool_choice: { type: "function", function: { name: "emit_pe" } },
    };
  }
  if (mode === "oracle") {
    return {
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: "You are a job-market intelligence engine. For a target role, return required skills, a 4-step roadmap, common gaps, and a one-line verdict for someone starting today." },
        { role: "user", content: `Role: ${p.skill}\nUser's known skills (optional): ${p.answer ?? "none stated"}` },
      ],
      tools: [{
        type: "function",
        function: {
          name: "emit_oracle",
          parameters: {
            type: "object",
            properties: {
              role: { type: "string" },
              requiredSkills: { type: "array", items: { type: "string" } },
              roadmap: { type: "array", items: { type: "object", properties: { step: { type: "string" }, detail: { type: "string" } }, required: ["step","detail"], additionalProperties: false } },
              gaps: { type: "array", items: { type: "string" } },
              verdict: { type: "string" },
            },
            required: ["role","requiredSkills","roadmap","gaps","verdict"], additionalProperties: false,
          },
        },
      }],
      tool_choice: { type: "function", function: { name: "emit_oracle" } },
    };
  }
  throw new Error("Unknown mode");
}
