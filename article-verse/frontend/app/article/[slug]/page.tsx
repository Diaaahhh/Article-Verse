import { Metadata } from "next";
import ArticleClient from "./ArticleClient";
import { API_BASE_URL } from "@/constants/api";


interface Props {
  params: {
    slug: string;
  };
}


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


  const article = await getArticle(params.slug);


  if (!article) {
    return {
      title: "Article Not Found",
      description: "This article does not exist.",
    };
  }


  const articleUrl = `${API_BASE_URL}/article/${article.slug}`;


  const imageUrl = article.art_image
    ? `${API_BASE_URL}/uploads/${article.art_image}`
    : `${API_BASE_URL}/default-image.jpg`;


  return {
    title:
      article.art_meta_title || article.art_title,


    description:
      article.art_meta_desc ||
      article.art_subtitle ||
      "Read this article on Article Verse.",


    keywords:
      article.art_meta_keywords || "",


    openGraph: {
      title:
        article.art_meta_title || article.art_title,


      description:
        article.art_meta_desc ||
        article.art_subtitle ||
        "Read this article on Article Verse.",


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


    twitter: {
      card: "summary_large_image",


      title:
        article.art_meta_title || article.art_title,


      description:
        article.art_meta_desc ||
        article.art_subtitle ||
        "Read this article on Article Verse.",


      images: [imageUrl],
    },
  };
}


export default function Page() {
  return <ArticleClient />;
}
