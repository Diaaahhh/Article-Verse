"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "@/constants/api";
import {
  Calendar,
  ArrowLeft,
  Clock,
  Share2,
  Bookmark,
  Heart,
} from "lucide-react";
import toast from "react-hot-toast";

interface Article {
  id: number;
  slug: string;
  user_id: number;
  art_title: string;
  art_subtitle: string;
  art_text: string;
  art_image: string;
  created_at: string;
  updated_at: string;
  lan_name?: string;
  cat_category?: string;
  cat_subcategory?: string;
  user_name?: string;
user_image?: string;
}

export default function ArticleClient() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/article/${params.slug}`);
        const data = await res.json();
        setArticle(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.slug) {
      fetchArticle();
    }
  }, [params.slug]);

  const readingTime = (text: string) => {
    // Strip HTML tags for accurate word count
    const strippedText = text?.replace(/<[^>]*>/g, '') || '';
    const wordsPerMinute = 200;
    const wordCount = strippedText.split(/\s/g).length || 0;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  // Function to render HTML content with links opening in new tab
 const renderHTMLContent = (htmlContent?: string) => {

  if (!htmlContent) {
    return { __html: "" };
  }

  const processedHtml = htmlContent.replace(
    /<a\s+([^>]*?)href=(["'])(.*?)\2([^>]*)>/gi,
    (match, before, quote, url, after) => {

      // Check if target already exists
      if (before.includes("target=") || after.includes("target=")) {
        return match;
      }

      // Add target="_blank"
      return `<a ${before} href=${quote}${url}${quote} target="_blank" rel="noopener noreferrer" ${after}>`;
    }
  );

  return { __html: processedHtml };
};

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--black-rich)" }}>
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p style={{ color: "var(--text-secondary)" }}>Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--black-rich)" }}>
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-heading)" }}>
            Article Not Found
          </h2>
          <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
            The article you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
            style={{ background: "var(--gradient-primary)", color: "white" }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }
const shareArticle = (platform: string) => {


  if (!article) return;


  const url = encodeURIComponent(
    `${window.location.origin}/article/${article.slug}`
  );


  const title = encodeURIComponent(article.art_title);


  let shareUrl = "";


  switch (platform) {


    case "facebook":
      shareUrl =
        `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      break;


    case "whatsapp":
      shareUrl =
        `https://wa.me/?text=${title}%20${url}`;
      break;



    default:
      return;
  }


  window.open(
    shareUrl,
    "_blank",
    "width=600,height=500"
  );
};

  return (
    <div className="article-page-container">
      
      {/* Absolute positioned Back Button */}
      <div className="article-back-button">
        <button onClick={() => router.back()} className="article-back-btn">
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      {/* Inner container - flex centered */}
      <div className="article-inner-container">
        
        {/* 3-Column Flex Layout */}
        <div className="article-three-columns"
        style={{
          background: "var(--black-warm)",
          padding: "20px",
          marginBottom: "0px"
        }}>
          
          {/* LEFT COLUMN - 250px - Hidden on mobile */}
          <div className="article-left-column">
            <div className="article-sticky-container">
              <div className="ad-card">
                <div className="ad-header">
                  <p className="ad-label">Advertisement</p>
                </div>
                <div className="ad-content">
                  <div className="ad-placeholder">
                    <svg className="ad-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="ad-text">Ad Space</p>
                    <p className="ad-size">300x250</p>
                  </div>
                </div>
              </div>

              <div className="ad-card ad-card-sponsor">
                <div className="ad-header">
                  <p className="ad-label">Sponsored</p>
                </div>
                <div className="ad-content">
                  <div className="ad-placeholder sponsor">
                    <svg className="ad-icon sponsor-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <p className="ad-text">Sponsor Ad</p>
                    <p className="ad-size">Your Brand Here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* CENTER COLUMN - Main Content */}
          <div className="article-center-column">
            
            {/* Centered Image - Responsive */}
            <div className="article-image-wrapper">
              {article.art_image ? (
                <div className="article-image-container">
                  <div className="article-image-glow"></div>
                  <img
                    src={`${API_BASE_URL}/uploads/${article.art_image}`}
                    alt={article.art_title}
                    className="article-image"
                  />
                </div>
              ) : (
                <div className="article-image-placeholder">
                  <div className="text-white text-center">
                    <div className="text-6xl md:text-8xl mb-3 md:mb-4">📖</div>
                    <p className="text-base md:text-xl">Featured Article</p>
                  </div>
                </div>
              )}
            </div>

            {/* Content Card */}
            <div className="article-content-card">
              
              {/* Category Tags */}
              {(article.cat_category || article.lan_name) && (
                <div className="article-tags">
                  {article.cat_category && (
                    <span className="article-tag category-tag">{article.cat_category}</span>
                  )}
                  {article.cat_subcategory && (
                    <span className="article-tag subcategory-tag">{article.cat_subcategory}</span>
                  )}
                  {article.lan_name && (
                    <span className="article-tag language-tag">{article.lan_name}</span>
                  )}
                </div>
              )}

              {/* Title */}
              <h1 
                className="article-title"
                style={{
                  fontSize: "1.3rem",
                  marginBottom: "0.5rem"
                }}
              >
                {article.art_title}
              </h1>

              {/* Subtitle */}
              {article.art_subtitle && (
                <p className="article-subtitle">{article.art_subtitle}</p>
              )}

              {/* Meta Information */}
              <div className="article-meta">
                <div
  className="article-author clickable-author"
  onClick={() => router.push(`/profile/${article.user_id}`)}
