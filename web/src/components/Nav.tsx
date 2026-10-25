import Link from "next/link";
import { Logo } from "./Logo";
import styles from "./Nav.module.css";

export function Nav() {
  return (
    <header className={styles.nav}>
      <div className="wrap">
        <div className={styles.navin}>
          <Logo />
          <nav className={styles.navlinks} aria-label="Main">
            <Link className={styles.nl} href="/#problem">The problem</Link>
            <Link className={styles.nl} href="/#idea">The idea</Link>
            <Link className={styles.nl} href="/#story">The story</Link>
            <Link className={styles.nl} href="/#founder">Founder</Link>
          </nav>
          <Link className="btn btn-ink" href="/#waitlist">Join the waitlist</Link>
        </div>
      </div>
    </header>
  );
}
