"use client";

import { useState } from "react";
import type { Design, Wing } from "@/lib/types";
import StatusChip from "@/components/ui/StatusChip";
import audioManifest from "@/data/audio.manifest.json";
import AudioTourButton from "./AudioTourButton";
import styles from "./Placard.module.css";

const AUDIO_SLUGS = new Set<string>(audioManifest.files);

export default function Placard({ design, wing }: { design: Design; wing?: Wing }) {
  const [listening, setListening] = useState(false);
  const hasAudio = AUDIO_SLUGS.has(design.slug);

  const facts: Array<[string, string]> = [
    ["Era", design.era],
    ["Provenance", design.region],
    ["Medium", design.medium],
    ["Edition", design.edition],
  ];

  return (
    <div className={styles.placard}>
      <div className={styles.headerRow}>
        <div className={styles.kicker}>
          {wing?.name ?? design.wing} · Stop No. {design.stopNumber}
        </div>
        {hasAudio && (
          <AudioTourButton
            slug={design.slug}
            stopNumber={design.stopNumber}
            playing={listening}
            onToggle={setListening}
          />
        )}
      </div>
      <h2 className={styles.title}>{design.title}</h2>
      <div className={styles.tagline}>&ldquo;{design.tagline}&rdquo;</div>

      {listening ? (
        <p className={styles.audioText}>{design.audioGuide}</p>
      ) : (
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
          {!hasAudio && <p className={styles.audioFallback}>{design.audioGuide}</p>}
        </>
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
