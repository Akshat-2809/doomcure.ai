"use client";

import { formatMetres, useScrolledPx } from "@/lib/scrollMeter";
import styles from "./ScrollMeterPill.module.css";

export function ScrollMeterPill() {
  const px = useScrolledPx();
  return (
    <div className={px > 400 ? `${styles.pill} ${styles.show}` : styles.pill} aria-hidden="true">
      <span className={styles.ring}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
      </span>
      <span>Scrolled <b>{formatMetres(px)} m</b> on this page</span>
    </div>
  );
}
