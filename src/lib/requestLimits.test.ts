import { describe, expect, it } from "vitest";
import {
  MAX_REQUEST_BYTES, InvalidInput, validateAIInput, validateTTSInput, readBoundedJSON,
} from "../../supabase/functions/_shared/requestLimits";

describe("cost-bearing AI API input limits", () => {
  it("accepts all six actual client modes", () => {
    expect(validateAIInput({ mode: "question", skill: "Python" }).mode).toBe("question");
    expect(validateAIInput({ mode: "evaluate", skill: "SQL", question: "Why?", answer: "Because." }).answer).toBe("Because.");
    expect(validateAIInput({ mode: "interview_question", skill: "React", index: 3 }).index).toBe(3);
    expect(validateAIInput({ mode: "interview_evaluate", skill: "React", question: "What?", answer: "Explained." }).mode).toBe("interview_evaluate");
    expect(validateAIInput({ mode: "project_evaluate", code: "console.log(1)", description: "Print a number", language: "JavaScript" }).language).toBe("JavaScript");
    expect(validateAIInput({ mode: "oracle", skill: "Cloud Engineer", answer: "Python" }).mode).toBe("oracle");
  });
  it("rejects unknown modes, oversized inputs and malformed question sequence", () => {
    expect(() => validateAIInput({ mode: "admin", skill: "Python" })).toThrow(InvalidInput);
    expect(() => validateAIInput({ mode: "question", skill: "X".repeat(121) })).toThrow(InvalidInput);
    expect(() => validateAIInput({ mode: "evaluate", skill: "Python", question: "Q", answer: "X".repeat(8001) })).toThrow(InvalidInput);
    expect(() => validateAIInput({ mode: "project_evaluate", code: "X".repeat(30001), description: "Anything" })).toThrow(InvalidInput);
    expect(() => validateAIInput({ mode: "interview_question", skill: "SQL", index: 999 })).toThrow(InvalidInput);
    expect(() => validateAIInput({ mode: "oracle", skill: "SQL", answer: "X".repeat(701) })).toThrow(InvalidInput);
  });
  it("bounds paid voice text and voice choices", () => {
    expect(validateTTSInput({ text: "How does this work?" }).voiceId).toBe("JBFqnCBsd6RMkjVDRZzb");
    expect(() => validateTTSInput({ text: "X".repeat(601) })).toThrow(InvalidInput);
    expect(() => validateTTSInput({ text: "Hello", voiceId: "../evil" })).toThrow(InvalidInput);
  });
  it("rejects bodies over the streamed size limit", async () => {
    const req = new Request("https://example.com/", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ mode: "question", skill: "X".repeat(MAX_REQUEST_BYTES) }),
    });
    await expect(readBoundedJSON(req)).rejects.toMatchObject({ status: 413 });
  });
  it("rejects non-JSON content types", async () => {
    const req = new Request("https://example.com/", {
      method: "POST", headers: { "content-type": "text/plain" }, body: "hello",
    });
    await expect(readBoundedJSON(req)).rejects.toMatchObject({ status: 415 });
  });
});
