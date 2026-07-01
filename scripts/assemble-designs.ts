/**
 * One-time assembly: merge curation batch JSONs (from the scratchpad) with the
 * 11 prototype/artifact entries into content/designs.json.
 *
 * - artifact_matches.json (perceptual hash match of the artifact's embedded
 *   thumbnails against crossroad_imgs/) authoritatively decides WHICH file each
 *   of the 11 artifact designs is. Batch `artifactMatch` guesses are ignored.
 * - Artifact entries keep their copy verbatim and stops 1–11.
 * - All other batch entries stand as-is; sourceFile names are validated against
 *   disk with unique-prefix fuzzy repair (agents occasionally mistype UUIDs).
 * - Remaining designs get stop numbers grouped by wing order.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { DesignEntry, DesignsFile, Wing } from "../src/lib/types";

const SCRATCH = process.argv[2];
if (!SCRATCH) {
  console.error("usage: tsx scripts/assemble-designs.ts <scratchpad-dir>");
  process.exit(1);
}
const ROOT = path.resolve(import.meta.dirname, "..");

const WINGS: Wing[] = [
  { slug: "bless-your-heart", name: "Bless Your Heart", subtitle: "Badass Women of History", order: 1 },
  { slug: "cautionary-tales", name: "Cautionary Tales", order: 2 },
  { slug: "fake-business-format", name: "Fake Business Format", order: 3 },
  { slug: "the-pantheon", name: "The Pantheon", subtitle: "Myth Series", order: 4 },
  { slug: "princess-treatment", name: "Princess Treatment", order: 5 },
];

// Conservator notes from the original artifact (dropped by the extractor)
const ARTIFACT_NOTES: Record<string, string> = {
  rudis:
    "Conservator's note: headline cropped in printing; letterspacing collapsed in the maker's mark. Full re-typeset scheduled before release.",
  decimation:
    "Conservator's note: headline clipped at the top margin; comma spacing collapsed in the lower lockup. Re-typeset before sale.",
  omalley:
    "Conservator's note: spelling fault in the lower text — HAWE for HAVE. One letterform stands between this piece and the floor.",
  medusa:
    "Conservator's note: tagline printed twice — reads as a press error, not emphasis. The mirror element is ambiguous; visitors report seeing a bicycle wheel. Composition revision recommended.",
  boudica:
    "Curator's memo: strongest illustration in the collection; the line beneath it is a category, not a caption. Awaiting one sentence of word golf worthy of her.",
  organism46b:
    "Curator's memo: rendered in deep-water blues, outside the house palette. Either it anchors a new wing or it is drift. The committee has not decided.",
};

const WING_MAP: Record<string, string> = {
  "Fake Business Format": "fake-business-format",
  "The Pantheon": "the-pantheon",
  "Cautionary Tales": "cautionary-tales",
  "Bless Your Heart": "bless-your-heart",
  "Princess Treatment": "princess-treatment",
};

type BatchEntry = DesignEntry & { artifactMatch?: string; stopNumber?: number; [k: string]: unknown };

async function loadJson(file: string): Promise<unknown> {
  return JSON.parse(await readFile(path.join(SCRATCH, file), "utf8"));
}

function pickEntries(raw: unknown): BatchEntry[] {
  if (Array.isArray(raw)) {
    if (raw.length && typeof raw[0] === "object" && raw[0] !== null && "entries" in (raw[0] as object)) {
      return (raw[0] as { entries: BatchEntry[] }).entries;
    }
    return raw as BatchEntry[];
  }
  return (raw as { entries: BatchEntry[] }).entries;
}

async function main() {
  const diskFiles = (await readdir(path.join(ROOT, "crossroad_imgs"))).filter((f) => f.endsWith(".png"));
  const diskSet = new Set(diskFiles);

  /** Repair a possibly mistyped filename by unique hex-prefix match. */
  const fixSource = (name: string, context: string): string => {
    if (diskSet.has(name)) return name;
    const prefix = name.slice(0, 38); // "file_" + 32-hex + separator
    const candidates = diskFiles.filter((f) => f.startsWith(prefix));
    if (candidates.length === 1) {
      console.warn(`repaired sourceFile for ${context}: ${name} → ${candidates[0]}`);
      return candidates[0];
    }
    throw new Error(`unresolvable sourceFile "${name}" (${context}): ${candidates.length} prefix candidates`);
  };

  const batchFiles = ["batch1.json", "batch2-curation.json", "batch3.json", "batch4.json", "batch-5.json", "batch6.json"];
  const batches: BatchEntry[] = [];
  for (const f of batchFiles) {
    const arr = pickEntries(await loadJson(f));
    for (const e of arr) e.sourceFile = fixSource(e.sourceFile, `${f}:${e.slug}`);
    batches.push(...arr);
    console.log(`${f}: ${arr.length} entries`);
  }

  const artifact = (await loadJson("prototype11.json")) as Array<{
    slug: string;
    title: string;
    tagline: string;
    wing: string;
    status: DesignEntry["status"];
    era: string;
    region: string;
    medium: string;
    edition: string;
    placard: string;
    audioGuide: string;
    stop: number;
  }>;
  const matches = (await loadJson("artifact_matches.json")) as Record<
    string,
    { file: string; distance: number }
  >;

  const entries: DesignEntry[] = [];
  const usedSources = new Set<string>();

  // 1) The 11 artifact designs — file decided by perceptual match, copy verbatim
  for (const a of artifact) {
    const match = matches[a.slug];
    if (!match || match.distance > 20) {
      throw new Error(`no confident perceptual match for artifact design "${a.slug}"`);
    }
    usedSources.add(match.file);
    entries.push({
      sourceFile: match.file,
      slug: a.slug,
      title: a.title,
      tagline: a.tagline,
      wing: WING_MAP[a.wing] ?? a.wing,
      status: a.status,
      stopNumber: a.stop,
      era: a.era,
      region: a.region,
      medium: a.medium,
      edition: a.edition,
      placard: a.placard,
      audioGuide: a.audioGuide,
      ...(ARTIFACT_NOTES[a.slug] ? { conservatorNote: ARTIFACT_NOTES[a.slug] } : {}),
    });
  }

  // 2) Everything else from the batches (batch copy stands on its own)
  const seenSlug = new Set(entries.map((e) => e.slug));
  const wingOrder = new Map(WINGS.map((w) => [w.slug, w.order]));
  const rest = batches
    .filter((b) => !usedSources.has(b.sourceFile))
    .sort(
      (x, y) =>
        (wingOrder.get(x.wing) ?? 98) - (wingOrder.get(y.wing) ?? 98) ||
        x.title.localeCompare(y.title),
    );

  let stop = 12;
  for (const b of rest) {
    if (usedSources.has(b.sourceFile)) continue;
    usedSources.add(b.sourceFile);
    let slug = b.slug;
    let n = 2;
    while (seenSlug.has(slug)) slug = `${b.slug}-${n++}`;
    seenSlug.add(slug);
    if (!wingOrder.has(b.wing)) {
      throw new Error(`entry "${slug}" has unknown wing "${b.wing}"`);
    }
    entries.push({
      sourceFile: b.sourceFile,
      slug,
      title: b.title,
      tagline: b.tagline,
      wing: b.wing,
      status: b.status,
      stopNumber: stop++,
      era: b.era,
      region: b.region,
      medium: b.medium,
      edition: b.edition,
      placard: b.placard,
      audioGuide: b.audioGuide,
      ...(b.conservatorNote ? { conservatorNote: b.conservatorNote } : {}),
    });
  }

  const out: DesignsFile = { wings: WINGS, designs: entries };
  const dest = path.join(ROOT, "content", "designs.json");
  await writeFile(dest, JSON.stringify(out, null, 2));
  const uncurated = diskFiles.length - usedSources.size;
  console.log(
    `designs.json written: ${entries.length} curated designs, ${uncurated} left as Recent Acquisitions`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
