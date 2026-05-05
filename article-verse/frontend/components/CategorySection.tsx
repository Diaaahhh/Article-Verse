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

export default function CategorySection({ setSelectedDeepTopic }: any) {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  // Stores fetched subcategories
  const [subcategories, setSubcategories] = useState<SubcategoryType[]>([]);

  // Stores currently selected category
  const [selectedCategory, setSelectedCategory] = useState("");
  // Stores fetched deep topics
const [deepTopics, setDeepTopics] = useState<DeepTopicType[]>([]);

// Stores selected subcategory
const [selectedSubcategory, setSelectedSubcategory] = useState("");
  /*
  |--------------------------------------------------------------------------
  | FETCH CATEGORY DATA
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/category_section`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  /*
  |--------------------------------------------------------------------------
  | CATEGORY ICONS
  |--------------------------------------------------------------------------
  | Icons are matched based on category name
  |--------------------------------------------------------------------------
  */

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "technology":
        return <Laptop size={26} />;

      case "science":
        return <FlaskConical size={26} />;

      case "health":
      case "healthcare":
        return <HeartPulse size={26} />;

      case "education":
        return <GraduationCap size={26} />;

      case "business":
        return <Briefcase size={26} />;

      case "music":
        return <Music size={26} />;

      case "sports":
        return <Trophy size={26} />;

      case "food":
        return <Utensils size={26} />;

      case "movie":
      case "cinema":
        return <Clapperboard size={26} />;

      case "travelling":
        return <Plane size={26} />;

      case "books":
      case "literature":
        return <BookOpen size={26} />;

      case "politics":
        return <Landmark size={26} />;

      case "design":
        return <Palette size={26} />;

      case "marketing":
        return <Megaphone size={26} />;

      case "art and craft":
        return <Scissors size={26} />;

      case "cuisine":
        return <ChefHat size={26} />;

      case "culinary":
        return <Soup size={26} />;

      case "history":
        return <ScrollText size={26} />;

      case "investment":
        return <LineChart size={26} />;

      case "journalism":
        return <Newspaper size={26} />;

      case "mathematics":
        return <Sigma size={26} />;

      case "performing arts":
        return <Theater size={26} />;

      case "philosophy":
        return <Library size={26} />;

      case "psychology":
        return <Brain size={26} />;

      case "television":
        return <Tv size={26} />;

      case "writing":
        return <PenTool size={26} />;

      default:
        return <Film size={26} />;
    }
  };
  /*
|--------------------------------------------------------------------------
| FETCH SUBCATEGORIES
|--------------------------------------------------------------------------
| Fetches subcategories based on selected category
|--------------------------------------------------------------------------
*/

  const fetchSubcategories = async (category: string) => {
    try {
      // Save selected category
      setSelectedCategory(category);

      // API request
      const response = await fetch(
        `${API_BASE_URL}/api/category_section/subcategories/${category}`
      );

      // Convert to JSON
      const data = await response.json();

      // Save subcategories
      setSubcategories(data);
    } catch (error) {
      console.log(error);
    }
  };
  /*
|--------------------------------------------------------------------------
| FETCH DEEP TOPICS
|--------------------------------------------------------------------------
| Fetches sub-subcategories based on selected subcategory
|--------------------------------------------------------------------------
*/

