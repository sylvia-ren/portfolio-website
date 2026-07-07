import { getSite } from "@/lib/content";
import { TypographyRipple } from "@/components/motion/ripple/typography-ripple";

/*
 * the threshold. not a landing page — the moment between the street
 * and the first room. a name, perhaps one sentence, and darkness.
 * the name rests beneath still water.
 */
export default function Threshold() {
  const site = getSite();

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-[var(--margin-page)] pb-[var(--space-section)] text-center">
      <h1 className="text-display reveal-in" style={{ animationDelay: "80ms" }}>
        <TypographyRipple>{site.name}</TypographyRipple>
      </h1>
      {site.statement ? (
        <p
          className="text-label ink-soft mt-[var(--space-block)] reveal-in"
          style={{ animationDelay: "180ms" }}
        >
          {site.statement}
        </p>
      ) : null}
    </div>
  );
}
