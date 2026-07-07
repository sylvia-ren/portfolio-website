"use client";

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

/*
 * three paintings drift past in continuous motion — like walking a long wall.
 * hover pauses the drift and whispers the title; click opens the work still.
 */
export function PaintingsMarquee({ items }: { items: PaintingMarqueeItem[] }) {
  const router = useRouter();
  const loop = [...items, ...items];

  return (
    <div className="paintings-marquee" aria-label="paintings">
      <div className="paintings-marquee-track">
        {loop.map((item, index) => (
          <figure key={`${item.slug}-${index}`} className="paintings-marquee-item">
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
                priority={index === 0}
                className="paintings-marquee-image"
              />
              <span className="paintings-marquee-label text-title">{item.label}</span>
            </button>
          </figure>
        ))}
      </div>
    </div>
  );
}
