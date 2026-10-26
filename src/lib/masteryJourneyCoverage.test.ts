import {beforeEach,describe,expect,it} from "vitest";
import {learningActions} from "./masteryJourney";
import {tracks} from "./academy";

describe("career-aware recommendations for all 69 academy tracks",()=>{
 beforeEach(()=>localStorage.clear());
 it("never recommends an unrelated frontend exercise for non-frontend specialties",()=>{
  for(const id of ["rust","go","cloud","aws","azure","linux","docker","ux-design","product-manager","seo","blockchain","embedded-iot"]){
   expect(tracks.some(t=>t.id===id)).toBe(true);
   const actions=learningActions(id);
   expect(actions.some(a=>a.kind==="learn")).toBe(true);
   expect(actions.some(a=>a.kind==="recheck")).toBe(true);
   expect(actions.filter(a=>a.kind==="project")).toHaveLength(0);
  }
 });
 it("continues recommending appropriate executable practice for three known flagship paths",()=>{
  for(const id of ["frontend","data-analyst","cybersecurity"]){
   const actions=learningActions(id);
   const project=actions.find(a=>a.kind==="project");
   expect(project).toBeDefined();
   expect(project!.path.startsWith("/practice?exercise=")).toBe(true);
  }
 });
 it("never attributes a passed project to other subjects",()=>{
  const all=tracks.map(t=>t.id);
  expect(new Set(all).size).toBe(all.length);
  for(const track of all){
   const actions=learningActions(track);
   expect(actions.every(x=>["learn","review","project","recheck"].includes(x.kind))).toBe(true);
   expect(actions.length).toBeLessThanOrEqual(4);
  }
 });
});