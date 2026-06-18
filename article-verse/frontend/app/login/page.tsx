import Login from "@/components/Login";
import {siteConfig} from "../../lib/siteConfig"

export const metadata = {
  title: "Login page",
  description: "Registered users log in from here.",
  alternates: {
    canonical: "/login",
  },
  openGraph: {
      url: `${siteConfig.siteUrl}/login`,
    },
     other: {
    "ia:markup_url": "https://chulkani.com/login",
    "ia:markup_url_dev": "https://chulkani.com/login",
    "ia:rules_url": "https://chulkani.com/login",
    "ia:rules_url_dev": "https://chulkani.com/login",
  },
};
export default function LoginPage() {
  return <Login />;
}