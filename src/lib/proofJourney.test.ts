import {beforeEach,describe,expect,it} from "vitest";
import {realityRoles,realityScenarios,evaluateReality,readRealityResults,saveRealityResult,realityReport,ROLE_REALITY_KEY} from "./roleReality";
import {getProofSummary,exportProofSummary} from "./proofEngine";
import {getLearningTrack,saveLearning,tracks,totalLessons} from "./academy";
import {saveTrackCheck,evaluateTrackCheck} from "./trackChecks";
import {savePractice} from "./practice";
import {flagshipExercises} from "./practiceFlagship";
import {saveShowcaseProject,emptyShowcaseDraft} from "./showcaseProjects";
import {exportLocalBackup,restoreLocalBackup,PORTABLE_KEYS} from "./backup";

describe("proof-of-work journey and role simulations",()=>{
 beforeEach(()=>localStorage.clear());
 it("provides two meaningful, safe role simulations for each flagship career",()=>{
   expect(realityRoles).toHaveLength(3);
   expect(realityScenarios).toHaveLength(6);
   expect(new Set(realityScenarios.map(s=>s.id)).size).toBe(6);
   for(const role of realityRoles)expect(realityScenarios.filter(s=>s.role===role.id)).toHaveLength(2);
   for(const s of realityScenarios){
     expect(s.steps).toHaveLength(3);
     expect(s.deliverable.length).toBeGreaterThan(40);
     expect(s.setting.length).toBeGreaterThan(70);
     for(const step of s.steps){
       expect(step.choices).toHaveLength(3);
       expect(new Set(step.choices).size).toBe(3);
       expect(step.correct).toBeGreaterThanOrEqual(0);
       expect(step.correct).toBeLessThan(3);
       expect(step.explanation.length).toBeGreaterThan(55);
     }
   }
 });
 it("checks recommended responses deterministically and refuses mismatched or forged storage",()=>{
   const s=realityScenarios[0];
   const full=evaluateReality(s.id,s.steps.map(x=>x.correct),"I want to practise error messages.");
   expect(full.correct).toBe(3);
   saveRealityResult(full);
   expect(readRealityResults()).toHaveLength(1);
   expect(realityReport(full)).toContain("fictional scenarios");
   expect(realityReport(full)).toContain("I want to practise error messages.");
   expect(()=>evaluateReality("not-real",[0,0,0])).toThrow();
   expect(()=>evaluateReality(s.id,[0,0,9])).toThrow();
   const forged={...full,correct:0};
   localStorage.setItem(ROLE_REALITY_KEY,JSON.stringify([forged]));
   expect(readRealityResults()).toHaveLength(0);
 });
 it("extends only three flagship curricula while preserving 69 track identities and original lesson IDs",()=>{
   expect(tracks).toHaveLength(69);
   expect(totalLessons()).toBe(225);
   for(const trackId of ["frontend","data-analyst","cybersecurity"]){
     const track=getLearningTrack(trackId)!;
     expect(track.lessons).toHaveLength(9);
     expect(track.lessons.map(x=>x.id)).toEqual(Array.from({length:9},(_,i)=>trackId+"-"+(i+1)));
     expect(track.lessons.every(x=>x.choices.length===3)).toBe(true);
   }
   expect(getLearningTrack("rust")?.lessons).toHaveLength(3);
 });
 it("includes six executable, deterministic project exercises spanning three role tracks",()=>{
   expect(flagshipExercises).toHaveLength(6);
   expect(new Set(flagshipExercises.map(x=>x.id)).size).toBe(6);
   for(const e of flagshipExercises){
     expect(e.tests.length).toBeGreaterThanOrEqual(4);
     expect(e.functionName.length).toBeGreaterThan(5);
     expect(e.starter).toContain("function "+e.functionName);
     expect(e.brief.length).toBeGreaterThan(90);
   }
 });
 it("honestly aggregates all supported browser-local evidence and includes user-authored provenance",()=>{
   saveLearning({passed:["frontend-1","frontend-4"],attempts:{"frontend-1":1,"frontend-4":1}});
   const track=getLearningTrack("frontend")!;
   saveTrackCheck(evaluateTrackCheck("frontend",track.lessons.slice(0,3).map(x=>x.correct)));
   const role=realityScenarios[0];
   saveRealityResult(evaluateReality(role.id,role.steps.map(x=>x.correct)));
   const exercise=flagshipExercises[0];
   savePractice({id:"sample1",exerciseId:exercise.id,code:exercise.starter,reflection:"work",
     results:exercise.tests.map(t=>({label:t.label,pass:true,expected:"",actual:""})),
     passed:exercise.tests.length,total:exercise.tests.length,updatedAt:Date.now()});
   saveShowcaseProject({...emptyShowcaseDraft,title:"My real accessible form",
     summary:"I built and tested a simple signup form with error messages."});
   const proof=getProofSummary();
   expect(proof.lessons).toBe(2);
   expect(proof.trackAttempts).toBe(1);
   expect(proof.roleSimulations).toBe(1);
   expect(proof.testedExercises).toBe(1);
   expect(proof.testCasesPassed).toBe(exercise.tests.length);
   expect(proof.authoredProjects).toBe(1);
   expect(new Set(proof.entries.map(e=>e.kind))).toEqual(new Set(["lesson","answer-key","browser-test","simulation","authored"]));
   const report=exportProofSummary(proof);
   expect(report).toContain("not a verified credential");
   expect(report).toContain("User-authored project case study");
   expect(report).not.toContain("certified master");
 });
 it("restores a simulation in portable backup and rejects malformed decision records",()=>{
   const s=realityScenarios[2];
   saveRealityResult(evaluateReality(s.id,s.steps.map(x=>x.correct),"practice"));
   expect(PORTABLE_KEYS).toContain(ROLE_REALITY_KEY);
   const backup=JSON.stringify(exportLocalBackup());
   localStorage.clear();
   expect(restoreLocalBackup(backup)).toBe(1);
   expect(readRealityResults()[0].scenarioId).toBe(s.id);
   const corrupted=JSON.parse(backup);
   corrupted.items[ROLE_REALITY_KEY][0].answers=[0,9,0];
   expect(()=>restoreLocalBackup(JSON.stringify(corrupted))).toThrow(/invalid|damaged/);
 });
});