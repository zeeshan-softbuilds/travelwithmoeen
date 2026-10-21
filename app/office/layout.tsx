import { Inter, JetBrains_Mono } from "next/font/google";
import "@/components/office/meadow.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

// The Meadow root. Every office token and class is scoped under .office, so the public site
// keeps its own look.
export default function OfficeLayout({ children }: { children: React.ReactNode }) {
  return <div className={`office ${inter.variable} ${jetBrainsMono.variable}`}>{children}</div>;
}
