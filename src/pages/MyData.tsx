import { useState } from "react";
import { Link } from "react-router-dom";
import { Download, Upload, Trash2, ShieldCheck, HardDrive, ArrowRight } from "lucide-react";
import { clearLocalProgress, downloadLocalBackup, restoreLocalBackup } from "@/lib/backup";
import CloudBackupPanel from "@/components/CloudBackupPanel";
export default function MyData(){
 const [file,setFile]=useState<File|null>(null);
 const [status,setStatus]=useState("");
 const [phrase,setPhrase]=useState("");
 const [busy,setBusy]=useState(false);
 async function restore(){
  if(!file)return;
  if(!window.confirm("Restore this backup? Stored progress for the same sections may be replaced."))return;
  setBusy(true);setStatus("");
  try{const count=restoreLocalBackup(await file.text());setStatus("Restored "+count+" browser-local sections. Reload a page to view imported data.");}
  catch(e){setStatus(e instanceof Error?e.message:"Backup could not be restored.");}
  finally{setBusy(false);}
 }
 function clear(){
  if(phrase!=="DELETE")return;
  if(!window.confirm("Permanently clear PortForge progress stored in this browser?"))return;
  try{clearLocalProgress();setPhrase("");setStatus("Local progress cleared. No server account data was affected.");}
  catch{setStatus("Browser storage could not be cleared.");}
 }
 return <div className="max-w-[970px] mx-auto px-4 sm:px-6 py-10 space-y-8">
  <header className="space-y-3"><span className="chip chip-cyan"><HardDrive className="size-4"/> LOCAL DATA CONTROL</span><h1 className="text-4xl md:text-5xl font-bold">Your progress belongs to you.</h1><p className="text-lg text-muted-foreground leading-relaxed">Export learning history, project practice and profile settings, then restore the backup on another device. Your data remains in this browser unless you manually move the file.</p></header>
  <div className="grid md:grid-cols-2 gap-4">
   <section className="panel p-6 space-y-4"><Download className="size-7 text-led-cyan"/><h2 className="text-2xl font-bold">Export my progress</h2><p className="text-sm text-muted-foreground">Download an unencrypted JSON backup of supported local learning, challenge, career, interview and portfolio records. Keep the file private.</p><button type="button" onClick={()=>{try{downloadLocalBackup();setStatus("Backup download initiated.");}catch{setStatus("Export failed. Browser storage may be blocked.");}}} className="inline-flex gap-2 items-center px-5 py-3 rounded-lg bg-foreground text-background font-semibold"><Download className="size-4"/> Download backup</button></section>
   <section className="panel p-6 space-y-4"><Upload className="size-7 text-led-cyan"/><h2 className="text-2xl font-bold">Restore a backup</h2><p className="text-sm text-muted-foreground">Choose a JSON file previously exported from PortForge AI. Importing can replace local records in the same categories.</p><label className="block text-sm font-semibold" htmlFor="backup-file">Select a backup file</label><input type="file" id="backup-file" accept=".json,application/json" onChange={e=>setFile(e.target.files?.[0]||null)} className="block w-full text-sm"/><button disabled={!file||busy} onClick={restore} className="inline-flex gap-2 items-center px-5 py-3 rounded-lg bg-foreground text-background font-semibold disabled:opacity-40"><Upload className="size-4"/>{busy?"Restoring…":"Restore selected file"}</button></section>
  </div>
  <CloudBackupPanel />
  <section className="panel p-6 space-y-4"><div className="flex items-center gap-3"><ShieldCheck className="size-7 text-led-cyan"/><h2 className="text-xl font-bold">Privacy and reliability</h2></div><p className="text-muted-foreground leading-relaxed text-sm">PortForge currently stores progress in browser storage. Clearing the browser, using private mode, or switching devices can cause loss without a backup. Private optional cloud snapshots require a configured account. do not put sensitive personal information in project code or AI submissions.</p><Link to="/data-use" className="inline-flex gap-2 items-center text-led-cyan text-sm">Full data use notice <ArrowRight className="size-4"/></Link></section>
  <section className="panel p-6 space-y-4"><h2 className="text-xl font-bold flex gap-3 items-center"><Trash2 className="size-5 text-led-alert"/> Delete local progress</h2><p className="text-sm text-muted-foreground">This permanently clears the supported PortForge records from this browser. Export first if you want a backup. Type DELETE to enable the action.</p><label className="block text-sm font-semibold" htmlFor="delete-confirmation">Confirmation word</label><input id="delete-confirmation" className="w-full max-w-sm bg-background border border-border p-3 rounded-lg" autoComplete="off" placeholder="DELETE" value={phrase} onChange={e=>setPhrase(e.target.value)}/><button type="button" onClick={clear} disabled={phrase!=="DELETE"} className="inline-flex gap-2 items-center border border-led-alert/60 text-led-alert rounded-lg px-5 py-3 disabled:opacity-30"><Trash2 className="size-4"/> Delete local records</button></section>
  {status&&<p role="status" className="panel p-4 text-sm">{status}</p>}
 </div>;
}
