import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import CategorySection from "@/components/CategorySection";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <CategorySection />
    </main>
  );
}