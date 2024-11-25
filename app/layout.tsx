import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "GNX World - AI Cover Art Generator",
  description:
    "Create unique album covers with classic vehicles and legendary artists, inspired by Kendrick Lamar's GNX.",
  openGraph: {
    title: "GNX World - AI Cover Art Generator",
    description:
      "Create unique album covers with classic vehicles and legendary artists, inspired by Kendrick Lamar's GNX.",
    url: "https://gnx.world",
    siteName: "GNX World",
    images: [
      {
        url: "/preview.jpg",
        width: 1200,
        height: 1200,
        alt: "GNX World Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GNX World - AI Cover Art Generator",
    description:
      "Create unique album covers with classic vehicles and legendary artists, inspired by Kendrick Lamar's GNX.",
    images: ["/preview.jpg"],
    creator: "@gill_works",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
