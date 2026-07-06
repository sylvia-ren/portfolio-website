# AGENTS.md

## Cursor Cloud specific instructions

This is a single Next.js 16 (App Router) static site — "a digital exhibition". No database, no backend API, no external services, and no `.env` files. All content lives in `content/` (YAML + Markdown + images) and is validated by Zod at build/dev time.

Standard commands live in `package.json` and `README.md`; use those. Key ones:

- Dev server: `npm run dev` (port 3000; runs `npm run media` first via the `predev` hook)
- Build (also validates all content): `npm run build`
- Lint: `npm run lint`

Non-obvious notes:

- `predev`/`prebuild`/`prestart` hooks run `scripts/sync-media.mjs`, which mirrors images from `content/<room>/<slug>/` into `public/media/` (gitignored). Run `npm run media` manually only if you add/change content images without restarting the dev server.
- A malformed `content/**/work.yaml` (or other content) makes `npm run build` fail with a readable Zod error — this is expected validation behavior, not a code bug.
- Self-hosted Satoshi fonts live in `src/fonts/` and are committed; no font download step is needed.
