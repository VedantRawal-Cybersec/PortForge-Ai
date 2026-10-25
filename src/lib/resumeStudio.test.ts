import {describe,expect,it} from "vitest";
import {
  blankResume,buildResumeHtml,buildResumePlainText,cleanResume,importPortfolioToResume,
  matchResumeKeywords,resumeGuidance,
} from "./resumeStudio";
import {defaultProfile} from "./profile";
import type {ShowcaseProject} from "./showcaseProjects";
const project:ShowcaseProject={
  id:"my-project",title:"Accessible Dashboard",summary:"Built a keyboard accessible dashboard with React and TypeScript.",
  challenge:"Navigation issues",approach:"Used semantic HTML",validation:"Verified focus behavior in browser",
  technologies:"React, TypeScript, SQL",role:"Developed the interface",outcome:"Improved my understanding of accessibility",
  projectUrl:"https://github.com/example/dashboard",createdAt:1,updatedAt:2,
};
describe("resume studio professional document export",()=>{
  it("starts empty rather than fabricating credentials, but imports real user work",()=>{
    const imported=importPortfolioToResume({...blankResume},
      {...defaultProfile,name:"Taylor",headline:"Aspiring developer",bio:"I build applications.",links:[]},[project]);
    expect(imported.name).toBe("Taylor");
    expect(imported.projects).toHaveLength(1);
    expect(imported.projects[0].description).toContain("Verified focus behavior");
    expect(imported.skills).toContain("TypeScript");
    expect(importPortfolioToResume(imported,{...defaultProfile},[project]).projects).toHaveLength(1);
    expect(imported.experience).toHaveLength(0);
  });
  it("escapes untrusted input and excludes scripts in all four layout exports",()=>{
    for(const style of ["ats","modern","editorial","executive"] as const){
      const html=buildResumeHtml({...blankResume,style,name:'</style><script>alert("x")</script>',
        summary:'<img src=x onerror=alert(1)>',website:"javascript:alert(1)",projects:[{
          id:"1",heading:"Demo",subheading:"",date:"",description:"<iframe src=evil></iframe>",
        }]});
      expect(html).toContain("Content-Security-Policy");
      expect(html).toContain("@page{size:A4");
      expect(html).toContain("&lt;script&gt;");
      expect(html).toContain("&lt;iframe");
      expect(html).not.toContain('<script>alert("x")</script>');
      expect(html).not.toContain('href="javascript:');
      expect(html).toContain("style-"+style);
    }
  });
  it("does not produce unsupported ATS claims and offers actionable checklist",()=>{
    const checks=resumeGuidance({...blankResume});
    expect(checks.some(x=>!x.ok)).toBe(true);
    expect(checks.every(x=>x.detail.length>20)).toBe(true);
  });
  it("reports literal job-description vocabulary, not fabricated suitability",()=>{
    const result=matchResumeKeywords({...blankResume,skills:"React and TypeScript",targetDescription:"Build React dashboards using TypeScript and PostgreSQL"});
    expect(result.found).toContain("react");
    expect(result.missing).toContain("postgresql");
  });
  it("sanitizes unexpected stored data and keeps HTML/text export parity",()=>{
    const doc=cleanResume({name:"Example",style:"fake",projects:[{heading:"Task manager",description:"Completed a real test"}]});
    expect(doc.style).toBe("ats");
    expect(buildResumeHtml(doc)).toContain("Task manager");
    expect(buildResumePlainText(doc)).toContain("Completed a real test");
    expect(cleanResume({education:"bad"}).education).toHaveLength(0);
  });
});
