import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import "./globals.css";
import "./overrides.css";

export const metadata: Metadata = {
  title: "Minerva — Consumer Intelligence",
  description: "Smart daily homepage for the Miami Dolphins CMO",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
