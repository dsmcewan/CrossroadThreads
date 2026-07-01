"use client";

import { useState } from "react";
import type { Design, Wing } from "@/lib/types";
import { COPY } from "@/lib/copy";
import StatusChip from "@/components/ui/StatusChip";
import styles from "./Placard.module.css";

type Mode = "PLACARD" | "AUDIO GUIDE";

export default function Placard({ design, wing }: { design: Design; wing?: Wing }) {
  const [mode, setMode] = useState<Mode>("PLACARD");

  const facts: Array<[string, string]> = [
    ["Era", design.era],
    ["Provenance", design.region],
    ["Medium", design.medium],
    ["Edition", design.edition],
  ];

  return (
    <div className={styles.placard}>
      <div className={styles.tabs}>
        {(["PLACARD", "AUDIO GUIDE"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`${styles.tab} ${mode === m ? styles.tabActive : ""}`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className={styles.kicker}>
        {wing?.name ?? design.wing} · Stop No. {design.stopNumber}
      </div>
      <h2 className={styles.title}>{design.title}</h2>
      <div className={styles.tagline}>&ldquo;{design.tagline}&rdquo;</div>

      {mode === "PLACARD" ? (
        <>
          <dl className={styles.facts}>
            {facts.map(([k, v]) => (
              <div key={k} className={styles.factRow}>
                <dt className={styles.factKey}>{k}</dt>
                <dd className={styles.factValue}>{v}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.placardText}>{design.placard}</p>
        </>
      ) : (
        <div>
          <div className={styles.audioPrompt}>
            <span className={styles.stopBadge}>{design.stopNumber}</span>
            {COPY.audioGuidePrompt}
          </div>
          <p className={styles.audioText}>{design.audioGuide}</p>
        </div>
      )}

      {design.conservatorNote && (
        <p className={styles.conservatorNote}>{design.conservatorNote}</p>
      )}

      <div className={styles.chipRow}>
        <StatusChip status={design.status} />
      </div>
    </div>
  );
}
