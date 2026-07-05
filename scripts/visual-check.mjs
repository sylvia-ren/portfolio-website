/*
 * one-off visual verification of the exhibition; not part of the build.
 * requires: npm i --no-save playwright && npx playwright install chromium
 * and the site served on :3100.
 */
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = "http://localhost:3100";
const OUT = "/tmp/shots";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  args: ["--enable-webgl", "--use-gl=swiftshader", "--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

// threshold
await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.screenshot({ path: `${OUT}/01-threshold.png` });

// ripple activation check: canvas visible, dom text transparent
const rippleState = await page.evaluate(async () => {
  await document.fonts.ready;
  await new Promise((resolve) => setTimeout(resolve, 600));
  const canvas = document.querySelector("h1 canvas");
  const text = document.querySelector("h1 span span");
  return {
    canvasVisible: canvas ? getComputedStyle(canvas).display !== "none" : false,
    canvasSize: canvas ? `${canvas.width}x${canvas.height}` : null,
    textColor: text ? getComputedStyle(text).color : null,
  };
});
console.log("ripple state:", JSON.stringify(rippleState));

// disturb the water and capture
const h1 = await page.locator("h1").boundingBox();
if (h1) {
  const cx = h1.x + h1.width / 2;
  const cy = h1.y + h1.height / 2;
  await page.mouse.move(cx - 120, cy, { steps: 4 });
  await page.mouse.move(cx + 120, cy, { steps: 12 });
  await new Promise((resolve) => setTimeout(resolve, 120));
  await page.screenshot({ path: `${OUT}/02-threshold-rippled.png` });
  await new Promise((resolve) => setTimeout(resolve, 2600));
  await page.screenshot({ path: `${OUT}/03-threshold-settled.png` });
}

// idle cost check: no rAF while water is still
const idle = await page.evaluate(
  () =>
    new Promise((resolve) => {
      let frames = 0;
      const original = window.requestAnimationFrame;
      window.requestAnimationFrame = (cb) => {
        frames += 1;
        return original(cb);
      };
      setTimeout(() => resolve(frames), 1000);
    }),
);
console.log("rAF calls during 1s of stillness:", idle);

const routes = [
  ["/paintings", "04-paintings"],
  ["/paintings/2025-untitled-i", "05-painting-catalogue"],
  ["/sketchbooks/2025-carnet", "06-sketchbook"],
  ["/writings", "07-writings"],
  ["/about", "08-about"],
];
for (const [route, name] of routes) {
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${OUT}/${name}.png` });
}

// full sketchbook page for rhythm review
await page.goto(BASE + "/sketchbooks/2025-carnet", { waitUntil: "networkidle" });
await page.screenshot({ path: `${OUT}/09-sketchbook-full.png`, fullPage: true });

// reduced motion: enhancement must not activate
const reduced = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
await reduced.goto(BASE + "/", { waitUntil: "networkidle" });
const reducedState = await reduced.evaluate(async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const canvas = document.querySelector("h1 canvas");
  return canvas ? getComputedStyle(canvas).display : "no-canvas";
});
console.log("reduced-motion canvas display:", reducedState);

await browser.close();
console.log("done");
