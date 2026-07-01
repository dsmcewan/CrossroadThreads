import { describe, expect, it } from "vitest";
import type { DesignsFile } from "../src/lib/types";
import { mergeCatalog } from "./build-catalog";

const WINGS = [
  { slug: "cautionary-tales", name: "Cautionary Tales", order: 2 },
  { slug: "the-pantheon", name: "The Pantheon", order: 4 },
];

const curated = (over: Partial<DesignsFile["designs"][0]> = {}) => ({
  sourceFile: "file_aaa.png",
  slug: "medusa",
  title: "Medusa",
  tagline: "Look away, darling",
  wing: "cautionary-tales",
  status: "ON DISPLAY" as const,
  stopNumber: 1,
  era: "Mythic Greece",
  region: "Exile",
  medium: "Print",
  edition: "Open",
  placard: "p",
  audioGuide: "a",
  ...over,
});

describe("mergeCatalog", () => {
  it("matches curated entries to files and marks them curated", () => {
    const { entries, errors } = mergeCatalog(["file_aaa.png"], {
      wings: WINGS,
      designs: [curated()],
    });
    expect(errors).toEqual([]);
    expect(entries).toHaveLength(1);
    expect(entries[0].curated).toBe(true);
    expect(entries[0].slug).toBe("medusa");
    expect(entries[0].products.length).toBeGreaterThan(0);
  });

  it("turns orphan images into Recent Acquisitions under study", () => {
    const { entries, wings } = mergeCatalog(
      ["file_0000000012ab34cd-xyz.png"],
      { wings: WINGS, designs: [] },
    );
    expect(entries[0].curated).toBe(false);
    expect(entries[0].slug).toBe("acquisition-12ab34cd");
    expect(entries[0].status).toBe("UNDER STUDY");
    expect(entries[0].stopNumber).toBeGreaterThanOrEqual(900);
    expect(wings.map((w) => w.slug)).toContain("recent-acquisitions");
  });

  it("fails loudly when a curated entry references a missing file", () => {
    const { errors } = mergeCatalog([], { wings: WINGS, designs: [curated()] });
    expect(errors.some((e) => e.includes("missing file"))).toBe(true);
  });

  it("detects duplicate slugs", () => {
    const { errors } = mergeCatalog(["file_aaa.png", "file_bbb.png"], {
      wings: WINGS,
      designs: [curated(), curated({ sourceFile: "file_bbb.png" })],
    });
    expect(errors.some((e) => e.includes("duplicate slug"))).toBe(true);
  });

  it("rejects unknown wings", () => {
    const { errors } = mergeCatalog(["file_aaa.png"], {
      wings: WINGS,
      designs: [curated({ wing: "not-a-wing" })],
    });
    expect(errors.some((e) => e.includes("unknown wing"))).toBe(true);
  });

  it("derives the wing list from used wings only, sorted by order", () => {
    const { wings } = mergeCatalog(["file_aaa.png"], {
      wings: WINGS,
      designs: [curated()],
    });
    expect(wings.map((w) => w.slug)).toEqual(["cautionary-tales"]);
  });
});
