import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  title: "Minerva — Consumer Intelligence",
  description: "Smart daily homepage for the Miami Dolphins CMO",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Google Fonts — preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Add fonts here as needed: */}
        {/* <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" /> */}
      </head>
      <body suppressHydrationWarning>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
