"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/constants/api";

type ArticleType = {
  id: number;
  art_title: string;
  art_subtitle: string;
  art_text: string;
  art_image: string;
};

export default function ContentSection({
  selectedCategory,
  selectedSubcategory,
  selectedDeepTopic,
  setSelectedArticle,
  setIsModalOpen,
}: {
  selectedCategory: string;
  selectedSubcategory: string;
  selectedDeepTopic: string;
  setSelectedArticle: any;
  setIsModalOpen: any;
}) {
  const [articles, setArticles] = useState<ArticleType[]>([]);
  /*
  |--------------------------------------------------------------------------
  | FETCH ARTICLES
  |--------------------------------------------------------------------------
  */
const truncateText = (text: string, limit: number) => {
  return text.length > limit ? text.substring(0, limit) : text;
};
  useEffect(() => {
    if (!selectedDeepTopic) return;
    console.log("Selected Deep Topic:", selectedDeepTopic);
    fetch(`${API_BASE_URL}/api/content_section/articles/${selectedDeepTopic}`)
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [selectedDeepTopic]);

  return (
    // outmost div
    <div
      className="flex items-center justify-center border shadow-lg px-4"
      style={{
        borderColor: "#D5D4D3",
        background: "rgba(236, 247, 241, 0.75)",
        backdropFilter: "blur(14px)",
      }}
    >
      {/* inner div */}
      <div className="w-full max-w-[1400px] flex flex-col lg:flex-row gap-6"
      style={{
        marginBottom: "48px"
      }}>
        {/* article portion */}
        <div className="w-full lg:w-[70%] flex flex-col">
          {/* Header */}
          <div
            className="mx-auto mb-[20px] mt-4 flex items-center justify-between px-2 py-9"
            style={{
              marginTop: "5px",
              marginBottom: "5px",
            }}
          >
            <h2
  className="text-lg font-bold "
  style={{
    color: "#302C2B",
    marginTop: "10px",
    marginBottom: "15px",
  }}
>
  {selectedCategory || "Category"} {" > "}
  {selectedSubcategory || "Subcategory"} {" > "}
  {selectedDeepTopic || "Topic"}
</h2>
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold shadow-md"
              style={{
                backgroundColor: "#A9512C",
                color: "#FFFFFF",
              }}
            >
              {articles.length}
            </span>
          </div>

          {/* Scrollable List */}
          <div className="w-full max-h-[600px] space-y-4 overflow-y-auto pr-2">
            {articles.length > 0 ? (
              articles.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border  transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  style={{
                    borderColor: "#D5D4D3",
                    backgroundColor: "#FAFAFA",
                    paddingTop: "4px",
                    paddingLeft:"10px",
                    paddingBottom: "5px",
                    marginBottom: "5px"
                  }}
                >
                 
                   {/* Image */}
{item.art_image && (
  <img
    src={item.art_image}
    alt={item.art_title}
    className="mb-3 h-[180px] w-full rounded-xl object-cover border border-[#D5D4D3]"
    
  />
)}

                    {/* Title */}
                    <h4
                      className="text-lg font-bold"
                      style={{ color: "#302C2B" }}
                    >
                      {item.art_title}
                    </h4>
                    {/* Subtitle */}

{item.art_subtitle && (
  <p className="mt-1 text-sm font-bold" style={{ color: "#5A6869" }}>
    {item.art_subtitle}
  </p>
)}

                    
                    

                    {/* Text Preview */}
                    <p className="mt-2 text-sm" style={{ color: "#5A6869" }}>
  {truncateText(item.art_text, 60)}
  
  {item.art_text.length > 60 && (
    <span
  className="ml-2 cursor-pointer font-semibold text-[#A9512C]"
  onClick={() => {
    setSelectedArticle(item);
    setIsModalOpen(true);
  }}
>
  ...see more
</span>
  )}
</p>
                </div>
              ))
            ) : (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl">📰</div>

                  <h3
                    className="mt-4 text-2xl font-bold"
                    style={{ color: "#302C2B" }}
                  >
                    No Articles
                  </h3>

                  <p className="mt-2 text-sm" style={{ color: "#5A6869" }}>
                    Select a deep topic to explore
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* outer div of advertisement */}
        <div className="w-full lg:w-[30%]">
          {/* group of advertisement */}
          <div
            className="rounded-2xl border p-4 h-full sticky top-6"
            style={{
              borderColor: "#D5D4D3",
              backgroundColor: "#FAFAFA",
            }}
          >
            {/* Heading */}
            <h4 className="text-lg font-bold mb-4" style={{ color: "#302C2B" }}>
              Sponsored
            </h4>
            {/* advertisement section */}
            <div className="space-y-4">
              <div className="h-[120px] bg-gray-200 rounded-xl flex items-center justify-center">
                Ad Space 1
              </div>

              <div className="h-[120px] bg-gray-200 rounded-xl flex items-center justify-center">
                Ad Space 2
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> 
  );
}
