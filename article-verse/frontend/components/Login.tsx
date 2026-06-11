"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { API_BASE_URL } from "@/constants/api";
import { useRouter } from "next/navigation";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ loginId, password }),
      });

      const data = await res.json();

      if (res.status === 404) {
        toast.error("User not found");
      } else if (res.status === 401) {
        toast.error("Incorrect password");
      } else if (res.status === 200) {
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Welcome to the Chulkani!!");

        setTimeout(() => {

  // Admin redirect
const userEmail = data.user.email.trim().toLowerCase();

if (userEmail === "root@iglweb.com") {
  router.push("/admin");
} else {
  router.push("/");
}

}, 1000);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("Server error");
    }
  };

  return (
    <section className="relative flex min-h-[calc(100vh-80px)] items-center justify-center">
      <Toaster position="top-right" />
      
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://chronicle.brightspotcdn.com/dims4/default/19e9e16/2147483647/strip/true/crop/2291x1527+55+0/resize/840x560!/quality/90/?url=http%3A%2F%2Fchronicle-brightspot.s3.us-east-1.amazonaws.com%2F62%2F5f%2Fe23b34094d34b36676df0d4a7b9c%2Fkiewra-august-sam-kalda-6428-stover-reuse-edited-modified.jpg')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Main Container - 1400px max-width with 3 columns */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 3-Column Flex Layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center justify-center min-h-[calc(100vh-80px)]">
          
          {/* LEFT COLUMN - Advertisement Space (250px) */}
          <div className="hidden lg:block w-[250px] flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="bg-[var(--black-card)] rounded-2xl overflow-hidden border border-[var(--border-light)]">
                <div className="bg-gradient-to-r from-[var(--black-soft)] to-[var(--black-deep)] p-3">
                  <p className="text-xs text-[var(--text-tertiary)] text-center uppercase tracking-wider">Advertisement</p>
                </div>
                <div className="p-4">
                  <div className="w-full h-[250px] bg-gradient-to-br from-[var(--black-soft)] to-[var(--black-deep)] rounded-xl flex flex-col items-center justify-center">
                    <svg className="w-12 h-12 text-[var(--text-tertiary)] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-[var(--text-secondary)]">Ad Space</p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-1">300x250</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[var(--black-card)] rounded-2xl overflow-hidden border border-[var(--border-light)]">
                <div className="bg-gradient-to-r from-[var(--black-soft)] to-[var(--black-deep)] p-3">
                  <p className="text-xs text-[var(--text-tertiary)] text-center uppercase tracking-wider">Sponsored</p>
                </div>
                <div className="p-4">
                  <div className="w-full h-[250px] bg-gradient-to-br from-[var(--black-warm)] to-[var(--black-deep)] rounded-xl flex flex-col items-center justify-center">
                    <svg className="w-12 h-12 text-[var(--accent-primary)]/40 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <p className="text-sm text-[var(--text-secondary)]">Sponsor Ad</p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-1">Your Brand Here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* CENTER COLUMN - Login Box */}
          <div className="flex-1 max-w-[500px] w-full">
            <div
              className="h-auto min-h-[480px] w-full rounded-2xl shadow-2xl flex flex-col"
              style={{
                background: "var(--black-card)",
                border: "1px solid var(--border-light)",
                padding: "40px",
              }}
            >
              <h2
                className="mb-6 text-center text-xl md:text-2xl font-bold"
                style={{
                  color: "var(--text-heading)",
                  marginBottom: "40px",
                }}
              >
                Login
              </h2>

              {/* Email Input */}
              <input
                type="email"
                placeholder="Enter email or userID"
                value={loginId}
