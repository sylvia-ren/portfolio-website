import Image from "next/image";
import { plateDimensions, plateSrc } from "@/lib/content";
import type { Plate as PlateData, Work } from "@/lib/content/schema";

/*
 * a plate is an image with its silence: the full image, never cropped,
 * never rounded, its exact space reserved before it loads.
 * `scale` decides how much wall it is given; `rest` the pause that follows.
 * entrance is a dissolve; hover is a quiet lift — stillness between.
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
  figureClassName,
  sizes,
  revealDelay,
  interactive = true,
}: {
  work: Work;
  plate: PlateData;
  eager?: boolean;
  figureClassName?: string;
  sizes?: string;
  revealDelay?: number;
  interactive?: boolean;
}) {
  const { width, height } = plateDimensions(work, plate.src);

  return (
    <figure
      className={
        figureClassName ?? `${scaleClass[plate.scale]} ${restClass[plate.rest]} last:mb-0`
      }
    >
      <div
        className={interactive ? "plate-lift plate-reveal" : "plate-reveal"}
        style={revealDelay ? { animationDelay: `${revealDelay}ms` } : undefined}
      >
        <Image
          src={plateSrc(work, plate.src)}
          alt={plate.alt}
          width={width}
          height={height}
          sizes={sizes ?? scaleSizes[plate.scale]}
          priority={eager}
          fetchPriority={eager ? "high" : undefined}
          className="h-auto w-full"
        />
      </div>
      {plate.caption ? (
        <figcaption className="text-label ink-soft mt-[var(--space-label)]">
          {plate.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
