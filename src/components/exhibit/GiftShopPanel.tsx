"use client";

import { useState } from "react";
import type { Design, ProductOffering } from "@/lib/types";
import { commerce } from "@/lib/commerce";
import { COPY } from "@/lib/copy";
import styles from "./GiftShopPanel.module.css";

export default function GiftShopPanel({ design }: { design: Design }) {
  const [notice, setNotice] = useState<string | null>(null);

  const acquire = (offering: ProductOffering) => {
    const action = commerce.getBuyAction(design, offering);
    if (action.kind === "link") {
      window.open(action.href, "_blank", "noopener");
    } else {
      setNotice(action.text);
    }
  };

  return (
    <section className={styles.panel} aria-label={COPY.giftShopHeading}>
      <h3 className={styles.heading}>{COPY.giftShopHeading}</h3>
      <ul className={styles.offerings}>
        {design.products.map((p) => (
          <li key={p.format} className={styles.offering}>
            <div className={styles.offeringText}>
              <span className={styles.offeringLabel}>{p.label}</span>
              {p.price && <span className={styles.offeringPrice}>{p.price}</span>}
            </div>
            <button className={styles.acquire} onClick={() => acquire(p)}>
              {COPY.acquireButton}
            </button>
          </li>
        ))}
      </ul>
      {notice && (
        <p className={styles.notice} role="status">
          {notice}
        </p>
      )}
    </section>
  );
}
