import { SketchbookStack } from "@/components/motion/sketchbook-stack";
import { plateDimensions, plateSrc } from "@/lib/content";
import type { Work } from "@/lib/content/schema";
import { Plate } from "./plate";

/*
 * the rhythm engine of a room: it walks the plates of a work and lets
 * the content's own scale/rest choices compose the breathing.
 * only the first plate loads eagerly — it is the one the visitor meets.
 */
export function GallerySequence({ work }: { work: Work }) {
  if (work.room === "sketchbooks") {
    return <SketchbookGallery work={work} />;
  }

  return (
    <div className="flex flex-col items-start">
      {work.plates.map((plate, index) => (
        <Plate
          key={plate.src}
          work={work}
          plate={plate}
          eager={index === 0}
          revealDelay={120 + index * 90}
        />
      ))}
    </div>
  );
}

function SketchbookGallery({ work }: { work: Work }) {
  const plates = work.plates.map((plate) => ({
    src: plateSrc(work, plate.src),
    alt: plate.alt,
    caption: plate.caption,
    ...plateDimensions(work, plate.src),
  }));

  return (
    <div className="reveal-in" style={{ animationDelay: "120ms" }}>
      <SketchbookStack plates={plates} />
    </div>
  );
}
