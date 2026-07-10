/*
 * Records a short demo of the full-page paintings marquee.
 * requires: npm i --no-save playwright && npx playwright install chromium
 */
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = "http://localhost:3100";
const OUT_DIR = "/tmp/paintings-demo";
fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch({
  args: ["--enable-webgl", "--use-gl=swiftshader", "--enable-unsafe-swiftshader"],
});

const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: {
    dir: OUT_DIR,
    size: { width: 1440, height: 900 },
  },
});

const page = await context.newPage();
await page.goto(`${BASE}/paintings`, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

// pause the drift so hover and framing stay stable for the recording
await page.addStyleTag({
  content: ".paintings-marquee-track { animation-play-state: paused !important; }",
});

await page.waitForTimeout(800);

// hover one painting to show the title label
const frame = page.locator(".paintings-marquee-frame").first();
if (await frame.count()) {
  await frame.hover();
  await page.waitForTimeout(1200);
}

// resume drift and capture several seconds of motion
await page.addStyleTag({
  content: ".paintings-marquee-track { animation-play-state: running !important; }",
});
await page.waitForTimeout(8000);

const video = page.video();
await context.close();
await browser.close();

if (!video) {
  throw new Error("No video recorded");
}

const sourcePath = await video.path();
const destPath = `${OUT_DIR}/paintings-full-page-demo.webm`;
fs.renameSync(sourcePath, destPath);
console.log(destPath);
