import { z } from "zod";

/*
 * the content contract. a malformed entry fails the build with a human
 * error message — it never silently breaks a room.
 */

/** how much of the wall a plate is given */
export const plateScales = ["intimate", "page", "full"] as const;

/** the exhalation after a plate: nothing, a breath, or a long silence */
export const plateRests = ["none", "breath", "silence"] as const;

const plateImagePattern = /\.(jpe?g|png|webp|avif|gif)$/i;

export const plateSchema = z.object({
  src: z
    .string()
    .min(1, "a plate needs an image file")
    .regex(plateImagePattern, "plate src must be an image file: jpg, png, webp, avif, or gif"),
  alt: z.string().min(1, "every plate needs alt text — accessibility is not optional"),
  caption: z.string().optional(),
  scale: z.enum(plateScales).default("page"),
  rest: z.enum(plateRests).default("breath"),
});

export const workSchema = z.object({
  title: z.string().min(1),
  year: z.number().int().min(1900).max(2200),
  medium: z.string().optional(),
  dimensions: z.string().optional(),
  /** optional wall text shown at the entrance of the work */
  note: z.string().optional(),
  /** lower numbers hang first within a room; ties fall back to year and slug */
  order: z.number().int().optional(),
  /** hide a work without deleting it */
  draft: z.boolean().default(false),
  plates: z.array(plateSchema).min(1, "a work needs at least one plate"),
});

export const writingSchema = z.object({
  title: z.string().min(1),
  year: z.number().int().min(1900).max(2200),
  kind: z.enum(["poem", "prose"]),
  note: z.string().optional(),
  draft: z.boolean().default(false),
});

export const siteSchema = z.object({
  /** true casing lives in the data; the presentation is lowercase */
  name: z.string().min(1),
  /** the single sentence a visitor may meet at the threshold */
  statement: z.string().optional(),
  description: z.string().min(1),
  email: z.string().email(),
  url: z.string().url().optional(),
});

export type Plate = z.infer<typeof plateSchema>;
export type Work = z.infer<typeof workSchema> & { slug: string; room: WorkRoom };
export type Writing = z.infer<typeof writingSchema> & { slug: string; body: string };
export type Site = z.infer<typeof siteSchema>;

export const workRooms = ["paintings", "sketchbooks", "photographs"] as const;
export type WorkRoom = (typeof workRooms)[number];
