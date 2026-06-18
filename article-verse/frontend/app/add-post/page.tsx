import { Suspense } from "react";
import AddPostPageClient from "./AddPostPageClient";
import {siteConfig} from "../../lib/siteConfig"
export const metadata = {
  title: "Content Creation Form",
  description: "Users can create articles from here",
  alternates: {
    canonical: "/add-post",
  },
   openGraph: {
    url: `${siteConfig.siteUrl}/add-post`,
  },
   other: {
    "ia:markup_url": "https://chulkani.com/add-post",
    "ia:markup_url_dev": "https://chulkani.com/add-post",
    "ia:rules_url": "https://chulkani.com/add-post",
    "ia:rules_url_dev": "https://chulkani.com/add-post",
  },
};
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddPostPageClient />
    </Suspense>
  );
}