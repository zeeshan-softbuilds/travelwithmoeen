import type { Metadata } from "next";
import { connection } from "next/server";
import { Geist, Geist_Mono, Philosopher } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SiteChrome } from "@/components/SiteChrome";
import { NavigationProgress } from "@/components/ui/NavigationProgress";
import { SiteSettingsProvider } from "@/components/SiteSettingsProvider";
import { getSiteSettings } from "@/lib/http/site-content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const philosopher = Philosopher({
  variable: "--font-philosopher",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Travel with Moeen | Explore the World",
  description: "Book your next adventure with Moeen Travel. Luxury tours, breathtaking destinations.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connection();
  const settings = await getSiteSettings();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${philosopher.variable} antialiased selection:bg-indigo-100 selection:text-indigo-900`}
      >
        <NavigationProgress />
        <SiteSettingsProvider value={settings}>
          <SiteChrome>{children}</SiteChrome>
          <Toaster richColors />
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
