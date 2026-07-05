# a digital exhibition

not a portfolio — a quiet exhibition space for paintings, sketchbooks,
writings and photographs. the conceptual thread is diffusion: a single
gesture whose consequences propagate softly and then settle.

## principles

- the artwork is always the protagonist; the interface almost disappears
- stillness is the default state; motion happens only when the visitor causes it
- ink and paper are the entire palette; images provide all other color
- space is the curator: rhythm outranks layout
- the site must be complete, accessible and beautiful with all enhancement off

## editing content

everything shown lives in [`content/`](content/README.md). adding a work is
adding a folder — no code is ever touched. the build fails with a readable
message if an entry is malformed.

## development

```bash
npm install
npm run dev     # mirrors media, starts next
npm run build   # validates all content, builds fully static pages
```

## structure

- `content/` — the collection (yaml + markdown + images), the only thing to edit
- `src/lib/content/` — schemas and loaders: the "cms"
- `src/components/presentation/` — server components; know nothing about motion
- `src/components/navigation/` — the shell and the one nav
- `src/styles/tokens.css` — the entire design system in one file
- `scripts/sync-media.mjs` — mirrors work media into `public/media`

## typography

satoshi (fontshare free license), self-hosted, two weights: light for
display, regular for everything else. no bold exists on this site.