onChange={(e) => setLoginId(e.target.value)}
                className="mb-4 w-full rounded-lg border px-4 h-[55px] md:h-[65px] text-sm md:text-base outline-none"
                style={{
                  borderColor: "var(--border-light)",
                  marginBottom: "20px",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  color: "var(--text-primary)",
                  backgroundColor: "var(--black-soft)",
                }}
              />

              {/* Password Input with Show/Hide Button Inside */}
              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border px-4 h-[55px] md:h-[65px] text-sm md:text-base outline-none"
                  style={{
                    borderColor: "var(--border-light)",
                    marginBottom: "20px",
                    paddingLeft: "10px",
                    paddingRight: "80px",
                    color: "var(--text-primary)",
                    backgroundColor: "var(--black-soft)",
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm md:text-base font-medium px-3 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap"
                  style={{
                    color: "var(--accent-primary)",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(217, 92, 43, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* Login Button */}
              <button
                onClick={handleLogin}
                className="w-full rounded-lg py-3 text-sm md:text-base font-semibold text-white transition-all duration-300 hover:opacity-90 h-[50px]"
                style={{
                  background: "var(--gradient-primary)",
                  marginBottom: "20px",
                }}
              >
                Login
              </button>

              {/* Register */}
              <p className="mt-4 text-center text-xs md:text-sm" style={{ color: "var(--text-secondary)" }}>
                Don't have an account?{" "}
                <span
                  onClick={() => router.push("/registration")}
                  className="cursor-pointer font-semibold transition-all duration-200 hover:underline"
                  style={{ color: "var(--accent-primary)" }}
                >
                  Register now
                </span>
              </p>
            </div>
          </div>
          
          {/* RIGHT COLUMN - Advertisement Space (250px) */}
          <div className="hidden lg:block w-[250px] flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="bg-[var(--black-card)] rounded-2xl overflow-hidden border border-[var(--border-light)]">
                <div className="bg-gradient-to-r from-[var(--black-soft)] to-[var(--black-deep)] p-3">
                  <p className="text-xs text-[var(--text-tertiary)] text-center uppercase tracking-wider">Advertisement</p>
                </div>
                <div className="p-4">
                  <div className="w-full h-[250px] bg-gradient-to-br from-[var(--black-soft)] to-[var(--black-deep)] rounded-xl flex flex-col items-center justify-center">
                    <svg className="w-12 h-12 text-[var(--text-tertiary)] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-[var(--text-secondary)]">Ad Space</p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-1">300x250</p>
                  </div>
                </div>
              </div>
              
              {/* Newsletter Signup */}
              <div className="bg-gradient-to-r from-[var(--accent-primary)]/5 to-[var(--black-soft)] rounded-2xl p-5 text-center border border-[var(--border-light)]">
                <div className="w-12 h-12 rounded-full bg-[var(--gradient-primary)] flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold" style={{ color: "var(--text-heading)" }}>Newsletter</p>
                <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>Get latest updates</p>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full mt-3 px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                  style={{
                    background: "var(--black-soft)",
                    borderColor: "var(--border-light)",
                    color: "var(--text-primary)",
                  }}
                />
                <button
                  className="mt-2 w-full text-xs px-3 py-1.5 rounded-lg transition-all duration-300 hover:shadow-md"
                  style={{
                    background: "var(--gradient-primary)",
                    color: "white",
                  }}
                >
                  Subscribe
                </button>
              </div>
              
              <div className="bg-[var(--black-card)] rounded-2xl overflow-hidden border border-[var(--border-light)]">
                <div className="bg-gradient-to-r from-[var(--black-soft)] to-[var(--black-deep)] p-3">
                  <p className="text-xs text-[var(--text-tertiary)] text-center uppercase tracking-wider">Sponsored</p>
                </div>
                <div className="p-4">
                  <div className="w-full h-[250px] bg-gradient-to-br from-[var(--black-warm)] to-[var(--black-deep)] rounded-xl flex flex-col items-center justify-center">
                    <svg className="w-12 h-12 text-[var(--accent-primary)]/40 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <p className="text-sm text-[var(--text-secondary)]">Your Ad Here</p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-1">Contact for rates</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}