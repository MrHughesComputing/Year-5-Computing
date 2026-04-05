import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "APSR Year 5 Computing App",
  description: "Browser-based Year 5 Scratch selection app for school use.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
