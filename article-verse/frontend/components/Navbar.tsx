"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { API_BASE_URL } from "@/constants/api";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
const [userImage, setUserImage] = useState("");
const [userId, setUserId] = useState<number | null>(null);
const [dropdownOpen, setDropdownOpen] = useState(false);

const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const checkAuth = async () => {

  try {

    const res = await fetch(
      `${API_BASE_URL}/api/profile`,
      {
        credentials: "include",
      }
    );

    const data = await res.json();

    if (res.ok) {

      setIsLoggedIn(true);

      setUserImage(data.user.user_image || "");
      setUserId(data.user.id);

    } else {

      setIsLoggedIn(false);

    }

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


  useEffect(() => {

  const handleClickOutside = (
    event: MouseEvent
  ) => {

    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(
        event.target as Node
      )
    ) {

      setDropdownOpen(false);

    }

  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () => {

    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );

  };

}, []);
  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
        // Remove local storage
    localStorage.removeItem("user");
      setIsLoggedIn(false);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddPost = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/check_auth`, {
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

  <div
  className="relative"
  ref={dropdownRef}
  onMouseEnter={() => setDropdownOpen(true)}
  onMouseLeave={() => setDropdownOpen(false)}
>

    {/* PROFILE IMAGE */}

    <div
      className="w-12 h-12 rounded-full overflow-hidden cursor-pointer border-2 border-[#A9512C] hover:scale-105 transition-all duration-300"
    >

      {userImage ? (

        <img
          src={`${API_BASE_URL}/uploads/profiles/${userImage}`}
          alt="Profile"
          className="w-full h-full object-cover"
        />

      ) : (

        <div className="w-full h-full bg-gradient-to-br from-[#A9512C] to-[#302C2B] flex items-center justify-center text-white font-bold">
          U
        </div>

      )}

    </div>

    {/* DROPDOWN */}

    {dropdownOpen && (

  <div
    className="
      absolute 
      right-0 
      top-12.5
      w-60
      overflow-hidden
      rounded-2xl
      border
      backdrop-blur-xl
      shadow-2xl
      animate-in
      fade-in
      zoom-in-95
      duration-200
    "
    style={{
      background: "rgba(26,26,26,0.96)",
      borderColor: "var(--border-light)",
      boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
      padding: "10px"
    }}
  >

    {/* TOP USER SECTION */}

    <div
      className="px-5 py-4 border-b"
      style={{
        borderColor: "var(--border-light)",
      }}
    >

      <p
        className="text-sm font-semibold"
        style={{
          color: "var(--text-heading)",
        }}
      >
        Welcome Back
      </p>

      <p
        className="text-xs mt-1"
        style={{
          color: "var(--text-secondary)",
        }}
      >
        Manage your profile & content
      </p>

    </div>

    {/* MENU ITEMS */}

    <div className="p-2">

      <button
        onClick={() => {

          setDropdownOpen(false);

          router.push(`/profile/${userId}`);

        }}
        className="
          w-full
          flex
          items-center
          gap-3
          px-4
          py-3
          rounded-xl
          text-sm
          font-medium
          transition-all
          duration-200
          hover:translate-x-1
        "
        style={{
          color: "var(--text-primary)",
          paddingTop: "10px",
          paddingBottom: "10px"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background =
            "rgba(217, 92, 43, 0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background =
            "transparent";
        }}
      >

        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>

        Profile

      </button>

      <button
        onClick={() => {

          setDropdownOpen(false);

          handleLogout();

        }}
        className="
          w-full
          flex
          items-center
          gap-3
          px-4
          py-3
          rounded-xl
          text-sm
          font-medium
          transition-all
          duration-200
          hover:translate-x-1
        "
        style={{
          color: "#EF4444",
          paddingTop: "10px",
          paddingBottom: "10px"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background =
            "rgba(239, 68, 68, 0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background =
            "transparent";
        }}
      >

        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V4"
          />
        </svg>

        Logout

      </button>

    </div>

  </div>

)}

  </div>

)}
        </div>
      </div>
    </nav>
  );
}