import {beforeEach,describe,expect,it} from "vitest";
import {flagshipOverview,getFlagshipMilestones} from "./flagshipOutcomes";
import {getLearningTrack,saveLearning} from "./academy";
import {savePractice} from "./practice";
import {saveShowcaseProject,emptyShowcaseDraft} from "./showcaseProjects";

describe("flagship milestone evidence",()=>{
 beforeEach(()=>localStorage.clear());
 it("shows realistic incomplete milestones rather than inflated readiness",()=>{
  const tracks=flagshipOverview();
  expect(tracks).toHaveLength(3);
  expect(tracks.every(t=>t.passed===0&&!t.finished)).toBe(true);
  expect(tracks.every(t=>t.total>=5)).toBe(true);
  for(const t of tracks){
   expect(t.steps.every(s=>s.link.startsWith("/"))).toBe(true);
   expect(new Set(t.steps.map(s=>s.id)).size).toBe(t.steps.length);
  }
 });
 it("reflects genuine saved lesson IDs without needing fabricated skill scores",()=>{
  const t=getLearningTrack("frontend")!;
  saveLearning({passed:t.lessons.slice(0,3).map(l=>l.id),attempts:{}});
  const m=getFlagshipMilestones("frontend");
  expect(m.find(x=>x.id==="frontend:learn")?.complete).toBe(true);
  expect(m.find(x=>x.id==="frontend:deepen")?.complete).toBe(false);
 });
 it("only counts a fully recorded test suite for a selected practical exercise",()=>{
  savePractice({id:"example-test",exerciseId:"real-form-validation",code:"function validateSignup(){}",reflection:"",
   results:[{label:"one",pass:true,expected:"",actual:""}],
   passed:1,total:4,updatedAt:Date.now()});
  expect(getFlagshipMilestones("frontend").find(x=>x.id==="frontend:test:real-form-validation")?.complete).toBe(false);
 });
 it("treats project sections as user-authored, never independent verification",()=>{
  saveShowcaseProject({...emptyShowcaseDraft,title:"Accessible frontend form",summary:"A real frontend interface with user-visible errors.",
   challenge:"Users could not understand which input was invalid.",
   approach:"I added semantic labels and persistent error messages.",
   validation:"I tested blank and malformed inputs using the keyboard.",
   outcome:"The tested cases pass locally."});
  const item=getFlagshipMilestones("frontend").find(x=>x.id==="frontend:portfolio");
  expect(item?.complete).toBe(true);
  expect(item?.description).toContain("self-authored");
 });
});