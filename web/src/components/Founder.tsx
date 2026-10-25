import Image from "next/image";
import portrait from "@/assets/founder/thenn-arasan.jpg";
import { FOUNDER_EMAIL, FOUNDER_LINKEDIN } from "@/lib/site";
import styles from "./Founder.module.css";

const chapters = [
  { yr: "2025 –", title: "Founder & CEO", text: "Building an AI-powered learning experience for an era of information overload." },
  {
    yr: "2018 – 2024",
    title: "Shopmatic · Engineering Manager",
    text: "One of the founding engineers in India. Led the rebuild of merchant storefronts in Next.js for 500,000+ stores, and turned a three-page checkout into one page.",
    stats: ["−32% checkout drop-offs", "+22% merchant sign-ups", "−30% bounce rate"],
  },
  { yr: "2017 – 2018", title: "RoofandFloor · Senior Software Engineer", text: "Built features in React for a real-estate platform from The Hindu Group, including a lighter landing page that doubled conversion." },
  { yr: "2010 – 2017", title: "Capgemini · Software Engineer", text: "System architecture for General Motors in-car interfaces, including the instrument cluster and head-up display, and web apps for operators of GE Healthcare CT scanners." },
];

export function Founder() {
  return (
    <section className={styles.sec} id="founder">
      <div className={`wrap ${styles.fgrid}`}>
        <div className={`${styles.fcard} rv`}>
          <div className={styles.fphoto}>
            <Image src={portrait} alt="Thenn Arasan, founder of Doomcure" placeholder="blur" sizes="(max-width: 1000px) calc(100vw - 96px), 440px" />
          </div>
          <div className={styles.name}>
            <span className={styles.nm}>Thenn Arasan</span>
            <span className="mono">Founder &amp; CEO · Bengaluru · BITS Pilani</span>
          </div>
          <div className={styles.triad}><span>Design</span><span>Engineering</span><span>Product</span></div>
          <div className={styles.links}>
            <a className={styles.contactBtn} href={`mailto:${FOUNDER_EMAIL}`} aria-label={`Email Thenn Arasan at ${FOUNDER_EMAIL}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
              Email
            </a>
            <a className={styles.contactBtn} href={FOUNDER_LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="Thenn Arasan on LinkedIn (opens in a new tab)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
        <div className={styles.col}>
          <div className={`rv ${styles.intro}`}>
            <span className="tag"><i />The founder</span>
            <h2 className="h2" style={{ fontSize: "clamp(34px, 4.2vw, 60px)" }}>Three skills from three chapters, finally in one place.</h2>
            <p className="lede">In college he spent more time on design and animation than on code. Then came years of building products as an engineer. Then the product lens that tied it together. In 2025 he gave himself 365 days to follow his curiosity, and this is what it led to.</p>
          </div>
          <div className={styles.chapters}>
            {chapters.map((c) => (
              <div className={`${styles.ch} rv`} key={c.yr}>
                <span className={styles.yr}>{c.yr}</span>
                <div>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                  {c.stats && <ul>{c.stats.map((s) => <li key={s}>{s}</li>)}</ul>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
