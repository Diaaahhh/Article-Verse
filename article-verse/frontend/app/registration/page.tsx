import Registration from "@/components/Registration";
import {siteConfig} from "../../lib/siteConfig"

export const metadata = {
  title: "Registration form",
  description: "Users can register from this page",
  alternates: {
    canonical: "/registration",
  },
  openGraph: {
          url: `${siteConfig.siteUrl}/registration`,
        },
         other: {
    "ia:markup_url": "https://chulkani.com/registration",
    "ia:markup_url_dev": "https://chulkani.com/registration",
    "ia:rules_url": "https://chulkani.com/registration",
    "ia:rules_url_dev": "https://chulkani.com/registration",
  },
};
export default function RegisterPage() {
  return <Registration />;
}