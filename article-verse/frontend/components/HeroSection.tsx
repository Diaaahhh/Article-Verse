"use client";

import { useEffect, useState } from "react";
import { Open_Sans } from "next/font/google";
import { API_BASE_URL } from "@/constants/api";
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export default function HeroSection() {
  // State for database data
  const [infoName, setInfoName] = useState("");
  const [infoSubtitle, setInfoSubtitle] = useState("");
  // Fetch data from backend
  useEffect(() => {
    const fetchInformation = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/hero_section`);

        const data = await response.json();

        // Get first row's info_name
        if (data.length > 0) {
          // Heading
          setInfoName(data[0].info_name);

          // Subtitle
          setInfoSubtitle(data[0].info_subtitle);
        }
      } catch (error) {
        console.log("Error fetching information:", error);
      }
    };

    fetchInformation();
  }, []);

  return (
<section className="relative flex min-h-[25vh] justify-center overflow-hidden bg-[#302C2B] text-white">      
  {/* Background Image */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 text-center">
        {/* Image Placeholder */}
        {/* <div
          className="mb-10 flex h-[120px] w-[120px] items-center justify-center rounded-3xl border-2 border-dashed"
          style={{
            borderColor: "#D5D4D3",
            backgroundColor: "rgba(255,255,255,0.05)",
          }}
        >
          <span className="text-sm font-medium" style={{ color: "#D5D4D3" }}>
            Logo Here
          </span>
        </div> */}

        {/* Heading */}
        <h1
          className={`${openSans.className} max-w-4xl text-5xl font-extrabold leading-tight md:text-7xl`}
          // style={{ marginBottom: "55px" }}
        >
          {infoName}
        </h1>

        {/* Search Box */}
        <div
          className="flex h-[62px] w-full max-w-[1140px] items-center overflow-hidden rounded-sm border-2 bg-white shadow-2xl md:h-[68px]"
          style={{
            borderColor: "#A9512C",
            boxShadow:
              "0 0 10px rgba(169,81,44,0.45), 0 0 25px rgba(169,81,44,0.25)",
          }}
        >
          {/* Input */}
          <input
            type="text"
            placeholder="Search articles, research, journals and stories..."
            className="h-full flex-1 text-base text-[#302C2B] outline-none md:text-lg"
            style={{
              paddingLeft: "32px",
              paddingRight: "20px",
            }}
          />

          {/* Search Button */}
          <button
            className="flex h-full min-w-[120px] items-center justify-center px-6 text-base font-semibold transition-all duration-300 md:min-w-[140px] md:text-lg"
            style={{
              backgroundColor: "#A9512C",
              color: "#FFFFFF",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#302C2B";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#A9512C";
            }}
          >
            Search
          </button>
        </div>

        {/* Paragraph */}
        <p
          className="max-w-3xl text-lg leading-8 text-[#D5D4D3] md:text-xl"
          style={{
            marginTop: "15px",
          }}
        >
          {infoSubtitle}
        </p>
      </div>
    </section>
  );
}
