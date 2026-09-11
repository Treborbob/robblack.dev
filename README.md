# robblack.dev

Personal site for Rob Black. One page, written as a changelog.

[Live site](https://robblack.dev)

## Stack

- Next.js 16 (App Router, server components; one small client script for the console boot log, the console trigger, and a release-index fallback for browsers without scroll-driven animations)
- React 19, TypeScript strict
- Tailwind CSS 4
- Biome for lint and format
- pnpm
- Deployed on Vercel

No database, no auth, no analytics, no cookies.

## Content

Everything on the page comes from `lib/content.ts`. Edit that file to update
roles, releases, projects or contact details. Version numbers follow the
scheme in `lib/version.ts`: calendar versioning, YY.MM.0.

## Development

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm check      # biome + tsc
pnpm build
```

## Structure

```
app/          layout, page, global styles
components/   one file per section of the page
lib/          content and the version helper
public/       static assets
```

## Licence

Code is MIT, see [LICENSE](LICENSE). The written content, the RB mark and the
share image are © Rob Black, all rights reserved: fork the code, replace the
content. Fonts under `app/fonts` are OFL, see `app/fonts/LICENSE.txt`.
