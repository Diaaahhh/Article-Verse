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

export default function ContentSection({ selectedDeepTopic }: { selectedDeepTopic: string }) {
  const [articles, setArticles] = useState<ArticleType[]>([]);

  /*
  |--------------------------------------------------------------------------
  | FETCH ARTICLES
  |--------------------------------------------------------------------------
  */

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
<div
      className=" border p-5 shadow-lg"
      style={{
        borderColor: "#D5D4D3",
background: "rgba(236, 247, 241, 0.75)",        backdropFilter: "blur(14px)",
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
        <h3 className="text-2xl font-bold" style={{ color: "#302C2B" }}>
          Articles
        </h3>

        <span
          className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold shadow-md"
          style={{
            backgroundColor: "#A9512C",
            color: "#FFFFFF",
          }}
        >
          {articles.length}
        </span>
      </div>

      {/* Scrollable List */}
      <div className="mx-auto w-full max-w-[1400px] max-h-[600px] space-y-4 overflow-y-auto px-2 sm:px-4 md:px-6 lg:px-8">
        {articles.length > 0 ? (
          articles.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{
                borderColor: "#D5D4D3",
                backgroundColor: "#FAFAFA",
              }}
            >
              {/* Image */}
              {item.art_image && (
                <img
                  src={item.art_image}
                  alt={item.art_title}
                  className="mb-3 h-[180px] w-full rounded-xl object-cover"
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
                <p
                  className="mt-1 text-sm"
                  style={{ color: "#5A6869" }}
                >
                  {item.art_subtitle}
                </p>
              )}

              {/* Text Preview */}
              <p
                className="mt-2 text-sm line-clamp-3"
                style={{ color: "#5A6869" }}
              >
                {item.art_text}
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

              <p
                className="mt-2 text-sm"
                style={{ color: "#5A6869" }}
              >
                Select a deep topic to explore
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
    
  );
}