import {describe,it,expect,beforeEach} from "vitest";
import {capstoneExercises} from "./practiceCapstones";
import {exercises} from "./practice";
import {learningActions} from "./masteryJourney";
describe("flagship practical capstones",()=>{
 beforeEach(()=>localStorage.clear());
 it("exposes distinct validated exercises with at least four deterministic cases",()=>{
  expect(capstoneExercises).toHaveLength(3);
  expect(new Set(capstoneExercises.map(x=>x.id)).size).toBe(3);
  for(const task of capstoneExercises){
   expect(exercises.some(x=>x.id===task.id)).toBe(true);
   expect(task.tests.length).toBeGreaterThanOrEqual(4);
   expect(task.starter).toContain("function "+task.functionName);
   expect(task.brief.length).toBeGreaterThan(130);
   expect(task.tests.every(t=>t.label&&Array.isArray(t.args))).toBe(true);
  }
 });
 it("preserves relevant flagship learning recommendations and avoids wrong career paths",()=>{
  for(const id of ["frontend","data-analyst","cybersecurity"])
   expect(learningActions(id).some(a=>a.kind==="project")).toBe(true);
  for(const id of ["ux-design","rust","cloud","seo","aws","android","machine-learning"])
   expect(learningActions(id).every(a=>a.kind!=="project")).toBe(true);
 });
});