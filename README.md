# a digital exhibition

a quiet exhibition space for paintings, sketchbooks,
writings and photographs.


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
