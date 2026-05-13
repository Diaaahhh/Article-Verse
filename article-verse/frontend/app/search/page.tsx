"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/constants/api";
import {
  Clock,
  TrendingUp,
  BookOpen,
  ExternalLink,
  Share2,
  Copy,
  Check,
  Send,
} from "lucide-react";

type SearchArticle = {
  id: number;
  slug: string;
  art_title: string;
  art_subtitle: string;
  art_text: string;
  art_image: string;
  created_at: string;
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchArticle[]>([]);
  const [loading, setLoading] = useState(true);
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
    article: SearchArticle
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

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

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

  return (
    <div
      className="min-h-screen px-6 py-14"
      style={{
        background: "var(--black-rich)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      {/* Main Container - 1400px max-width centered */}
      <div className="max-w-[1400px] mx-auto"
      style={{
        background: "var(--black-warm)",
          padding: "20px",
      }}>
        
        {/* Heading - Centered */}
        <div className="mb-10 flex justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div
                className="w-1 h-8 rounded-full"
                style={{ background: "var(--gradient-primary)" }}
              ></div>
              <h1
                className="text-l font-extrabold"
                style={{ color: "var(--text-heading)",
                    font: "36px"
                 }}
              >
                Search Results
              </h1>
            </div>
            <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
              Showing results for:
              <span
                className="ml-2 font-semibold"
                style={{ color: "var(--accent-primary)" }}
              >
                {query}
              </span>
            </p>
          </div>
        </div>

        {/* 3-Column Layout - Flex with ads on sides and content in center */}
        <div className="flex justify-center items-start gap-6">
          
          {/* LEFT COLUMN - Advertisement Space (250px) */}
          <div className="hidden lg:block w-[250px] flex-shrink-0 sticky top-24">
            <div className="space-y-6">
              <div
                className="rounded-2xl overflow-hidden border"
                style={{
                  borderColor: "var(--border-light)",
                  background: "var(--black-card)",
                }}
              >
                <div
                  className="p-3 text-center"
                  style={{
                    background: "linear-gradient(to right, var(--black-soft), var(--black-deep))",
                  }}
                >
                  <p className="text-xs uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                    Advertisement
                  </p>
                </div>
                <div className="p-4">
                  <div
                    className="w-full h-[250px] rounded-xl flex flex-col items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, var(--black-soft), var(--black-deep))",
                    }}
                  >
                    <svg className="w-12 h-12 mb-2" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Ad Space</p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>300x250</p>
                  </div>
                </div>
              </div>

              <div
                className="rounded-2xl overflow-hidden border"
                style={{
                  borderColor: "var(--border-light)",
                  background: "var(--black-card)",
                }}
              >
                <div
                  className="p-3 text-center"
                  style={{
                    background: "linear-gradient(to right, var(--black-soft), var(--black-deep))",
                  }}
                >
                  <p className="text-xs uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                    Sponsored
                  </p>
                </div>
                <div className="p-4">
                  <div
                    className="w-full h-[250px] rounded-xl flex flex-col items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, var(--black-warm), var(--black-deep))",
                    }}
                  >
                    <svg className="w-12 h-12 mb-2" style={{ color: "rgba(217,92,43,0.4)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Sponsor Ad</p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>Your Brand Here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* CENTER COLUMN - Search Results */}
          <div className="flex-1 max-w-3xl mx-auto w-full">
            {/* Loading */}
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="spinner"></div>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-5">
                {results.map((article) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.slug}`}
                    className={`group relative rounded-2xl border cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-visible block ${
                      openShareId === article.id ? "z-[999]" : "z-10"
                    }`}
                    style={{
                      borderColor: "var(--border-light)",
                      backgroundColor: "var(--black-soft)",
                    }}
                  >
                    {/* Gradient Border Effect on Hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                      style={{
                        background: "linear-gradient(135deg, rgba(217,92,43,0.1), rgba(30,107,107,0.1))",
                      }}
                    ></div>

                    <div className="relative p-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Image Section */}
                        <div className="flex-shrink-0">
                          {article.art_image ? (
                            <div className="w-24 h-24 rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300">
                              <img
                                src={`${API_BASE_URL}/uploads/${article.art_image}`}
                                alt={article.art_title}
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
                            {/* Title */}
                            <h4
                              className="text-lg font-bold group-hover:text-[var(--accent-primary)] transition-colors duration-300 line-clamp-1"
                              style={{ color: "var(--text-heading)" }}
                            >
                              {article.art_title}
                            </h4>

                            {/* Meta Info */}
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" style={{ color: "var(--text-tertiary)" }} />
                                <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                                  {formatDate(article.created_at)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" style={{ color: "var(--accent-primary)" }} />
                                <span className="text-xs" style={{ color: "var(--accent-primary)" }}>
                                  Featured
                                </span>
                              </div>
                            </div>

                            {/* Subtitle */}
                            {article.art_subtitle && (
                              <p
                                className="mt-2 text-sm font-medium line-clamp-1"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                {article.art_subtitle}
                              </p>
                            )}

                            {/* Text Preview */}
                            <p
                              className="mt-2 text-sm line-clamp-2"
                              style={{ color: "var(--text-tertiary)" }}
                            >
                              {truncateText(article.art_text, 120)}
                            </p>

                            {/* Read More Indicator */}
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
                              onClick={(e) => handleCopy(e, article.slug, article.id)}
                              className="group/share w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg relative overflow-hidden"
                              style={{
                                background: "linear-gradient(135deg, rgba(217,92,43,0.12), rgba(217,92,43,0.06))",
                                border: "1px solid rgba(217,92,43,0.2)",
                              }}
                            >
                              <div className="absolute inset-0 opacity-0 group-hover/share:opacity-100 transition-opacity duration-300"
                                style={{ background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))" }}
                              ></div>
                              {copiedId === article.id ? (
                                <Check className="w-5 h-5 relative z-10 text-green-500" />
                              ) : (
                                <Copy className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover/share:scale-110" style={{ color: "var(--accent-primary)" }} />
                              )}
                            </button>

                            {/* Share Button */}
                            <button
                              onClick={(e) => handleShare(e, article.id)}
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
                            {openShareId === article.id && (
                              <div
                                ref={dropdownRef}
                                className="absolute top-24 right-0 z-[9999] w-56 rounded-2xl p-2 shadow-2xl border backdrop-blur-xl animate-fade-in"
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
                                    onClick={(e) => shareToSocial(e, "facebook", article)}
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:translate-x-1 group/facebook"
                                  >
                                    <div className="w-9 h-9 rounded-full bg-[#1877F2] flex items-center justify-center shadow-md group-hover/facebook:shadow-lg transition-all">
                                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z" />
                                      </svg>
                                    </div>
                                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Facebook</span>
                                  </button>

                                  {/* WhatsApp */}
                                  <button
                                    onClick={(e) => shareToSocial(e, "whatsapp", article)}
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:translate-x-1 group/whatsapp"
                                  >
                                    <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center shadow-md group-hover/whatsapp:shadow-lg transition-all">
                                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22 16.19a8.34 8.34 0 0 1-2.36.65 4.13 4.13 0 0 0 1.81-2.27 8.31 8.31 0 0 1-2.61 1 4.1 4.1 0 0 0-7 3.74 11.65 11.65 0 0 1-8.45-4.29 4.1 4.1 0 0 0 1.27 5.47A4.06 4.06 0 0 1 2.8 19.1a4.1 4.1 0 0 0 3.82 2.85 8.23 8.23 0 0 1-5.1 1.76 8.22 8.22 0 0 1-.98-.06 11.62 11.62 0 0 0 6.29 1.85c7.55 0 11.67-6.25 11.67-11.67 0-.18 0-.36-.01-.53A8.36 8.36 0 0 0 22 16.19z" />
                                      </svg>
                                    </div>
                                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>WhatsApp</span>
                                  </button>

                                  {/* Twitter/X */}
                                  <button
                                    onClick={(e) => shareToSocial(e, "twitter", article)}
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:translate-x-1 group/twitter"
                                  >
                                    <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center shadow-md group-hover/twitter:shadow-lg transition-all">
                                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                      </svg>
                                    </div>
                                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>X (Twitter)</span>
                                  </button>

                                  {/* LinkedIn */}
                                  <button
                                    onClick={(e) => shareToSocial(e, "linkedin", article)}
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:translate-x-1 group/linkedin"
                                  >
                                    <div className="w-9 h-9 rounded-full bg-[#0077B5] flex items-center justify-center shadow-md group-hover/linkedin:shadow-lg transition-all">
                                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C0.792 0 0 0.774 0 1.729v20.542C0 23.227 0.792 24 1.771 24h20.451c0.979 0 1.771-0.773 1.771-1.729V1.729C24 0.774 23.208 0 22.225 0z" />
                                      </svg>
                                    </div>
                                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>LinkedIn</span>
                                  </button>

                                  {/* Instagram */}
                                  <button
                                    onClick={(e) => shareToSocial(e, "instagram", article)}
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:translate-x-1 group/instagram"
                                  >
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center shadow-md group-hover/instagram:shadow-lg transition-all">
                                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8z" />
                                      </svg>
                                    </div>
                                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Instagram</span>
                                  </button>

                                  {/* Telegram */}
                                  <button
                                    onClick={(e) => shareToSocial(e, "telegram", article)}
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:translate-x-1 group/telegram"
                                  >
                                    <div className="w-9 h-9 rounded-full bg-[#0088cc] flex items-center justify-center shadow-md group-hover/telegram:shadow-lg transition-all">
                                      <Send className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Telegram</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              /* No Results */
              <div
                className="flex flex-col items-center justify-center rounded-3xl border py-24 text-center"
                style={{
                  borderColor: "var(--border-light)",
                  backgroundColor: "var(--black-card)",
                }}
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3
                  className="mt-4 text-2xl font-bold"
                  style={{ color: "var(--text-heading)" }}
                >
                  No Results Found
                </h3>
                <p
                  className="mt-2 text-sm max-w-md"
                  style={{ color: "var(--text-secondary)" }}
                >
                  We could not find any articles matching your search. Try different keywords.
                </p>
              </div>
            )}
          </div>
          
          {/* RIGHT COLUMN - Advertisement Space (250px) */}
          <div className="hidden lg:block w-[250px] flex-shrink-0 sticky top-24">
            <div className="space-y-6">
              <div
                className="rounded-2xl overflow-hidden border"
                style={{
                  borderColor: "var(--border-light)",
                  background: "var(--black-card)",
                }}
              >
                <div
                  className="p-3 text-center"
                  style={{
                    background: "linear-gradient(to right, var(--black-soft), var(--black-deep))",
                  }}
                >
                  <p className="text-xs uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                    Advertisement
                  </p>
                </div>
                <div className="p-4">
                  <div
                    className="w-full h-[250px] rounded-xl flex flex-col items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, var(--black-soft), var(--black-deep))",
                    }}
                  >
                    <svg className="w-12 h-12 mb-2" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Ad Space</p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>300x250</p>
                  </div>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div
                className="rounded-2xl p-5 text-center border"
                style={{
                  background: "linear-gradient(135deg, rgba(217,92,43,0.05), rgba(30,107,107,0.05))",
                  borderColor: "var(--border-light)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold" style={{ color: "var(--text-heading)" }}>Newsletter</p>
                <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>Get latest updates</p>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full mt-3 px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                  style={{
                    background: "var(--black-soft)",
                    borderColor: "var(--border-light)",
                    color: "var(--text-primary)",
                  }}
                />
                <button
                  className="mt-2 w-full text-xs px-3 py-1.5 rounded-lg transition-all duration-300 hover:shadow-md"
                  style={{
                    background: "var(--gradient-primary)",
                    color: "white",
                  }}
                >
                  Subscribe
                </button>
              </div>

              <div
                className="rounded-2xl overflow-hidden border"
                style={{
                  borderColor: "var(--border-light)",
                  background: "var(--black-card)",
                }}
              >
                <div
                  className="p-3 text-center"
                  style={{
                    background: "linear-gradient(to right, var(--black-soft), var(--black-deep))",
                  }}
                >
                  <p className="text-xs uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                    Sponsored
                  </p>
                </div>
                <div className="p-4">
                  <div
                    className="w-full h-[250px] rounded-xl flex flex-col items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, var(--black-warm), var(--black-deep))",
                    }}
                  >
                    <svg className="w-12 h-12 mb-2" style={{ color: "rgba(217,92,43,0.4)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Your Ad Here</p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>Contact for rates</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
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