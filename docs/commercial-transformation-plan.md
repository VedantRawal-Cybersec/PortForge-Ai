# PortForge AI — Commercial Product Transformation Plan

## Vision and release standard
Build a beginner-friendly, industry-neutral system connecting **learn → assess → build → interview → demonstrate evidence → career growth**. The public product must not showcase one person's identity or personal projects. Do not claim a capability, user count, assessment verification, or external job-data accuracy without supporting evidence.

This is an execution-order plan, **not an estimate that every feature can be shipped in a day**. Each stage has acceptance gates before production.

## Current-state audit (observed from main source)
- The existing homepage embedded a personal profile and specific cybersecurity projects.
- Homepage activity and latency statistics were hard-coded/illustrative, not live measurements.
- Portfolio data is browser-local (`src/lib/portfolio.ts`); short random hashes are not verifiable signatures.
- Workspace runs user JavaScript with `new Function(code)` in the host page and represents many other languages without execution.
- Supabase `ai-evaluate` and `tts` Edge Functions are configured with `verify_jwt = false`, permissive CORS, and lack user-scoped quotas in reviewed source.
- AI grading uses one model output without validated objective benchmark, provenance or grade calibration.
- 'Learning Engine' has no independent application route, and the landing module merely linked to Skill Test.
- Most features lack substantive automated tests, account-backed progress, and recovery flows.
- Visual patterns are heavily cyber-terminal-oriented and include small labels and pseudo-live telemetry, inconsistent with a universal learning product.
- The linked Supabase runtime project cannot be inspected through the presently connected Supabase account; production service configuration and database policies remain unverified.

## Stage 0 — Trust, brand and safe foundation
- [x] New universal landing page, removing personal project feed and fake usage metrics.
- [x] Personal-data-free local portfolio view with accurate 'AI-assessed, browser-local' labels.
- [x] Clearer navigation and product metadata.
- [ ] Replace all unsubstantiated 'verified/certified/instant' marketing claims across modules.
- [ ] Remove `new Function` execution in the parent browsing context; replace with independent isolated compute.
- [ ] Require backend authentication or bounded anonymous trial protection with per-IP/per-user quotas and output sizes; review all Edge Function CORS rules.
- [ ] Verify upstream provider keys, usage budgets, model fallback, service timeouts, concurrency caps and incident responses.
- [ ] Test all routes, actions and accessibility before promoting.

**Gate:** no personal content or fake stats; no unisolated code execution; no exploitable public AI cost path.

## Stage 1 — Product architecture and information design
Public navigation: Product, How It Works, Features, Pricing, Sign In, Get Started.
Authenticated navigation: Dashboard, Learn, Assess, Projects, Interview, Career, Portfolio; help and settings in secondary menu.
- First-run onboarding asks goal, baseline, role, learning pace and preferred language without overwhelming forms.
- Choose 'starting from zero', 'building projects', 'getting career ready', or 'improving skills'; adjust path dynamically.
- Home dashboard shows next recommended action, progress, recently started work, and contextual AI assistance.
- Shared design tokens, semantic color roles, accessible light/dark mode and reduced-motion handling.
- Responsive layouts at 375, 390, 768, 1024, 1440 px, keyboard testing and focus management.
- Meaningful animation: hover depth, progress transitions, staggered entrance, route continuity; no noisy auto-loop effects.
- No deceptive counters, meaningless latency indicators, or fake social proof.

**Gate:** a first-time user can start a useful learning task within 60 seconds without documentation.

## Stage 2 — Accounts, evidence and cloud persistence
- Supabase Auth or compatible managed auth with secure sessions, email verification and recovery.
- Database entities: profiles, goals, role_targets, skills, learning_paths, lessons, assessment_attempts, project_revisions, interview_sessions, evidence_items, portfolio_pages, usage_budgets and audit_events.
- Ownership-enforcing RLS and negative tests across all tables, views, RPCs, storage buckets and private artifacts.
- Browser-local history import with explicit consent; sync status, save feedback and undo safeguards.
- Privacy: export/delete account, retention controls, public/private artifacts, consent around audio/transcripts.
- Certificate-like badges are **not** issued until evidence provenance can be independently checked.

**Gate:** saved work survives devices and users cannot access each other's data.

