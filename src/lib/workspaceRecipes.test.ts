import {describe,it,expect} from "vitest";
import {workspaceRecipes,findWorkspaceRecipe} from "./workspaceRecipes";
describe("guided project briefs",()=>{
 it("provides meaningful starter projects with explicit acceptance conditions",()=>{
   expect(workspaceRecipes.length).toBeGreaterThanOrEqual(7);
   expect(new Set(workspaceRecipes.map(x=>x.id)).size).toBe(workspaceRecipes.length);
   expect(new Set(workspaceRecipes.map(x=>x.language)).size).toBe(3);
   expect(new Set(workspaceRecipes.map(x=>x.difficulty)).size).toBe(3);
   for(const item of workspaceRecipes){
     expect(item.brief.length).toBeGreaterThan(30);
     expect(item.starter.length).toBeGreaterThan(60);
     expect(item.acceptance.length).toBeGreaterThanOrEqual(3);
     expect(findWorkspaceRecipe(item.id)).toEqual(item);
   }
 });
});