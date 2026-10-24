import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";
import { LogoMark } from "./Logo";
import styles from "./LegalPage.module.css";

export function LegalPage({ title }: { title: string }) {
  return (
    <main className={styles.page}>
      <div className={`wrap ${styles.inner}`}>
        <Link className={styles.logo} href="/" aria-label="Doomcure home">
          <LogoMark />
          <span>doomcure</span>
        </Link>
        <span className="tag"><i />Legal</span>
        <h1 className="h2">{title}</h1>
        <p className={styles.draft}>[DRAFT — to be written]</p>
        <p className="lede">
          This page hasn&apos;t been written yet. Questions in the meantime? Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
        <Link className="btn btn-ink" href="/">Back to home</Link>
      </div>
    </main>
  );
}
