import { GalleryGrid } from "crossroad-collection";
import { designs, wings } from "./_fixtures";

// The full gallery: a row of "wing" filter stamps above a responsive grid of
// ExhibitCards. Client-interactive (the stamps filter by wing).
export function Gallery() {
  return <GalleryGrid designs={designs} wings={wings} />;
}
