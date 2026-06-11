"use client";

import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import CategorySection from "@/components/CategorySection";
import ContentSection from "@/components/ContentSection";
import Footer from "@/components/Footer";
import { API_BASE_URL } from "@/constants/api";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedDeepTopic, setSelectedDeepTopic] = useState("");
 
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
       
      />
   
    </main>
  );
}
