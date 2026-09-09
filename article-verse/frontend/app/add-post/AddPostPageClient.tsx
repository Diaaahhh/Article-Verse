import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_BASE_URL } from "@/constants/api";
import AddPost from "@/components/AddPost";

export default async function AddPostPage() {
  const cookieStore = await cookies();

  const allCookies = cookieStore.getAll();

  const cookieHeader = allCookies
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  let res;

  try {
    res = await fetch(`${API_BASE_URL}/api/check_auth`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });
  } catch (error) {
    console.error("Auth request failed:", error);
    redirect("/login");
  }

  if (!res.ok) {
    redirect("/login");
  }

  return <AddPost />;
}