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

## Things that are not obvious

- The release index highlights the current entry with CSS only: a shared
  `timeline-scope` on the changelog grid and a `view-timeline-name` per
  entry, animated in `globals.css`. No JavaScript, no active state in
  browsers without scroll-driven animations.
- There is a hidden debug console (`components/debug-console.tsx`, loaded on
  demand by `components/runtime.tsx`). Keyboard only: the backtick key or the
  Konami code. The console boot log hints at it. Build facts come from
  `next.config.ts` `env` via `lib/build-info.ts`. Do not add a visible trigger.
- The Browser pane does not paint while hidden, so scroll-driven animations
  and `requestAnimationFrame` never advance there. To verify interactive
  behaviour, drive headless Chrome over the DevTools protocol from a small
  Node script (`--remote-debugging-port`, then `Runtime.evaluate` and
  `Page.captureScreenshot`). Anchor URLs render blank in headless
  `--screenshot`; capture full-page and crop instead.
