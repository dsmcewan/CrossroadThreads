import type { ExhibitStatus } from "@/lib/types";
import styles from "./StatusChip.module.css";

const LABELS: Record<ExhibitStatus, string> = {
  "ON DISPLAY": "On Display",
  "IN CONSERVATION": "In Conservation",
  "UNDER STUDY": "Under Study",
};

export default function StatusChip({
  status,
  small = false,
}: {
  status: ExhibitStatus;
  small?: boolean;
}) {
  return (
    <span className={styles.chip} data-status={status} data-small={small || undefined}>
      {LABELS[status]}
    </span>
  );
}
