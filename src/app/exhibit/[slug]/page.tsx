import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDesign, getDesigns, getWing } from "@/data/catalog";
import { COPY } from "@/lib/copy";
import ExhibitImage from "@/components/ui/ExhibitImage";
import Placard from "@/components/exhibit/Placard";
import GiftShopPanel from "@/components/exhibit/GiftShopPanel";
import styles from "./page.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return getDesigns().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const design = getDesign(slug);
  if (!design) return {};
  return {
    title: `${design.title} · The Crossroad Archive`,
    description: design.placard,
  };
}

export default async function ExhibitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const design = getDesign(slug);
  if (!design) notFound();

  const wing = getWing(design.wing);

  return (
    <main className={`${styles.exhibit} rise`}>
      <Link href="/" className={styles.back}>
        ← {COPY.returnToGallery}
      </Link>
      <div className={styles.room}>
        <div className={styles.frame}>
          <ExhibitImage
            images={design.images}
            alt={design.title}
            kind="full"
            sizes="(max-width: 900px) 92vw, 560px"
            loading="eager"
          />
        </div>
        <div className={styles.wall}>
          <Placard design={design} wing={wing} />
          <GiftShopPanel design={design} />
        </div>
      </div>
    </main>
  );
}
