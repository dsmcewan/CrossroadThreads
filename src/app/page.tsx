import GalleryGrid from "@/components/gallery/GalleryGrid";
import { getDesigns, getWings } from "@/data/catalog";

export default function GalleryPage() {
  return <GalleryGrid designs={getDesigns()} wings={getWings()} />;
}
