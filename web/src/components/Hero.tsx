import { Offscreen } from "./Offscreen";
import { PhoneSplit } from "./PhoneSplit";
import { WaitlistForm } from "./WaitlistForm";
import styles from "./Hero.module.css";

const doomPosts = [
  { bar: 70, badge: "99+", title: "You won't believe what happened next", media: true },
  { bar: 90, badge: "LIVE", title: "Everyone is angry about this. Again.", lines: [80, 55] },
  { bar: 60, title: "Part 4 of 37. Wait for it…", media: true },
  { bar: 84, badge: "NEW", title: "BREAKING: one more thing to worry about", lines: [70] },
];

const cureCards = [
  { c: styles.c1, kick: "Science · 1 min", title: "Why is the sky blue?", text: "Air scatters blue light from the sun more than red, so blue reaches you from every direction." },
  { c: styles.c2, kick: "Money · 1 min", title: "How does compound interest grow?", text: "You earn interest on your interest, so growth speeds up the longer you leave it." },
  { c: styles.c3, kick: "Ideas · 1 min", title: "What did the Stoics mean by control?", text: "Sort what you can control from what you can't, and put your energy into the first." },
  { c: styles.c4, kick: "Body · 1 min", title: "How do vaccines teach your body?", text: "They show your immune system a harmless preview of a germ, so it knows the real one faster." },
];

// Each feed is rendered twice so the -50% loop is seamless.
const twice = <T,>(list: T[]) => [...list, ...list];

function DoomLayer() {
  return (
    <>
      <div className={styles.statusbar} style={{ color: "var(--onDoom2)" }}><span>02:47</span><span>●●● 4%</span></div>
      <div className={styles.feed}>
        {twice(doomPosts).map((p, i) => (
          <div className={styles.post} key={i}>
            <div className={styles.ph}>
              <span className={styles.av} />
              <span className={styles.bar} style={{ width: p.bar }} />
              {p.badge && <span className={styles.badge}>{p.badge}</span>}
            </div>
            <b>{p.title}</b>
            {p.media && <div className={styles.media} />}
            {p.lines?.map((w, j) => <div className={styles.bar} style={{ width: `${w}%` }} key={j} />)}
          </div>
        ))}
      </div>
      <div className={styles.doomtime}><span>Scrolled tonight</span><span>2h 14m · remembered: ?</span></div>
    </>
  );
}

function CureLayer() {
  return (
    <>
      <div className={styles.statusbar} style={{ color: "var(--ink)" }}><span>19:30</span><span>●●● 82%</span></div>
      <div className={`${styles.feed} ${styles.slow}`}>
        {twice(cureCards).map((c, i) => (
          <div className={`${styles.card} ${c.c}`} key={i}>
            <span className={styles.kick}>{c.kick}</span>
            <b>{c.title}</b>
            <p>{c.text}</p>
          </div>
        ))}
      </div>
      <div className={styles.prooftime}><span>Learned tonight</span><span>4 ideas · kept</span></div>
    </>
  );
}

export function Hero() {
  return (
    <section className={styles.hero} id="top">
      <div className={styles.dots} aria-hidden="true" />
      <div className={`wrap ${styles.herogrid}`}>
        <div className={styles.herocopy}>
          <span className={`tag ${styles.tagIn}`}><i />Early stage · Building now</span>
          <h1 className={styles.h1}>
            <span className={styles.w}>An</span> <span className={`${styles.w} ${styles.hl}`}>antidote</span> <span className={styles.w}>to</span>
            <br />
            <span className={styles.w}><span className={`${styles.glitch} ${styles.strike}`} data-t="doom">doom</span>scrolling.</span>
          </h1>
          <p className={`lede ${styles.lede}`}>An AI-powered learning experience that makes what you take in actually stay with you. Built for an era of information overload.</p>
          <WaitlistForm source="hero" buttonLabel="Get early access" />
          <div className={styles.under}>
            <div className={styles.faces} aria-hidden="true">
              <span style={{ background: "var(--violet)" }} />
              <span style={{ background: "var(--mint)" }} />
              <span style={{ background: "var(--sun)" }} />
              <span style={{ background: "var(--sky)" }} />
            </div>
            <span style={{ color: "var(--ink2)", fontSize: 15 }}>Started as a side project. Now used by real people around the world.</span>
          </div>
        </div>

        <Offscreen className={styles.stage}>
          <div className={styles.sticker} aria-hidden="true">
            <svg viewBox="0 0 132 132">
              <defs><path id="circ" d="M66,66 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0" /></defs>
              <circle cx="66" cy="66" r="64" fill="#FFC93C" stroke="#141414" strokeWidth="2" />
              <text style={{ fontFamily: "var(--mono)" }} fontSize="10.5" letterSpacing="2.2" fill="#141414">
                <textPath href="#circ">AI-POWERED LEARNING · DOOMCURE · </textPath>
              </text>
              <path d="M66 48 C67.4 59 69 60.6 80 62 C69 63.4 67.4 65 66 76 C64.6 65 63 63.4 52 62 C63 60.6 64.6 59 66 48 Z" fill="#141414" transform="translate(0 4)" />
            </svg>
          </div>
          <PhoneSplit doom={<DoomLayer />} cure={<CureLayer />} />
          <span className={styles.hint} aria-hidden="true">Drag to cure the feed →</span>
        </Offscreen>
      </div>
    </section>
  );
}
