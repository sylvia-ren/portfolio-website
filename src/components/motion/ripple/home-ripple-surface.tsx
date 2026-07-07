"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

function drawElementText(ctx: CanvasRenderingContext2D, el: Element) {
  if (!(el instanceof HTMLElement)) return;

  const style = getComputedStyle(el);
  if (style.visibility === "hidden" || style.display === "none") return;

  const rect = el.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;

  const fontSize = parseFloat(style.fontSize);
  ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  if ("letterSpacing" in ctx) {
    ctx.letterSpacing = style.letterSpacing === "normal" ? "0px" : style.letterSpacing;
  }
  ctx.fillStyle = style.color;
  ctx.textBaseline = "top";

  let text = el.textContent?.trim() ?? "";
  if (!text) return;
  if (style.textTransform === "lowercase") text = text.toLowerCase();
  if (style.textTransform === "uppercase") text = text.toUpperCase();

  const lineHeight =
    style.lineHeight === "normal" ? fontSize * 1.3 : parseFloat(style.lineHeight);

  const words = text.split(/\s+/);
  let line = "";
  let y = rect.top;

  const flush = (content: string) => {
    if (!content) return;
    let x = rect.left;
    const lineWidth = ctx.measureText(content).width;
    if (style.textAlign === "center") x = rect.left + (rect.width - lineWidth) / 2;
    else if (style.textAlign === "right") x = rect.right - lineWidth;
    ctx.fillText(content, x, y);
    y += lineHeight;
  };

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > rect.width && line) {
      flush(line);
      line = word;
    } else {
      line = test;
    }
  }
  flush(line);
}

function HomeRippleSurface({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

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
    const sources = new Set<HTMLElement>();

    const retire = () => {
      for (const el of sources) {
        el.classList.remove("home-ripple-source");
        el.style.color = "";
      }
      sources.clear();
      canvas.style.display = "none";
      setActive(false);
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

          for (const el of sources) {
            el.classList.remove("home-ripple-source");
            el.style.color = "";
          }
          sources.clear();

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

          const targets = root.querySelectorAll(RIPPLE_SELECTOR);
          for (const target of targets) {
            if (!(target instanceof HTMLElement)) continue;
            drawElementText(ctx, target);
            target.classList.add("home-ripple-source");
            sources.add(target);
          }

          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
          engine.resize(bufferWidth, bufferHeight);
          engine.setTexture(scratch);
          canvas.style.display = "block";
          setActive(true);

          for (const el of sources) {
            el.style.color = "transparent";
          }
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
        observer.observe(root);
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
    <div
      ref={rootRef}
      className={active ? "home-atmosphere home-atmosphere--active" : "home-atmosphere"}
    >
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
