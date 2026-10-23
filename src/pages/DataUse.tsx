import { Link } from "react-router-dom";
import { DatabaseZap, ShieldAlert, HardDrive, Mic } from "lucide-react";
export default function DataUse(){
 const items=[
  {icon:HardDrive,title:"Information saved on this device",body:"Your dashboard preferences, lesson completion, mission checklists, local portfolio records and saved workspace drafts are stored in this browser. Clearing browser storage may remove them. This prototype does not offer cloud account sync or server-side backup."},
  {icon:DatabaseZap,title:"AI requests and external services",body:"When you submit an assessment, project for grading, role request or interview response, that material may be sent to the project's configured Supabase Edge Functions and upstream AI service. Do not submit passwords, API keys, financial identifiers, private client files or other sensitive information."},
  {icon:Mic,title:"Microphone and speech",body:"Interview practice asks for browser microphone permission when voice input is used. Speech-recognition behavior varies by browser and may involve your browser vendor's recognition service. Speech playback may use a text-to-speech provider or your browser's built-in voices."},
  {icon:ShieldAlert,title:"AI output is guidance, not certification",body:"AI feedback may be incomplete or inaccurate. Scores, local reference codes, and self-tracked milestones are not professional certifications. Verify consequential recommendations against authoritative sources."}
 ];
 return <div className="max-w-[950px] mx-auto px-4 sm:px-6 py-12 space-y-9">
   <header className="space-y-4"><div className="chip chip-cyan">PRODUCT TRANSPARENCY</div><h1 className="text-4xl md:text-5xl font-bold tracking-tight">Data use and AI limitations</h1><p className="text-lg text-muted-foreground leading-relaxed">This is a practical transparency notice for the current PortForge AI prototype, not a complete legal privacy policy. Production launch requires a verified data inventory, user rights process, and reviewed terms.</p></header>
   <section className="space-y-4">{items.map(item=><article key={item.title} className="panel p-6 flex items-start gap-4"><span className="size-11 rounded-xl bg-led-cyan/10 flex items-center justify-center shrink-0"><item.icon className="size-5 text-led-cyan"/></span><div><h2 className="text-xl font-bold">{item.title}</h2><p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.body}</p></div></article>)}</section>
   <div className="panel p-6"><h2 className="font-bold text-lg">What is not supported yet</h2><p className="mt-3 text-sm text-muted-foreground">Multi-device account recovery, public portfolio publishing, certified evidence verification, paid subscriptions, and secure multi-language code execution are not available in this release. Do not rely on local activity records as durable storage.</p><Link to="/dashboard" className="inline-flex mt-5 text-led-cyan hover:underline">Return to my dashboard →</Link></div>
 </div>;
}
