import type { ReactNode } from "react";
import { LEGAL_LAST_UPDATED } from "@/lib/legal";
import { Footer } from "./Footer";
import { Nav } from "./Nav";
import s from "./LegalDoc.module.css";

export type LegalSection = { id: string; title: string; body: ReactNode };

type Props = { title: string; intro: ReactNode; sections: LegalSection[] };

/** Long-form legal page: header, contents list, numbered sections. Server-rendered, no client JS. */
export function LegalDoc({ title, intro, sections }: Props) {
  return (
    <>
      <Nav />
      <main className={s.page}>
        <div className="wrap">
          <header className={s.head}>
            <span className="tag"><i />Legal</span>
            <h1 className={s.title}>{title}</h1>
            <p className={s.meta}>Last updated {LEGAL_LAST_UPDATED}</p>
          </header>

          <div className={s.layout}>
            <nav className={s.toc} aria-label="Contents">
              <details open className={s.tocBox}>
                <summary>Contents</summary>
                <ol>
                  {sections.map((sec, i) => (
                    <li key={sec.id}>
                      <a href={`#${sec.id}`}>
                        <span className={s.num}>{String(i + 1).padStart(2, "0")}</span>
                        {sec.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
            </nav>

            <article className={s.doc}>
              <div className={s.intro}>{intro}</div>
              {sections.map((sec, i) => (
                <section key={sec.id} id={sec.id} className={s.section} aria-labelledby={`${sec.id}-h`}>
                  <h2 id={`${sec.id}-h`}>
                    <span className={s.num}>{String(i + 1).padStart(2, "0")}</span>
                    {sec.title}
                  </h2>
                  {sec.body}
                </section>
              ))}
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
