"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type SketchbookPlate = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

const PAPER_MARGIN = 1.06;

/*
 * a sketchbook on the desk: pages stacked beneath, one spread at a time.
 * the fictive sheet sizes itself to each page — portrait for tall drawings,
 * landscape spreads kept tight so the paper does not overshoot the image.
 */
export function SketchbookStack({ plates }: { plates: SketchbookPlate[] }) {
  const [index, setIndex] = useState(0);
  const [turn, setTurn] = useState<"next" | "prev" | null>(null);
  const busy = useRef(false);
  const plate = plates[index];
  const isPortrait = plate.height > plate.width;
  const aspectRatio = `${plate.width * PAPER_MARGIN} / ${plate.height * PAPER_MARGIN}`;

  const turnPage = useCallback(
    (direction: "next" | "prev") => {
      if (busy.current) return;
      if (direction === "next" && index >= plates.length - 1) return;
      if (direction === "prev" && index <= 0) return;

      busy.current = true;

      if (direction === "prev") {
        setIndex((current) => current - 1);
        setTurn("prev");
        window.setTimeout(() => {
          setTurn(null);
          busy.current = false;
        }, 560);
        return;
      }

      setTurn("next");
      window.setTimeout(() => {
        setIndex((current) => current + 1);
        setTurn(null);
        busy.current = false;
      }, 560);
    },
    [index, plates.length],
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const direction = x < rect.width * 0.38 ? "prev" : "next";
      turnPage(direction);
    },
    [turnPage],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        turnPage("next");
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        turnPage("prev");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [turnPage]);

  if (!plate) return null;

  const activeClass =
    turn === "next"
      ? "sketchbook-sheet--turn-next"
      : turn === "prev"
        ? "sketchbook-sheet--turn-prev"
        : "";

  return (
    <div className={`sketchbook ${isPortrait ? "sketchbook--portrait" : "sketchbook--landscape"}`}>
      <div
        className="sketchbook-stage"
        style={{ aspectRatio }}
        onClick={handleClick}
        role="group"
        aria-label={`carnet, page ${index + 1} sur ${plates.length}`}
      >
        <div className="sketchbook-sheet sketchbook-sheet--under-2" aria-hidden />
        <div className="sketchbook-sheet sketchbook-sheet--under-1" aria-hidden />

        <div
          key={index}
          className={`sketchbook-sheet sketchbook-sheet--active ${activeClass}`}
        >
          <div className="sketchbook-page">
            <Image
              src={plate.src}
              alt={plate.alt}
              width={plate.width}
              height={plate.height}
              sizes={isPortrait ? "(max-width: 768px) 84vw, 352px" : "(max-width: 768px) 92vw, 640px"}
              quality={75}
              priority={index === 0}
              className="h-full w-full"
            />
          </div>
        </div>
      </div>

      <div className="sketchbook-meta">
        <p className="sketchbook-hint">
          {index > 0 ? "gauche · " : ""}
          feuilleter
          {index < plates.length - 1 ? " · droite" : ""}
        </p>
        <p className="text-label ink-soft">
          {index + 1} / {plates.length}
        </p>
      </div>

      {plate.caption ? (
        <figcaption className="text-label ink-soft mt-[var(--space-label)]">
          {plate.caption}
        </figcaption>
      ) : null}
    </div>
  );
}
