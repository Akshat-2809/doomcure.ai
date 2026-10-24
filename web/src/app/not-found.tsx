import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found — Doomcure",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className={styles.page}>
      <span className={`${styles.fly} ${styles.fly1}`} aria-hidden="true" />
      <span className={`${styles.fly} ${styles.fly2}`} aria-hidden="true" />
      <div className={`wrap ${styles.inner}`}>
        <Link className={styles.logo} href="/" aria-label="Doomcure home">
          <LogoMark />
          <span>doomcure</span>
        </Link>
        <span className="tag"><i style={{ background: "var(--ink)" }} />Error 404</span>
        <h1 className={styles.big}>404</h1>
        <p className="lede">This page doesn&apos;t exist. It may have scrolled away.</p>
        <Link className="btn btn-ink" href="/">Back to home</Link>
      </div>
    </main>
  );
}
