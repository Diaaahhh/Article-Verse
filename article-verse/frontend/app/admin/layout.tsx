"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import "../admin.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = localStorage.getItem("user");

        if (!user) {
          router.push("/login");
          return;
        }

        const parsedUser = JSON.parse(user);

        if (parsedUser.email !== "root@iglweb.com") {
          router.push("/");
          return;
        }

        setAuthorized(true);
      } catch (error) {
        console.error("Auth error:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F3F4F6' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="admin-spinner"></div>
          <p style={{ marginTop: '1rem', color: '#6B7280' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F3F4F6' }}>
      <AdminSidebar />
      <div style={{ flex: 1, marginLeft: '280px' }}>
        <div style={{ padding: '2rem' }}>
          {children}
        </div>
      </div>
    </div>
  );
}