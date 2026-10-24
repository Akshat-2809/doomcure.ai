import type { Metadata, Viewport } from "next";
import { Dela_Gothic_One, Martian_Mono, Schibsted_Grotesk } from "next/font/google";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";
import "./globals.css";

const dela = Dela_Gothic_One({ weight: "400", subsets: ["latin"], variable: "--font-dela" });
const schibsted = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-schibsted" });
const martian = Martian_Mono({ subsets: ["latin"], variable: "--font-martian" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#F3F3EF",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dela.variable} ${schibsted.variable} ${martian.variable}`}>
      <body>
        <div className="d">{children}</div>
      </body>
    </html>
  );
}
