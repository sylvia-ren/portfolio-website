import Image from "next/image";
import Link from "next/link";
import { plateDimensions, plateSrc } from "@/lib/content";
import type { Work } from "@/lib/content/schema";
import { navCollectionLabel } from "@/lib/content/nav";

/*
 * the sketchbook room opens with the two carnets already visible; each cover
 * is still just a doorway to the page-turning stack behind it.
 */
const PAPER_MARGIN = 1.06;

export function SketchbookRoomIndex({ works }: { works: Work[] }) {
  return (
    <ul className="sketchbook-covers">
      {works.map((work, index) => {
        const label = navCollectionLabel("sketchbooks", work);
        const cover = work.plates[0];
        const { width, height } = plateDimensions(work, cover.src);
        const aspectRatio = `${width * PAPER_MARGIN} / ${height * PAPER_MARGIN}`;

        return (
          <li
            key={work.slug}
            className="sketchbook-cover-item reveal-in"
            style={{ animationDelay: `${120 + index * 90}ms` }}
          >
            <Link
              href={`/sketchbooks/${work.slug}`}
              className="sketchbook-cover-link quiet-link"
              aria-label={`ouvrir le carnet ${label}`}
            >
              <figure>
                <div className="sketchbook-cover-frame" style={{ aspectRatio }}>
                  <span className="sketchbook-cover-sheet sketchbook-cover-sheet--under-2" />
                  <span className="sketchbook-cover-sheet sketchbook-cover-sheet--under-1" />
                  <span className="sketchbook-cover-sheet sketchbook-cover-sheet--active">
                    <span className="sketchbook-cover-page">
                      <Image
                        src={plateSrc(work, cover.src)}
                        alt={cover.alt}
                        width={width}
                        height={height}
                        sizes="(max-width: 768px) 72vw, 288px"
                        quality={75}
                        priority={index === 0}
                        fetchPriority={index === 0 ? "high" : undefined}
                        className="h-full w-full"
                      />
                    </span>
                  </span>
                </div>
                <figcaption className="sketchbook-cover-caption">
                  <span className="text-title">{work.title}</span>
                  <span className="text-label ink-soft">({label})</span>
                </figcaption>
              </figure>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
