"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavCollection } from "@/lib/content/nav";

const staticRooms = [
  { href: "/", label: "home" },
  { href: "/writings", label: "writings" },
  { href: "/photographs", label: "photographs" },
  { href: "/about", label: "about" },
  { href: "/contact", label: "contact" },
] as const;

type NavEntry =
  | { kind: "link"; href: string; label: string }
  | { kind: "collection"; collection: NavCollection };

/*
 * the only wayfinding on the site: quiet labels, top right.
 * paintings and sketchbooks unfold on hover — like turning to the index
 * of a catalogue without leaving the room you are in.
 */
export function SiteNav({ collections }: { collections: NavCollection[] }) {
  const pathname = usePathname();

  const entries: NavEntry[] = [
    { kind: "link", href: "/", label: "home" },
    ...collections.map(
      (collection): NavEntry => ({ kind: "collection", collection }),
    ),
    ...staticRooms
      .filter((room) => room.href !== "/")
      .map((room): NavEntry => ({ kind: "link", ...room })),
  ];

  return (
    <nav aria-label="rooms">
      <ul className="flex flex-wrap justify-end gap-x-5 gap-y-1">
        {entries.map((entry) => {
          if (entry.kind === "link") {
            const current =
              entry.href === "/"
                ? pathname === "/"
                : pathname.startsWith(entry.href);
            return (
              <li key={entry.href}>
                <Link
                  href={entry.href}
                  aria-current={current ? "page" : undefined}
                  className="text-label quiet-link"
                >
                  {entry.label}
                </Link>
              </li>
            );
          }

          const { collection } = entry;
          const current = pathname.startsWith(collection.href);

          return (
            <li key={collection.href} className="nav-dropdown">
              <Link
                href={collection.href}
                aria-current={current ? "page" : undefined}
                aria-haspopup="true"
                className="text-label quiet-link"
              >
                {collection.label}
              </Link>
              {collection.items.length > 0 ? (
                <ul className="nav-dropdown-menu" role="menu">
                  {collection.items.map((item) => {
                    const itemCurrent = pathname === item.href;
                    return (
                      <li key={item.href} role="none">
                        <Link
                          href={item.href}
                          role="menuitem"
                          aria-current={itemCurrent ? "page" : undefined}
                          className="nav-dropdown-item quiet-link"
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
