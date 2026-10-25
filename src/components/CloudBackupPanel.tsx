import { useState } from "react";
import { Link } from "react-router-dom";
import { Cloud, CloudDownload, CloudUpload, Trash2 } from "lucide-react";
import { usePortForgeAuth } from "@/lib/usePortForgeAuth";
import { uploadPrivateBackup, downloadPrivateBackup, deletePrivateBackup } from "@/lib/cloudBackup";

export default function CloudBackupPanel(){
  const {user,ready}=usePortForgeAuth();
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  async function perform(kind:"upload"|"restore"|"delete"){
    if(!user||busy)return;
    const confirmation={
      upload:"Upload the current local progress as your private account backup? This replaces the previous cloud snapshot but does not delete local data.",
      restore:"Restore your private cloud snapshot to this device? Local sections may be overwritten. Download a local backup first if needed.",
      delete:"Permanently remove the cloud backup for this account? Browser-local records and published portfolios are not affected.",
    };
    if(!window.confirm(confirmation[kind]))return;
    setBusy(true);setMessage("");
    try{
      if(kind==="upload"){
        const bytes=await uploadPrivateBackup(user.id);
        setMessage("Private backup saved to your account ("+Math.round(bytes/1024)+" KB). It is not end-to-end encrypted.");
      } else if(kind==="restore"){
        const {sections}=await downloadPrivateBackup(user.id);
        setMessage("Restored "+sections+" local sections. Reload a tool to view the imported data.");
      } else {
        await deletePrivateBackup(user.id);
        setMessage("Private cloud backup deleted.");
      }
    }catch(e){setMessage(e instanceof Error?e.message:"Cloud operation failed.");}
    finally{setBusy(false);}
  }
  return <section className="panel p-6 space-y-5" aria-labelledby="cloud-backup-title">
    <h2 id="cloud-backup-title" className="text-xl font-bold flex gap-3 items-center">
      <Cloud className="size-6 text-led-cyan"/> Private cloud backup
    </h2>
    <p className="text-sm text-muted-foreground">Optional manual backup and restoration for moving between devices. Your work is never automatically uploaded, merged or published by this control. Files are held on the configured Supabase project with per-account access policies; this is not end-to-end encryption.</p>
    {!ready?<p role="status">Checking account…</p>:!user? <Link to="/account" className="inline-flex rounded-lg px-4 py-3 bg-foreground text-background font-semibold text-sm">Sign in for private cloud backup</Link>:
    <div className="flex flex-wrap gap-3">
      <button type="button" disabled={busy} onClick={()=>perform("upload")} className="inline-flex gap-2 items-center rounded-lg px-4 py-3 bg-foreground text-background text-sm font-semibold disabled:opacity-40">
        <CloudUpload size={16}/> Save private backup
      </button>
      <button type="button" disabled={busy} onClick={()=>perform("restore")} className="inline-flex gap-2 items-center rounded-lg px-4 py-3 border border-border text-sm font-semibold disabled:opacity-40">
        <CloudDownload size={16}/> Restore to this device
      </button>
      <button type="button" disabled={busy} onClick={()=>perform("delete")} className="inline-flex gap-2 items-center rounded-lg px-4 py-3 border border-led-alert/40 text-led-alert text-sm font-semibold disabled:opacity-40">
        <Trash2 size={16}/> Delete cloud backup
      </button>
    </div>}
    {message&&<p role="status" className="border border-border bg-surface-2 rounded-lg p-3 text-sm">{message}</p>}
  </section>;
}
