import type { Catalog, Design, Wing } from "@/lib/types";
import catalogJson from "./catalog.generated.json";

const catalog = catalogJson as unknown as Catalog;

export function getCatalog(): Catalog {
  return catalog;
}

export function getDesigns(): Design[] {
  return catalog.designs;
}

export function getDesign(slug: string): Design | undefined {
  return catalog.designs.find((d) => d.slug === slug);
}

export function getWings(): Wing[] {
  return catalog.wings;
}

export function getWing(slug: string): Wing | undefined {
  return catalog.wings.find((w) => w.slug === slug);
}
