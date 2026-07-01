import type { ExhibitImages } from "@/lib/types";
import { asset, srcSetFor } from "@/lib/paths";

/**
 * Static-export-safe responsive image: <picture> with AVIF + WebP sources
 * from the prebuild manifest, blur placeholder as CSS background.
 */
export default function ExhibitImage({
  images,
  alt,
  kind,
  sizes,
  loading = "lazy",
  className,
}: {
  images: ExhibitImages;
  alt: string;
  kind: "card" | "full";
  sizes: string;
  loading?: "lazy" | "eager";
  className?: string;
}) {
  const variants = images[kind];
  const fallback = variants.filter((v) => v.format === "webp").at(-1);
  if (!fallback) return null;

  return (
    <picture>
      <source type="image/avif" srcSet={srcSetFor(variants, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSetFor(variants, "webp")} sizes={sizes} />
      <img
        src={asset(fallback.src)}
        alt={alt}
        width={fallback.width}
        height={fallback.height}
        loading={loading}
        decoding="async"
        className={className}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          border: "1px solid var(--ink)",
          backgroundImage: `url(${images.blurDataURL})`,
          backgroundSize: "cover",
        }}
      />
    </picture>
  );
}
