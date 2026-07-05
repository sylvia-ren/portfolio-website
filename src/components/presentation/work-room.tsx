import Link from "next/link";
import { notFound } from "next/navigation";
import { getWork, getWorks } from "@/lib/content";
import type { WorkRoom } from "@/lib/content/schema";
import { EmptyRoom, Room } from "./room";
import { IndexList } from "./index-list";
import { WorkLabel } from "./work-label";
import { GallerySequence } from "./gallery-sequence";

/*
 * the three image rooms (paintings, sketchbooks, photographs) share one
 * anatomy; the route files stay one line each and are never duplicated.
 */

export function WorkRoomIndex({ room }: { room: WorkRoom }) {
  const works = getWorks(room);

  return (
    <Room title={room}>
      {works.length === 0 ? (
        <EmptyRoom />
      ) : (
        <IndexList
          items={works.map((work) => ({
            href: `/${room}/${work.slug}`,
            title: work.title,
            detail: `(${work.year})`,
          }))}
        />
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
      <div className="mt-[var(--space-section)] mb-[var(--space-section)]">
        <WorkLabel work={work} />
      </div>
      <GallerySequence work={work} />
      <p className="mt-[var(--space-rest)]">
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
  return work ? { title: work.title, description: work.note } : {};
}
