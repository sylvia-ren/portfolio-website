import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import matter from "gray-matter";
import { imageSize } from "image-size";
import { ZodError } from "zod";
import {
  siteSchema,
  workSchema,
  writingSchema,
  type Site,
  type Work,
  type WorkRoom,
  type Writing,
} from "./schema";

const CONTENT_DIR = path.join(process.cwd(), "content");

function fail(where: string, error: unknown): never {
  if (error instanceof ZodError) {
    const details = error.issues
      .map((issue) => `  · ${issue.path.join(".") || "(root)"} — ${issue.message}`)
      .join("\n");
    throw new Error(`content error in ${where}:\n${details}`);
  }
  throw new Error(`content error in ${where}: ${String(error)}`);
}

export function getSite(): Site {
  const file = path.join(CONTENT_DIR, "site.yaml");
  try {
    return siteSchema.parse(parseYaml(fs.readFileSync(file, "utf8")));
  } catch (error) {
    fail("content/site.yaml", error);
  }
}

/**
 * a room of works: every folder under content/<room>/ containing a work.yaml.
 * adding a work is adding a folder — no react is ever touched.
 */
export function getWorks(room: WorkRoom): Work[] {
  const roomDir = path.join(CONTENT_DIR, room);
  if (!fs.existsSync(roomDir)) return [];

  const works = fs
    .readdirSync(roomDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const file = path.join(roomDir, entry.name, "work.yaml");
      if (!fs.existsSync(file)) {
        fail(`content/${room}/${entry.name}`, "missing work.yaml");
      }
      try {
        const parsed = workSchema.parse(parseYaml(fs.readFileSync(file, "utf8")));
        return { ...parsed, slug: entry.name, room };
      } catch (error) {
        fail(`content/${room}/${entry.name}/work.yaml`, error);
      }
    })
    .filter((work) => !work.draft);

  /* newest first; folder name breaks ties so ordering is deliberate */
  return works.sort((a, b) => b.year - a.year || b.slug.localeCompare(a.slug));
}

export function getWork(room: WorkRoom, slug: string): Work | undefined {
  return getWorks(room).find((work) => work.slug === slug);
}

export function getWritings(): Writing[] {
  const dir = path.join(CONTENT_DIR, "writings");
  if (!fs.existsSync(dir)) return [];

  const writings = fs
    .readdirSync(dir)
    .filter((name) => /\.md$/.test(name))
    .map((name) => {
      const raw = fs.readFileSync(path.join(dir, name), "utf8");
      const slug = name.replace(/\.md$/, "");
      try {
        const { data, content } = matter(raw);
        const parsed = writingSchema.parse(data);
        return { ...parsed, slug, body: content.trim() };
      } catch (error) {
        fail(`content/writings/${name}`, error);
      }
    })
    .filter((writing) => !writing.draft);

  return writings.sort((a, b) => b.year - a.year || b.slug.localeCompare(a.slug));
}

export function getWriting(slug: string): Writing | undefined {
  return getWritings().find((writing) => writing.slug === slug);
}

export function getAbout(): { body: string } {
  const file = path.join(CONTENT_DIR, "about.md");
  if (!fs.existsSync(file)) return { body: "" };
  const { content } = matter(fs.readFileSync(file, "utf8"));
  return { body: content.trim() };
}

/** public path for a plate image, colocated with its work */
export function plateSrc(work: Work, file: string): string {
  return `/media/${work.room}/${work.slug}/${file}`;
}

/**
 * intrinsic dimensions, read at build time so every plate's space on the
 * wall is reserved before a single byte of image arrives — nothing shifts,
 * nothing visibly loads. the page already exists.
 */
export function plateDimensions(
  work: Work,
  file: string,
): { width: number; height: number } {
  const abs = path.join(CONTENT_DIR, work.room, work.slug, file);
  const { width, height } = imageSize(fs.readFileSync(abs));
  if (!width || !height) {
    throw new Error(`content error: could not read dimensions of ${abs}`);
  }
  return { width, height };
}
