import { useState } from "react";
import { CheckCircle2, ClipboardCopy, Download, MessageSquareText, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

type Category = "Bug report" | "Learning feedback" | "Accessibility" | "Billing question" | "Other";
const categories: Category[] = ["Bug report", "Learning feedback", "Accessibility", "Billing question", "Other"];
const MAX = 4000;
const initial = { category: "Bug report" as Category, summary: "", details: "", steps: "", contact: "" };
export default function Support() {
  const [data, setData] = useState(initial);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const valid = data.summary.trim().length >= 8 && data.details.trim().length >= 20;
  function report() {
    return [
      "PortForge AI — customer support report",
      "Category: " + data.category,
      "Summary: " + data.summary.trim(),
      "Details: " + data.details.trim(),
      "Steps to reproduce / desired outcome: " + (data.steps.trim() || "Not provided"),
      "Contact (optional): " + (data.contact.trim() || "Not provided"),
      "Page: " + window.location.origin,
      "Created: " + new Date().toISOString(),
      "This report has NOT been submitted automatically."
    ].join("\n\n");
  }
  async function copy() {
    if (!valid) return;
    try { await navigator.clipboard.writeText(report()); setCopied(true); setError(""); }
    catch { setError("Clipboard unavailable. Use Download report instead."); }
  }
  function download() {
    if (!valid) return;
    const blob = new Blob([report()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "portforge-support-report.txt"; a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setError("");
  }
  return <div className="max-w-[920px] mx-auto px-4 sm:px-6 py-10 space-y-7">
    <header className="space-y-3">
      <span className="chip chip-cyan"><MessageSquareText className="size-4"/> CUSTOMER HELP</span>
      <h1 className="text-4xl md:text-5xl font-bold">Help improve your learning experience.</h1>
      <p className="text-muted-foreground leading-relaxed">Report broken lessons, confusing feedback, accessibility barriers, or product concerns. This page prepares a report you control; it does not send information to a server.</p>
    </header>
    <section className="panel p-5 sm:p-7 space-y-5" aria-label="Prepare a support report">
      <div className="rounded-lg border border-border bg-surface-2 p-4 flex gap-3 text-sm">
        <ShieldAlert className="size-5 shrink-0 text-led-cyan" aria-hidden="true"/>
        <p><strong>No automatic submission.</strong> Copy or download your report and share it with the project owner through an established contact channel. Do not include passwords, API keys, identity documents or private customer data.</p>
      </div>
      <div className="space-y-2">
        <label htmlFor="issue-category" className="text-sm font-semibold">What do you need help with?</label>
        <select id="issue-category" className="block w-full rounded-lg bg-background border border-border p-3" value={data.category} onChange={e=>setData(d=>({...d,category:e.target.value as Category}))}>{categories.map(c=><option key={c} value={c}>{c}</option>)}</select>
      </div>
      <div className="space-y-2">
        <label htmlFor="issue-summary" className="text-sm font-semibold">Short description (required)</label>
        <input id="issue-summary" maxLength={160} className="block w-full rounded-lg bg-background border border-border p-3" placeholder="e.g. My project test never finishes" value={data.summary} onChange={e=>{setCopied(false);setData(d=>({...d,summary:e.target.value}));}} aria-describedby="issue-summary-help"/>
        <p id="issue-summary-help" className="text-xs text-muted-foreground">At least 8 characters.</p>
      </div>
      <div className="space-y-2">
        <label htmlFor="issue-details" className="text-sm font-semibold">What happened, and what did you expect? (required)</label>
        <textarea id="issue-details" rows={5} maxLength={MAX} className="block w-full rounded-lg bg-background border border-border p-3" placeholder="Describe the problem, expected result, and impact on your work." value={data.details} onChange={e=>{setCopied(false);setData(d=>({...d,details:e.target.value}));}} aria-describedby="issue-details-help"/>
        <p id="issue-details-help" className="text-xs text-muted-foreground">{data.details.length}/{MAX} characters; at least 20 required.</p>
      </div>
      <div className="space-y-2">
        <label htmlFor="issue-steps" className="text-sm font-semibold">Steps to reproduce (optional)</label>
        <textarea id="issue-steps" rows={3} maxLength={MAX} className="block w-full rounded-lg bg-background border border-border p-3" placeholder="1. Open a lesson… 2. Click Run… 3. See an error…" value={data.steps} onChange={e=>setData(d=>({...d,steps:e.target.value}))}/>
      </div>
      <div className="space-y-2">
        <label htmlFor="issue-contact" className="text-sm font-semibold">Contact detail (optional)</label>
        <input id="issue-contact" maxLength={160} className="block w-full rounded-lg bg-background border border-border p-3" placeholder="An email address, only if you choose to include it" value={data.contact} onChange={e=>setData(d=>({...d,contact:e.target.value}))}/>
      </div>
      <div className="flex flex-wrap gap-3">
        <button disabled={!valid} type="button" onClick={copy} className="inline-flex gap-2 items-center px-5 py-3 rounded-lg bg-foreground text-background font-semibold disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-led-cyan"><ClipboardCopy className="size-4"/>{copied?"Copied report":"Copy report"}</button>
        <button disabled={!valid} type="button" onClick={download} className="inline-flex gap-2 items-center px-5 py-3 rounded-lg border border-border font-semibold disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-led-cyan"><Download className="size-4"/> Download report</button>
      </div>
      {copied&&<p role="status" className="text-sm flex items-center gap-2 text-led-cyan"><CheckCircle2 className="size-4"/> Report copied. It has not been submitted.</p>}
      {error&&<p role="alert" className="text-sm text-led-alert">{error}</p>}
    </section>
    <aside className="panel p-5 space-y-2">
      <h2 className="font-bold text-xl">Looking for data controls?</h2>
      <p className="text-sm text-muted-foreground">Back up or delete supported browser-local learning records, and review what AI services may receive.</p>
      <div className="flex flex-wrap gap-4 text-sm text-led-cyan"><Link to="/my-data">My data &amp; backups</Link><Link to="/data-use">Data use &amp; AI limitations</Link></div>
    </aside>
  </div>;
}
