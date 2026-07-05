import { getAbout } from "@/lib/content";
import { Room } from "@/components/presentation/room";

export const metadata = { title: "about" };

/*
 * reads like the final pages of an exhibition catalogue:
 * measured paragraphs, nothing else.
 */
export default function About() {
  const { body } = getAbout();

  return (
    <Room title="about">
      <div className="max-w-[var(--measure-prose)]">
        {body.split(/\n\s*\n/).map((paragraph, index) => (
          <p key={index} className="wall-text mb-[var(--space-text)] last:mb-0">
            {paragraph}
          </p>
        ))}
      </div>
    </Room>
  );
}
