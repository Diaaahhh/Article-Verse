"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { API_BASE_URL } from "@/constants/api";
import { useRouter } from "next/navigation";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
const [email, setEmail] = useState("");
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
  body: JSON.stringify({ email, password }),
});

    const data = await res.json();

    if (res.status === 404) {
      toast.error("User not found");
    } else if (res.status === 401) {
      toast.error("Incorrect password");
    } else if (res.status === 200) {
      localStorage.setItem(
  "user",
  JSON.stringify(data.user)
);
      toast.success("Welcome to the Chulkani!!");

setTimeout(() => {
  router.push("/");
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
    
    <section className="relative flex min-h-[calc(100vh-112px-120px)] items-center justify-center">
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

      {/* Login Box */}
      {/* Wrapper (padding layer) */}
<div className="relative z-10 w-full max-w-[500px] px-[20px] md:px-[30px]">


  {/* Actual Login Box */}
  <div className="h-auto min-h-[480px] w-full rounded-2xl bg-white p-6 md:p-8 shadow-2xl flex flex-col " 
  style={{
    padding: "40px"
}}>

    <h2 className="mb-6 text-center text-xl md:text-2xl font-bold text-[#302C2B]"
    style={{
    marginBottom: "40px"
}}>
      Login
    </h2>

    {/* Email */}
    <input
      type="email"
      placeholder="Enter email"
       value={email}
  onChange={(e) => setEmail(e.target.value)}
        className="mb-4 w-full rounded-lg border px-4 h-[55px] md:h-[65px] text-sm md:text-base outline-none"

      style={{ borderColor: "#D5D4D3", marginBottom: "20px",
        paddingLeft: "10px"
      }}
    />

    {/* Password */}
    <div className="relative mb-4">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={password}
  onChange={(e) => setPassword(e.target.value)}
          className=" w-full rounded-lg border px-4 h-[55px] md:h-[65px] text-sm md:text-base outline-none"

        style={{ borderColor: "#D5D4D3" , marginBottom: "20px",
        paddingLeft: "10px"}}
      />

       <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-600 "
      >
        {showPassword ? "Hide" : "Show"}
      </button>
    </div>

    {/* Login Button */}
    <button
    onClick={handleLogin}
      className="w-full rounded-lg py-3 text-sm md:text-base font-semibold text-white transition-all duration-300 hover:opacity-90 h-[30px] md:h-[35px]"
      style={{
        background: "linear-gradient(135deg, #A9512C 0%, #302C2B 100%)",
        marginBottom: "20px",
      }}
    >
      Login
    </button>

    {/* Register */}
    <p className="mt-4 text-center text-xs md:text-sm text-gray-600">
      Don't have an account?{" "}
      <span
  onClick={() => router.push("/registration")}
  className="cursor-pointer font-semibold text-[#A9512C]"
>
  Register now
</span>
    </p>

  </div>
</div>
    </section>
  );
}