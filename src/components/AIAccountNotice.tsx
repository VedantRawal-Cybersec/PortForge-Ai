import { Link } from "react-router-dom";
import { ShieldCheck, Sparkles } from "lucide-react";
import { usePortForgeAuth } from "@/lib/usePortForgeAuth";

export default function AIAccountNotice(){
  const {user,ready}=usePortForgeAuth();
  if(!ready)return null;
  return <div className="rounded-xl border border-border bg-surface-2/50 p-3 flex items-start gap-2.5 text-xs text-muted-foreground" role="note">
    {user?<ShieldCheck className="size-4 shrink-0 text-led-green"/>:<Sparkles className="size-4 shrink-0 text-led-cyan"/>}
    <p>{user?
      "Signed in. AI assistance is subject to daily usage limits, and evaluations remain advisory.":
      <>Guided practice works without signing in. <Link className="text-led-cyan underline font-semibold" to="/account">Sign in for AI evaluation</Link> after the account service is configured.</>}</p>
  </div>;
}
