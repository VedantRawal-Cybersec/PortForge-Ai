# PortForge AI
**Learn. Practice. Build. Grow.**

PortForge AI is an evolving skill-development and career-preparation platform designed for beginners, students, career switchers, and working professionals. It is **not** an individual's portfolio or a cybersecurity-specific product.

## Implemented
- **Guided dashboard:** choose a goal, experience level, and starting learning track
- **Learning Academy:** 4 foundational tracks, 12 bite-sized lessons and graded multiple-choice knowledge checks
- **Skill DNA:** visualize real lesson completion, locally tested coding challenges and AI-assessed activity without claiming professional verification
- **Career Missions:** six guided challenges with locally tracked checklists
- **Independent Practice Lab:** six JavaScript programming exercises with repeatable sandboxed test cases, saved code and reflection
- **Project-to-Interview Coach:** rehearse four interview prompts anchored to a project you actually wrote and tested
- **Career Explorer:** five curated, offline starter roadmaps with saved milestone checklists; optional AI-generated suggestions
- **Skill Test:** submit answers to an external AI evaluator with structured feedback
- **Interview Simulator:** voice/text question practice, browser microphone capture and TTS fallback
- **Project Workspace:** editing for many languages, isolated JavaScript-only execution and AI review (when the configured backend is available)
- **Job Oracle:** AI-assisted role and skill-gap suggestions
- **My Portfolio:** browser-local activity evidence, profile editing and JSON backup export
- **My Data:** unencrypted JSON backup export, validated local restoration and deletion controls (no server synchronization)
- **UI:** responsive navigation, dark/light theme, reduced motion, lazy routes and error recovery
- **Trust:** transparent data use notice, no fabricated user counts or personal default projects

## Critical limitations — do not market as a fully commercial-ready service
- **No cloud user accounts, secure synchronized portfolios, paid subscriptions or independently verified credentials.**
- App progress, profiles and project drafts are saved locally in each browser. Local data can be lost if site storage is cleared.
- **JavaScript sandbox is for educational code snippets, not unrestricted production compute.** All other languages are for editing/AI review only, not execution. A hardened server-side runtime is required for full multi-language support.
- AI services use a Supabase project referenced by this repository. The project is **not accessible from the presently connected management account**; deployed Edge Functions, per-user quotas, secrets, retention and RLS have not been verified.
- Audio/TTS depends on browsers, microphone permission and optional upstream speech services.
- AI assessment feedback is advisory and can be incorrect. The locally generated identifiers are not certified evidence.
- A reviewed, production-appropriate legal privacy policy, TOS and actual service monitoring are still required.

## Development
```bash
npm install
npm run test
npx tsc --noEmit -p tsconfig.app.json
npm run build
npm run dev
```

**Lockfile note:** `package-lock.json` is currently inconsistent with the dependency spec and needs regeneration and review; CI temporarily uses `npm install` rather than `npm ci`.

## Deployment
The Vercel project is [portforge-ai.vercel.app](https://portforge-ai.vercel.app). All React Router paths fall back to `index.html` through `vercel.json`. The production URL may not include these changes until the production deployment is updated.

## Launch readiness
See [commercial-transformation-plan.md](docs/commercial-transformation-plan.md) for security, persistence, certification, payments, user support and production release gates.
