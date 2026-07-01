import Link from "next/link";
import { getDesigns, getWings } from "@/data/catalog";
import { COPY, facadeCounts } from "@/lib/copy";
import styles from "./MuseumHeader.module.css";

export default function MuseumHeader() {
  const works = getDesigns().length;
  const wings = getWings().length;

  return (
    <header className={styles.facade}>
      <div className={styles.department}>{COPY.department}</div>
      <h1 className={styles.title}>
        <Link href="/" className={styles.titleLink}>
          {COPY.siteTitleLines[0]}
          <br />
          {COPY.siteTitleLines[1]}
        </Link>
      </h1>
      <div className={styles.subtitle}>{COPY.subtitle}</div>
      <div className={styles.plaque}>{facadeCounts(works, wings)}</div>
    </header>
  );
}
