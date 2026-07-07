# content

everything the site shows lives here. adding, editing or removing work never
touches code — a malformed entry fails the build with a readable message.

## identity — `site.yaml`

name, one-sentence statement, description (seo), contact email.
write with true casing; the site lowercases everything visually.

## works — `paintings/`, `sketchbooks/`, `photographs/`

one folder per work. the folder name is the url slug (use `year-title` so
ordering stays deliberate). inside: a `work.yaml` and the image files (`jpg`,
`png`, `webp`, `avif` or `gif`).

```
paintings/
  2025-le-reve/
    work.yaml
    01.jpg
sketchbooks/
  2023-carnet/
    work.yaml
    01.jpg
    02.jpg
  2024-carnet/
    work.yaml
    01.jpg
```

### adding another sketchbook

1. create a folder under `content/sketchbooks/`, e.g. `2024-carnet/`
2. add a `work.yaml` with `year: 2024` and a `plates:` list (one entry per page)
3. drop the image files beside it (`01.jpg`, `02.jpg`, …)
4. optional: set `order:` so carnets sort predictably in the nav (lower first)
5. restart the dev server — `predev` mirrors images into `public/media/`

the year appears in the sketchbooks hover menu; the folder slug becomes the url
(`/sketchbooks/2024-carnet`).

`work.yaml`:

```yaml
title: Traces of Evaporation
year: 2024
order: 1
medium: chinese ink on paper      # optional
dimensions: 30 × 40 cm            # optional
note: >                           # optional wall text at the entrance
  a single gesture, allowed to continue without me.
plates:
  - src: 01.jpg
    alt: black ink diffusing upward through water   # required, always
    caption: first minute                           # optional
    scale: full        # intimate | page | full     (how much wall it is given)
    rest: silence      # none | breath | silence    (the pause that follows)
  - src: 02.jpg
    alt: the same ink, settled
```

`scale` and `rest` compose the breathing of the room — density and silence
are curated here, in the content, not hard-coded in components.

set `draft: true` to hide a work without deleting it.

## writings — `writings/*.md`

one file per text. frontmatter, then the text itself. line breaks in poems
are honored exactly as written.

```markdown
---
title: What the Water Kept
year: 2023
kind: poem            # poem | prose
---

the ink does not ask
where it is going.
```

## about — `about.md`

plain paragraphs. reads like the final pages of an exhibition catalogue.
