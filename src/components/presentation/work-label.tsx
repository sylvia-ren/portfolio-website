import type { Work } from "@/lib/content/schema";

/*
 * the wall label: title, year, medium, dimensions.
 * set exactly like a label in a gallery — small, quiet, complete.
 */
export function WorkLabel({ work }: { work: Work }) {
  const details = [String(work.year), work.medium, work.dimensions]
    .filter(Boolean)
    .join(", ");

  return (
    <header>
      <h1 className="text-title">{work.title}</h1>
      <p className="text-label ink-soft mt-[var(--space-hair)]">{details}</p>
      {work.note ? <p className="wall-text mt-[var(--space-block)]">{work.note}</p> : null}
    </header>
  );
}
