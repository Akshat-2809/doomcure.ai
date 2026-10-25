import { Footer } from "@/components/Footer";
import { Founder } from "@/components/Founder";
import { Hero } from "@/components/Hero";
import { Idea } from "@/components/Idea";
import { Marquee } from "@/components/Marquee";
import { Nav } from "@/components/Nav";
import { Problem } from "@/components/Problem";
import { ScrollMeterPill } from "@/components/ScrollMeterPill";
import { Story } from "@/components/Story";
import { Waitlist } from "@/components/Waitlist";
import { CONTACT_EMAIL, FOUNDER_EMAIL, FOUNDER_LINKEDIN, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  email: CONTACT_EMAIL,
  description: SITE_DESCRIPTION,
  slogan: "An antidote to doomscrolling.",
  founder: { "@type": "Person", name: "Thenn Arasan", jobTitle: "Founder & CEO", email: FOUNDER_EMAIL, sameAs: [FOUNDER_LINKEDIN] },
  address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressCountry: "IN" },
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Problem />
        <Idea />
        <Story />
        <Founder />
        <Waitlist />
      </main>
      <Footer />
      <ScrollMeterPill />
    </>
  );
}
