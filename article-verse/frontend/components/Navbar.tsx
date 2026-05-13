"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { API_BASE_URL } from "@/constants/api";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/check-auth`, {
          credentials: "include",
        });
        setIsLoggedIn(res.status === 200);
      } catch (error) {
        console.log(error);
        setIsLoggedIn(false);
      }
    };
    checkAuth();

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
      setIsLoggedIn(false);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddPost = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/check-auth`, {
        credentials: "include",
      });
      if (res.status === 401) {
        router.push("/login");
      } else {
        router.push("/add-post");
      }
    } catch (error) {
      console.log(error);
      router.push("/login");
    }
  };

  return (
    <nav
      className={`w-full border-b transition-all duration-300 flex justify-center sticky top-0 z-50 ${
        scrolled ? 'shadow-lg bg-white/95 backdrop-blur-sm' : 'shadow-sm bg-white'
      }`}
      style={{ borderColor: "#D5D4D3" }}
    >
      <div className="mx-auto flex h-20 w-full max-w-[1400px] items-center justify-between px-6">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => router.push("/")}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A9512C] to-[#302C2B] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <div>
            <h1 className="font-bold text-xl bg-gradient-to-r from-[#A9512C] to-[#302C2B] bg-clip-text text-transparent">
              Chulkani
            </h1>
            <p className="text-xs text-gray-500">Manage your content</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Add Post - Always visible */}
          <button
            onClick={handleAddPost}
            className="group relative overflow-hidden flex h-[44px] w-[130px] cursor-pointer items-center justify-center text-sm font-semibold tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:h-[48px] md:w-[140px]"
            style={{
              border: "2px solid #A9512C",
              color: "#A9512C",
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#A9512C";
              e.currentTarget.style.color = "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FFFFFF";
              e.currentTarget.style.color = "#A9512C";
            }}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Post
          </button>

          {/* Log Out Button - Only show when logged in (no Sign In button) */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="flex h-[44px] w-[130px] cursor-pointer items-center justify-center text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:h-[48px] md:w-[140px]"
              style={{
                background: "linear-gradient(135deg, #A9512C 0%, #302C2B 100%)",
                borderRadius: "12px",
              }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Log Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}