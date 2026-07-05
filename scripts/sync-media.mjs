/*
 * mirrors media files colocated with works (content/<room>/<slug>/*)
 * into public/media/<room>/<slug>/* so next can serve them.
 * this keeps the promise that adding a work is adding one folder.
 */
import fs from "node:fs";
import path from "node:path";

const ROOMS = ["paintings", "sketchbooks", "photographs"];
const MEDIA = /\.(jpe?g|png|webp|avif|gif|mp4|webm)$/i;

const contentDir = path.resolve("content");
const mediaDir = path.resolve("public/media");

fs.rmSync(mediaDir, { recursive: true, force: true });

let count = 0;
for (const room of ROOMS) {
  const roomDir = path.join(contentDir, room);
  if (!fs.existsSync(roomDir)) continue;

  for (const entry of fs.readdirSync(roomDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const workDir = path.join(roomDir, entry.name);
    for (const file of fs.readdirSync(workDir)) {
      if (!MEDIA.test(file)) continue;
      const target = path.join(mediaDir, room, entry.name, file);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(path.join(workDir, file), target);
      count += 1;
    }
  }
}

console.log(`media: ${count} file(s) mirrored to public/media`);
