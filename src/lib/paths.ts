/**
 * Prefix a site-relative path with the GitHub Pages basePath.
 * basePath is auto-applied only to next/link and next/image — every raw
 * <img src>, srcSet, favicon, and OG image URL must go through this helper.
 */
export function asset(p: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${p}`;
}

/** Build a srcSet string from image variants of one format. */
export function srcSetFor(
  variants: { src: string; width: number; format: string }[],
  format: "avif" | "webp",
): string {
  return variants
    .filter((v) => v.format === format)
    .map((v) => `${asset(v.src)} ${v.width}w`)
    .join(", ");
}
