export type ExhibitStatus = "ON DISPLAY" | "IN CONSERVATION" | "UNDER STUDY";

export interface Wing {
  slug: string; // 'bless-your-heart'
  name: string; // 'Bless Your Heart'
  subtitle?: string; // 'Badass Women of History'
  order: number;
}

export interface ImageVariant {
  src: string; // site-relative path under /images/designs/…
  width: number;
  height: number;
  format: "avif" | "webp";
}

export interface ExhibitImages {
  sourceFile: string; // original filename in crossroad_imgs/
  width: number; // original pixel size
  height: number;
  blurDataURL: string; // tiny base64 webp for blur-up
  card: ImageVariant[]; // 480w, 768w
  full: ImageVariant[]; // 1024w (native width, no upscaling)
}

export interface ProductOffering {
  format: "tee" | "poster";
  label: string; // 'Museum Reproduction Tee'
  price?: string; // display-only until a provider is wired
  externalId?: string; // Shopify variant / Printful URL / Snipcart id — later
}

/** A curated entry as written in content/designs.json (images injected at build). */
export interface DesignEntry {
  sourceFile: string;
  slug: string;
  title: string;
  tagline: string;
  wing: string; // Wing.slug
  status: ExhibitStatus;
  stopNumber: number;
  era: string;
  region: string; // provenance line
  medium: string;
  edition: string;
  placard: string; // wall-label copy
  audioGuide: string; // curator narration
  conservatorNote?: string;
  products?: ProductOffering[];
}

export interface Design extends DesignEntry {
  curated: boolean; // false = auto-generated Recent Acquisition
  products: ProductOffering[];
  images: ExhibitImages;
}

export interface Catalog {
  generatedAt: string;
  wings: Wing[]; // curated wings + auto 'recent-acquisitions' when needed
  designs: Design[];
}

/** Shape of content/designs.json */
export interface DesignsFile {
  wings: Wing[];
  designs: DesignEntry[];
}
