import Image from "next/image";
import { plateDimensions, plateSrc } from "@/lib/content";
import type { Plate as PlateData, Work } from "@/lib/content/schema";

/*
 * a plate is an image with its silence: the full image, never cropped,
 * never rounded, never moving, its exact space reserved before it loads.
 * `scale` decides how much wall it is given; `rest` the pause that follows.
 */

const scaleClass: Record<PlateData["scale"], string> = {
  intimate: "w-[min(24rem,72%)]",
  page: "w-[min(48rem,100%)]",
  full: "w-full",
};

const scaleSizes: Record<PlateData["scale"], string> = {
  intimate: "(max-width: 640px) 72vw, 384px",
  page: "(max-width: 832px) 88vw, 768px",
  full: "88vw",
};

const restClass: Record<PlateData["rest"], string> = {
  none: "mb-[var(--space-section)]",
  breath: "mb-[var(--space-plate)]",
  silence: "mb-[var(--space-rest)]",
};

export function Plate({
  work,
  plate,
  eager = false,
}: {
  work: Work;
  plate: PlateData;
  eager?: boolean;
}) {
  const { width, height } = plateDimensions(work, plate.src);

  return (
    <figure className={`${scaleClass[plate.scale]} ${restClass[plate.rest]} last:mb-0`}>
      <Image
        src={plateSrc(work, plate.src)}
        alt={plate.alt}
        width={width}
        height={height}
        sizes={scaleSizes[plate.scale]}
        priority={eager}
        className="h-auto w-full"
      />
      {plate.caption ? (
        <figcaption className="text-label ink-soft mt-[var(--space-label)]">
          {plate.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
