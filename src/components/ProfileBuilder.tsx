import { useState } from "react";
import { Download, Edit3, Save, FileText } from "lucide-react";
import { getProfile, saveProfile, type LearnerProfile } from "@/lib/profile";
import { getPortfolio } from "@/lib/portfolio";
export default function ProfileBuilder(){
 const [profile,setProfile]=useState<LearnerProfile>(getProfile);
 const [editing,setEditing]=useState(false);
 const [saved,setSaved]=useState(false);
 const [link,setLink]=useState(profile.links[0]||"");
 const change=(field:keyof LearnerProfile,value:string)=>{setProfile(p=>({...p,[field]:value}));setSaved(false);};
 const store=()=>{const next={...profile,links:link.trim()?[link.trim()]:[]};saveProfile(next);setProfile(next);setEditing(false);setSaved(true);};
 const backup=()=>{
   const payload={version:1,exportedAt:new Date().toISOString(),profile:{...profile,links:link.trim()?[link.trim()]:[]},activities:getPortfolio()};
   const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
   const url=URL.createObjectURL(blob);const a=document.createElement("a");
   a.href=url;a.download="portforge-portfolio-backup.json";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
 };
 return <section className="panel p-5 md:p-7 space-y-5" aria-labelledby="profile-title">
   <div className="flex flex-wrap items-start justify-between gap-4">
    <div><p className="text-xs tracking-widest text-led-cyan font-mono mb-2">MY PROFILE BUILDER</p><h2 id="profile-title" className="text-2xl md:text-3xl font-bold">Make your portfolio your own.</h2><p className="mt-2 text-sm text-muted-foreground">Edit your introduction and export a personal backup. Only you control what you enter.</p></div>
    <div className="flex gap-2 flex-wrap">
      <button type="button" onClick={backup} className="inline-flex items-center gap-2 border border-border rounded-lg px-4 py-2.5 text-sm hover:bg-surface-2"><Download className="size-4"/> Export backup</button>
      <button type="button" onClick={()=>{if(editing)store();else setEditing(true);}} className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold bg-led-cyan text-background">{editing?<Save className="size-4"/>:<Edit3 className="size-4"/>}{editing?"Save details":"Edit details"}</button>
    </div>
   </div>
   {editing?<div className="grid md:grid-cols-2 gap-4">
     <label className="block text-sm">Display name<input maxLength={55} value={profile.name} onChange={e=>change("name",e.target.value)} placeholder="Your name" className="block mt-2 w-full p-3 bg-background border border-border rounded-lg"/></label>
     <label className="block text-sm">Professional headline<input maxLength={120} value={profile.headline} onChange={e=>change("headline",e.target.value)} placeholder="e.g. Aspiring Product Designer" className="block mt-2 w-full p-3 bg-background border border-border rounded-lg"/></label>
     <label className="block text-sm md:col-span-2">About you<textarea rows={4} maxLength={1000} value={profile.bio} onChange={e=>change("bio",e.target.value)} placeholder="What are you learning, building, or hoping to achieve?" className="block mt-2 w-full p-3 bg-background border border-border rounded-lg"/></label>
     <label className="block text-sm md:col-span-2">Personal website / project link<input type="url" value={link} onChange={e=>setLink(e.target.value)} placeholder="https://example.com" className="block mt-2 w-full p-3 bg-background border border-border rounded-lg"/></label>
   </div>:<div className="rounded-xl border border-border bg-surface-2 p-6 flex gap-4 items-start">
     <span className="size-12 rounded-xl bg-led-cyan/10 shrink-0 flex items-center justify-center"><FileText className="size-6 text-led-cyan"/></span>
     <div className="min-w-0"><h3 className="text-xl font-bold break-words">{profile.name||"Your name"}</h3><p className="text-led-cyan text-sm mt-1">{profile.headline||"Your personal headline will appear here."}</p><p className="text-sm text-muted-foreground leading-relaxed mt-3 whitespace-pre-wrap break-words">{profile.bio||"Add a short introduction to explain what you're learning and building."}</p>
       {profile.links.length>0&&<a href={/^https:\/\/[^\s]+$/i.test(profile.links[0])?profile.links[0]:undefined} target="_blank" rel="noreferrer noopener" className="inline-block mt-4 text-led-cyan underline text-sm break-all">{/^https:\/\/[^\s]+$/i.test(profile.links[0])?profile.links[0]:"Link must start with https://"}</a>}
     </div>
   </div>}
   <p role="status" className="text-xs text-muted-foreground">{saved?"Saved to this device. ":""}No public portfolio has been published. Cloud sync and shared portfolio links are not currently enabled.</p>
 </section>;
}
