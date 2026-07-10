import Link from "next/link";
import Image from "next/image";
import { plateDimensions, plateSrc } from "@/lib/content";
import type { Work } from "@/lib/content/schema";
import { navCollectionLabel } from "@/lib/content/nav";

/*
 * the sketchbook room opens on the carnet covers: enough of each book is
 * visible to choose a year before stepping into the full stack.
 */
export function SketchbookRoomIndex({ works }: { works: Work[] }) {
  return (
    <ul className="sketchbook-covers">
      {works.map((work, index) => {
        const label = navCollectionLabel("sketchbooks", work);
        const cover = work.plates[0];
        const { width, height } = plateDimensions(work, cover.src);

        return (
          <li
            key={work.slug}
            className="sketchbook-cover-item reveal-in"
            style={{ animationDelay: `${120 + index * 90}ms` }}
          >
            <Link
              href={`/sketchbooks/${work.slug}`}
              className="sketchbook-cover-link quiet-link"
              aria-label={`carnet ${label}`}
            >
              <span className="sketchbook-cover-frame plate-lift">
                <Image
                  src={plateSrc(work, cover.src)}
                  alt={cover.alt}
                  width={width}
                  height={height}
                  sizes="(max-width: 768px) 76vw, 360px"
                  quality={75}
                  priority={index === 0}
                  fetchPriority={index === 0 ? "high" : undefined}
                  className="sketchbook-cover-image"
                />
              </span>
              <span className="sketchbook-cover-label text-title">{label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
