"use client";

import { useEffect, useState } from "react";
import type { Design, Wing } from "@/lib/types";
import { COPY } from "@/lib/copy";
import ExhibitCard from "./ExhibitCard";
import styles from "./GalleryGrid.module.css";

const ALL = "all";

export default function GalleryGrid({
  designs,
  wings,
}: {
  designs: Design[];
  wings: Wing[];
}) {
  const [wing, setWing] = useState<string>(ALL);

  // Restore ?wing= from the URL on mount (effect-guarded: no window during SSG,
  // and useSearchParams would force a Suspense/CSR bailout on static export).
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("wing");
    if (fromUrl && (fromUrl === ALL || wings.some((w) => w.slug === fromUrl))) {
      setWing(fromUrl);
    }
  }, [wings]);

  const select = (slug: string) => {
    setWing(slug);
    const url = new URL(window.location.href);
    if (slug === ALL) url.searchParams.delete("wing");
    else url.searchParams.set("wing", slug);
    window.history.replaceState(null, "", url);
  };

  const shown = wing === ALL ? designs : designs.filter((d) => d.wing === wing);

  return (
    <>
      <nav className={styles.filters} aria-label="Wings">
        <FilterStamp
          label={COPY.allWings}
          active={wing === ALL}
          rotate={-0.8}
          onClick={() => select(ALL)}
        />
        {wings.map((w, i) => (
          <FilterStamp
            key={w.slug}
            label={w.name}
            active={wing === w.slug}
            rotate={i % 2 === 0 ? 0.8 : -0.8}
            onClick={() => select(w.slug)}
          />
        ))}
      </nav>

      <main className={styles.gallery}>
        {shown.map((d, i) => (
          <ExhibitCard key={d.slug} design={d} index={i} />
        ))}
      </main>
    </>
  );
}

function FilterStamp({
  label,
  active,
  rotate,
  onClick,
}: {
  label: string;
  active: boolean;
  rotate: number;
  onClick: () => void;
}) {
  return (
    <button
      className={`${styles.stamp} ${active ? styles.stampActive : ""}`}
      style={{ transform: `rotate(${rotate}deg)` }}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
