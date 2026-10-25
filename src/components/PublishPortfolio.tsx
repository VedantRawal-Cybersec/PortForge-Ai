import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Globe2, LockKeyhole, ExternalLink, ClipboardCopy } from "lucide-react";
import { toast } from "sonner";
import { usePortForgeAuth } from "@/lib/usePortForgeAuth";
import { getProfile, type LearnerProfile } from "@/lib/profile";
import { getShowcaseProjects, type ShowcaseProject } from "@/lib/showcaseProjects";
import { myPublication, normalizePublicationSlug, savePublication, unpublish, type Publication } from "@/lib/publication";
import type { PortfolioTheme } from "@/lib/portfolioSite";

type Props = { profile: LearnerProfile; projects: ShowcaseProject[]; theme: PortfolioTheme };
export default function PublishPortfolio({profile,projects,theme}:Props) {
  const {user,ready}=usePortForgeAuth();
  const [saved,setSaved]=useState<Publication|null>(null);
  const [slug,setSlug]=useState("");
  const [busy,setBusy]=useState(false);
  const [status,setStatus]=useState("");
  useEffect(()=>{
    if(!user){setSaved(null);return;}
    let active=true;
    void myPublication(user.id).then(p=>{
      if(active){setSaved(p);setSlug(p?.slug||normalizePublicationSlug(getProfile().name)+"-portfolio");}
    }).catch(()=>{if(active)setStatus("Cloud publishing is not configured on the selected backend.");});
    return()=>{active=false;};
  },[user]);
  async function publish(){
    if(!user||busy)return;
    if(!window.confirm("Publish your chosen profile text and project case studies to a public web address? Anyone with the URL may view and copy them."))return;
    setBusy(true);setStatus("");
    try {
      const path=await savePublication(user.id,slug,profile,projects,theme);
      const next=await myPublication(user.id);
      setSaved(next);
      setSlug(next?.slug||slug);
      setStatus("Public portfolio published: "+window.location.origin+path);
      toast.success("Public portfolio published.");
    }catch(e){setStatus(e instanceof Error?e.message:"Could not publish.");}
    finally{setBusy(false);}
  }
  async function hide(){
    if(!user||busy)return;
    if(!window.confirm("Unpublish your public portfolio? Existing external copies and search-engine caches cannot be recalled."))return;
    setBusy(true);setStatus("");
    try{await unpublish(user.id);setSaved(prev=>prev?{...prev,published:false}:prev);setStatus("Portfolio unpublished. The public link will no longer display it.");}
    catch(e){setStatus(e instanceof Error?e.message:"Unpublish failed.");}
    finally{setBusy(false);}
  }
  const url=saved?.published?window.location.origin+"/p/"+saved.slug:"";
  return <section className="panel p-5 md:p-7 space-y-5" aria-labelledby="publish-portfolio-title">
    <div className="flex items-center gap-3"><Globe2 className="size-6 text-led-cyan"/>
      <div><h2 id="publish-portfolio-title" className="text-2xl font-bold">Your portfolio on the web</h2>
        <p className="text-sm text-muted-foreground mt-1">A dedicated public link with publish/unpublish controls, separate from the downloadable HTML file.</p>
      </div>
    </div>
    {!ready?<p role="status" className="text-sm">Checking account…</p>:!user?
      <div className="rounded-xl border border-border p-5 space-y-3">
        <p className="text-sm text-muted-foreground flex gap-2 items-center"><LockKeyhole size={17}/> Sign in to publish a page. You can still preview and download HTML without an account.</p>
        <Link to="/account" className="inline-flex rounded-xl bg-foreground text-background px-4 py-2.5 text-sm font-bold">Sign in to publish</Link>
      </div>:
      <div className="space-y-4">
        <label htmlFor="published-slug" className="block text-sm font-bold">Choose your public link name</label>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">portforge-ai.vercel.app/p/</span>
          <input id="published-slug" value={slug} maxLength={60} onChange={e=>setSlug(normalizePublicationSlug(e.target.value))}
            className="flex-1 min-w-[160px] rounded-lg border border-border bg-background p-3 text-sm" placeholder="your-name-portfolio"/>
        </div>
        <p className="text-xs text-muted-foreground">Only your display name, headline, bio, and the {projects.length} case studies in this editor are selected for publication. Your AI practice history, email, private backups, and unsaved drafts are excluded. You control when it is public.</p>
        {saved?.published&&<div className="rounded-xl border border-led-cyan/30 bg-led-cyan/5 p-4 space-y-2">
          <p className="font-bold text-sm text-led-cyan">Currently published</p>
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm break-all underline inline-flex gap-2 items-center">{url}<ExternalLink size={16}/></a>
          <button type="button" onClick={()=>{void navigator.clipboard.writeText(url);toast.info("Link copied.");}}
            className="flex gap-1.5 items-center text-xs border border-border rounded-lg p-2"><ClipboardCopy size={14}/> Copy public link</button>
        </div>}
        <div className="flex flex-wrap gap-3">
          <button type="button" disabled={busy||projects.length===0||!slug}
            onClick={publish} className="bg-led-cyan text-background px-5 py-3 rounded-xl text-sm font-bold disabled:opacity-45">
            {busy?"Saving…":saved?.published?"Update published page":"Publish portfolio"}
          </button>
          {saved?.published&&<button type="button" disabled={busy} onClick={hide}
            className="border border-led-alert/50 rounded-xl px-5 py-3 text-sm font-semibold text-led-alert disabled:opacity-45">Unpublish</button>}
        </div>
      </div>}
    {status&&<p role="status" className="text-sm border border-border rounded-lg bg-surface-2 p-3 break-words">{status}</p>}
  </section>;
}
