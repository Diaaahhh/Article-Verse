import { Metadata } from "next";
import ArticleClient from "./ArticleClient";
import { API_BASE_URL } from "@/constants/api";
import {siteConfig} from "../../../lib/siteConfig"

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

async function getArticle(slug: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/article/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  
  // IMPORTANT FIX
  const { slug } = await params;

  const article = await getArticle(slug);

  if (!article) {
    return {
      title: "Article Not Found",
      description: "This article does not exist.",
    };
  }

  const articleUrl = `${siteConfig.siteUrl}/article/${article.slug}`;

  const imageUrl = article.art_image
    ? `${API_BASE_URL}/uploads/${article.art_image}`
    : `${API_BASE_URL}/default-image.jpg`;

  return {
    title: article.art_meta_title || article.art_title,

    description:
      article.art_meta_desc ||
      article.art_subtitle ||
      "Read this article on Chulkani.com.",

    keywords: article.art_meta_keywords || "",
alternates: {
    canonical: `/article/${article.slug}`,
  },
    openGraph: {
      title: article.art_meta_title || article.art_title,

      description:
        article.art_meta_desc ||
        article.art_subtitle ||
        "Read this article on Chulkani.com.",

      url: articleUrl,

      siteName: "Chulkani",

      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.art_title,
        },
      ],

      locale: "en_US",

      type: "article",
    },
 other: {
    "ia:markup_url": articleUrl,
    "ia:markup_url_dev": articleUrl,
    "ia:rules_url": articleUrl,
    "ia:rules_url_dev":articleUrl,
    "itemprop:image": imageUrl,
    "article:tag": article.art_tags || "",
  },
    twitter: {
      card: "summary_large_image",

      title: article.art_meta_title || article.art_title,

      description:
        article.art_meta_desc ||
        article.art_subtitle ||
        "Read this article on Chulkani.com.",

      images: [imageUrl],
    },
  };
}

export default function Page() {
  return <ArticleClient />;
}