import { getSite } from "@/lib/content";

/*
 * the threshold. not a landing page — the moment between the street
 * and the first room. a name, perhaps one sentence, and darkness.
 */
export default function Threshold() {
  const site = getSite();

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-[var(--margin-page)] pb-[var(--space-section)] text-center">
      <h1 className="text-display">{site.name}</h1>
      {site.statement ? (
        <p className="text-label ink-soft mt-[var(--space-block)]">
          {site.statement}
        </p>
      ) : null}
    </div>
  );
}
