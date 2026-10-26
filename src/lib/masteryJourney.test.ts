import {beforeEach,describe,expect,it,vi} from "vitest";
import {REVIEW_KEY,reviewAnswer,readReviews,dueReviews,reviewOverview,learningActions,validReview} from "./masteryJourney";
import {getLearningTrack,saveLearning} from "./academy";
import {exportLocalBackup,restoreLocalBackup,PORTABLE_KEYS} from "./backup";
const DAY=86400000;
const time=Date.UTC(2026,9,26,8,0,0);
describe("spaced retrieval and next useful action",()=>{
 beforeEach(()=>localStorage.clear());
 it("schedules 1, 3, 7, 14, 30-day reviews and returns incorrect answers to next day",()=>{
   const id="frontend-1";
   const a=reviewAnswer(id,true,time);
   expect(a.streak).toBe(1);expect(a.dueAt-time).toBe(DAY);
   const b=reviewAnswer(id,true,time+DAY);
   expect(b.streak).toBe(2);expect(b.dueAt-(time+DAY)).toBe(3*DAY);
   const c=reviewAnswer(id,true,time+4*DAY);
   expect(c.streak).toBe(3);expect(c.dueAt-(time+4*DAY)).toBe(7*DAY);
   const d=reviewAnswer(id,false,time+5*DAY);
   expect(d.streak).toBe(0);expect(d.dueAt-(time+5*DAY)).toBe(DAY);
   expect(d.attempts).toBe(4);expect(d.correct).toBe(3);
   expect(dueReviews(time+6*DAY)).toHaveLength(1);
   expect(dueReviews(time+6*DAY,"cybersecurity")).toHaveLength(0);
 });
 it("validates and filters forged, obsolete and corrupt progress entries",()=>{
   expect(()=>reviewAnswer("unknown-course",true,time)).toThrow();
   expect(()=>reviewAnswer("frontend-1",true,-10)).toThrow();
   const r=reviewAnswer("frontend-1",true,time);
   expect(validReview(r.id,r)).toBe(true);
   expect(validReview(r.id,{...r,dueAt:-1})).toBe(false);
   const stale={"frontend-1":r,"missing-1":r,"frontend-2":{...r,id:"frontend-2",attempts:0}};
   localStorage.setItem(REVIEW_KEY,JSON.stringify(stale));
   expect(Object.keys(readReviews())).toEqual(["frontend-1"]);
   localStorage.setItem(REVIEW_KEY,"not json");
   expect(readReviews()).toEqual({});
 });
 it("selects due review then incomplete lesson and unattempted relevant project",()=>{
   saveLearning({passed:["frontend-1"],attempts:{"frontend-1":1}});
   reviewAnswer("frontend-1",true,time);
   const rec=learningActions("frontend",time+DAY);
   expect(rec[0].kind).toBe("review");
   expect(rec[0].path).toContain("lesson=frontend-1");
   expect(rec.some(r=>r.kind==="learn"&&r.path.includes("frontend-2"))).toBe(true);
   expect(rec.some(r=>r.kind==="project"&&r.path.includes("real-form-validation"))).toBe(true);
   expect(reviewOverview(time+DAY).due).toBe(1);
   expect(getLearningTrack("frontend")?.lessons.length).toBeGreaterThan(3);
 });
 it("includes review schedules in portable backups, preserving original learning progress",()=>{
   saveLearning({passed:["frontend-1"],attempts:{"frontend-1":1}});
   reviewAnswer("frontend-1",true,time);
   expect(PORTABLE_KEYS).toContain(REVIEW_KEY);
   const backup=JSON.stringify(exportLocalBackup());
   localStorage.clear();
   expect(restoreLocalBackup(backup)).toBe(2);
   expect(readReviews()["frontend-1"].streak).toBe(1);
   const corrupt=JSON.parse(backup);
   corrupt.items[REVIEW_KEY]["frontend-1"].streak=-1;
   expect(()=>restoreLocalBackup(JSON.stringify(corrupt))).toThrow(/invalid|damaged/);
 });
});
