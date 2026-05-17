"use client";

import { useEffect, useState, useRef } from "react";
import { API_BASE_URL } from "@/constants/api";
import { useRouter } from "next/navigation";
import {
  Share2,
  Copy,
  Check,
  ExternalLink,
  TrendingUp,
  BookOpen,
  Clock,
  Send,
} from "lucide-react";

type ArticleType = {
  id: number;
  slug: string;
  art_title: string;
  art_subtitle: string;
  art_text: string;
  art_image: string;
  created_at: string;
  lan_id: number;
};
type LanguageType = {
  id: number;
  lan_name: string;
};

export default function ContentSection({
  selectedCategory,
  selectedSubcategory,
  selectedDeepTopic,
}: {
  selectedCategory: string;
  selectedSubcategory: string;
  selectedDeepTopic: string;
}) {
  const router = useRouter();
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [languages, setLanguages] = useState<LanguageType[]>([]);
const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [openShareId, setOpenShareId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const getArticleUrl = (slug: string) => {
    return `${window.location.origin}/article/${slug}`;
  };

  const handleCopy = async (e: React.MouseEvent, slug: string, id: number) => {
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(getArticleUrl(slug));
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleShare = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setOpenShareId((prev) => (prev === id ? null : id));
  };

  const shareToSocial = (
    e: React.MouseEvent,
    platform: string,
    article: ArticleType
  ) => {
    e.stopPropagation();

    const url = encodeURIComponent(getArticleUrl(article.slug));
    const title = encodeURIComponent(article.art_title);

    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${title}%20${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case "instagram":
        // Instagram doesn't support direct sharing via URL
        navigator.clipboard.writeText(getArticleUrl(article.slug));
        alert("Link copied! You can now paste it on Instagram.");
        setOpenShareId(null);
        return;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${url}&text=${title}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=500");
    setOpenShareId(null);
  };

  const truncateText = (text: string, limit: number) => {
  // Remove HTML tags
  const plainText = text
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return plainText.length > limit
    ? plainText.substring(0, limit) + "..."
    : plainText;
};

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleArticleClick = (article: ArticleType) => {
    router.push(`/article/${article.slug}`);
  };

  useEffect(() => {
  const fetchArticles = async () => {
    try {
      let url = "";

      // If no category/topic selected → show latest 10 articles
      if (!selectedDeepTopic) {
        url = `${API_BASE_URL}/api/content_section/latest`;
      } else {
        // Otherwise show topic articles
        url = `${API_BASE_URL}/api/content_section/articles/${selectedDeepTopic}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      setArticles(data);
      setSelectedLanguage("all");
    } catch (error) {
      console.log(error);
    }
  };

  fetchArticles();
}, [selectedDeepTopic]);

  // Close share dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenShareId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
  fetch(`${API_BASE_URL}/api/languages`)
    .then((res) => res.json())
    .then((data) => {
      setLanguages(data);
    })
    .catch((error) => {
      console.log(error);
    });
}, []);

const filteredArticles =
  selectedLanguage === "all"
    ? articles
    : articles.filter(
        (article) => article.lan_id === Number(selectedLanguage)
      );

  return (
    <div
      className="flex items-center justify-center px-4"
      style={{
        background: "var(--black-card)",
        backdropFilter: "blur(14px)",
      }}
    >
      <div
        className="w-full max-w-[1400px] flex flex-col lg:flex-row gap-6"
        style={{
          background: "var(--black-warm)",
          padding: "20px",
        }}
      >
        {/* Article Portion */}
        <div className="w-full lg:w-[70%] flex flex-col">
          {/* Header */}
          <div className="mx-auto mb-6 flex items-center justify-between"
          style={{
            marginBottom: "3px"
          }}>
            <div className="flex items-center gap-3">
              <div
                className="w-1 h-8 rounded-full"
                style={{ background: "var(--gradient-primary)" }}
              ></div>
              <h2
                className="text-xl font-bold"
                style={{ color: "var(--text-heading)" }}
              >
                {selectedCategory || "Category"} <span className="text-[var(--accent-primary)]">/</span>{" "}
                {selectedSubcategory || "Subcategory"} <span className="text-[var(--accent-primary)]">/</span>{" "}
                {selectedDeepTopic || "Topic"}
              </h2>
            </div>
            <div className="flex items-center gap-3">
  {/* Language Selector */}
  <div className="relative">
    <select
      value={selectedLanguage}
      onChange={(e) => setSelectedLanguage(e.target.value)}
      disabled={articles.length === 0}
      className={`px-4 py-2 rounded-xl border text-sm font-medium outline-none transition-all duration-300 ${
        articles.length === 0
          ? "opacity-50 cursor-not-allowed"
          : "hover:scale-[1.02]"
      }`}
      style={{
        background: "var(--black-soft)",
        borderColor: "var(--border-light)",
        color: "var(--text-primary)",
      }}
    >
      <option value="all">All Languages</option>

      {languages.map((language) => (
        <option key={language.id} value={language.id}>
          {language.lan_name}
        </option>
      ))}
    </select>
  </div>

  {/* Count */}
  <div
    className="flex items-center justify-center w-10 h-10 rounded-full shadow-lg"
    style={{
      background: "var(--gradient-primary)",
    }}
  >
    <span className="text-white font-bold text-sm">
      {filteredArticles.length}
    </span>
  </div>
</div>
          </div>

          {/* Scrollable List - Enhanced Cards */}
<div className="w-full max-h-[600px] overflow-y-auto overflow-x-visible pr-2 custom-scrollbar">
  {filteredArticles.length > 0 ? (
    <div className="space-y-5 pr-4">
      {filteredArticles.map((item) => (
        <div
          key={item.id}
          onClick={() => handleArticleClick(item)}
          className={`group relative rounded-2xl border cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-visible ${
            openShareId === item.id ? "z-[999]" : "z-10"
          }`}
          style={{
            borderColor: "var(--border-light)",
            backgroundColor: "var(--black-soft)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "5px",
            gap: "5px"
          }}
        >
          {/* Image Section */}
                      <div className="flex-shrink-0">
                        {item.art_image ? (
                          <div className="w-24 h-24 rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300">
                            <img
                              src={`${API_BASE_URL}/uploads/${item.art_image}`}
                              alt={item.art_title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        ) : (
                          <div
                            className="w-24 h-24 rounded-xl flex items-center justify-center shadow-md"
                            style={{
                              background: "linear-gradient(135deg, rgba(217,92,43,0.15), rgba(30,107,107,0.15))",
                            }}
                          >
                            <BookOpen className="w-10 h-10" style={{ color: "var(--accent-primary)" }} />
                          </div>
                        )}
                      </div>


                      {/* Content Section */}
                      <div className="flex-1 min-w-0 flex flex-col sm:flex-row justify-between gap-4">
                        {/* Left Content */}
                        <div className="flex-1">
                          <h4
                            className="text-lg font-bold group-hover:text-[var(--accent-primary)] transition-colors duration-300 line-clamp-1"
                            style={{ color: "var(--text-heading)" }}
                          >
                            {item.art_title}
                          </h4>


                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" style={{ color: "var(--text-tertiary)" }} />
                              <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                                {formatDate(item.created_at)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" style={{ color: "var(--accent-primary)" }} />
                              <span className="text-xs" style={{ color: "var(--accent-primary)" }}>
                                Featured
                              </span>
                            </div>
                          </div>


                          {item.art_subtitle && (
                            <p
                              className="mt-2 text-sm font-medium line-clamp-1"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              {item.art_subtitle}
                            </p>
                          )}


                          <p
                            className="mt-2 text-sm line-clamp-2"
                            style={{ color: "var(--text-tertiary)" }}
                          >
                            {truncateText(item.art_text, 120)}
                          </p>


                          <div className="mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-2">
                            <span
                              className="text-xs font-semibold"
                              style={{ color: "var(--accent-primary)" }}
                            >
                              Read full article
                            </span>
                            <ExternalLink className="w-3 h-3" style={{ color: "var(--accent-primary)" }} />
                          </div>
                        </div>


                        {/* Share Actions */}
                        <div
                          className="relative flex flex-col items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Copy Link Button */}
                          <button
                            onClick={(e) => handleCopy(e, item.slug, item.id)}
                            className="group/share w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg relative overflow-hidden"
                            style={{
                              background: "linear-gradient(135deg, rgba(217,92,43,0.12), rgba(217,92,43,0.06))",
                              border: "1px solid rgba(217,92,43,0.2)",
                            }}
                          >
                            <div className="absolute inset-0 opacity-0 group-hover/share:opacity-100 transition-opacity duration-300"
                              style={{ background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))" }}
                            ></div>
                            {copiedId === item.id ? (
                              <Check className="w-5 h-5 relative z-10 text-green-500" />
                            ) : (
                              <Copy className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover/share:scale-110" style={{ color: "var(--accent-primary)" }} />
                            )}
                          </button>


                          {/* Share Button */}
                          <button
                            onClick={(e) => handleShare(e, item.id)}
                            className="group/share w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg relative overflow-hidden"
                            style={{
                              background: "linear-gradient(135deg, rgba(30,107,107,0.12), rgba(30,107,107,0.06))",
                              border: "1px solid rgba(30,107,107,0.2)",
                            }}
                          >
                            <div className="absolute inset-0 opacity-0 group-hover/share:opacity-100 transition-opacity duration-300"
                              style={{ background: "linear-gradient(135deg, var(--accent-secondary), var(--accent-primary))" }}
                            ></div>
                            <Share2 className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover/share:rotate-12" style={{ color: "var(--accent-secondary)" }} />
                          </button>


                          {/* Share Dropdown */}
                          {openShareId === item.id && (
                            <div
                              ref={dropdownRef}
                              className="absolute top-24 right-0 z-50 w-56 rounded-2xl p-2 shadow-2xl border backdrop-blur-xl animate-fade-in"
                              style={{
                                background: "rgba(26,26,26,0.98)",
                                borderColor: "var(--border-light)",
                                backdropFilter: "blur(20px)",
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="p-2 border-b" style={{ borderColor: "var(--border-light)" }}>
                                <p className="text-xs font-medium text-center" style={{ color: "var(--text-secondary)" }}>
                                  Share via
                                </p>
                              </div>
                              <div className="flex flex-col gap-1 p-2">
                                {/* Facebook */}
                                <button
                                  onClick={(e) => shareToSocial(e, "facebook", item)}
                                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:translate-x-1 group/facebook"
                                >
                                  <div className="w-9 h-9 rounded-full bg-[#1877F2] flex items-center justify-center shadow-md group-hover/facebook:shadow-lg transition-all">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z" />
                                    </svg>
                                  </div>
                                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                                    Facebook
                                  </span>
                                </button>


                                {/* WhatsApp */}
                                <button
                                  onClick={(e) => shareToSocial(e, "whatsapp", item)}
                                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:translate-x-1 group/whatsapp"
                                >
                                  <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center shadow-md group-hover/whatsapp:shadow-lg transition-all">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M22 16.19a8.34 8.34 0 0 1-2.36.65 4.13 4.13 0 0 0 1.81-2.27 8.31 8.31 0 0 1-2.61 1 4.1 4.1 0 0 0-7 3.74 11.65 11.65 0 0 1-8.45-4.29 4.1 4.1 0 0 0 1.27 5.47A4.06 4.06 0 0 1 2.8 19.1a4.1 4.1 0 0 0 3.82 2.85 8.23 8.23 0 0 1-5.1 1.76 8.22 8.22 0 0 1-.98-.06 11.62 11.62 0 0 0 6.29 1.85c7.55 0 11.67-6.25 11.67-11.67 0-.18 0-.36-.01-.53A8.36 8.36 0 0 0 22 16.19z" />
                                    </svg>
                                  </div>
                                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                                    WhatsApp
                                  </span>
                                </button>


                                {/* Twitter/X */}
                                <button
                                  onClick={(e) => shareToSocial(e, "twitter", item)}
                                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:translate-x-1 group/twitter"
                                >
                                  <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center shadow-md group-hover/twitter:shadow-lg transition-all">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                  </div>
                                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                                    X (Twitter)
                                  </span>
                                </button>


                                {/* LinkedIn */}
                                <button
                                  onClick={(e) => shareToSocial(e, "linkedin", item)}
                                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:translate-x-1 group/linkedin"
                                >
                                  <div className="w-9 h-9 rounded-full bg-[#0077B5] flex items-center justify-center shadow-md group-hover/linkedin:shadow-lg transition-all">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C0.792 0 0 0.774 0 1.729v20.542C0 23.227 0.792 24 1.771 24h20.451c0.979 0 1.771-0.773 1.771-1.729V1.729C24 0.774 23.208 0 22.225 0z" />
                                    </svg>
                                  </div>
                                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                                    LinkedIn
                                  </span>
                                </button>


                                {/* Instagram */}
                                <button
                                  onClick={(e) => shareToSocial(e, "instagram", item)}
                                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:translate-x-1 group/instagram"
                                >
                                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center shadow-md group-hover/instagram:shadow-lg transition-all">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8z" />
                                    </svg>
                                  </div>
                                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                                    Instagram
                                  </span>
                                </button>


                                {/* Telegram */}
                                <button
                                  onClick={(e) => shareToSocial(e, "telegram", item)}
                                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:translate-x-1 group/telegram"
                                >
                                  <div className="w-9 h-9 rounded-full bg-[#0088cc] flex items-center justify-center shadow-md group-hover/telegram:shadow-lg transition-all">
                                    <Send className="w-4 h-4 text-white" />
                                  </div>
                                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                                    Telegram
                                  </span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

        </div>
      ))}
    </div>
  ) : (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">📰</div>

        <h3
          className="mt-4 text-2xl font-bold"
          style={{ color: "var(--text-heading)" }}
        >
          No Articles
        </h3>

        <p
  className="mt-2 text-sm"
  style={{ color: "var(--text-secondary)" }}
>
  No articles available right now
</p>
      </div>
    </div>
  )}
</div>

        </div>

        {/* Advertisement Portion */}
        <div className="w-full lg:w-[30%]">
          <div
            className="rounded-2xl border p-4 h-full sticky top-6"
            style={{
              borderColor: "var(--border-light)",
              backgroundColor: "var(--black-card)",
            }}
          >
            <h4
              className="text-lg font-bold mb-4 flex items-center gap-2"
              style={{ color: "var(--text-heading)" }}
            >
              <span className="w-1 h-5 rounded-full" style={{ background: "var(--accent-primary)" }}></span>
              Sponsored
            </h4>
            <div className="space-y-4">
              <div
                className="h-[120px] rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, var(--black-soft), var(--black-deep))",
                  color: "var(--text-tertiary)",
                }}
              >
                <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Ad Space 1</span>
              </div>
              <div
                className="h-[120px] rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, var(--black-soft), var(--black-deep))",
                  color: "var(--text-tertiary)",
                }}
              >
                <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm font-medium">Ad Space 2</span>
              </div>
              <div
                className="h-[120px] rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, var(--black-soft), var(--black-deep))",
                  color: "var(--text-tertiary)",
                }}
              >
                <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v13m0-13V6.5a1.5 1.5 0 112 0V7m-2 1h2m0 0v2m0-2h-2" />
                </svg>
                <span className="text-sm font-medium">Ad Space 3</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--black-soft);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--accent-primary);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--accent-secondary);
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}