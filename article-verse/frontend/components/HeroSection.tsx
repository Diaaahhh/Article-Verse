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
        <div className="relative w-full max-w-[1140px]">
  <div
    className="flex h-[62px] items-center overflow-hidden rounded-sm border-2 bg-white shadow-2xl md:h-[68px] search-container"
    style={{
      borderColor: "#A9512C",
      boxShadow:
        "0 0 10px rgba(169,81,44,0.45), 0 0 25px rgba(169,81,44,0.25)",
    }}
  >
        
          {/* Input - IMPROVED */}
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
            className="h-full flex-1 search-input text-black font-arial "
            style={{
              paddingLeft: "28px",
              paddingRight: "20px",
              backgroundColor: "#FFFFFF",
              color: "#1A1A1A",
              fontSize: "1.1rem",
              fontWeight: "400",
              letterSpacing: "0.3px",
              fontFamily: "Arial, Helvetica, sans-serif",
              outline: "none",
              border: "none",
              minWidth: "0",
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
           {/* Search Results - IMPROVED with enhanced shadow */}
        {search.trim() && (
<div
  className="relative z-[9999] mt-0 rounded-b-2xl border border-t-0 overflow-hidden search-results"
    style={{
      width: "calc(100% - 140px)", // subtract search button width
      background: "#FFFFFF",
      borderColor: "#A9512C",
      boxShadow:
  "0 20px 50px rgba(0,0,0,0.25), 0 10px 30px rgba(169,81,44,0.25), 0 0 0 1px rgba(169,81,44,0.15)",
        padding: "20px",
    }}
  >
            {loading ? (
              <div className="p-4 text-center text-black font-arial" style={{ fontSize: "1rem" }}>
                Searching...
              </div>
            ) : results.length > 0 ? (
              results.map((item) => (
                <a
                  key={item.id}
                  href={`/article/${item.slug}`}
                  className="block border-b px-8 py-7 text-left transition-all hover:bg-[#f5f5f5] search-result-item"
                  style={{
                    padding: "10px"
                  }}
                >
                  <h3 className="font-bold text-[#1A1A1A] font-arial" style={{  fontSize: "1.2rem",
    lineHeight: "1.6", }}>
                    {item.art_title}
                  </h3>

                 
                </a>
              ))
            ) : (
              <div className="p-4 text-center text-[#666] font-arial" style={{ fontSize: "1rem" }}>
                No results found
              </div>
            )}
          </div>
        )}
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