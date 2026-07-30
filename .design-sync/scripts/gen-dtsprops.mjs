// One-off: compose accurate, self-contained <Name>Props bodies for cfg.dtsPropsFor.
// Synth-entry mode can't extract the inline prop types, so each body must inline
// every referenced type (the emitted .d.ts only imports React). Run from repo
// root: node .ds-sync/gen-dtsprops.mjs
import { readFileSync, writeFileSync } from "node:fs";

// Shared shapes, fully inlined (no type aliases survive in the emitted .d.ts).
const IMAGE_VARIANT = `{ src: string; width: number; height: number; format: "avif" | "webp" }`;
const EXHIBIT_IMAGES =
  `{ sourceFile: string; width: number; height: number; blurDataURL: string; ` +
  `card: ${IMAGE_VARIANT}[]; full: ${IMAGE_VARIANT}[] }`;
const PRODUCT = `{ format: "tee" | "poster"; label: string; price?: string; externalId?: string }`;
const STATUS = `"ON DISPLAY" | "IN CONSERVATION" | "UNDER STUDY"`;
const WING = `{ slug: string; name: string; subtitle?: string; order: number }`;
const DESIGN =
  `{ sourceFile: string; slug: string; title: string; tagline: string; wing: string; ` +
  `status: ${STATUS}; stopNumber: number; era: string; region: string; medium: string; ` +
  `edition: string; placard: string; audioGuide: string; conservatorNote?: string; ` +
  `products: ${PRODUCT}[]; curated: boolean; images: ${EXHIBIT_IMAGES} }`;

const b = (lines) => lines.map((l) => `  ${l}`).join("\n");

const dtsPropsFor = {
  StatusChip: b([
    `/** Which exhibit-status label + color to show. */`,
    `status: ${STATUS};`,
    `/** Compact size for use inside cards. */`,
    `small?: boolean;`,
  ]),
  ExhibitImage: b([
    `/** Responsive image set from the prebuild manifest. */`,
    `images: ${EXHIBIT_IMAGES};`,
    `alt: string;`,
    `/** Pick the card (grid) or full (detail) variant set. */`,
    `kind: "card" | "full";`,
    `/** The <img> sizes attribute, e.g. "(max-width: 640px) 90vw, 270px". */`,
    `sizes: string;`,
    `loading?: "lazy" | "eager";`,
    `className?: string;`,
  ]),
  AudioTourButton: b([
    `/** Exhibit slug — resolves the narration MP3 at /audio/<slug>.mp3. */`,
    `slug: string;`,
    `stopNumber: number;`,
    `/** Controlled play/stop state. */`,
    `playing: boolean;`,
    `onToggle: (playing: boolean) => void;`,
  ]),
  MuseumHeader: `  // No props — reads the catalog baked into the bundle.`,
  MuseumFooter: `  // No props.`,
  ExhibitCard: b([
    `design: ${DESIGN};`,
    `/** Position in the grid — staggers the rise-in animation. */`,
    `index: number;`,
  ]),
  GalleryGrid: b([`designs: (${DESIGN})[];`, `wings: (${WING})[];`]),
  GiftShopPanel: b([`design: ${DESIGN};`]),
  Placard: b([`design: ${DESIGN};`, `wing?: ${WING};`]),
};

const cfgPath = ".design-sync/config.json";
const cfg = JSON.parse(readFileSync(cfgPath, "utf8"));
cfg.dtsPropsFor = dtsPropsFor;
writeFileSync(cfgPath, JSON.stringify(cfg, null, 2) + "\n");
console.log(`merged dtsPropsFor for ${Object.keys(dtsPropsFor).length} components into ${cfgPath}`);
