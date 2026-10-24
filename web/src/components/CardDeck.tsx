"use client";

import { useState } from "react";
import styles from "./Idea.module.css";

const cards = [
  { kick: "Science · 1 min", title: "Why is the sky blue?", text: "Air scatters blue light more than red, so blue reaches you from every direction.", bg: "#FF5B2E", fg: "#141414" },
  { kick: "Money · 1 min", title: "How does compound interest grow?", text: "You earn interest on your interest, so growth speeds up over time.", bg: "#7B61FF", fg: "#FFFFFF" },
  { kick: "Ideas · 1 min", title: "What did the Stoics mean by control?", text: "Sort what you can control from what you can’t, and act on the first.", bg: "#12B088", fg: "#141414" },
  { kick: "Body · 1 min", title: "How do vaccines teach your body?", text: "A harmless preview of a germ, so your immune system knows the real one.", bg: "#FFC93C", fg: "#141414" },
];

const positions = [styles.p0, styles.p1, styles.p2, styles.p3];

export function CardDeck() {
  const [top, setTop] = useState(0);
  const n = cards.length;

  return (
    <div className={styles.deck}>
      {cards.map((c, i) => {
        const pos = (i - top + n) % n;
        return (
          <div key={c.title} className={`${styles.dc} ${positions[pos]}`} style={{ background: c.bg, color: c.fg }} aria-hidden={pos !== 0}>
            <span className="mono">{c.kick}</span>
            <b>{c.title}</b>
            <p>{c.text}</p>
          </div>
        );
      })}
      <button type="button" className={styles.next} onClick={() => setTop((t) => (t + 1) % n)}>Next card →</button>
    </div>
  );
}
