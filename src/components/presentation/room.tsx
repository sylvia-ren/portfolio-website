/*
 * the shared bones of every room page: the page margin, the room title
 * held quietly at the top, and the space where works hang.
 */
export function Room({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-[var(--margin-page)] pb-[var(--space-section)]">
      <h1 className="text-display mt-[var(--space-section)]">{title}</h1>
      <div className="mt-[var(--space-section)]">{children}</div>
    </div>
  );
}

/** an honest empty state: the room exists, nothing is hung yet */
export function EmptyRoom() {
  return <p className="text-label ink-soft">this room is being hung.</p>;
}
