"use client";

import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import CategorySection from "@/components/CategorySection";
import ContentSection from "@/components/ContentSection";
import Footer from "@/components/Footer";
export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedDeepTopic, setSelectedDeepTopic] = useState("");
  // MODAL STATE FOR CONTENT SECTON
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <main>
      <HeroSection />

      <CategorySection
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        selectedDeepTopic={selectedDeepTopic}
        setSelectedCategory={setSelectedCategory}
        setSelectedSubcategory={setSelectedSubcategory}
        setSelectedDeepTopic={setSelectedDeepTopic}
      />

      <ContentSection
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        selectedDeepTopic={selectedDeepTopic}
        setSelectedArticle={setSelectedArticle}
        setIsModalOpen={setIsModalOpen}
      />
      {/* ✅ GLOBAL MODAL HERE */}
      {isModalOpen && selectedArticle && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-[700px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{
              padding: "35px",
            }}
          >
            <button
              className="absolute top-4 right-4 text-xl font-bold text-gray-500 hover:text-black"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-2" style={{ color: "#302C2B" }}>
              {selectedArticle.art_title}
            </h2>

            {selectedArticle.art_subtitle && (
              <p
                className="text-sm mb-3 font-bold"
                style={{ color: "#5A6869" }}
              >
                {selectedArticle.art_subtitle}
              </p>
            )}

            {selectedArticle.art_image && (
              <img
                src={selectedArticle.art_image}
                alt={selectedArticle.art_title}
                className="mb-4 h-[200px] w-full rounded-xl object-cover"
              />
            )}

            <p className="text-sm leading-relaxed" style={{ color: "#5A6869" }}>
              {selectedArticle.art_text}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
