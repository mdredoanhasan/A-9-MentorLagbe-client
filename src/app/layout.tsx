import { Fraunces } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-fraunces",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fraunces.variable}>

      <body>
        <Navbar/>
        {children}
      <Footer/>
      </body>
    </html>
  );
}