import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";
import { Logo } from "./Logo";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.foot}>
      <div className="wrap">
        <div className={styles.footrow}>
          <div className={styles.brand}>
            <Logo size={32} stroke="#FFFFFF" />
            <p style={{ color: "#A4A4AC" }}>An antidote to doomscrolling. AI-powered learning that stays with you.</p>
          </div>
          <nav className={styles.fl} aria-label="Footer">
            <Link href="/#problem">Problem</Link>
            <Link href="/#idea">Idea</Link>
            <Link href="/#story">Story</Link>
            <Link href="/#founder">Founder</Link>
            <Link href="/#waitlist">Waitlist</Link>
          </nav>
          <a className={`mono ${styles.mail}`} href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </div>
      </div>
      <div className={styles.giant} aria-hidden="true">
        {"doomcure".split("").map((ch, i) => <span key={i}>{ch}</span>)}
      </div>
      <div className={`wrap ${styles.legal}`}>
        <span>© 2026 Doomcure · Bengaluru</span>
        <span><Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link> · <Link href="/contact">Contact</Link></span>
      </div>
    </footer>
  );
}
