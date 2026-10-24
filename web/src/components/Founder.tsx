import styles from "./Founder.module.css";

const chapters = [
  { yr: "2025 –", title: "Founder & CEO, Doomcure", text: "Building an AI-powered learning experience for an era of information overload." },
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
          {/* TODO: replace with the founder photo (see README) */}
          <div className={styles.fphoto}>
            <span className={styles.ini}>TA</span>
            <span className={styles.lab}>[Founder photo]</span>
          </div>
          <div className={styles.name}>
            <span className={styles.nm}>Thenn Arasan</span>
            <span className="mono">Founder &amp; CEO · Bengaluru · BITS Pilani</span>
          </div>
          <div className={styles.triad}><span>Design</span><span>Engineering</span><span>Product</span></div>
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
