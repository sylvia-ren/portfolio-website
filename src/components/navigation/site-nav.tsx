"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const rooms = [
  { href: "/", label: "home" },
  { href: "/paintings", label: "paintings" },
  { href: "/sketchbooks", label: "sketchbooks" },
  { href: "/writings", label: "writings" },
  { href: "/photographs", label: "photographs" },
  { href: "/about", label: "about" },
  { href: "/contact", label: "contact" },
] as const;

/*
 * the only wayfinding on the site: quiet labels, top right, no underline,
 * no pills, no buttons. the current room is simply a shade more present.
 */
export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="rooms">
      <ul className="flex flex-wrap justify-end gap-x-5 gap-y-1">
        {rooms.map((room) => {
          const current =
            room.href === "/"
              ? pathname === "/"
              : pathname.startsWith(room.href);
          return (
            <li key={room.href}>
              <Link
                href={room.href}
                aria-current={current ? "page" : undefined}
                className="text-label quiet-link"
              >
                {room.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
