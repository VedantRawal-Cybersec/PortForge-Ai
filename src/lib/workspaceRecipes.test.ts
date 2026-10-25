import {describe,expect,it} from "vitest";
import {workspaceRecipes,findWorkspaceRecipe} from "./workspaceRecipes";
import {interviewPreparation,interviewReport} from "./interviewCoach";
describe("guided workspace briefs and interview coaching",()=>{
  it("offers real starter files and concrete acceptance criteria for each level",()=>{
    expect(workspaceRecipes.length).toBeGreaterThanOrEqual(7);
    expect(new Set(workspaceRecipes.map(r=>r.id)).size).toBe(workspaceRecipes.length);
    expect(new Set(workspaceRecipes.map(r=>r.language)).size).toBe(3);
    expect(new Set(workspaceRecipes.map(r=>r.difficulty)).size).toBe(3);
    for(const r of workspaceRecipes){
      expect(r.starter.length).toBeGreaterThan(60);
      expect(r.acceptance.length).toBeGreaterThanOrEqual(3);
      expect(r.brief.length).toBeGreaterThan(30);
      expect(findWorkspaceRecipe(r.id)).toEqual(r);
    }
    expect(findWorkspaceRecipe("../foo")).toBeUndefined();
  });
  it("gives different coaching for each round and chosen project",()=>{
    const basics=interviewPreparation(0,"beginner");
    const applied=interviewPreparation(1,"intermediate");
    const expert=interviewPreparation(2,"advanced","Real project");
    expect(basics.title).not.toBe(applied.title);
    expect(expert.context).toContain("Real project");
    expect(expert.levelTip).toContain("constraints");
    expect(expert.steps).toHaveLength(3);
  });
  it("exports genuine interview answers, not fictitious evaluations",()=>{
    const t=interviewReport("Frontend Developer","beginner",[
      {round:0,question:"What does React state do?",answer:"It tracks changing UI values.",
       mode:"Guided (not graded)",feedback:"Give an example"},
    ]);
    expect(t).toContain("React state");
    expect(t).toContain("It tracks changing UI values");
    expect(t).toContain("Guided (not graded)");
    expect(t).not.toContain("Certified");
  });
});
