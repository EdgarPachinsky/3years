/**
 * Builds the Chapter 03 photo list from whatever is in the images folder.
 *
 * Drop photos into public/assets/chapter-3/images and that is the whole job —
 * this reads each file's real pixel size out of its header (the mosaic board
 * needs it to keep the photo's shape) and writes the typed list the game
 * imports. Runs automatically on `npm start` and `npm run build`.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMAGES_DIR = join(root, 'public', 'assets', 'chapter-3', 'images');
const OUT_FILE = join(root, 'src', 'app', 'core', 'data', 'chapter-3-photos.generated.ts');
const PUBLIC_PREFIX = 'assets/chapter-3/images';
const ALLOWED = new Set(['.jpg', '.jpeg', '.png', '.webp']);

/* ---------------------------------------------------- dimension readers --- */

function jpegSize(buf) {
  let i = 2; // skip SOI
  while (i < buf.length) {
    if (buf[i] !== 0xff) {
      i++;
      continue;
    }
    let marker = buf[i + 1];
    while (marker === 0xff) {
      i++;
      marker = buf[i + 1];
    }
    // SOF0..SOF15, skipping DHT/JPG/DAC which share the range
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
    }
    if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd9)) {
      i += 2;
      continue;
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
}

function pngSize(buf) {
  if (buf.toString('ascii', 12, 16) !== 'IHDR') return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function webpSize(buf) {
  if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') return null;
  const kind = buf.toString('ascii', 12, 16);
  if (kind === 'VP8X') {
    return {
      width: 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16)),
      height: 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16)),
    };
  }
  if (kind === 'VP8 ') {
    return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  }
  if (kind === 'VP8L') {
    const bits = buf.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  return null;
}

function imageSize(file) {
  const buf = readFileSync(file);
  const ext = extname(file).toLowerCase();
  if (ext === '.png') return pngSize(buf);
  if (ext === '.webp') return webpSize(buf);
  return jpegSize(buf);
}

/* -------------------------------------------------------------- collect --- */

if (!existsSync(IMAGES_DIR)) {
  console.warn(`[chapter-3] no images folder at ${IMAGES_DIR} — writing an empty list.`);
}

const files = existsSync(IMAGES_DIR)
  ? readdirSync(IMAGES_DIR).filter((f) => !f.startsWith('.') && ALLOWED.has(extname(f).toLowerCase()))
  : [];

// 0, 1, 2 ... 10 rather than 0, 1, 10, 2 — then anything non-numeric, alphabetically.
const numberOf = (f) => {
  const stem = basename(f, extname(f));
  return /^\d+$/.test(stem) ? Number(stem) : Number.POSITIVE_INFINITY;
};
files.sort((a, b) => numberOf(a) - numberOf(b) || a.localeCompare(b));

const photos = [];
for (const file of files) {
  const size = imageSize(join(IMAGES_DIR, file));
  if (!size || !size.width || !size.height) {
    console.warn(`[chapter-3] skipped ${file} — could not read its dimensions.`);
    continue;
  }
  const stem = basename(file, extname(file));
  const id = `p${stem.replace(/[^a-zA-Z0-9]+/g, '-')}`;
  photos.push({ id, src: `${PUBLIC_PREFIX}/${file}`, ...size });
}

/* ---------------------------------------------------------------- write --- */

const body = photos
  .map((p) => `  { id: '${p.id}', src: '${p.src}', width: ${p.width}, height: ${p.height} },`)
  .join('\n');

const out = `// AUTO-GENERATED — do not edit by hand.
// Run \`npm start\` or \`npm run build\`, or \`node scripts/generate-chapter-3-photos.mjs\`.
// Source: public/${PUBLIC_PREFIX}
import { MosaicPhoto } from '../models/story.models';

export const CHAPTER_THREE_PHOTOS: readonly MosaicPhoto[] = [
${body}
];
`;

mkdirSync(dirname(OUT_FILE), { recursive: true });
writeFileSync(OUT_FILE, out, 'utf8');
console.log(`[chapter-3] ${photos.length} photo${photos.length === 1 ? '' : 's'} -> ${OUT_FILE.replace(root + '/', '')}`);
