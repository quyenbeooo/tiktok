import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SnapTik-Pro Clone | Free TikTok Video Downloader (No Watermark)",
  description:
    "Download TikTok videos without watermark in HD quality. Free online tool to save TikTok MP4 videos, MP3 audio, and photo slideshows. No registration required.",
  keywords: [
    "TikTok downloader",
    "download TikTok video",
    "TikTok no watermark",
    "TikTok MP3",
    "save TikTok video",
    "TikTok photo download",
  ],
  authors: [{ name: "SnapTik-Pro Clone" }],
  openGraph: {
    title: "SnapTik-Pro Clone | Free TikTok Video Downloader",
    description:
      "Download TikTok videos without watermark in HD. Free, fast, and no registration.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SnapTik-Pro Clone | TikTok Downloader",
    description: "Download TikTok videos without watermark for free.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "UqRMniZb3OtCEhJ8kfuGb1mSXAIXy4OkOreIHFBk9Ck",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
