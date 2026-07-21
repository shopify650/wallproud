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
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
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
