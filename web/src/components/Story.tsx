import { STORY_TRACK_ID } from "@/lib/site";
import { StoryArrows } from "./StoryArrows";
import styles from "./Story.module.css";

const icon = (d: React.ReactNode) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);

const chapters = [
  { n: "01", bg: "var(--sun)", icon: icon(<path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12z" />), title: "A thread", text: "Someone in a founder community started a conversation. People jumped in and ideas flew." },
  { n: "02", bg: "var(--mint)", icon: icon(<path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />), title: "A reply, built", text: "A member made a request. Thenn built something in response, and the community loved it." },
  { n: "03", bg: "var(--sky)", icon: icon(<><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17h.01" /></>), title: "A hypothesis", text: "The spark became a question worth answering, then a side project." },
  { n: "04", bg: "var(--orange)", icon: icon(<path d="M13 2L4 14h7l-1 8 9-12h-7z" />), title: "A prototype in a week", text: "A mentor asked why not build one. One week later, there was a working prototype." },
  { n: "05", bg: "var(--violet)", icon: icon(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>), title: "Real users, worldwide", text: "Real people and real traffic from around the world started showing up." },
  { n: "06", bg: "var(--white)", icon: icon(<path d="M12 3c.8 5.6 3.4 8.2 9 9-5.6.8-8.2 3.4-9 9-.8-5.6-3.4-8.2-9-9 5.6-.8 8.2-3.4 9-9z" />), title: "A company", text: "Now a team, building it properly. More on this soon.", final: true },
];

export function Story() {
  return (
    <section className={styles.story} id="story">
      <div className={`wrap ${styles.storyhead} rv`}>
        <div className={styles.headcopy}>
          <span className="tag"><i />The story</span>
          <h2 className="h2">The butterfly effect.</h2>
          <p className="lede" style={{ color: "rgba(255,255,255,.85)" }}>It didn&apos;t start with a pitch deck. It started with a conversation in a community, and a founder who built something in reply.</p>
        </div>
        <StoryArrows />
      </div>
      <div className={styles.hs} id={STORY_TRACK_ID} tabIndex={0} role="region" aria-label="Story, scroll sideways">
        {chapters.map((c) => (
          <div className={c.final ? `${styles.hcard} ${styles.final}` : styles.hcard} key={c.n}>
            <span className={styles.n}>{c.n}</span>
            <span className={styles.ic} style={{ background: c.bg }}>{c.icon}</span>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
          </div>
        ))}
      </div>
      <div className={styles.prog} aria-hidden="true"><i /></div>
    </section>
  );
}
