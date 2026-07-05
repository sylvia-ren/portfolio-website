import { SiteNav } from "./site-nav";

/*
 * a room provides its own light. components inside only ever see
 * --bg and --fg; whether the walls are paper or night is decided here.
 */
export function RoomShell({
  room,
  children,
}: {
  room: "paper" | "dark";
  children: React.ReactNode;
}) {
  return (
    <div
      data-room={room}
      className="flex min-h-dvh flex-col bg-[var(--bg)] text-[var(--fg)]"
    >
      <a href="#room" className="skip-link text-label">
        skip to the room
      </a>
      <header className="flex justify-end px-[var(--margin-page)] pt-[var(--space-block)]">
        <SiteNav />
      </header>
      <main id="room" className="flex flex-1 flex-col">
        {children}
      </main>
    </div>
  );
}
