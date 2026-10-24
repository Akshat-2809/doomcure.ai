"use client";

import { formatMetres, useScrolledPx } from "@/lib/scrollMeter";
import styles from "./Problem.module.css";

export function MeterValue() {
  const px = useScrolledPx();
  return <div className={styles.big}>{formatMetres(px)}<small> m</small></div>;
}

export function MeterRuler() {
  const px = useScrolledPx();
  return <div className={styles.ruler} style={{ "--rx": `${-(px * 0.2) % 500}px` } as React.CSSProperties} aria-hidden="true" />;
}
