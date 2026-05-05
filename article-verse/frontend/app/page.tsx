"use client";

import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import CategorySection from "@/components/CategorySection";
import ContentSection from "@/components/ContentSection";

export default function HomePage() {
  const [selectedDeepTopic, setSelectedDeepTopic] = useState("");

  return (
    <main>
      <Navbar />
      <HeroSection />

      <CategorySection setSelectedDeepTopic={setSelectedDeepTopic} />

      <ContentSection selectedDeepTopic={selectedDeepTopic} />
    </main>
  );
}