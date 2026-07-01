import { COPY } from "@/lib/copy";
import styles from "./MuseumFooter.module.css";

export default function MuseumFooter() {
  return <footer className={styles.footer}>{COPY.footer}</footer>;
}
