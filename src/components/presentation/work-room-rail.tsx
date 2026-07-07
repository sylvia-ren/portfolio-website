import Link from "next/link";
import Image from "next/image";
import type { Work } from "@/lib/content/schema";
import { plateDimensions, plateSrc } from "@/lib/content";
import { navCollectionLabel } from "@/lib/content/nav";

/*
 * a horizontal walk through the works — paintings side by side, scrollable,
 * each one lifted on hover. click opens the catalogue page.
 */
export function WorkRoomRail({
  room,
  works,
}: {
  room: Work["room"];
  works: Work[];
}) {
  return (
    <div className="work-rail -mx-[var(--margin-page)] px-[var(--margin-page)]">
      <div className="work-rail-track">
        {works.map((work, index) => {
          const plate = work.plates[0];
          const { width, height } = plateDimensions(work, plate.src);
          const label = navCollectionLabel(room, work);

          return (
            <figure key={work.slug} className="work-rail-item">
              <Link
                href={`/${room}/${work.slug}`}
                className="plate-lift plate-reveal block"
                style={{ animationDelay: `${120 + index * 90}ms` }}
              >
                <Image
                  src={plateSrc(work, plate.src)}
                  alt={plate.alt}
                  width={width}
                  height={height}
                  sizes="(max-width: 768px) 72vw, 320px"
                  quality={60}
                  priority={index === 0}
                  fetchPriority={index === 0 ? "high" : undefined}
                  className="h-auto w-full"
                />
              </Link>
              <figcaption className="mt-[var(--space-label)]">
                <Link
                  href={`/${room}/${work.slug}`}
                  className="quiet-link text-title"
                >
                  {label}
                </Link>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
}
