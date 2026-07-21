import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WallProud — Collect & Display Testimonials",
  description: "Collect, manage, and showcase customer testimonials as beautiful embeddable widgets.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "64x64 128x128 192x192 256x256", type: "image/x-icon" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-canvas text-ink">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#141414",
              color: "#ffffff",
              border: "1px solid #262626",
              borderRadius: 10,
            },
          }}
        />
      </body>
    </html>
  );
}
