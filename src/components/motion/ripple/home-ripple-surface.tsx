"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { createRippleEngine } from "./engine";

const HOME_IMAGE = "/media/home.jpg";
const MIN_TRAVEL = 14;
const RIPPLE_SELECTOR = "a, h1, p, button, [role='menuitem']";

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource & { width: number; height: number },
  width: number,
  height: number,
) {
  const imageRatio = image.width / image.height;
  const canvasRatio = width / height;
  let drawWidth = width;
  let drawHeight = height;
  let offsetX = 0;
  let offsetY = 0;

  if (imageRatio > canvasRatio) {
    drawWidth = height * imageRatio;
    offsetX = (width - drawWidth) / 2;
  } else {
    drawHeight = width / imageRatio;
    offsetY = (height - drawHeight) / 2;
  }

  ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
}

function HomeRippleSurface({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;

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
      canvas.style.display = "none";
      engine?.destroy();
      engine = null;
    };

    const load = async () => {
      await document.fonts.ready;
      if (cancelled) return;

      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("home image failed to load"));
        img.src = HOME_IMAGE;
      });
      if (cancelled) return;

      try {
        engine = createRippleEngine(canvas, Math.min(devicePixelRatio, 2));
        if (!engine) return;

        const raster = () => {
          if (!engine) return;

          const dpr = Math.min(devicePixelRatio, 2);
          const width = Math.ceil(window.innerWidth);
          const height = Math.ceil(window.innerHeight);
          const bufferWidth = Math.ceil(width * dpr);
          const bufferHeight = Math.ceil(height * dpr);

          const scratch = document.createElement("canvas");
          scratch.width = bufferWidth;
          scratch.height = bufferHeight;
          const ctx = scratch.getContext("2d");
          if (!ctx) {
            retire();
            return;
          }

          ctx.scale(dpr, dpr);
          drawImageCover(ctx, image, width, height);

          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
          engine.resize(bufferWidth, bufferHeight);
          engine.setTexture(scratch);
          canvas.style.display = "block";
        };

        raster();

        let lastX = -1;
        let lastY = -1;
        const onMove = (event: PointerEvent) => {
          if (!engine) return;
          const hit = document.elementFromPoint(event.clientX, event.clientY);
          const target = hit?.closest(RIPPLE_SELECTOR);
          if (!target || !root.contains(target)) return;

          const travel = Math.hypot(event.clientX - lastX, event.clientY - lastY);
          if (travel < MIN_TRAVEL) return;
          lastX = event.clientX;
          lastY = event.clientY;

          const dpr = Math.min(devicePixelRatio, 2);
          engine.drop(event.clientX * dpr, (window.innerHeight - event.clientY) * dpr);
        };

        window.addEventListener("pointermove", onMove);
        listeners.push(() => window.removeEventListener("pointermove", onMove));

        observer = new ResizeObserver(() => raster());
        observer.observe(document.documentElement);

        const onLost = () => retire();
        canvas.addEventListener("webglcontextlost", onLost);
        listeners.push(() => canvas.removeEventListener("webglcontextlost", onLost));
      } catch {
        retire();
      }
    };

    void load();

    return () => {
      cancelled = true;
      listeners.forEach((off) => off());
      observer?.disconnect();
      retire();
    };
  }, []);

  return (
    <div ref={rootRef} className="home-atmosphere">
      <div
        aria-hidden
        className="home-atmosphere-backdrop"
        style={{ backgroundImage: `url(${HOME_IMAGE})` }}
      />
      <canvas ref={canvasRef} aria-hidden className="home-atmosphere-canvas" />
      <div className="home-atmosphere-content">{children}</div>
    </div>
  );
}

export function HomeAtmosphere({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname !== "/") return <>{children}</>;
  return <HomeRippleSurface>{children}</HomeRippleSurface>;
}
