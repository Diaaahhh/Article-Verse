import type { Metadata } from "next";
import "./globals.css";
import {API_BASE_URL} from "../constants/api" 

import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/siteConfig";
import { getSettings } from "@/lib/getSettings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  const iconUrl = settings?.site_icon
    ? `${API_BASE_URL}/uploads/settings/${settings.site_icon}`
    : siteConfig.favicon;

  return {
    metadataBase: new URL(siteConfig.siteUrl),

    title: {
      default: "Chulkani.com",
      template: "%s | Chulkani.com",
    },

    description: siteConfig.defaultDescription,

    icons: {
      icon: iconUrl,
      shortcut: iconUrl,
    },

    robots: {
      index: true,
      follow: true,
    },
 verification: {
      google:
        settings?.google_site_verification || "",
    },

    // ADD HERE
    other: {
      "fb:app_id":
        settings?.fb_app_id || "",

      "p:domain_verify":
        settings?.pinterest_domain_verify || "",
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.siteName,
      images: [
        {
          url: siteConfig.defaultOgImage,
          width: 1200,
          height: 630,
          alt: "Chulkani.com",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      images: [siteConfig.defaultOgImage],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <meta name="family" content="Arial" /><meta name="family" content="SutonnyMJ" />
<meta name="family" content="Boishakhi;" />
<meta
      name="developer"
      content=" Developed By: IGL Web Ltd Powered by : IGL Group Web address : http://www.iglweb.com Address : House 33, Road 04, Dhanmondi, Dhaka - 1205, Bangladesh, Cell : +880-1958-666999"
    />
      </head>
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
