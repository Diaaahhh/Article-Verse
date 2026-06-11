"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/constants/api";
import {
  Laptop,
  FlaskConical,
  HeartPulse,
  GraduationCap,
  Briefcase,
  Music,
  Trophy,
  Utensils,
  Clapperboard,
  Plane,
  BookOpen,
  Landmark,
  Palette,
  Megaphone,
  Scissors,
  Film,
  ChefHat,
  Soup,
  Stethoscope,
  ScrollText,
  LineChart,
  Newspaper,
  Library,
  Sigma,
  Theater,
  Brain,
  Tv,
  PenTool,
} from "lucide-react";

type CategoryType = {
  cat_category: string;
};
type SubcategoryType = {
  cat_subcategory: string;
};
type DeepTopicType = {
  cat_sub_subcategory: string;
};

export default function CategorySection({
  selectedCategory,
  selectedSubcategory,
  selectedDeepTopic,
  setSelectedCategory,
  setSelectedSubcategory,
  setSelectedDeepTopic,
}: any) {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryType[]>([]);
  const [deepTopics, setDeepTopics] = useState<DeepTopicType[]>([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [subcategorySearch, setSubcategorySearch] = useState("");
  const [deepTopicSearch, setDeepTopicSearch] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catRes, subRes, deepRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/category_section`),
          fetch(`${API_BASE_URL}/api/category_section/all-subcategories`),
          fetch(`${API_BASE_URL}/api/category_section/all-deep-topics`),
        ]);

        const categories = await catRes.json();
        const subcategories = await subRes.json();
        const deepTopics = await deepRes.json();

        setCategories(categories);
        setSubcategories(subcategories);
        setDeepTopics(deepTopics);
      } catch (error) {
        console.log(error);
      }
    };

    fetchInitialData();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "technology":
        return <Laptop size={22} />;
      case "science":
        return <FlaskConical size={22} />;
      case "health":
      case "healthcare":
        return <HeartPulse size={22} />;
      case "education":
        return <GraduationCap size={22} />;
      case "business":
        return <Briefcase size={22} />;
      case "music":
        return <Music size={22} />;
      case "sports":
        return <Trophy size={22} />;
      case "food":
        return <Utensils size={22} />;
      case "movie":
      case "cinema":
        return <Clapperboard size={22} />;
      case "travelling":
        return <Plane size={22} />;
      case "books":
      case "literature":
        return <BookOpen size={22} />;
      case "politics":
        return <Landmark size={22} />;
      case "design":
        return <Palette size={22} />;
      case "marketing":
        return <Megaphone size={22} />;
      case "art and craft":
        return <Scissors size={22} />;
      case "cuisine":
        return <ChefHat size={22} />;
      case "culinary":
        return <Soup size={22} />;
      case "history":
        return <ScrollText size={22} />;
      case "investment":
        return <LineChart size={22} />;
      case "journalism":
        return <Newspaper size={22} />;
      case "mathematics":
        return <Sigma size={22} />;
      case "performing arts":
        return <Theater size={22} />;
      case "philosophy":
        return <Library size={22} />;
      case "psychology":
        return <Brain size={22} />;
      case "television":
        return <Tv size={22} />;
      case "writing":
        return <PenTool size={22} />;
      default:
        return <Film size={22} />;
    }
  };

  const fetchSubcategories = async (category: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/category_section/subcategories/${category}`
      );
      const data = await response.json();
      setSubcategories(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDeepTopics = async (subcategory: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/category_section/deep-topics/${subcategory}`
      );
      const data = await response.json();
      setDeepTopics(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubcategorySelect = async (subcategory: string) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/category_section/subcategory/${encodeURIComponent(
        subcategory
      )}`
    );

    const data = await response.json();

    if (!data) return;

    // select category
    setSelectedCategory(data.cat_category);

    // select subcategory
    setSelectedSubcategory(data.cat_subcategory);

    // clear selected deep topic
    setSelectedDeepTopic("");

    // load corresponding deep topics
    await fetchDeepTopics(data.cat_subcategory);
  } catch (error) {
    console.log(error);
  }
};

  const filteredCategories = categories.filter((item) =>
    item.cat_category.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredSubcategories = subcategories.filter((item) =>
    item.cat_subcategory.toLowerCase().includes(subcategorySearch.toLowerCase())
  );

  const filteredDeepTopics = deepTopics.filter((item) =>
    item.cat_sub_subcategory
      .toLowerCase()
      .includes(deepTopicSearch.toLowerCase())
  );

  // Custom scrollbar styles with new theme
  const scrollbarStyles = {
    scrollbarWidth: "thin" as const,
    scrollbarColor: "#D95C2B #2A2A2A",
  };

  return (
    <section
      className="relative w-full overflow-hidden px-4 py-16 md:px-8"
      style={{
        background: "var(--black-rich)",
      }}
    >
      {/* Background Glow Effects with new colours */}
      <div
        className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full blur-3xl"
        style={{
          background: "rgba(217, 92, 43, 0.08)",
        }}
      ></div>

      <div
        className="absolute bottom-[-150px] right-[-100px] h-[350px] w-[350px] rounded-full blur-3xl"
        style={{
          background: "rgba(26, 26, 26, 0.05)",
        }}
      ></div>

      <div
        className="absolute left-[40%] top-[20%] h-[220px] w-[220px] rounded-full blur-3xl"
        style={{
          background: "rgba(217, 92, 43, 0.04)",
        }}
      ></div>

      <div className="relative z-10">
        {/* Section Heading */}
        <div className="mb-8 text-center">
          <h2
            className="text-3xl font-bold md:text-4xl"
            style={{
              color: "var(--text-heading)",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            Explore Categories
          </h2>
        </div>

        {/* 3 Column Layout Wrapper */}
        <div
          className="flex justify-center"
          style={{
            marginBottom: "32px",
          }}
        >
          {/* 3 Column Layout */}
          <div
            className="mx-auto grid w-full max-w-[1400px] grid-cols-1 lg:grid-cols-3 gap-6"
            style={{
              background: "var(--black-warm)", // Warm black (#1E1B1A)
              // borderRadius: "24px",
              padding: "20px",
              marginBottom: "0px",
            }}
          >
            {/* COLUMN 1 - CATEGORIES */}
            <div
              className="rounded-2xl border shadow-lg overflow-hidden flex flex-col"
              style={{
                borderColor: "var(--border-light)",
                background: "var(--black-card)",
                backdropFilter: "blur(14px)",
                padding: "10px",
              }}
            >
              {/* Search Bar */}
              <div className="p-4 pb-0">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full rounded-xl border px-4 py-2 text-sm outline-none"
                  style={{
                    borderColor: "var(--border-light)",
                    backgroundColor: "var(--black-soft)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-3"
                style={{
                  marginTop: "5px",
                }}
              >
                <h3
                  className="text-xl font-bold"
                  style={{
                    color: "var(--text-heading)",
                  }}
                >
                  Categories
                </h3>

                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold shadow-md"
                  style={{
                    backgroundColor: "var(--accent-primary)",
                    color: "#FFFFFF",
                  }}
                >
                  {categories.length}
                </span>
              </div>

              {/* Scrollable List */}
              <div
                className="max-h-[420px] overflow-y-auto space-y-2 px-3 pb-3"
                style={scrollbarStyles}
              >
                {filteredCategories.slice(0, 50).map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
  setSelectedCategory(item.cat_category);
  setSelectedSubcategory("");
  setSelectedDeepTopic("");

  fetchSubcategories(item.cat_category);
}}

                    className="flex cursor-pointer items-center gap-3 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                    style={{
                      borderColor:
                        selectedCategory === item.cat_category
                          ? "var(--accent-primary)"
                          : "var(--border-light)",
                      backgroundColor:
                        selectedCategory === item.cat_category
                          ? "rgba(217, 92, 43, 0.1)"
                          : "var(--black-soft)",
                      boxShadow:
                        selectedCategory === item.cat_category
                          ? "0 0 10px rgba(217, 92, 43, 0.15)"
                          : "none",
                    }}
                  >
                    <div
                      className="flex h-10 w-12 items-center justify-center rounded-xl text-white"
                      style={{
                        background:
                          selectedCategory === item.cat_category
                            ? "var(--gradient-primary)"
                            : "linear-gradient(135deg, #4A6FA5 0%, #2A2A2A 100%)",
                      }}
                    >
                      {getCategoryIcon(item.cat_category)}
                    </div>
                    <div className="flex-1 py-2 pr-2">
                      <h4
                        className="text-base font-semibold"
                        style={{
                          color:
                            selectedCategory === item.cat_category
                              ? "var(--accent-primary)"
                              : "var(--text-primary)",
                        }}
                      >
                        {item.cat_category}
                      </h4>
                    </div>
                  </div>
                ))}
                {filteredCategories.length === 0 && (
                  <div className="text-center py-8">
                    <p
                      className="text-gray-500"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      No categories found
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* COLUMN 2 - SUBCATEGORIES */}
            <div
              className="rounded-2xl border shadow-lg overflow-hidden flex flex-col"
              style={{
                borderColor: "var(--border-light)",
                background: "var(--black-card)",
                backdropFilter: "blur(14px)",
                padding: "10px",
              }}
            >
              {/* Search Bar */}
              <div className="p-4 pb-0">
                <input
                  type="text"
                  placeholder="Search subcategories..."
                  value={subcategorySearch}
                  onChange={(e) => setSubcategorySearch(e.target.value)}
                  className="w-full rounded-xl border px-4 py-2 text-sm outline-none"
                  style={{
                    borderColor: "var(--border-light)",
                    backgroundColor: "var(--black-soft)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-3"
                style={{
                  marginTop: "5px",
                }}
              >
                <h3
                  className="text-xl font-bold"
                  style={{
                    color: "var(--text-heading)",
                  }}
                >
                  Subcategories
                </h3>

                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold shadow-md"
                  style={{
                    backgroundColor: "var(--accent-primary)",
                    color: "#FFFFFF",
                  }}
                >
                  {subcategories.length}
                </span>
              </div>

              {/* Scrollable List */}
              <div
                className="max-h-[420px] overflow-y-auto space-y-2 px-3 pb-3"
                style={scrollbarStyles}
              >
                {filteredSubcategories.length > 0 ? (
                  filteredSubcategories.slice(0, 50).map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleSubcategorySelect(item.cat_subcategory)}
                      className="cursor-pointer rounded-xl border p-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                      style={{
                        borderColor:
                          selectedSubcategory === item.cat_subcategory
                            ? "var(--accent-primary)"
                            : "var(--border-light)",
                        backgroundColor:
                          selectedSubcategory === item.cat_subcategory
                            ? "rgba(217, 92, 43, 0.1)"
                            : "var(--black-soft)",
                        boxShadow:
                          selectedSubcategory === item.cat_subcategory
                            ? "0 0 10px rgba(217, 92, 43, 0.15)"
                            : "none",
                        padding: "10px",
                      }}
                    >
                      <h4
                        className="text-base font-semibold"
                        style={{
                          color: "var(--text-primary)",
                        }}
                      >
                        {item.cat_subcategory}
                      </h4>
                    </div>
                  ))
                ) : (
                  <div className="flex min-h-[300px] items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl">📂</div>
                      <h3
                        className="mt-3 text-xl font-bold"
                        style={{ color: "var(--text-heading)" }}
                      >
                        No Subcategories
                      </h3>
                      <p
                        className="mt-1 text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Select a category to explore
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* COLUMN 3 - DEEP TOPICS */}
            <div
              className="rounded-2xl border shadow-lg overflow-hidden flex flex-col"
              style={{
                borderColor: "var(--border-light)",
                background: "var(--black-card)",
                backdropFilter: "blur(14px)",
                padding: "10px",
              }}
            >
              {/* Search Bar */}
              <div className="p-4 pb-0">
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={deepTopicSearch}
                  onChange={(e) => setDeepTopicSearch(e.target.value)}
                  className="w-full rounded-xl border px-4 py-2 text-sm outline-none"
                  style={{
                    borderColor: "var(--border-light)",
                    backgroundColor: "var(--black-soft)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-3"
                style={{
                  marginTop: "5px",
                }}
              >
                <h3
                  className="text-xl font-bold"
                  style={{
                    color: "var(--text-heading)",
                  }}
                >
                  Deep Topics
                </h3>

                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold shadow-md"
                  style={{
                    backgroundColor: "var(--accent-primary)",
                    color: "#FFFFFF",
                  }}
                >
                  {deepTopics.length}
                </span>
              </div>

              {/* Scrollable List */}
              <div
                className="max-h-[420px] overflow-y-auto space-y-2 px-3 pb-3"
                style={scrollbarStyles}
              >
                {filteredDeepTopics.length > 0 ? (
                  filteredDeepTopics.slice(0, 50).map((item, index) => (
                    <div
                      key={index}
                      onClick={async () => {
                        try {
                          const response = await fetch(
                            `${API_BASE_URL}/api/category_section/deep-topic/${encodeURIComponent(
                              item.cat_sub_subcategory
                            )}`
                          );

                          const data = await response.json();

                          setSelectedCategory(data.cat_category);
                          setSelectedSubcategory(data.cat_subcategory);
                          setSelectedDeepTopic(data.cat_sub_subcategory);

                          fetchSubcategories(data.cat_category);
                          fetchDeepTopics(data.cat_subcategory);
                        } catch (error) {
                          console.log(error);
                        }
                      }}
                      className="cursor-pointer rounded-xl border p-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                      style={{
                        borderColor:
                          selectedDeepTopic === item.cat_sub_subcategory
                            ? "var(--accent-primary)"
                            : "var(--border-light)",
                        backgroundColor:
                          selectedDeepTopic === item.cat_sub_subcategory
                            ? "rgba(217, 92, 43, 0.1)"
                            : "var(--black-soft)",
                        boxShadow:
                          selectedDeepTopic === item.cat_sub_subcategory
                            ? "0 0 10px rgba(217, 92, 43, 0.15)"
                            : "none",
                        padding: "10px",
                      }}
                    >
                      <h4
                        className="text-base font-semibold"
                        style={{
                          color: "var(--text-primary)",
                        }}
                      >
                        {item.cat_sub_subcategory}
                      </h4>
                    </div>
                  ))
                ) : (
                  <div className="flex min-h-[300px] items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl">🧠</div>
                      <h3
                        className="mt-3 text-xl font-bold"
                        style={{ color: "var(--text-heading)" }}
                      >
                        No Deep Topics
                      </h3>
                      <p
                        className="mt-1 text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Select a subcategory to explore
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles - Updated for dark theme */}
      <style jsx>{`
        div::-webkit-scrollbar {
          width: 6px;
        }
        div::-webkit-scrollbar-track {
          background: #2a2a2a;
          border-radius: 10px;
        }
        div::-webkit-scrollbar-thumb {
          background: #d95c2b;
          border-radius: 10px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #1e6b6b;
        }
      `}</style>
    </section>
  );
}
