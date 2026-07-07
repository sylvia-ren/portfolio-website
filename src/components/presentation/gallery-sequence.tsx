import { Plate } from "./plate";
import type { Plate as PlateData, Work } from "@/lib/content/schema";

/*
 * the rhythm engine of a room: it walks the plates of a work and lets
 * the content's own scale/rest choices compose the breathing.
 * only the first plate loads eagerly — it is the one the visitor meets.
 */
export function GallerySequence({ work }: { work: Work }) {
  if (work.room === "sketchbooks") {
    return <SketchbookGrid work={work} />;
  }

  return (
    <div className="flex flex-col items-start">
      {work.plates.map((plate, index) => (
        <Plate key={plate.src} work={work} plate={plate} eager={index === 0} />
      ))}
    </div>
  );
}

const sketchbookScaleClass: Record<PlateData["scale"], string> = {
  intimate: "w-[min(24rem,100%)]",
  page: "w-full",
  full: "w-full md:col-span-2",
};

const sketchbookSizes: Record<PlateData["scale"], string> = {
  intimate: "(max-width: 768px) 88vw, 384px",
  page: "(max-width: 768px) 88vw, 44vw",
  full: "(max-width: 768px) 88vw, 88vw",
};

const sketchbookAlignment = [
  "md:justify-self-start",
  "md:justify-self-end",
  "md:justify-self-start",
  "md:justify-self-end",
];

function sketchbookFigureClass(plate: PlateData, index: number): string {
  const alignment =
    plate.scale === "full" ? "justify-self-stretch" : sketchbookAlignment[index % 4];

  return `${sketchbookScaleClass[plate.scale]} ${alignment}`;
}

function SketchbookGrid({ work }: { work: Work }) {
  return (
    <div className="grid grid-cols-1 items-start gap-y-[var(--space-section)] md:grid-cols-2 md:gap-x-[var(--space-block)] md:gap-y-[var(--space-block)]">
      {work.plates.map((plate, index) => (
        <Plate
          key={plate.src}
          work={work}
          plate={plate}
          eager={index === 0}
          figureClassName={sketchbookFigureClass(plate, index)}
          sizes={sketchbookSizes[plate.scale]}
        />
      ))}
    </div>
  );
}
