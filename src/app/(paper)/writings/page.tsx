import { getWritings } from "@/lib/content";
import { EmptyRoom, Room } from "@/components/presentation/room";
import { IndexList } from "@/components/presentation/index-list";

export const metadata = { title: "writings" };

export default function Writings() {
  const writings = getWritings();

  return (
    <Room title="writings">
      {writings.length === 0 ? (
        <EmptyRoom />
      ) : (
        <IndexList
          items={writings.map((writing) => ({
            href: `/writings/${writing.slug}`,
            title: writing.title,
            detail: `(${writing.year}, ${writing.kind})`,
          }))}
        />
      )}
    </Room>
  );
}
