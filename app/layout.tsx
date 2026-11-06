import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";

const display = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Keep the promise: no retrospective changes to settlement",
  description:
    "Skilled workers already on the path to settlement are being moved from five years to ten, part-way through. Here is why the change should not be retrospective.",
  openGraph: {
    title: "Keep the promise",
    description:
      "Skilled workers already on the path to settlement are being moved from five years to ten. Don't make it retrospective.",
    images: ["/scenes/street-wide.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#08111d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${display.variable} ${sans.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
