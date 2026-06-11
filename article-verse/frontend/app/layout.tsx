import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),

  title: {
    default: siteConfig.siteName,
    template: `%s | ${siteConfig.siteName}`,
  },

  description: siteConfig.defaultDescription,

  icons: {
    icon: siteConfig.favicon,
    shortcut: siteConfig.favicon,
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    siteName: siteConfig.siteName,
    images: [siteConfig.defaultOgImage],
  },

  twitter: {
    card: "summary_large_image",
    images: [siteConfig.defaultOgImage],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body >
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#363636",
              color: "#fff",
              borderRadius: "12px",
            },
            success: {
              iconTheme: {
                primary: "#10B981",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#EF4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
