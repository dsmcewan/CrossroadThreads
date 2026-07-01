import Link from "next/link";
import type { Design } from "@/lib/types";
import ExhibitImage from "@/components/ui/ExhibitImage";
import StatusChip from "@/components/ui/StatusChip";
import styles from "./ExhibitCard.module.css";

export default function ExhibitCard({
  design,
  index,
}: {
  design: Design;
  index: number;
}) {
  return (
    <Link href={`/exhibit/${design.slug}/`} className={styles.link}>
      <figure
        className={`${styles.card} rise`}
        style={{ animationDelay: `${Math.min(index, 12) * 60}ms` }}
      >
        <ExhibitImage
          images={design.images}
          alt={design.title}
          kind="card"
          sizes="(max-width: 640px) 90vw, 270px"
          loading={index < 6 ? "eager" : "lazy"}
        />
        <figcaption className={styles.caption}>
          <div className={styles.captionText}>
            <div className={styles.title}>{design.title}</div>
            <div className={styles.stop}>Stop No. {design.stopNumber}</div>
          </div>
          <StatusChip status={design.status} small />
        </figcaption>
      </figure>
    </Link>
  );
}
