import {describe,it,expect} from "vitest";
import {readFileSync} from "node:fs";
const file=(path:string)=>readFileSync(path,"utf8");
describe("commercial AI and data security invariants",()=>{
  it("enforces verified user session at all paid provider boundaries",()=>{
    const config=file("supabase/config.toml");
    expect(config).toContain("[functions.ai-evaluate]\nverify_jwt = true");
    expect(config).toContain("[functions.tts]\nverify_jwt = true");
    for(const fn of ["ai-evaluate","tts"]){
      const content=file("supabase/functions/"+fn+"/index.ts");
      expect(content).toContain("requireBudget(req,");
      const gatePos=content.indexOf("await requireBudget(req,");
      const firstProvider=content.indexOf("await fetch(",gatePos);
      expect(gatePos).toBeGreaterThan(0);
      expect(firstProvider).toBeGreaterThan(gatePos);
    }
  });
  it("declares row-level policies and refuses direct customer quota access",()=>{
    const migration=file("supabase/migrations/20261025123000_portforge_secure_launch.sql");
    for(const relation of ["portforge_documents","portforge_publications","portforge_ai_usage"]){
      expect(migration).toContain("alter table public."+relation+" enable row level security");
    }
    expect(migration).toContain("revoke all on function public.portforge_reserve_ai_quota");
    expect(migration).toContain("grant execute on function public.portforge_reserve_ai_quota(uuid,text,integer) to service_role");
    expect(migration).toContain("public.portforge_ai_usage.calls < p_limit");
  });
});
