import {describe,expect,it} from "vitest";
import {appliedLabs} from "./practiceAppliedLabs";
import {exercises} from "./practice";

describe("hands-on benchmark project catalog",()=>{
 it("offers 24 distinct projects, including 12 new realistic, tested labs",()=>{
   expect(exercises.length).toBe(24);
   expect(appliedLabs).toHaveLength(12);
   expect(new Set(exercises.map(x=>x.id)).size).toBe(exercises.length);
   for(const topic of ["Frontend","Data","Defensive Security"]){
     expect(appliedLabs.filter(x=>x.topic.startsWith(topic)).length).toBe(4);
   }
   for(const level of ["Beginner","Intermediate","Advanced"]){
     expect(appliedLabs.some(x=>x.level===level)).toBe(true);
   }
 });
 it("each project states executable requirements and includes meaningful edge cases",()=>{
   for(const item of appliedLabs){
     expect(item.title.length).toBeGreaterThan(10);
     expect(item.brief.length).toBeGreaterThan(100);
     expect(item.starter).toContain("function "+item.functionName);
     expect(item.hint.length).toBeGreaterThan(30);
     expect(item.tests).toHaveLength(4);
     expect(new Set(item.tests.map(t=>t.label)).size).toBe(4);
     expect(item.tests.every(t=>Array.isArray(t.args))).toBe(true);
   }
 });
 it("contains deliberately denied outcomes in defensive access labs",()=>{
   const rbac=appliedLabs.find(x=>x.id==="security-role-access")!;
   expect(rbac.tests.some(t=>t.label.includes("denied")&&t.expected===false)).toBe(true);
   expect(rbac.tests.find(t=>t.label==="Admin delete")?.expected).toBe(true);
   const audit=appliedLabs.find(x=>x.id==="security-minimal-audit")!;
   const sensitive=JSON.stringify(audit.tests[0].args);
   const redacted=JSON.stringify(audit.tests[0].expected);
   expect(sensitive).toContain("SECRET");
   expect(redacted).not.toContain("SECRET");
 });
});
