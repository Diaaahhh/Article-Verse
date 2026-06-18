import Profile from "@/components/Profile";
import { generateSEO } from "@/lib/seo";
import { Metadata } from "next";
import {siteConfig} from "../../../lib/siteConfig"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {

  const { id } = await params;

  return {
    title: "User Profile",

    alternates: {
      canonical: `/profile/${id}`,
    },
    openGraph: {
        url: `${siteConfig.siteUrl}/profile/${id}`,
      },
       other: {
    "ia:markup_url": `https://chulkani.com/profile/${id}`,
    "ia:markup_url_dev": `https://chulkani.com/profile/${id}`,
    "ia:rules_url": `https://chulkani.com/profile/${id}`,
    "ia:rules_url_dev": `https://chulkani.com/profile/${id}`,
  },
  };
}

export default function Page() {
  return <Profile />;
}