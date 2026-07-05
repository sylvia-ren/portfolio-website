import { Plate } from "./plate";
import type { Work } from "@/lib/content/schema";

/*
 * the rhythm engine of a room: it walks the plates of a work and lets
 * the content's own scale/rest choices compose the breathing.
 * only the first plate loads eagerly — it is the one the visitor meets.
 */
export function GallerySequence({ work }: { work: Work }) {
  return (
    <div className="flex flex-col items-start">
      {work.plates.map((plate, index) => (
        <Plate key={plate.src} work={work} plate={plate} eager={index === 0} />
      ))}
    </div>
  );
}
