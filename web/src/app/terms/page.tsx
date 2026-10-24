import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms — Doomcure",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <LegalPage title="Terms" />;
}
