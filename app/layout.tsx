import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Minerva — Consumer Intelligence",
  description: "Smart daily homepage for the Miami Dolphins CMO",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg-root text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
