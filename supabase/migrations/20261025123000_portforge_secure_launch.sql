-- PortForge commercial foundation. REVIEW before applying to PortForge's original project.
-- This file is not deployed automatically by GitHub/Vercel.
create table if not exists public.portforge_documents (
  user_id uuid not null references auth.users(id) on delete cascade,
  document_key text not null check (document_key in ('local-backup')),
  document jsonb not null check (jsonb_typeof(document) = 'object' and octet_length(document::text) <= 950000),
  updated_at timestamptz not null default now(),
  primary key (user_id, document_key)
);
alter table public.portforge_documents enable row level security;
revoke all on public.portforge_documents from anon, authenticated;
grant select, insert, update, delete on public.portforge_documents to authenticated;
create policy "Owner reads private backup" on public.portforge_documents
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Owner creates private backup" on public.portforge_documents
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Owner changes private backup" on public.portforge_documents
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Owner deletes private backup" on public.portforge_documents
  for delete to authenticated using ((select auth.uid()) = user_id);

create table if not exists public.portforge_publications (
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text primary key check (slug ~ '^[a-z0-9][a-z0-9-]{2,59}$'),
  document jsonb not null check (jsonb_typeof(document) = 'object' and octet_length(document::text) <= 150000),
  theme text not null default 'minimal' check (theme in ('minimal','editorial','night')),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);
create index if not exists portforge_publications_owner_idx on public.portforge_publications(user_id);
alter table public.portforge_publications enable row level security;
revoke all on public.portforge_publications from anon, authenticated;
grant select on public.portforge_publications to anon;
grant select, insert, update, delete on public.portforge_publications to authenticated;
create policy "Public sees published portfolios" on public.portforge_publications
  for select to anon using (published = true);
create policy "Signed-in sees public and own portfolios" on public.portforge_publications
  for select to authenticated using (published = true or user_id = (select auth.uid()));
create policy "Owner creates publication" on public.portforge_publications
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "Owner updates publication" on public.portforge_publications
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "Owner deletes publication" on public.portforge_publications
  for delete to authenticated using (user_id = (select auth.uid()));

-- Private quota counters: never expose direct table access to browser clients.
create table if not exists public.portforge_ai_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_day date not null default (now() at time zone 'utc')::date,
  mode text not null check (mode in ('question','evaluate','interview_question','interview_evaluate','project_evaluate','oracle','tts')),
  calls integer not null default 0 check (calls >= 0),
  primary key (user_id,usage_day,mode)
);
alter table public.portforge_ai_usage enable row level security;
revoke all on public.portforge_ai_usage from anon, authenticated;
revoke all on public.portforge_ai_usage from public;
-- Uses atomic database updates even with concurrent Edge Function requests.
create or replace function public.portforge_reserve_ai_quota(
  p_user_id uuid, p_mode text, p_limit integer
) returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_calls integer;
begin
  if p_user_id is null or p_mode not in ('question','evaluate','interview_question','interview_evaluate','project_evaluate','oracle','tts')
     or p_limit < 1 or p_limit > 100 then
    return false;
  end if;
  insert into public.portforge_ai_usage (user_id,usage_day,mode,calls)
  values (p_user_id,(now() at time zone 'utc')::date,p_mode,1)
  on conflict (user_id,usage_day,mode) do update
  set calls = public.portforge_ai_usage.calls + 1
  where public.portforge_ai_usage.calls < p_limit
  returning calls into v_calls;
  return v_calls is not null;
end;
$$;
revoke all on function public.portforge_reserve_ai_quota(uuid,text,integer) from public, anon, authenticated;
grant execute on function public.portforge_reserve_ai_quota(uuid,text,integer) to service_role;
-- All authorization is performed using the verified Supabase Auth session, never editable user_metadata.
