/**
 * Server-side cost and schema boundaries for anonymous practice requests.
 * This is defense in depth, NOT authentication, distributed rate limiting,
 * provider spend control, or proof of AI evaluation correctness.
 */
export const MAX_REQUEST_BYTES = 48 * 1024;
export const MAX_TTS_BYTES = 4 * 1024;
export const AI_MODES = [
  "question", "evaluate", "interview_question",
  "interview_evaluate", "project_evaluate", "oracle",
] as const;
export type AIMode = typeof AI_MODES[number];
export type AIInput = {
  mode: AIMode;
  skill: string;
  question: string;
  answer: string;
  code: string;
  description: string;
  language: string;
  index: number;
};

export class InvalidInput extends Error {
  constructor(message = "Invalid or oversized request.", public status = 400) {
    super(message);
    this.name = "InvalidInput";
  }
}
function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new InvalidInput("Expected a JSON object.");
  }
  return value as Record<string, unknown>;
}
function stringField(obj: Record<string, unknown>, key: string, max: number, required = false): string {
  const value = obj[key] === undefined ? "" : obj[key];
  if (typeof value !== "string" || value.length > max) {
    throw new InvalidInput("Invalid or oversized field: " + key + ".");
  }
  const trimmed = value.trim();
  if (required && !trimmed) throw new InvalidInput("Missing field: " + key + ".");
  return trimmed;
}
export function validateAIInput(raw: unknown): AIInput {
  const body = record(raw);
  const mode = body.mode;
  if (typeof mode !== "string" || !(AI_MODES as readonly string[]).includes(mode)) {
    throw new InvalidInput("Unknown AI request mode.");
  }
  const result: AIInput = {
    mode: mode as AIMode,
    skill: stringField(body, "skill", 120, mode !== "project_evaluate"),
    question: "",
    answer: "",
    code: "",
    description: "",
    language: "",
    index: 1,
  };
  if (mode === "evaluate" || mode === "interview_evaluate") {
    result.question = stringField(body, "question", 3000, true);
    result.answer = stringField(body, "answer", 8000, true);
  }
  if (mode === "oracle") result.answer = stringField(body, "answer", 700);
  if (mode === "interview_question") {
    const i = body.index ?? 1;
    if (!Number.isInteger(i) || typeof i !== "number" || i < 1 || i > 3) {
      throw new InvalidInput("Question index must be 1, 2, or 3.");
    }
    result.index = i;
  }
  if (mode === "project_evaluate") {
    result.code = stringField(body, "code", 30000, true);
    result.description = stringField(body, "description", 500, true);
    result.language = stringField(body, "language", 100);
  }
  return result;
}
export function validateTTSInput(raw: unknown): { text: string; voiceId: string } {
  const body = record(raw);
  const text = stringField(body, "text", 600, true);
  const voiceId = stringField(body, "voiceId", 64) || "JBFqnCBsd6RMkjVDRZzb";
  if (!/^[a-zA-Z0-9]{12,64}$/.test(voiceId)) {
    throw new InvalidInput("Invalid voice selection.");
  }
  return { text, voiceId };
}
/** Enforce a cap while consuming the stream, before JSON.parse. */
export async function readBoundedJSON(req: Request, limit = MAX_REQUEST_BYTES): Promise<unknown> {
  const length = req.headers.get("content-length");
  if (length && Number(length) > limit) throw new InvalidInput("Request body is too large.", 413);
  const type = req.headers.get("content-type") ?? "";
  if (!type.toLowerCase().includes("application/json")) {
    throw new InvalidInput("Content-Type must be application/json.", 415);
  }
  if (!req.body) throw new InvalidInput("Missing request body.");
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel();
        throw new InvalidInput("Request body is too large.", 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const out = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { out.set(chunk, offset); offset += chunk.byteLength; }
  try {
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(out));
  } catch {
    throw new InvalidInput("Malformed JSON request.");
  }
}
