-- Run against a migrated local Supabase stack: supabase test db.
-- This test deliberately uses synthetic users in a rolled-back transaction.
begin;
create extension if not exists pgtap with schema extensions;
select plan(12);
select ok((select relrowsecurity from pg_class where oid='public.portforge_documents'::regclass),'private backups have RLS');
select ok((select relrowsecurity from pg_class where oid='public.portforge_publications'::regclass),'published pages have RLS');
select ok((select relrowsecurity from pg_class where oid='public.portforge_ai_usage'::regclass),'quota counters have RLS');
select ok(not has_table_privilege('anon','public.portforge_documents','SELECT'),'anonymous visitors cannot read backups');
select ok(not has_table_privilege('authenticated','public.portforge_ai_usage','SELECT'),'customers cannot read quota counters');
select ok(not has_function_privilege('authenticated','public.portforge_reserve_ai_quota(uuid,text,integer)','EXECUTE'),'customers cannot invoke privileged quota function');
insert into auth.users(id,instance_id,aud,role,email,encrypted_password,created_at,updated_at)
values
('11111111-1111-4111-8111-111111111111','00000000-0000-0000-0000-000000000000','authenticated','authenticated','portforge-owner-a@sample.invalid','',now(),now()),
('22222222-2222-4222-8222-222222222222','00000000-0000-0000-0000-000000000000','authenticated','authenticated','portforge-owner-b@sample.invalid','',now(),now());
insert into public.portforge_documents(user_id,document_key,document)
values
('11111111-1111-4111-8111-111111111111','local-backup','{"format":"portforge-local-backup","version":1,"items":{}}'),
('22222222-2222-4222-8222-222222222222','local-backup','{"format":"portforge-local-backup","version":1,"items":{}}');
insert into public.portforge_publications(user_id,slug,document,published)
values
('11111111-1111-4111-8111-111111111111','portforge-a-test','{"name":"A","projects":[]}',false),
('22222222-2222-4222-8222-222222222222','portforge-b-test','{"name":"B","projects":[]}',true);
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
set local role authenticated;
select is((select count(*)::integer from public.portforge_documents),1,'A only reads A private backup');
select is((select count(*)::integer from public.portforge_publications),2,'A reads A draft plus B public page');
select is((select count(*)::integer from public.portforge_publications where published=false),1,'A cannot see B private drafts');
select is((select count(*)::integer from public.portforge_documents where user_id='22222222-2222-4222-8222-222222222222'),0,'A cannot query B backup');
reset role;
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
set local role authenticated;
select is((select count(*)::integer from public.portforge_documents),1,'B only reads B private backup');
select is((select count(*)::integer from public.portforge_publications where published=false),0,'B cannot read A private draft');
reset role;
select * from finish();
rollback;
