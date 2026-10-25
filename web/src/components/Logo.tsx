import Link from "next/link";
import { ACCENT } from "@/lib/site";
import styles from "./Logo.module.css";

/** Stacked-card mark with a spark, from the design's nav/footer logo. */
export function LogoMark({ size = 34, stroke = "#141414" }: { size?: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect x="9" y="5" width="22" height="28" rx="6" fill="#7B61FF" stroke={stroke} strokeWidth="2" transform="rotate(-12 20 19)" />
      <rect x="9" y="7" width="22" height="28" rx="6" fill={ACCENT} stroke={stroke} strokeWidth="2" />
      <path d="M20 14 C20.6 18.6 21.4 19.4 26 20 C21.4 20.6 20.6 21.4 20 26 C19.4 21.4 18.6 20.6 14 20 C18.6 19.4 19.4 18.6 20 14 Z" fill="#141414" />
    </svg>
  );
}

export function Logo({ href = "/#top", size, stroke }: { href?: string; size?: number; stroke?: string }) {
  return (
    <Link className={styles.logo} href={href} aria-label="Doomcure home">
      <LogoMark size={size} stroke={stroke} />
      <span className={styles.wm}>doomcure</span>
    </Link>
  );
}
