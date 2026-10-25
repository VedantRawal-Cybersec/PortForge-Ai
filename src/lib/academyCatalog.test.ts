import {beforeEach,describe,expect,it} from "vitest";
import {getLearning,saveLearning,tracks,totalLessons,trackCategories,getLearningTrack} from "./academy";
import {makeCuratedCareerPlan,starterCareers} from "./careerPlans";

describe("expanded independent learning pathways",()=>{
 beforeEach(()=>localStorage.clear());
 it("publishes 69 discoverable real starter tracks with unique, answerable checks",()=>{
   expect(tracks.length).toBe(69);
   expect(totalLessons()).toBe(207);
   expect(new Set(tracks.map(t=>t.id)).size).toBe(tracks.length);
   const all=tracks.flatMap(t=>t.lessons);
   expect(new Set(all.map(x=>x.id)).size).toBe(all.length);
   for(const track of tracks){
     expect(track.lessons.length).toBe(3);
     expect(track.name.length).toBeGreaterThan(2);
     expect(track.description.length).toBeGreaterThan(15);
     expect(track.category).toBeTruthy();
     expect(track.deliverable).toBeTruthy();
     expect(getLearningTrack(track.id)).toEqual(track);
     for(const lesson of track.lessons){
       expect(lesson.prompt.length).toBeGreaterThan(15);
       expect(lesson.choices).toHaveLength(3);
       expect(new Set(lesson.choices).size).toBe(3);
       expect(lesson.correct).toBeGreaterThanOrEqual(0);
       expect(lesson.correct).toBeLessThan(3);
       expect(lesson.why.length).toBeGreaterThan(22);
       expect(lesson.hint.length).toBeGreaterThan(10);
       expect(lesson.example.length).toBeGreaterThan(15);
     }
   }
   expect(trackCategories.length).toBeGreaterThanOrEqual(6);
 });
 it("keeps existing progress across newly appended lessons",()=>{
   saveLearning({passed:["digital-1","coding-2","react-1"],attempts:{"digital-1":3,"react-1":1}});
   expect(getLearning().passed).toContain("digital-1");
   expect(getLearning().passed).toContain("react-1");
   expect(tracks.find(t=>t.id==="digital")?.lessons[0].id).toBe("digital-1");
 });
 it("exposes every academy track through Oracle with specific deliverables",()=>{
   const mapped=new Set(starterCareers.map(p=>p.learnTrackId).filter(Boolean));
   for(const t of tracks)expect(mapped.has(t.id)).toBe(true);
   expect(new Set(starterCareers.map(p=>p.id)).size).toBe(starterCareers.length);
   for(const item of starterCareers){
     expect(item.steps).toHaveLength(4);
     expect(item.skills.length).toBeGreaterThanOrEqual(3);
     const plan=makeCuratedCareerPlan(item,"beginner");
     expect(plan.steps.some(s=>s.description.includes("Portfolio deliverable:"))).toBe(true);
     expect(plan.steps.every(s=>s.description.length>60)).toBe(true);
   }
 });
 it("keeps external roadmap links restricted to HTTPS roadmap.sh",()=>{
   for(const t of tracks){
     if(t.resourceUrl){
       expect(new URL(t.resourceUrl).protocol).toBe("https:");
       expect(new URL(t.resourceUrl).host).toBe("roadmap.sh");
     }
   }
 });
});