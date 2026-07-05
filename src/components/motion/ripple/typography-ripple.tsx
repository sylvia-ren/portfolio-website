"use client";

import { useEffect, useRef } from "react";
import { createRippleEngine } from "./engine";

/*
 * the signature. the text is printed beneath a perfectly still layer of
 * water; the pointer is a microscopic disturbance in it. strictly a
 * progressive enhancement: the real dom text stays in the document
 * (selectable, searchable, read by assistive technology) and is made
 * transparent only once the water is actually rendering above it.
 * any failure at any step leaves plain printed text — the fallback
 * is the design.
 *
 * it enhances only when all of these hold:
 *   a fine pointer · no reduced-motion preference · webgl available ·
 *   canvas letter-spacing support · fonts loaded · text on a single line
 */

const PAD = 40; // css px of water around the text, so ripples are not clipped
const MIN_TRAVEL = 14; // css px of pointer travel between disturbances

export function TypographyRipple({ children }: { children: string }) {
  const textRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const textEl = textRef.current;
    const canvas = canvasRef.current;
    if (!textEl || !canvas) return;

    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let engine: ReturnType<typeof createRippleEngine> = null;
    let observer: ResizeObserver | null = null;
    let cancelled = false;
    const listeners: Array<() => void> = [];

    const retire = () => {
      textEl.style.color = "";
      canvas.style.display = "none";
      engine?.destroy();
      engine = null;
    };

    document.fonts.ready.then(() => {
      if (cancelled) return;
      try {
        const scratch = document.createElement("canvas");
        const ctx = scratch.getContext("2d");
        if (!ctx || !("letterSpacing" in ctx)) return;

        engine = createRippleEngine(canvas, Math.min(devicePixelRatio, 2));
        if (!engine) return;

        const raster = () => {
          if (!engine) return;
          /* the print may currently be transparent under the water —
             restore it so we always rasterize the true ink color */
          textEl.style.color = "";
          const style = getComputedStyle(textEl);
          const rect = textEl.getBoundingClientRect();
          const fontSize = parseFloat(style.fontSize);

          /* wrapped text keeps its printed form — single lines only */
          if (rect.height > fontSize * 1.75 || rect.width === 0) {
            retire();
            return;
          }

          const dpr = Math.min(devicePixelRatio, 2);
          const w = Math.ceil((rect.width + PAD * 2) * dpr);
          const h = Math.ceil((rect.height + PAD * 2) * dpr);
          scratch.width = w;
          scratch.height = h;
          ctx.scale(dpr, dpr);
          ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
          ctx.letterSpacing = style.letterSpacing === "normal" ? "0px" : style.letterSpacing;
          ctx.fillStyle = style.color;
          ctx.textBaseline = "alphabetic";

          let text = textEl.textContent ?? "";
          if (style.textTransform === "lowercase") text = text.toLowerCase();
          if (style.textTransform === "uppercase") text = text.toUpperCase();

          const metrics = ctx.measureText(text);
          const ascent = metrics.fontBoundingBoxAscent || fontSize * 0.8;
          const descent = metrics.fontBoundingBoxDescent || fontSize * 0.2;
          const baseline = PAD + rect.height / 2 + (ascent - descent) / 2;
          ctx.fillText(text, PAD, baseline);

          canvas.style.width = `${rect.width + PAD * 2}px`;
          canvas.style.height = `${rect.height + PAD * 2}px`;
          engine.resize(w, h);
          engine.setTexture(scratch);

          /* the water is rendering; the print beneath goes silent */
          canvas.style.display = "block";
          textEl.style.color = "transparent";
        };

        raster();

        let lastX = -1;
        let lastY = -1;
        const onMove = (event: PointerEvent) => {
          if (!engine) return;
          const travel = Math.hypot(event.clientX - lastX, event.clientY - lastY);
          if (travel < MIN_TRAVEL) return;
          lastX = event.clientX;
          lastY = event.clientY;

          const box = canvas.getBoundingClientRect();
          const dpr = Math.min(devicePixelRatio, 2);
          const x = (event.clientX - box.left) * dpr;
          const y = (box.height - (event.clientY - box.top)) * dpr;
          engine.drop(x, y);
        };

        const area = textEl.parentElement ?? textEl;
        area.addEventListener("pointermove", onMove);
        listeners.push(() => area.removeEventListener("pointermove", onMove));

        observer = new ResizeObserver(() => raster());
        observer.observe(textEl);

        const onLost = () => retire();
        canvas.addEventListener("webglcontextlost", onLost);
        listeners.push(() => canvas.removeEventListener("webglcontextlost", onLost));
      } catch {
        retire();
      }
    });

    return () => {
      cancelled = true;
      listeners.forEach((off) => off());
      observer?.disconnect();
      retire();
    };
  }, [children]);

  return (
    <span className="relative inline-block">
      <span ref={textRef}>{children}</span>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute hidden"
        style={{ left: -PAD, top: -PAD }}
      />
    </span>
  );
}
