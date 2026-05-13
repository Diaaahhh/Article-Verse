"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/constants/api";
import { useRouter } from "next/navigation";

type SearchArticle = {
  id: number;
  slug: string;
  art_title: string;
  art_subtitle: string;
};


export default function HeroSection() {
  const router = useRouter();
  // State for database data
  const [infoName, setInfoName] = useState("");
  const [infoSubtitle, setInfoSubtitle] = useState("");
  const [search, setSearch] = useState("");
const [results, setResults] = useState<SearchArticle[]>([]);
const [loading, setLoading] = useState(false);
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

  useEffect(() => {
  if (!search.trim()) {
    setResults([]);
    return;
  }

  const delayDebounce = setTimeout(async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/api/search?q=${encodeURIComponent(search)}`
      );

      const data = await res.json();

      setResults(data);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, 400);

  return () => clearTimeout(delayDebounce);

}, [search]);
const handleSearch = () => {
  if (!search.trim()) return;

  router.push(`/search?q=${encodeURIComponent(search)}`);
};
  return (
    <section className="relative flex min-h-[25vh] justify-center overflow-hidden bg-[#302C2B] text-white">      
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 text-center">
        {/* Heading - FIXED with solid color */}
        <h1
          className={` max-w-4xl text-5xl font-extrabold leading-tight md:text-7xl`}
          style={{
            color: "white",
            background: "none",
            WebkitBackgroundClip: "unset",
            backgroundClip: "unset",
          }}
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
             onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  }}
            value={search}
onChange={(e) => setSearch(e.target.value)}
            className="h-full flex-1 text-base text-[#302C2B] outline-none md:text-lg"
            style={{
              paddingLeft: "32px",
              paddingRight: "20px",
              backgroundColor: "#FFFFFF",
              color: "#302C2B",
            }}
          />

          {/* Search Button */}
          <button
            className="flex h-full min-w-[120px] items-center justify-center px-6 text-base font-semibold transition-all duration-300 md:min-w-[140px] md:text-lg"
            onClick={handleSearch}
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
{/* Search Results */}
{search.trim() && (
  <div
    className="w-full max-w-[1140px] rounded-b-2xl border border-t-0 overflow-hidden"
    style={{
      background: "#FFFFFF",
      borderColor: "#A9512C",
    }}
  >
    {loading ? (
      <div className="p-4 text-center text-black">
        Searching...
      </div>
    ) : results.length > 0 ? (
      results.map((item) => (
        <a
          key={item.id}
          href={`/article/${item.slug}`}
          className="block border-b p-4 transition-all hover:bg-[#f5f5f5]"
        >
          <h3 className="font-bold text-[#302C2B]">
            {item.art_title}
          </h3>

          {item.art_subtitle && (
            <p className="mt-1 text-sm text-gray-600">
              {item.art_subtitle}
            </p>
          )}
        </a>
      ))
    ) : (
      <div className="p-4 text-center text-gray-500">
        No results found
      </div>
    )}
  </div>
)}
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