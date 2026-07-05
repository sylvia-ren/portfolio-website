import type { MetadataRoute } from "next";
import { getSite, getWorks, getWritings } from "@/lib/content";
import { workRooms } from "@/lib/content/schema";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSite().url ?? "";

  const rooms = ["", "/paintings", "/sketchbooks", "/writings", "/photographs", "/about", "/contact"];
  const works = workRooms.flatMap((room) =>
    getWorks(room).map((work) => `/${room}/${work.slug}`),
  );
  const writings = getWritings().map((writing) => `/writings/${writing.slug}`);

  return [...rooms, ...works, ...writings].map((route) => ({
    url: `${base}${route || "/"}`,
  }));
}
