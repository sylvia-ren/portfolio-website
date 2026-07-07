import Link from "next/link";

/*
 * the index of a room: nothing but titles and years, like a checklist
 * at a gallery entrance. images wait inside the works themselves.
 */
export type IndexItem = {
  href: string;
  title: string;
  detail: string;
};

export function IndexList({ items }: { items: IndexItem[] }) {
  return (
    <ul className="flex flex-col gap-[var(--space-text)]">
      {items.map((item, index) => (
        <li
          key={item.href}
          className="reveal-in"
          style={{ animationDelay: `${120 + index * 70}ms` }}
        >
          <Link
            href={item.href}
            className="quiet-link inline-flex items-baseline gap-[var(--space-text)]"
          >
            <span className="text-title">{item.title}</span>
            <span className="text-label">{item.detail}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
