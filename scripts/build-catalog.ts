import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  Catalog,
  Design,
  DesignsFile,
  ProductOffering,
  Wing,
} from "../src/lib/types";
import { loadCache, processImage, saveCache, type PipelineOptions } from "./image-pipeline";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE_DIR = path.join(ROOT, "crossroad_imgs");
const DESIGNS_FILE = path.join(ROOT, "content", "designs.json");
const OUTPUT_FILE = path.join(ROOT, "src", "data", "catalog.generated.json");
const IMAGE_OUTPUT = path.join(ROOT, "public", "images", "designs");
const CACHE_FILE = path.join(ROOT, ".image-cache.json");

const RECENT_ACQUISITIONS_WING: Wing = {
  slug: "recent-acquisitions",
  name: "Recent Acquisitions",
  subtitle: "Attribution Pending",
  order: 99,
};

const DEFAULT_PRODUCTS: ProductOffering[] = [
  { format: "tee", label: "Museum Reproduction Tee" },
  { format: "poster", label: "Exhibition Poster" },
];

/** A merged entry before the image pipeline fills in `images`. */
export type MergedEntry = Omit<Design, "images"> & { images: null };

/** Pure merge logic — unit-testable without touching the filesystem. */
export function mergeCatalog(
  imageFiles: string[],
  designsFile: DesignsFile,
): { entries: MergedEntry[]; wings: Wing[]; errors: string[] } {
  const errors: string[] = [];
  const bySource = new Map(designsFile.designs.map((d) => [d.sourceFile, d]));
  const seenSlugs = new Set<string>();
  const wingSlugs = new Set(designsFile.wings.map((w) => w.slug));

  // Curated entries pointing at files that don't exist → hard error
  for (const d of designsFile.designs) {
    if (!imageFiles.includes(d.sourceFile)) {
      errors.push(`Registrar error: "${d.slug}" references missing file ${d.sourceFile}`);
    }
    if (seenSlugs.has(d.slug)) errors.push(`Registrar error: duplicate slug "${d.slug}"`);
    seenSlugs.add(d.slug);
    if (!wingSlugs.has(d.wing)) {
      errors.push(`Registrar error: "${d.slug}" assigned to unknown wing "${d.wing}"`);
    }
  }

  let acquisitionNo = 0;
  const entries = imageFiles.map((file) => {
    const curatedEntry = bySource.get(file);
    if (curatedEntry) {
      return {
        products: DEFAULT_PRODUCTS,
        ...curatedEntry,
        curated: true,
        images: null,
      };
    }
    acquisitionNo += 1;
    const hex = file.replace(/^file_0*/, "").slice(0, 8);
    return {
      sourceFile: file,
      slug: `acquisition-${hex}`,
      title: `Untitled Acquisition No. ${acquisitionNo}`,
      tagline: "Attribution pending",
      wing: RECENT_ACQUISITIONS_WING.slug,
      status: "UNDER STUDY" as const,
      stopNumber: 900 + acquisitionNo,
      era: "Undetermined",
      region: "Found in the archive",
      medium: "Print, process under review",
      edition: "Uncataloged",
      placard:
        "Accessioned recently. Attribution pending. The registrar asks for patience, and reminds visitors that every piece in this museum was once a stranger.",
      audioGuide:
        "You are looking at a work the museum has not yet identified. It arrived with the rest of the archive and awaits the registrar's attention. We display it anyway. Some things should not have to earn a wall.",
      products: DEFAULT_PRODUCTS,
      curated: false,
      images: null,
    };
  });

  const usedWings = new Set(entries.map((e) => e.wing));
  const wings = [
    ...designsFile.wings.filter((w) => usedWings.has(w.slug)),
    ...(usedWings.has(RECENT_ACQUISITIONS_WING.slug) ? [RECENT_ACQUISITIONS_WING] : []),
  ].sort((a, b) => a.order - b.order);

  return { entries, wings, errors };
}

async function main() {
  const imageFiles = (await readdir(SOURCE_DIR))
    .filter((f) => f.toLowerCase().endsWith(".png"))
    .sort();

  const designsFile: DesignsFile = existsSync(DESIGNS_FILE)
    ? JSON.parse(await readFile(DESIGNS_FILE, "utf8"))
    : { wings: [], designs: [] };

  const { entries, wings, errors } = mergeCatalog(imageFiles, designsFile);
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exit(1);
  }

  const opts: PipelineOptions = {
    sourceDir: SOURCE_DIR,
    outputDir: IMAGE_OUTPUT,
    cacheFile: CACHE_FILE,
  };
  const cache = await loadCache(CACHE_FILE);

  console.log(`Processing ${entries.length} designs (${designsFile.designs.length} curated)…`);
  const designs: Design[] = [];
  let done = 0;
  for (const entry of entries) {
    const images = await processImage(entry.slug, entry.sourceFile, opts, cache);
    designs.push({ ...entry, images });
    done += 1;
    if (done % 20 === 0) console.log(`  ${done}/${entries.length}`);
  }
  await saveCache(CACHE_FILE, cache);

  designs.sort((a, b) => a.stopNumber - b.stopNumber);
  const catalog: Catalog = {
    generatedAt: new Date().toISOString(),
    wings,
    designs,
  };
  await mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await writeFile(OUTPUT_FILE, JSON.stringify(catalog, null, 2));
  console.log(
    `Catalog written: ${designs.length} designs, ${wings.length} wings → ${path.relative(ROOT, OUTPUT_FILE)}`,
  );
}

// Run when executed directly (tsx scripts/build-catalog.ts), not when imported by tests
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
