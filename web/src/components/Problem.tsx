import { MeterRuler, MeterValue } from "./MeterReadout";
import { Offscreen } from "./Offscreen";
import styles from "./Problem.module.css";

const words: [string, boolean][] = [
  ["autoplay", true],
  ["infinite scroll", false],
  ["99+ unread", true],
  ["pull to refresh", false],
  ["streak at risk", true],
  ["for you", false],
];

export function Problem() {
  return (
    <section className={styles.doomsec} id="problem">
      <Offscreen className={styles.grain} aria-hidden="true" />
      <div className={`wrap ${styles.doomgrid}`}>
        <div className={`rv ${styles.copy}`}>
          <span className={`tag ${styles.tag}`}><i />The problem</span>
          <h2 className="h2">Information overload is the default setting.</h2>
          <p className="lede">The feed never ends, so it never feels finished. We take in more than ever and keep very little of it. The scroll is designed to keep you scrolling, not to leave you knowing more.</p>
          <div className={styles.feedwords}>
            {words.map(([w, red]) => (
              <span key={w} className={red ? `${styles.fw} ${styles.r}` : styles.fw}>{w}</span>
            ))}
          </div>
        </div>
        <div className={`${styles.meter} rv`} role="status" aria-live="off">
          <span className="mono" style={{ color: "var(--onDoom2)" }}>Live · measured on this page</span>
          <MeterValue />
          <p style={{ fontSize: 18 }}>That&apos;s how far you&apos;ve scrolled on this page so far. Now picture a whole evening of it, and ask how much you&apos;d remember tomorrow.</p>
          <MeterRuler />
        </div>
      </div>
    </section>
  );
}
