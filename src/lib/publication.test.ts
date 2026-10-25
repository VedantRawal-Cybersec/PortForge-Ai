import { describe, expect, it, vi } from "vitest";
vi.mock("@/integrations/supabase/client",()=>({supabase:{auth:{},from:()=>({})}}));
import { normalizePublicationSlug, validPublicationSlug, preparePublicPortfolio, sanitizePublicDocument } from "./publication";
import { defaultProfile } from "./profile";
import type { ShowcaseProject } from "./showcaseProjects";
const project: ShowcaseProject={
  id:"p1",title:"Accessible dashboard",summary:"Built an accessible dashboard with user-controlled filtering.",
  challenge:"Understand user needs",approach:"Used simple controls",validation:"Keyboard-tested",
  technologies:"React",role:"Designed interface",outcome:"Learned accessibility",projectUrl:"javascript:alert(1)",
  createdAt:1,updatedAt:1,
};
describe("public portfolio data privacy and safety",()=>{
  it("normalizes and validates URL slugs",()=>{
    expect(normalizePublicationSlug("  Alice's Portfolio!?")).toBe("alice-s-portfolio");
    expect(validPublicationSlug("alice-s-portfolio")).toBe(true);
    expect(validPublicationSlug("../secret")).toBe(false);
    expect(validPublicationSlug("ab")).toBe(false);
  });
  it("publishes only display fields and sanitized project evidence",()=>{
    const doc=preparePublicPortfolio({...defaultProfile,name:"Taylor",bio:"About me"},[project]);
    expect(doc.name).toBe("Taylor");
    expect(doc.projects).toHaveLength(1);
    expect(doc.projects[0].validation).toBe("Keyboard-tested");
    expect(doc.projects[0].projectUrl).toBe("");
    expect(JSON.stringify(doc)).not.toMatch(/email|password|session|token/i);
  });
  it("handles hostile public document values and rejects unexpected structures",()=>{
    expect(sanitizePublicDocument({projects:"not array"})).toBeNull();
    const safe=sanitizePublicDocument({name:'<img src=x onerror=alert(1)>',projects:[{
      title:"Dangerous <script>",summary:"This is a demonstration project.",projectUrl:"http://example.org",
    }]});
    expect(safe?.name).toContain("<img");
    expect(safe?.projects[0].projectUrl).toBe("");
    // Rendering uses React escaping, never dangeroulySetInnerHTML.
  });
});
