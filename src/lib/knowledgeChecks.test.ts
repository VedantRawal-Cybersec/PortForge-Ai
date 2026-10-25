import {beforeEach,describe,it,expect} from "vitest";
import {knowledgeItems,topics,createKnowledgeSession,questionForSession,answerKnowledge,
  saveKnowledgeSession,readKnowledgeSessions,knowledgeSummary,knowledgeReport} from "./knowledgeChecks";

describe("offline knowledge checks",()=>{
  beforeEach(()=>localStorage.clear());
  it("contains distinct track- and level-banded items with usable feedback",()=>{
    expect(knowledgeItems.length).toBeGreaterThanOrEqual(27);
    expect(new Set(knowledgeItems.map(i=>i.id)).size).toBe(knowledgeItems.length);
    for(const track of topics){
      for(const level of ["beginner","intermediate","advanced"]){
        expect(knowledgeItems.filter(i=>i.topic===track.id&&i.difficulty===level).length).toBeGreaterThanOrEqual(3);
      }
    }
    for(const item of knowledgeItems){
      expect(item.options).toHaveLength(4);
      expect(item.answer).toBeGreaterThanOrEqual(0);
      expect(item.answer).toBeLessThan(4);
      expect(item.explanation.length).toBeGreaterThan(20);
      expect(item.practice.length).toBeGreaterThan(20);
      expect(item.version).toBe(1);
    }
  });
  it("adjusts level after two correct or two wrong responses",()=>{
    let s=createKnowledgeSession("data","beginner");
    let a=questionForSession(s);
    expect(a?.difficulty).toBe("beginner");
    s=answerKnowledge(s,a!,a!.answer);
    a=questionForSession(s);
    s=answerKnowledge(s,a!,a!.answer);
    expect(questionForSession(s)?.difficulty).toBe("intermediate");
    a=questionForSession(s);
    s=answerKnowledge(s,a!,a!.answer===0?1:0);
    a=questionForSession(s);
    s=answerKnowledge(s,a!,a!.answer===0?1:0);
    expect(questionForSession(s)?.difficulty).toBe("beginner");
  });
  it("offers a six-answer session without question repetition and saves transparent evidence",()=>{
    let s=createKnowledgeSession("security","beginner");
    const ids=new Set<string>();
    for(let i=0;i<6;i++){
      const q=questionForSession(s);
      expect(q).not.toBeNull();
      expect(ids.has(q!.id)).toBe(false);
      ids.add(q!.id);
      s=answerKnowledge(s,q!,q!.answer);
    }
    expect(s.completedAt).toBeGreaterThan(0);
    expect(questionForSession(s)).toBeNull();
    saveKnowledgeSession(s);
    expect(readKnowledgeSessions()).toHaveLength(1);
    expect(knowledgeSummary(readKnowledgeSessions()).find(x=>x.topic==="security")?.correct).toBe(6);
    expect(knowledgeReport(s)).toContain("Not a verified qualification");
  });
  it("blocks mismatched item, invalid index and corrupt browser storage",()=>{
    const s=createKnowledgeSession("frontend","beginner");
    expect(()=>answerKnowledge(s,knowledgeItems.find(x=>x.topic==="data")!,0)).toThrow();
    expect(()=>answerKnowledge(s,questionForSession(s)!,-1)).toThrow();
    localStorage.setItem("portforge_knowledge_checks_v1","not json");
    expect(readKnowledgeSessions()).toEqual([]);
  });
});
