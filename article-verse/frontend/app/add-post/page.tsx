"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/constants/api";
import AddPost from "@/components/AddPost";

export default function AddPostPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch(`${API_BASE_URL}/api/check-auth`, {
        credentials: "include",
      });

      if (res.status === 401) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  return <AddPost />;
}