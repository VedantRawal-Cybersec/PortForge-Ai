import {describe,it,expect} from "vitest";
import {interviewPreparation,interviewReport} from "./interviewCoach";
import {makeCuratedCareerPlan,starterCareers} from "./careerPlans";
import {offlineInterviewPrompt} from "./offlineCoach";
describe("practical career and interview learning journeys",()=>{
  it("calibrates real project questions across three experience levels",()=>{
    for(const level of ["beginner","intermediate","advanced"] as const){
      const items=[0,1,2].map(i=>offlineInterviewPrompt("React",i,level,"My own app").question);
      expect(new Set(items).size).toBe(3);
      expect(items.every(q=>q.includes("My own app"))).toBe(true);
    }
  });
  it("provides distinct coaching for foundational, applied and debugging answers",()=>{
    const titles=[0,1,2].map(i=>interviewPreparation(i,"intermediate").title);
    expect(new Set(titles).size).toBe(3);
    expect(interviewPreparation(2,"advanced","Project").context).toContain("Project");
    const report=interviewReport("React","beginner",[{round:0,question:"What is state?",answer:"A value managed by a component.",mode:"Guided (not graded)",feedback:"Give one example."}]);
    expect(report).toContain("A value managed by a component.");
    expect(report).toContain("Guided (not graded)");
    expect(report).not.toContain("Certified");
  });
  it("generates portfolio deliverables appropriate to curated role and level",()=>{
    for(const role of starterCareers){
      const basic=makeCuratedCareerPlan(role,"beginner","HTML, SQL");
      const advanced=makeCuratedCareerPlan(role,"advanced");
      expect(basic.steps).toHaveLength(4);
      expect(basic.steps.some(s=>/Portfolio deliverable:/.test(s.description))).toBe(true);
      expect(advanced.steps[2].description).not.toBe(basic.steps[2].description);
      expect(basic.knownSkills).toContain("html");
      expect(basic.source).toBe("curated");
    }
  });
});
