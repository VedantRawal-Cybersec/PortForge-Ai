import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { exportLocalBackup, restoreLocalBackup } from "./backup";

const api = supabase as unknown as SupabaseClient;
const MAX_SYNC_SIZE = 900000;

/** Opt-in, whole-backup snapshots; no automatic replacement or silent sync. */
export async function uploadPrivateBackup(userId: string): Promise<number> {
  const doc = exportLocalBackup();
  const bytes = new TextEncoder().encode(JSON.stringify(doc)).byteLength;
  if(bytes > MAX_SYNC_SIZE) throw new Error("Your data is too large for one private cloud backup. Download a file instead.");
  const { error } = await api.from("portforge_documents").upsert({
    user_id:userId,document_key:"local-backup",document:doc,updated_at:new Date().toISOString(),
  },{onConflict:"user_id,document_key"});
  if(error) throw new Error("Private cloud backup could not be saved. Check your account and Supabase setup.");
  return bytes;
}
export async function downloadPrivateBackup(userId: string): Promise<{createdAt:string, sections:number}> {
  const {data,error}=await api.from("portforge_documents").select("document").eq("user_id",userId)
    .eq("document_key","local-backup").maybeSingle();
  if(error) throw new Error("Your cloud backup could not be retrieved.");
  if(!data?.document) throw new Error("No private cloud backup exists for this account yet.");
  const record=data.document as unknown;
  if(!record||typeof record!=="object"||Array.isArray(record)) throw new Error("Cloud backup is damaged.");
  const json=JSON.stringify(record);
  if(new TextEncoder().encode(json).byteLength > MAX_SYNC_SIZE)throw new Error("Cloud backup exceeds the import limit.");
  const count=restoreLocalBackup(json);
  const createdAt=(record as Record<string,unknown>).createdAt;
  return {createdAt:typeof createdAt==="string"?createdAt:"Unknown",sections:count};
}
export async function deletePrivateBackup(userId: string): Promise<void>{
  const {error}=await api.from("portforge_documents").delete().eq("user_id",userId).eq("document_key","local-backup");
  if(error)throw new Error("Private backup could not be deleted.");
}
