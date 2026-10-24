import { Logo } from "./Logo";
import styles from "./Nav.module.css";

export function Nav() {
  return (
    <header className={styles.nav}>
      <div className="wrap">
        <div className={styles.navin}>
          <Logo />
          <nav className={styles.navlinks} aria-label="Main">
            <a className={styles.nl} href="#problem">The problem</a>
            <a className={styles.nl} href="#idea">The idea</a>
            <a className={styles.nl} href="#story">The story</a>
            <a className={styles.nl} href="#founder">Founder</a>
          </nav>
          <a className="btn btn-ink" href="#waitlist">Join the waitlist</a>
        </div>
      </div>
    </header>
  );
}
