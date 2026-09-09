import Profile from "@/components/Profile";
import { generateSEO } from "@/lib/seo";
import { Metadata } from "next";
import {siteConfig} from "../../lib/siteConfig"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {

  const { id } = await params;

  return {
    title: "User Profile",


    alternates: {
      canonical: `/${id}`,
    },
    openGraph: {
        url: `${siteConfig.siteUrl}/${id}`,
      },
       other: {
    "ia:markup_url": `https://chulkani.com/${id}`,
    "ia:markup_url_dev": `https://chulkani.com/${id}`,
    "ia:rules_url": `https://chulkani.com/${id}`,
    "ia:rules_url_dev": `https://chulkani.com/${id}`,
  },
  };
}

export default function Page() {
  return(
  <>
  {/* console.log(${id}); */}
  
  <Profile />;
  </>
  )
}