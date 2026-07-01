import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import type { ExhibitImages, ImageVariant } from "../src/lib/types";

const CARD_WIDTHS = [480, 768];
const FULL_WIDTH = 1024; // native width of the originals — never upscale
const BLUR_WIDTH = 20;

export interface PipelineOptions {
  sourceDir: string; // crossroad_imgs/
  outputDir: string; // public/images/designs/
  cacheFile: string; // .image-cache.json
}

type Cache = Record<string, { hash: string; result: ExhibitImages }>;

export async function loadCache(cacheFile: string): Promise<Cache> {
  if (!existsSync(cacheFile)) return {};
  try {
    return JSON.parse(await readFile(cacheFile, "utf8"));
  } catch {
    return {};
  }
}

export async function saveCache(cacheFile: string, cache: Cache): Promise<void> {
  await writeFile(cacheFile, JSON.stringify(cache, null, 2));
}

/** Process one design image into responsive variants; returns manifest entry. */
export async function processImage(
  slug: string,
  sourceFile: string,
  opts: PipelineOptions,
  cache: Cache,
): Promise<ExhibitImages> {
  const sourcePath = path.join(opts.sourceDir, sourceFile);
  const buf = await readFile(sourcePath);
  const hash = createHash("sha1").update(buf).digest("hex");

  const cached = cache[slug];
  const outDir = path.join(opts.outputDir, slug);
  if (cached?.hash === hash && allOutputsExist(cached.result, opts.outputDir)) {
    return cached.result;
  }

  await mkdir(outDir, { recursive: true });
  const img = sharp(buf);
  const meta = await img.metadata();
  const width = meta.width ?? FULL_WIDTH;
  const height = meta.height ?? FULL_WIDTH;

  const variants = async (targetWidth: number, kind: string): Promise<ImageVariant[]> => {
    const w = Math.min(targetWidth, width);
    const h = Math.round((height / width) * w);
    const out: ImageVariant[] = [];
    for (const format of ["avif", "webp"] as const) {
      const file = `${kind}-${w}.${format}`;
      const dest = path.join(outDir, file);
      const resized = sharp(buf).resize(w).flatten({ background: "#e4d8bc" });
      if (format === "avif") await resized.avif({ quality: 50 }).toFile(dest);
      else await resized.webp({ quality: 72 }).toFile(dest);
      out.push({ src: `/images/designs/${slug}/${file}`, width: w, height: h, format });
    }
    return out;
  };

  const card = (await Promise.all(CARD_WIDTHS.map((w) => variants(w, "card")))).flat();
  const full = await variants(FULL_WIDTH, "full");

  const blurBuf = await sharp(buf)
    .resize(BLUR_WIDTH)
    .flatten({ background: "#e4d8bc" })
    .webp({ quality: 40 })
    .toBuffer();
  const blurDataURL = `data:image/webp;base64,${blurBuf.toString("base64")}`;

  const result: ExhibitImages = { sourceFile, width, height, blurDataURL, card, full };
  cache[slug] = { hash, result };
  return result;
}

function allOutputsExist(result: ExhibitImages, outputRoot: string): boolean {
  return [...result.card, ...result.full].every((v) =>
    existsSync(path.join(outputRoot, "..", "..", v.src.replace(/^\//, ""))),
  );
}
