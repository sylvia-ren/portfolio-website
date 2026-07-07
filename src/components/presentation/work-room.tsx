import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getWork, getWorks, plateDimensions, plateSrc } from "@/lib/content";
import type { WorkRoom } from "@/lib/content/schema";
import { EmptyRoom, Room } from "./room";
import { WorkLabel } from "./work-label";
import { GallerySequence } from "./gallery-sequence";

/*
 * the three image rooms (paintings, sketchbooks, photographs) share one
 * anatomy; the route files stay one line each and are never duplicated.
 */

/*
 * a room is a walk past the works themselves — one at a time, each with
 * a whispered label — never a menu of titles. entering a work opens its
 * catalogue page.
 */
export function WorkRoomIndex({ room }: { room: WorkRoom }) {
  const works = getWorks(room);

  return (
    <Room title={room}>
      {works.length === 0 ? (
        <EmptyRoom />
      ) : (
        <div className="flex flex-col items-start">
          {works.map((work, index) => {
            const plate = work.plates[0];
            const { width, height } = plateDimensions(work, plate.src);
            return (
              <figure
                key={work.slug}
                className="mb-[var(--space-plate)] w-[min(44rem,100%)] last:mb-0"
              >
                <Link href={`/${room}/${work.slug}`} className="block">
                  <div
                    className="plate-lift plate-reveal"
                    style={{ animationDelay: `${120 + index * 90}ms` }}
                  >
                    <Image
                      src={plateSrc(work, plate.src)}
                      alt={plate.alt}
                      width={width}
                      height={height}
                      sizes="(max-width: 768px) 88vw, 704px"
                      quality={60}
                      priority={index === 0}
                      fetchPriority={index === 0 ? "high" : undefined}
                      className="h-auto w-full"
                    />
                  </div>
                </Link>
                <figcaption className="mt-[var(--space-label)]">
                  <Link
                    href={`/${room}/${work.slug}`}
                    className="quiet-link inline-flex items-baseline gap-[var(--space-text)]"
                  >
                    <span className="text-title">{work.title}</span>
                    <span className="text-label">({work.year})</span>
                  </Link>
                </figcaption>
              </figure>
            );
          })}
        </div>
      )}
    </Room>
  );
}

export function WorkCataloguePage({
  room,
  slug,
}: {
  room: WorkRoom;
  slug: string;
}) {
  const work = getWork(room, slug);
  if (!work) notFound();

  return (
    <article className="px-[var(--margin-page)] pb-[var(--space-section)]">
      <div
        className="mt-[var(--space-section)] mb-[var(--space-section)] reveal-in"
        style={{ animationDelay: "80ms" }}
      >
        <WorkLabel work={work} />
      </div>
      <GallerySequence work={work} />
      <p
        className="mt-[var(--space-rest)] reveal-in"
        style={{ animationDelay: `${120 + work.plates.length * 90 + 120}ms` }}
      >
        <Link href={`/${room}`} className="text-label quiet-link">
          {room}
        </Link>
      </p>
    </article>
  );
}

export function workRoomParams(room: WorkRoom): { slug: string }[] {
  return getWorks(room).map((work) => ({ slug: work.slug }));
}

export function workMetadata(room: WorkRoom, slug: string) {
  const work = getWork(room, slug);
  if (!work) return {};
  const details = [String(work.year), work.medium].filter(Boolean).join(", ");
  return {
    title: work.title,
    description: work.note?.trim() ?? `${work.title} (${details}) — ${room}.`,
  };
}
