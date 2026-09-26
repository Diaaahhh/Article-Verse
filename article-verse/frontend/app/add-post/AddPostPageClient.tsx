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

  console.log("ADD POST - COOKIE HEADER:", cookieHeader);
  console.log("ADD POST - API URL:", API_BASE_URL);

  let res;

  try {
    res = await fetch(`${API_BASE_URL}/api/check_auth`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    console.log("ADD POST - AUTH STATUS:", res.status);

    const responseText = await res.text();

    console.log("ADD POST - AUTH RESPONSE:", responseText);

    if (!res.ok) {
      redirect("/login");
    }
  } catch (error) {
    console.error("ADD POST - AUTH REQUEST FAILED:", error);
    redirect("/login");
  }

  return <AddPost />;
}