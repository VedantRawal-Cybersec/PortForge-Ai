# PortForge AI

**Learn. Practice. Build. Grow.**

PortForge AI is an evolving general-purpose skill development and career-preparation platform for beginners, students, and professionals. The product is not a personal portfolio or a cybersecurity-only website.

## Current modules

- **Skill Test:** Topic-based questions and AI-generated feedback
- **Interview:** Voice and text interview practice
- **Workspace:** Code editing, local JavaScript practice and AI project feedback
- **Career Paths:** AI-assisted role exploration and skill-gap suggestions
- **My Portfolio:** Browser-local history of practice activities

## Important product limitations

This release is a prototype. Portfolio entries are stored locally in the browser, so they are not portable verified credentials. The code workspace executes JavaScript in the page context and **must not be treated as a safe untrusted-code runner**. Non-JavaScript languages are not executed. AI functionality depends on external Supabase Edge Functions and availability of their upstream AI services.

Commercialization requires user accounts, secure cloud persistence, a sandboxed code runner, server-side evidence verification, abuse prevention, privacy controls, production observability, and complete regression tests. The homepage intentionally avoids unverified usage numbers or testimonials.

## Stack

React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Supabase JS, React Router.

## Development

```bash
npm ci
npm run dev
npm run test
npm run lint
npm run build
```

## Deployment

Vercel project: [portforge-ai.vercel.app](https://portforge-ai.vercel.app). The `vercel.json` fallback supports client-side routing. Configure client-safe Supabase publishable environment variables in Vercel; never place service role keys in frontend environment variables.
