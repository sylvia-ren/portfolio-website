import { TypographyRipple } from "@/components/motion/ripple/typography-ripple";

/*
 * the shared bones of every room page: the page margin, the room title
 * held quietly at the top, and the space where works hang. the title is
 * one of the few surfaces of still water on the site.
 */
export function Room({
  title,
  children,
  bare = false,
}: {
  title: string;
  children: React.ReactNode;
  bare?: boolean;
}) {
  if (bare) {
    return (
      <div className="flex min-h-0 flex-1 flex-col justify-center">
        <div className="reveal-in min-h-0 flex-1" style={{ animationDelay: "120ms" }}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="px-[var(--margin-page)] pb-[var(--space-section)]">
      <h1
        className="text-display mt-[var(--space-section)] reveal-in"
        style={{ animationDelay: "60ms" }}
      >
        <TypographyRipple>{title}</TypographyRipple>
      </h1>
      <div
        className="mt-[var(--space-section)] reveal-in"
        style={{ animationDelay: "150ms" }}
      >
        {children}
      </div>
    </div>
  );
}

/** an honest empty state: the room exists, nothing is hung yet */
export function EmptyRoom() {
  return <p className="text-label ink-soft">this room is being hung.</p>;
}
