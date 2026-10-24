import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy — Doomcure",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <LegalPage title="Privacy" />;
}
