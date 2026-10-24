"use client";

import { useEffect, useRef } from "react";
import styles from "./Hero.module.css";

type Props = { doom: React.ReactNode; cure: React.ReactNode };

/**
 * The DOOM/CURE phone. The split position lives in a CSS variable (--split)
 * on the phone, so the 60fps auto-sweep never re-renders React.
 */
export function PhoneSplit({ doom, cure }: Props) {
  const phoneRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const touched = useRef(false);

  function apply(value: number) {
    phoneRef.current?.style.setProperty("--split", `${value}%`);
  }

  useEffect(() => {
    const phone = phoneRef.current;
    const input = inputRef.current;
    if (!phone || !input) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const t0 = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      if (touched.current) return;
      const s = Math.round((50 + 30 * Math.sin((now - t0) / 1500)) * 10) / 10;
      apply(s);
      input.value = String(s);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf && !touched.current) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    // Only sweep while the phone is on screen.
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(phone);
    return () => {
      io.disconnect();
      stop();
    };
  }, []);

  return (
    <div ref={phoneRef} className={styles.phone} style={{ "--split": "50%" } as React.CSSProperties}>
      <div className={styles.screen}>
        <div className={styles.notch} />
        <div className={styles.layer} aria-hidden="true">{doom}</div>
        <div className={`${styles.layer} ${styles.proof}`} aria-hidden="true">{cure}</div>
        <span className={`${styles.side} ${styles.l}`} aria-hidden="true">DOOM</span>
        <span className={`${styles.side} ${styles.r}`} aria-hidden="true">CURE</span>
        <div className={styles.divider} aria-hidden="true">
          <span className={styles.knob}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l-6 6 6 6M15 6l6 6-6 6" /></svg>
          </span>
        </div>
        <input
          ref={inputRef}
          className={styles.range}
          type="range"
          min="0"
          max="100"
          defaultValue="50"
          aria-label="Drag to compare a doomscrolling feed with a Doomcure feed"
          onInput={(e) => {
            touched.current = true;
            const v = parseFloat(e.currentTarget.value);
            apply(Number.isNaN(v) ? 50 : v);
          }}
          onPointerDown={() => {
            touched.current = true;
          }}
        />
      </div>
    </div>
  );
}