## Stage 3 — Upgrade all five shipped tools
**Assess:** structured diagnostic, skill-topic taxonomy, question bank, difficulty adaptation, exact rubrics, AI feedback validated against reference examples, explanation and retry, anti-repeat, progress history.
**Interview:** role libraries, mic/device checks, start/pause/reset/skip, speech/text fallback, interview transcript, realistic follow-ups, structured feedback, session recovery, cost ceilings; no unreliable emotion inference.
**Workspace:** isolate execution with a containerized or equivalent remote sandbox; whitelist real supported languages, quota CPU/memory/time, reject dangerous network/filesystem behavior, multi-file projects, autosave, test runner, AI reviews anchored to test output.
**Career:** role taxonomy, skills mapping from users' actual artifacts, sources/dated claims for job data, achievable milestones, editable roadmaps, saved progress.
**Portfolio:** user-editable personal site, project writeups, media, GitHub links, selective public visibility, export and share, robust verified-evidence service for only truly validated records.

**Gate:** each engine completes its primary use case in tests with offline/error/retry modes.

## Stage 4 — Add real learning engine and differentiators
- Learning Academy with concept explanations, worked examples, quizzes, prerequisites, resource references and adaptive reinforcement.
- Skill DNA: visual knowledge graph calculated from explainable evidence and calibrated rubrics.
- Proof Passport: signed, server-backed, revocable evidence views, not short client-side random numbers.
- AI Mentor: session-aware tutor with scaffolded hints and learner-controlled detail.
- Missions: end-to-end project assignments with transparent criteria and assessment artifacts.
- Localized language experiences with terminology quality assurance.
- Collaboration and recruiter mode only after access control, role permissions and abuse systems are robust.

**Gate:** feedback generates appropriate next steps that users can complete, not dead-end suggestions.

## Stage 5 — Production infrastructure, security and operations
- Move AI access behind a server-side gateway with authentication, metering, rate limiting, spending limits, schema validation, retries, timeouts, audit logs and providers' terms compliance.
- Protect user uploads from injection, malware and disclosure; avoid exposing answer keys or scoring logic.
- Privacy/security review (OWASP Top 10, secrets, dependencies, RLS, SSRF, abuse prevention).
- CDN caching and lazy route loading, optimized fonts/images, reduced JavaScript costs and stable layouts.
- Real user monitoring, error reporting, uptime checks, backup/recovery and support triage.
- Automated unit, integration, a11y, API-contract, E2E and smoke tests in PR/production pipelines.
- Transparent terms, privacy policy, AI limitations, moderation, reporting and support channels.

**Gate:** release only after build/functional/security/regression checks pass and key workflows have verified real responses.

## Stage 6 — Growth and monetization
- Free: onboarding, selected lessons, basic tests and locally or account-saved trial projects with clear usage caps.
- Pro: expanded assessments, interviews, private portfolio customizations, advanced reports and usage quotas.
- Teams/Education: organization admin, cohorts, learning paths, analytics and evidence export.
- Recruiter-facing evidence lookup with consent and clear verification semantics.
- No fabricated testimonials, fake conversion counters or promised hiring outcomes.

## Quality targets (proposed, not measured)
- Core Web Vitals 75th percentile: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1.
- Accessibility: WCAG 2.2 AA for core flows; keyboard and reduced-motion coverage.
- AI invocation success: target ≥99% of allowed requests excluding intentional quota restrictions; explicit error states on failure.
- All critical routes and interactive flows pass desktop/mobile E2E checks.
- Zero hard-coded marketing telemetry and zero personal-default profiles.
- No user code executing in application origin.
- Analytics: activation rate, first assessment completion, project completion, returning users, 7-day retention, support incidents, cost per active learner.

## Release workflow
1. Feature branch + preview.
2. Build, lint, test and inspect preview before merge.
3. Connect correct Supabase project access to verify Edge Functions, secrets and RLS (without exposing credentials).
4. Resolve product/security blockers, expand tests, then merge reviewed changes.
5. Verify production deploy, live routes and main user journeys. Roll back on regressions.

## Scope notes
- A successful Vercel build alone does **not** prove AI functionality or business readiness.
- Automatic code execution, signed certifications, job accuracy, payment handling and stable storage require services and verification that cannot be substituted with interface mockups.
