import { CardDeck } from "./CardDeck";
import styles from "./Idea.module.css";

export function Idea() {
  return (
    <section className={styles.sec} id="idea">
      <div className="wrap">
        <div className="rv">
          <span className="tag"><i />The idea</span>
          <p className={styles.quote} style={{ marginTop: 28 }}>
            <span className={styles.q}>“</span>An AI-powered learning experience that enhances knowledge retention and engagement.<span className={styles.q}>”</span>
          </p>
          <span className={styles.attr}>From Thenn Arasan, founder</span>
        </div>
        <div className={styles.pillars}>
          <div className={`${styles.pillar} rv`}>
            <div className={styles.vis} aria-hidden="true">
              <div className={styles.orbit}><i>?</i><i>!</i><i>?</i></div>
              <div className={styles.core}>?</div>
            </div>
            <h3>Curiosity first</h3>
            <p>It starts from what you actually want to know. Curiosity is the compass, not the algorithm&apos;s idea of what keeps you hooked.</p>
          </div>
          <div className={`${styles.pillar} rv`}>
            <div className={styles.vis} aria-hidden="true">
              <div className={styles.keep}>
                <div className={styles.krow}><span>What you scroll past</span><div className={`${styles.kbar} ${styles.fade}`}><i /></div></div>
                <div className={styles.krow}><span>What you learn here</span><div className={`${styles.kbar} ${styles.stay}`}><i /></div></div>
              </div>
            </div>
            <h3>Made to stay</h3>
            <p>The point is retention. What you learn should still be there tomorrow, next week and when you need it.</p>
          </div>
          <div className={`${styles.pillar} rv`}>
            <div className={styles.vis}>
              <CardDeck />
            </div>
            <h3>As engaging as a feed</h3>
            <p>The pull of a feed, pointed at something that leaves you better off. Go on, tap through a few.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