const fetchDeepTopics = async (subcategory: string) => {
  try {
    // Save selected subcategory
    setSelectedSubcategory(subcategory);

    // API request
    const response = await fetch(
      `${API_BASE_URL}/api/category_section/deep-topics/${subcategory}`
    );

    // Convert response into JSON
    const data = await response.json();

    // Store deep topics
    setDeepTopics(data);
  } catch (error) {
    console.log(error);
  }
};
  return (
    <section
      className="relative w-full overflow-hidden px-4 py-24 md:px-8"
      style={{
        background:
          "linear-gradient(135deg, #F5E6DC 0%, #F1E0D6 45%, #FFFFFF 100%)",
      }}
    >
      {/* Background Glow Effects */}
      <div
        className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full blur-3xl"
        style={{
          background: "rgba(169, 81, 44, 0.10)",
        }}
      ></div>

      <div
        className="absolute bottom-[-150px] right-[-100px] h-[350px] w-[350px] rounded-full blur-3xl"
        style={{
          background: "rgba(48, 44, 43, 0.08)",
        }}
      ></div>

      <div
        className="absolute left-[40%] top-[20%] h-[220px] w-[220px] rounded-full blur-3xl"
        style={{
          background: "rgba(90, 104, 105, 0.06)",
        }}
      ></div>
      <div className="relative z-10 ">
        {/* Section Heading */}
        <div className="mb-10 text-center">
          <h2
            className="text-3xl font-bold md:text-5xl"
            style={{
              color: "#302C2B",
              marginTop: "48px",
              marginBottom: "48px",
            }}
          >
            Explore Categories
          </h2>
        </div>
        {/* 3 Column Layout Wrapper */}
        <div
          className="flex justify-center"
          style={{
            marginBottom: "48px",
          }}
        >
          {/* 3 Column Layout */}
          <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 lg:grid-cols-3 gap-6 ">
            {/* COLUMN 1 */}
            <div
              className="rounded-3xl border p-5 shadow-lg"
              style={{
                borderColor: "#D5D4D3",
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(14px)",
                padding: "15px",
              }}
            >
              {/* Header */}
              <div
                className="mx-auto mb-[20px] mt-4 flex items-center justify-between   px-2 py-9"
                style={{
                  marginTop: "5px",
                  marginBottom: "5px",
                }}
              >
                <h3
                  className="text-2xl font-bold"
                  style={{
                    color: "#302C2B",
                  }}
                >
                  Categories
                </h3>

                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold shadow-md"
                  style={{
                    backgroundColor: "#A9512C",
                    color: "#FFFFFF",
                  }}
                >
                  {categories.length}
                </span>
              </div>

              {/* Scrollable List */}
              <div className="max-h-[600px] space-y-4 overflow-y-auto pr-2 ">
                {categories.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => fetchSubcategories(item.cat_category)}
                    className="flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    style={{
                      borderColor:
                        selectedCategory === item.cat_category
                          ? "#A9512C"
                          : "#D5D4D3",

                      backgroundColor:
                        selectedCategory === item.cat_category
                          ? "#FDF1EB"
                          : "#FAFAFA",

                      marginTop: "10px",

                      boxShadow:
                        selectedCategory === item.cat_category
                          ? "0 0 15px rgba(169,81,44,0.18)"
                          : "none",
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
                      style={{
                        background:
                          selectedCategory === item.cat_category
                            ? "linear-gradient(135deg, #A9512C 0%, #6E3218 100%)"
                            : "linear-gradient(135deg, #e07a52 0%, #302C2B 100%)",
                      }}
                    >
                      {getCategoryIcon(item.cat_category)}
                    </div>

                    {/* Text */}
                    <div>
                      <h4
                        className="text-lg font-semibold"
                        style={{
                          color:
                            selectedCategory === item.cat_category
                              ? "#A9512C"
                              : "#302C2B",
                        }}
                      >
                        {item.cat_category}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 2 */}
            <div
              className="rounded-3xl border p-5 shadow-lg"
              style={{
                borderColor: "#D5D4D3",
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(14px)",
                padding: "15px",
              }}
            >
              {/* Header */}
              <div
                className="mx-auto mb-[20px] mt-4 flex items-center justify-between px-2 py-9"
                style={{
                  marginTop: "5px",
                  marginBottom: "5px",
                }}
              >
                <h3
                  className="text-2xl font-bold"
                  style={{
                    color: "#302C2B",
                  }}
                >
                  Subcategories
                </h3>

                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold shadow-md"
                  style={{
                    backgroundColor: "#A9512C",
                    color: "#FFFFFF",
                  }}
                >
                  {subcategories.length}
                </span>
              </div>

              {/* Scrollable List */}
              <div className="max-h-[600px] space-y-4 overflow-y-auto pr-2">
                {subcategories.length > 0 ? (
                  subcategories.map((item, index) => (
                    <div
  key={index}
  onClick={() => fetchDeepTopics(item.cat_subcategory)}
  className="flex min-h-[60px] cursor-pointer items-center gap-4 rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"

                      style={{
  borderColor:
    selectedSubcategory === item.cat_subcategory
      ? "#A9512C"
      : "#D5D4D3",

  backgroundColor:
    selectedSubcategory === item.cat_subcategory
      ? "#FDF1EB"
      : "#FAFAFA",

  marginTop: "10px",

  paddingLeft: "10px",

  boxShadow:
    selectedSubcategory === item.cat_subcategory
      ? "0 0 15px rgba(169,81,44,0.18)"
      : "none",
}}
                    >
                      {/* Text Section */}
                      <div>
                        <h4
                          className="text-lg font-semibold"
                          style={{
                            color: "#302C2B",
                          }}
                        >
                          {item.cat_subcategory}
                        </h4>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex min-h-[400px] items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl">📂</div>

                      <h3
                        className="mt-4 text-2xl font-bold"
                        style={{
                          color: "#302C2B",
                        }}
                      >
                        No Subcategories
                      </h3>

                      <p
                        className="mt-2 text-sm"
                        style={{
                          color: "#5A6869",
                        }}
                      >
                        Select a category to explore
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

           {/* COLUMN 3 */}
<div
  className="rounded-3xl border p-5 shadow-lg"
  style={{
    borderColor: "#D5D4D3",
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(14px)",
    padding: "15px",
  }}
>
  {/* Header */}
  <div
    className="mx-auto mb-[20px] mt-4 flex items-center justify-between px-2 py-9"
    style={{
      marginTop: "5px",
      marginBottom: "5px",
    }}
  >
    <h3
      className="text-2xl font-bold"
      style={{
        color: "#302C2B",
      }}
    >
      Deep Topics
    </h3>

    <span
      className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold shadow-md"
      style={{
        backgroundColor: "#A9512C",
        color: "#FFFFFF",
      }}
    >
      {deepTopics.length}
    </span>
  </div>

  {/* Scrollable List */}
  <div className="max-h-[600px] space-y-4 overflow-y-auto pr-2">
    {deepTopics.length > 0 ? (
      deepTopics.map((item, index) => (
        <div
          key={index}
          onClick={() =>{ console.log("Clicked:", item.cat_sub_subcategory); setSelectedDeepTopic(item.cat_sub_subcategory)}}
          className="flex min-h-[60px] cursor-pointer items-center gap-4 rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          style={{
            borderColor: "#D5D4D3",
            backgroundColor: "#FAFAFA",
            marginTop: "10px",
            paddingLeft: "10px",
          }}
        >
          {/* Text Section */}
          <div>
            <h4
              className="text-lg font-semibold"
              style={{
                color: "#302C2B",
              }}
            >
              {item.cat_sub_subcategory}
            </h4>
          </div>
        </div>
      ))
    ) : (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="text-5xl">🧠</div>

          <h3
            className="mt-4 text-2xl font-bold"
            style={{
              color: "#302C2B",
            }}
          >
            No Deep Topics
          </h3>

          <p
            className="mt-2 text-sm"
            style={{
              color: "#5A6869",
            }}
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
    </section>
  );
}
