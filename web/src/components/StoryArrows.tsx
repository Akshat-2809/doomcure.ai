"use client";

import { STORY_TRACK_ID } from "@/lib/site";
import styles from "./Story.module.css";

function scrollStory(dir: 1 | -1) {
  const el = document.getElementById(STORY_TRACK_ID);
  if (!el) return;
  const card = el.firstElementChild;
  const w = card ? card.getBoundingClientRect().width + 20 : 380;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollBy({ left: dir * w, behavior: reduced ? "instant" : "smooth" });
}

export function StoryArrows() {
  return (
    <div className={styles.arrows}>
      <button type="button" className={styles.arw} aria-label="Previous" aria-controls={STORY_TRACK_ID} onClick={() => scrollStory(-1)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
      </button>
      <button type="button" className={styles.arw} aria-label="Next" aria-controls={STORY_TRACK_ID} onClick={() => scrollStory(1)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}
