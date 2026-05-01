import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Planify - University Timetable Management",
  description: "Automated university timetable generation and management system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
