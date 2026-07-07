import type { WorkRoom } from "./schema";

export type NavCollectionItem = {
  href: string;
  label: string;
};

export type NavCollection = {
  href: string;
  label: WorkRoom;
  items: NavCollectionItem[];
};

/** rooms whose works appear as a quiet hover menu in the site nav */
export const navCollectionRooms: WorkRoom[] = ["paintings", "sketchbooks"];

export function navCollectionLabel(room: WorkRoom, work: {
  title: string;
  year: number;
}): string {
  return room === "sketchbooks" ? String(work.year) : work.title;
}
