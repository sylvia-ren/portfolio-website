"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export type PaintingMarqueeItem = {
  slug: string;
  label: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

const MARQUEE_COPY_COUNT = 8;

type MarqueeTrackStyle = CSSProperties & {
  "--paintings-marquee-shift": string;
};

/*
 * three paintings drift past in continuous motion — like walking a long wall.
 * hover pauses the drift and whispers the title; click opens the work still.
 */
export function PaintingsMarquee({ items }: { items: PaintingMarqueeItem[] }) {
  const router = useRouter();
  const copies = Array.from({ length: MARQUEE_COPY_COUNT }, (_, index) => index);
  const trackStyle: MarqueeTrackStyle = {
    "--paintings-marquee-shift": `-${100 / MARQUEE_COPY_COUNT}%`,
  };

  return (
    <div className="paintings-marquee" aria-label="paintings">
      <div className="paintings-marquee-track" style={trackStyle}>
        {copies.map((copyIndex) => (
          <div className="paintings-marquee-group" key={copyIndex}>
            {items.map((item, itemIndex) => (
              <figure
                key={`${copyIndex}-${item.slug}`}
                className="paintings-marquee-item"
              >
                <button
                  type="button"
                  className="paintings-marquee-frame plate-lift"
                  onClick={() => router.push(`/paintings/${item.slug}`)}
                  aria-label={item.label}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    sizes="(max-width: 768px) 40vw, 240px"
                    quality={75}
                    priority={copyIndex === 0 && itemIndex === 0}
                    className="paintings-marquee-image"
                  />
                  <span className="paintings-marquee-label text-title">{item.label}</span>
                </button>
              </figure>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
