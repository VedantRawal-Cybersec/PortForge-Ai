import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { KeyRound, LogOut, ShieldCheck, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePortForgeAuth } from "@/lib/usePortForgeAuth";

export default function Account() {
  const { user, ready } = usePortForgeAuth();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function sendLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setMessage("");
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: window.location.origin + "/account" },
      });
      if (error) throw error;
      setSent(true);
      setMessage("Check your email for a sign-in link or code. If you receive a code, enter it below.");
    } catch {
      setMessage("Sign-in could not be started. Confirm that email authentication and the site redirect are enabled in your Supabase project.");
    } finally { setBusy(false); }
  }
  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !/^[0-9]{6,8}$/.test(otp.trim())) return;
    setBusy(true); setMessage("");
    try {
      const {error}=await supabase.auth.verifyOtp({email:email.trim(),token:otp.trim(),type:"email"});
      if(error)throw error;
      setMessage("Email verified. Your PortForge account is now signed in.");
      setOtp("");
    } catch {
      setMessage("That code could not be verified. Check it and ensure it has not expired.");
    } finally { setBusy(false); }
  }
  async function signOut() {
    setBusy(true);
    const {error} = await supabase.auth.signOut();
    setMessage(error ? "Sign-out failed. Try again." : "Signed out. Your locally saved drafts remain on this device.");
    setBusy(false);
  }
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6">
      <div className="space-y-3">
        <span className="chip chip-cyan"><ShieldCheck className="size-4"/> ACCOUNT & PRIVACY</span>
        <h1 className="text-4xl sm:text-5xl font-bold">Your work stays yours.</h1>
        <p className="text-muted-foreground leading-relaxed">Practise offline without an account. Sign in to access quota-protected AI tools, private cloud backups and portfolio publishing once your account service is configured.</p>
      </div>
      <section className="panel p-5 sm:p-8 space-y-5" aria-live="polite">
        {!ready ? <p role="status">Checking your session…</p> : user ? <>
          <h2 className="text-2xl font-bold">Signed in</h2>
          <p className="text-sm text-muted-foreground">Account: <strong className="text-foreground break-all">{user.email || "Verified account"}</strong></p>
          <p className="text-sm text-muted-foreground">Your local work is not automatically uploaded. Choose what to back up or publish.</p>
          <div className="flex gap-3 flex-wrap">
            <Link to="/my-data" className="rounded-xl bg-foreground text-background px-5 py-3 text-sm font-bold">Manage cloud backups</Link>
            <Link to="/portfolio" className="rounded-xl border border-border px-5 py-3 text-sm font-bold">Publish a portfolio</Link>
            <button type="button" disabled={busy} onClick={signOut} className="rounded-xl border border-border px-5 py-3 text-sm font-bold inline-flex gap-2 items-center"><LogOut size={16}/> Sign out</button>
          </div>
        </> : <>
          <h2 className="text-2xl font-bold flex items-center gap-2"><KeyRound className="size-6 text-led-cyan"/> Sign in by email</h2>
          <form onSubmit={sendLink} className="space-y-4">
            <label htmlFor="account-email" className="block text-sm font-semibold">Email address</label>
            <input id="account-email" type="email" autoComplete="email" required maxLength={254} value={email}
              onChange={e=>setEmail(e.target.value)}
              placeholder="you@example.com" className="w-full rounded-xl border border-border bg-background p-3"/>
            <button disabled={busy||!email.trim()} className="inline-flex gap-2 items-center bg-led-cyan text-background font-bold rounded-xl px-5 py-3 disabled:opacity-50">
              <Mail size={16}/>{busy?"Sending…":"Send sign-in link"}
            </button>
          </form>
          {sent && <form onSubmit={verifyCode} className="rounded-xl border border-border p-4 space-y-3">
            <label htmlFor="account-code" className="block text-sm font-semibold">Received a numeric verification code?</label>
            <input id="account-code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6,8}"
              maxLength={8} value={otp} onChange={e=>setOtp(e.target.value.replace(/[^0-9]/g,""))}
              className="w-full rounded-xl border border-border bg-background p-3 font-mono tracking-widest"
              placeholder="6-digit code" />
            <button type="submit" disabled={busy||!/^[0-9]{6,8}$/.test(otp)}
              className="rounded-xl bg-foreground text-background px-5 py-3 text-sm font-bold disabled:opacity-40">Verify code and sign in</button>
          </form>}
          <p className="text-xs text-muted-foreground">Sign-in requires the PortForge Supabase email provider and redirect URLs to be configured. We do not request your password.</p>
          <p className="text-sm text-muted-foreground">Prefer not to sign in? <Link to="/skill-test" className="text-led-cyan underline">Use guided offline practice</Link>.</p>
        </>}
        {message && <p role="status" className="rounded-lg border border-border bg-surface-2 p-3 text-sm">{message}</p>}
      </section>
    </div>
  );
}
