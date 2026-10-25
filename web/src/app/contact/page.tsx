import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import s from "@/components/Contact.module.css";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact — Doomcure",
  description: "Questions, ideas or feedback about Doomcure? Write to us and we'll reply by email.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className={s.page}>
        <div className={s.dots} aria-hidden="true" />
        <div className={`wrap ${s.grid}`}>
          <div className={s.copy}>
            <span className={`tag ${s.tagIn}`}><i />Contact</span>
            <h1 className={s.h1}>
              Say <span className={s.hl}>hello.</span>
            </h1>
            <p className={`lede ${s.lede}`}>Questions, ideas or feedback about Doomcure? Write to us and we&apos;ll reply by email.</p>

            <div className={s.cards}>
              <a className={`${s.card} ${s.cOrange}`} href={`mailto:${CONTACT_EMAIL}`}>
                <span className="mono">Email</span>
                <b>{CONTACT_EMAIL}</b>
              </a>
              <div className={`${s.card} ${s.cSun}`}>
                <span className="mono">Based in</span>
                <b>Bengaluru, India</b>
              </div>
              <Link className={`${s.card} ${s.cMint}`} href="/#waitlist">
                <span className="mono">Early access</span>
                <b>Join the waitlist&nbsp;→</b>
              </Link>
            </div>
          </div>

          <div className={s.formCard}>
            <h2 className={s.formTitle}>Send a message</h2>
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
