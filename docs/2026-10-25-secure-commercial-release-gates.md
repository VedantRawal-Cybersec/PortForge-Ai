# PortForge commercial release gate — 2026-10-25
**Status:** Source prepared in PR #11. Not deployed to PortForge's configured Supabase project.

## Current production and boundaries
- GitHub main baseline: `bd07d4e35716d5c4c9e5f37c362f0afff46b8d71`.
- Public domain: https://portforge-ai.vercel.app
- Original configured Supabase project: `hoqzslivhdtikweussan` (not visible in the connected account).
- Do NOT use any of the other Supabase projects in the connected account as substitutes. Never copy production user data into unrelated environments.
- Do NOT deploy a frontend requiring signed-in AI without migrating + verifying the same backend first.
- Tests currently cover TS, Vitest, production bundle and mocked Chromium flows; pgTAP and real authenticated AI must run on a staging clone or the actual authorized project.

## Backend rollout (correct project owner only)
1. Connect the right Supabase account/organization that owns `hoqzslivhdtikweussan`. Take a verified database backup and provision a staging clone.
2. Check the Auth email provider and Site URL: `https://portforge-ai.vercel.app`; allow redirect `https://portforge-ai.vercel.app/account` and the specific Vercel preview domain used for QA.
3. Review migration `supabase/migrations/20261025123000_portforge_secure_launch.sql` for conflicts on the target database, then apply to staging and run `supabase test db`. Confirm RLS with two **different** dedicated signed-in users, including attempts to read, update and delete other users' drafts and backup records.
4. Configure the Edge Function environment only in Supabase project settings: the required provider key (`LOVABLE_API_KEY` for current gateway), Supabase standard URL/service-role secrets, and `PORTFORGE_ALLOWED_ORIGINS` for exact QA and production domains. Never expose a service-role key or AI API key in Vite/Vercel client environment variables.
5. Deploy `ai-evaluate` and `tts` to staging with JWT verification enabled. Confirm a no-token request returns 401 without calling providers, an invalid token returns 401, and exhausted quotas return 429 before provider billing.
6. Run `scripts/verify-live-interfaces.mjs` with dedicated A/B short-lived session tokens supplied through environment variables, with `PORTFORGE_LIVE_AI_TESTS=YES` only when provider charges are authorized. It checks beginner, intermediate, advanced questions; evaluation scores and shape; three interview rounds; and rejects anonymous calls.
7. Manually review generated questions for pedagogical difficulty, factual quality and distinct rounds. A valid JSON response is not proof of quality or grading correctness.
8. Manually verify cloud backup and restore across two browsers/accounts, unauthorized data visibility denial, publish, update, and unpublish. Verify B cannot access A's unpublished portfolio; public visitors can only view approved published data. Check privacy and consent language.
9. Configure provider-side spending hard limits and alerts. The Postgres per-user and 750-credit daily global guard limits requests but is NOT a hard monetary spending ceiling.
10. Confirm all release CI checks on the final commit. Only then merge PR #11 and build a **production** Vercel deployment. Validate the canonical domain commit, test all five routes and rollback if errors occur.

## Critical missing validations
- Correct project account access: BLOCKED.
- Migration actually applied to production: NOT DONE.
- SQL RLS cross-user pgTAP tests: NOT RUN against original project.
- Authenticated live AI/TTS calls: NOT RUN against original project.
- Provider hard spend limit: NOT VERIFIED.
- Hosted portfolio share/unpublish: CODE + MOCKED BROWSER TESTS ONLY.
- GitHub frontend typecheck/tests/browser build: tracked in current CI.
- Production updated: NO; user previously required deployment only after everything works.

## Go/no-go
**NO-GO** until correct Supabase access, independent RLS tests, live AI evaluation quality review and cost controls pass. Do not replace the primary backend with an unrelated project, introduce paid services or promise global competitive superiority without validation.
