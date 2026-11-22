import { Fraunces, Geist } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import SiteChrome from "./components/site-chrome";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "MentorLagbe",
};

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-fraunces",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable, fraunces.variable)}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SiteChrome navbar={<Navbar />} footer={<Footer />}>
            {children}
          </SiteChrome>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}