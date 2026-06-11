import Profile from "@/components/Profile";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Profile",
  description: "This is the profile of user",
  path: "/about",
});
export default function Page() {
  return <Profile />;
}