import { WaitlistForm } from "./WaitlistForm";
import styles from "./Waitlist.module.css";

export function Waitlist() {
  return (
    <section className={styles.cta} id="waitlist">
      <span className={`${styles.fly} ${styles.fly1}`} aria-hidden="true" />
      <span className={`${styles.fly} ${styles.fly2}`} aria-hidden="true" />
      <span className={`${styles.fly} ${styles.fly3}`} aria-hidden="true" />
      <span className={`${styles.fly} ${styles.fly4}`} aria-hidden="true" />
      <div className={`wrap ${styles.ctain}`}>
        <span className="tag"><i style={{ background: "var(--ink)" }} />Early access</span>
        <h2 className={`${styles.ctah} rv`}>Make your scroll<br />doomproof.</h2>
        <p className="lede">We&apos;re building now. Leave your email and you&apos;ll be first to try it.</p>
        <WaitlistForm source="cta" buttonLabel="Join the waitlist" full />
      </div>
    </section>
  );
}
