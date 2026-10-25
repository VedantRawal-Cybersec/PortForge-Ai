import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function usePortForgeAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (alive) { setUser(data.user?.is_anonymous ? null : data.user); setReady(true); }
    }).catch(() => { if (alive) setReady(true); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (alive) { setUser(session?.user && !session.user.is_anonymous ? session.user : null); setReady(true); }
    });
    return () => { alive = false; subscription.unsubscribe(); };
  }, []);
  return { user, ready };
}
