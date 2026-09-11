# robblack.dev

Rob's personal one-page site, presented as a changelog of his career.
Static, no backend. Deployed on Vercel from `main`.

## Stack

Next.js 16 (App Router), React 19, TypeScript strict, Tailwind 4, Biome,
pnpm only. No shadcn, no database, no auth, no client components unless
something genuinely needs interaction.

## Conventions

- Top-level `app/`, `components/`, `lib/`, `public/`. No `src/`.
- All copy and data live in `lib/content.ts`. Do not hardcode content in components.
- Versions come from `lib/version.ts`: calendar versioning, YY.MM.0.
- UK English. Dry, plain wording. Jokes are allowed if they are short.
- Design tokens are in `app/globals.css` under `@theme`. Dark only, by choice.
- Respect `prefers-reduced-motion`. Keep the page fully usable with no JS.

## Commands

```
pnpm dev      # http://localhost:3000
pnpm check    # biome + tsc
pnpm build
```

## Guardrails

- Do not change DNS, delete the Netlify site, or touch Vercel production
  settings without being asked.
- Commit in logical units once `pnpm check` passes.
