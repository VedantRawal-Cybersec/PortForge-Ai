import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { LearnerProfile } from "./profile";
import type { ShowcaseProject } from "./showcaseProjects";
import { safeProjectUrl } from "./showcaseProjects";
import type { PortfolioTheme } from "./portfolioSite";

export interface PublicProject {
  title: string; summary: string; challenge: string; approach: string;
  validation: string; technologies: string; role: string; outcome: string; projectUrl: string;
}
export interface PublicPortfolioData {
  name: string; headline: string; bio: string; focus: string; projects: PublicProject[];
}
export interface Publication {
  slug: string; theme: PortfolioTheme; published: boolean;
  document: PublicPortfolioData; updated_at?: string;
}
const api = supabase as unknown as SupabaseClient;
const clipped = (value: unknown, limit: number) => typeof value === "string" ? value.trim().slice(0,limit) : "";
export function normalizePublicationSlug(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g,"-").replace(/^-|-$/g,"").slice(0,60).replace(/-$/g,"");
}
export function validPublicationSlug(slug: string) {
  return /^[a-z0-9][a-z0-9-]{2,59}$/.test(slug);
}
export function preparePublicPortfolio(profile: LearnerProfile, projects: ShowcaseProject[]): PublicPortfolioData {
  return {
    name: clipped(profile.name,80) || "Portfolio",
    headline: clipped(profile.headline,160),
    bio: clipped(profile.bio,1200),
    focus: clipped(profile.focus,100),
    projects: projects.slice(0,24).map(p=>({
      title:clipped(p.title,100),
      summary:clipped(p.summary,1200),
      challenge:clipped(p.challenge,800),
      approach:clipped(p.approach,1000),
      validation:clipped(p.validation,800),
      technologies:clipped(p.technologies,180),
      role:clipped(p.role,140),
      outcome:clipped(p.outcome,400),
      projectUrl:safeProjectUrl(p.projectUrl),
    })).filter(p=>p.title.length>=3 && p.summary.length>=10),
  };
}
export function sanitizePublicDocument(data: unknown): PublicPortfolioData | null {
  if (!data || typeof data!=="object" || Array.isArray(data)) return null;
  const src=data as Record<string,unknown>;
  if (!Array.isArray(src.projects) || src.projects.length>24) return null;
  return {
    name:clipped(src.name,80) || "Portfolio",
    headline:clipped(src.headline,160),bio:clipped(src.bio,1200),focus:clipped(src.focus,100),
    projects:src.projects.map((raw):PublicProject=>{
      const p=raw && typeof raw==="object"&&!Array.isArray(raw) ? raw as Record<string,unknown> : {};
      return {
        title:clipped(p.title,100),summary:clipped(p.summary,1200),
        challenge:clipped(p.challenge,800),approach:clipped(p.approach,1000),
        validation:clipped(p.validation,800),technologies:clipped(p.technologies,180),
        role:clipped(p.role,140),outcome:clipped(p.outcome,400),
        projectUrl:safeProjectUrl(p.projectUrl),
      };
    }).filter(p=>p.title.length>=3&&p.summary.length>=10),
  };
}
export async function myPublication(userId: string): Promise<Publication | null> {
  const {data,error}=await api.from("portforge_publications").select("slug,theme,published,document,updated_at")
    .eq("user_id",userId).maybeSingle();
  if(error) throw new Error("Publication service is not yet configured or unavailable.");
  if(!data) return null;
  const document=sanitizePublicDocument(data.document);
  return document?{slug:data.slug,theme:data.theme,published:data.published,document,updated_at:data.updated_at}:null;
}
export async function savePublication(userId: string,slugRaw: string,profile:LearnerProfile,projects:ShowcaseProject[],theme:PortfolioTheme){
  const slug=normalizePublicationSlug(slugRaw);
  if(!validPublicationSlug(slug)) throw new Error("Use a URL name of 3–60 lowercase letters, numbers or hyphens.");
  const document=preparePublicPortfolio(profile,projects);
  if(!document.projects.length) throw new Error("Add at least one complete project before publishing.");
  if(!profile.name.trim()) throw new Error("Enter a display name in your profile first.");
  const {error}=await api.from("portforge_publications").upsert({
    user_id:userId, slug, document, theme, published:true, updated_at:new Date().toISOString(),
  },{onConflict:"user_id"});
  if(error) throw new Error(error.code==="23505" ? "That portfolio URL is already used. Choose another." : "Publishing failed. Check your connection and account setup.");
  return "/p/"+slug;
}
export async function unpublish(userId:string){
  const {error}=await api.from("portforge_publications").update({
    published:false,updated_at:new Date().toISOString(),
  }).eq("user_id",userId);
  if(error) throw new Error("Could not unpublish. Try again before sharing this link.");
}
export async function publicPublication(slug:string):Promise<Publication|null>{
  if(!validPublicationSlug(slug)) return null;
  const {data,error}=await api.from("portforge_publications").select("slug,theme,published,document,updated_at")
    .eq("slug",slug).eq("published",true).maybeSingle();
  if(error) throw new Error("Portfolio service is unavailable.");
  if(!data||!data.published) return null;
  const document=sanitizePublicDocument(data.document);
  return document?{slug:data.slug,theme:data.theme,published:true,document,updated_at:data.updated_at}:null;
}