>
  <div className="article-avatar">

    {article.user_image ? (

      <img
        src={`${API_BASE_URL}/uploads/profiles/${article.user_image}`}
        alt={article.user_name}
        className="article-avatar-image"
      />

    ) : (

      <span className="article-avatar-text">
        {article.user_name?.charAt(0)}
      </span>

    )}

  </div>

  <div>
    <p className="article-author-name">
      {article.user_name}
    </p>
  </div>
</div>

                <div className="article-date-time">
                  <div className="article-date">
                    <Calendar className="article-icon" />
                    <span>
                      {new Date(article.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="article-time">
                    <Clock className="article-icon" />
                    <span>{readingTime(article.art_text)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="article-actions">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`article-action-btn ${isLiked ? 'liked' : ''}`}
                  >
                    <Heart className={`article-action-icon ${isLiked ? 'filled' : ''}`} />
                  </button>
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`article-action-btn ${isBookmarked ? 'bookmarked' : ''}`}
                  >
                    <Bookmark className={`article-action-icon ${isBookmarked ? 'filled' : ''}`} />
                  </button>
                  <button
                    onClick={() =>
                      navigator.share?.({
                        title: article.art_title,
                        text: article.art_subtitle,
                      })
                    }
                    className="article-action-btn"
                  >
                    <Share2 className="article-action-icon" />
                  </button>
                </div>
              </div>

              {/* Article Content - Renders HTML with formatting, links open in new tab, and prevents copying */}
              <div 
                className="article-content"
                style={{
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  MozUserSelect: "none",
                  msUserSelect: "none",
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  toast.error("Content copying is disabled");
                  return false;
                }}
                onCopy={(e) => {
                  e.preventDefault();
                  toast.error("Copying content is disabled");
                  return false;
                }}
                onCut={(e) => {
                  e.preventDefault();
                  toast.error("Cutting content is disabled");
                  return false;
                }}
                onDragStart={(e) => {
                  e.preventDefault();
                  return false;
                }}
              >
                <div 
                  dangerouslySetInnerHTML={renderHTMLContent(article.art_text)}
                  style={{
                    lineHeight: "1.8",
                    color: "var(--text-primary)",
                  }}
                  className="article-html-content"
                />
              </div>

              {/* Divider */}
              <div className="article-divider"></div>

              {/* Share Section */}
              <div className="article-share-section">
                <p className="article-share-label">Share this article</p>
                <div className="article-share-buttons">
                  <button
  className="share-btn facebook"
  onClick={() => shareArticle("facebook")}
>

                    <svg className="share-icon" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z" />
                    </svg>
                  </button>
                  <button
  className="share-btn whatsapp"
  onClick={() => shareArticle("whatsapp")}
>

                    <svg className="share-icon" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 16.19a8.34 8.34 0 0 1-2.36.65 4.13 4.13 0 0 0 1.81-2.27 8.31 8.31 0 0 1-2.61 1 4.1 4.1 0 0 0-7 3.74 11.65 11.65 0 0 1-8.45-4.29 4.1 4.1 0 0 0 1.27 5.47A4.06 4.06 0 0 1 2.8 19.1a4.1 4.1 0 0 0 3.82 2.85 8.23 8.23 0 0 1-5.1 1.76 8.22 8.22 0 0 1-.98-.06 11.62 11.62 0 0 0 6.29 1.85c7.55 0 11.67-6.25 11.67-11.67 0-.18 0-.36-.01-.53A8.36 8.36 0 0 0 22 16.19z" />
                    </svg>
                  </button>
                  <button className="share-btn instagram">
                    <svg className="share-icon" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* RIGHT COLUMN - 250px - Hidden on mobile */}
          <div className="article-right-column">
            <div className="article-sticky-container">
              <div className="ad-card">
                <div className="ad-header">
                  <p className="ad-label">Advertisement</p>
                </div>
                <div className="ad-content">
                  <div className="ad-placeholder">
                    <svg className="ad-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="ad-text">Ad Space</p>
                    <p className="ad-size">300x250</p>
                  </div>
                </div>
              </div>

              <div className="newsletter-card">
                <div className="newsletter-icon">
                  <svg className="newsletter-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="newsletter-title">Newsletter</p>
                <p className="newsletter-subtitle">Get latest updates</p>
                <input type="email" placeholder="Your email" className="newsletter-input" />
                <button className="newsletter-button">Subscribe</button>
              </div>

              <div className="ad-card ad-card-sponsor-bottom">
                <div className="ad-header">
                  <p className="ad-label">Sponsored</p>
                </div>
                <div className="ad-content">
                  <div className="ad-placeholder sponsor-bottom">
                    <svg className="ad-icon sponsor-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <p className="ad-text">Your Ad Here</p>
                    <p className="ad-size">Contact for rates</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}