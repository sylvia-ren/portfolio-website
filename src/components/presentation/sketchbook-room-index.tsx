import Link from "next/link";
import type { Work } from "@/lib/content/schema";
import { navCollectionLabel } from "@/lib/content/nav";

/*
 * the sketchbook room without previews — only years, whispered on hover.
 * the carnet itself waits behind each link.
 */
export function SketchbookRoomIndex({ works }: { works: Work[] }) {
  return (
    <ul className="sketchbook-years">
      {works.map((work, index) => {
        const label = navCollectionLabel("sketchbooks", work);
        return (
          <li
            key={work.slug}
            className="sketchbook-years-item reveal-in"
            style={{ animationDelay: `${120 + index * 90}ms` }}
          >
            <Link
              href={`/sketchbooks/${work.slug}`}
              className="sketchbook-years-link quiet-link"
              aria-label={`carnet ${label}`}
            >
              <span className="sketchbook-years-label text-title">{label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
