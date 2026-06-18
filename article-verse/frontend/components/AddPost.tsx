"use client";

import React, { useState, KeyboardEvent, useEffect } from "react";
import { API_BASE_URL } from "@/constants/api";
import toast from "react-hot-toast";
import slugify from "slugify";
import { useSearchParams } from "next/navigation";
import Cropper from "react-easy-crop";
import TiptapEditor from "./editor/TiptapEditor";
import Select from "react-select";
import ReCAPTCHA from "react-google-recaptcha";

export default function AddPost() {
  const [captchaToken, setCaptchaToken] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [articleTags, setArticleTags] = useState<string[]>([]);
  const [articleTagInput, setArticleTagInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [categorySuggestion, setCategorySuggestion] =
  useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [croppedImageSize, setCroppedImageSize] = useState<number | null>(null);
  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [languages, setLanguages] = useState<any[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const searchParams = useSearchParams();
  const articleId = searchParams.get("id");
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedDeepTopic, setSelectedDeepTopic] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [deepTopics, setDeepTopics] = useState<any[]>([]);
  const [imageError, setImageError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<any>({});
  // Title validation function - accepts letters, spaces, and numbers 0-9
  const validateTitle = (value: string) => {
    const regex = /^[a-zA-Z0-9\s]*$/;
    if (!regex.test(value)) {
      setTitleError(
        "Only letters (a-z, A-Z), numbers (0-9), and spaces are allowed"
      );
      return false;
    }
    setTitleError("");
    return true;
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length > 60) {
      setTitleError("Title cannot exceed 60 characters");
      return;
    }

    setTitle(value);
    setTitleError("");
  };

  const handleSubtitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const urlRegex = /(https?:\/\/|www\.|\.com|\.net|\.org|\.io|\.co)/i;

    if (urlRegex.test(value)) {
      return;
    }

    if (value.length > 160) {
      return;
    }

    setSubtitle(value);
    setMetaDesc(value);
  };
  const handleCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };
  const getCroppedImage = async () => {
    if (!imagePreview || !croppedAreaPixels) return null;

    const image = new Image();

    image.src = imagePreview;

    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = document.createElement("canvas");

    canvas.width = 850;
    canvas.height = 300;

    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    ctx.drawImage(
      image,

      croppedAreaPixels.x,
      croppedAreaPixels.y,

      croppedAreaPixels.width,
      croppedAreaPixels.height,

      0,
      0,

      850,
      300
    );

    return new Promise<File | null>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(null);
            return;
          }

          const file = new File([blob], "featured.jpg", {
            type: "image/jpeg",
          });

          setCroppedImageSize(file.size);

          resolve(file);
        },
        "image/jpeg",
        0.8
      );
    });
  };
  const handleSubmit = async () => {
    try {
      if (!captchaToken) {
        toast.error("Please complete reCAPTCHA");
        return;
      }
      const errors: any = {};

      if (!title.trim()) {
        errors.title = "Title is required";
      }

      const finalContent = content;

      if (!selectedLanguage) {
        errors.language = "Please select a language";
      }

      if (!selectedCategory) {
        errors.category = "Please select a category";
      }

      if (!selectedSubcategory) {
        errors.subcategory = "Please select a subcategory";
      }

      if (!selectedDeepTopic) {
        errors.deepTopic = "Please select a deep topic";
      }

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
      const parser = new DOMParser();

      const doc = parser.parseFromString(finalContent, "text/html");

      const imageElements = doc.querySelectorAll("img");

      const editorImages = Array.from(imageElements)
        .map((img) => img.getAttribute("src"))
        .filter(Boolean)
        .slice(0, 4);
      setFieldErrors({});
      const formData = new FormData();

      const slug = slugify(title, {
        lower: true,
        strict: true,
      });

      formData.append("title", title);
      formData.append("slug", slug);
      formData.append("subtitle", subtitle);
      formData.append("content", finalContent);
      formData.append("editorImages", JSON.stringify(editorImages));
      formData.append("metaTitle", metaTitle);
      formData.append("metaDesc", metaDesc);
      formData.append("metaKeywords", JSON.stringify(tags));
      formData.append("art_tags", articleTags.join(","));
      formData.append("languageId", selectedLanguage);
      formData.append("category", selectedCategory);
      formData.append("subcategory", selectedSubcategory);
      formData.append("deepTopic", selectedDeepTopic);
      formData.append("captchaToken", captchaToken);
      formData.append("categorySuggestion",categorySuggestion);

      if (articleId) {
        formData.append("articleId", articleId);
      }

      if (imagePreview) {
        const croppedFile = await getCroppedImage();

        if (croppedFile) {
          formData.append("image", croppedFile);
        }
      }

      const res = await fetch(`${API_BASE_URL}/api/add-post`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (res.status === 201) {
        toast.success("Post submitted successfully 🚀");

        setTitle("");
        setSubtitle("");
        setContent("");

        setMetaTitle("");
        setMetaDesc("");

        setTags([]);
        setTagInput("");

        setArticleTags([]);
        setArticleTagInput("");

        setImage(null);
        setImagePreview(null);

        setSelectedLanguage("");
        setSelectedCategory("");
        setSelectedSubcategory("");
        setSelectedDeepTopic("");

        setSubcategories([]);
        setDeepTopics([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Server error");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      const value = tagInput.trim().replace(/,/g, "");
      if (value && tags.length < 10 && !tags.includes(value)) {
        setTags([...tags, value]);
        setTagInput("");
      }
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const fetchLanguages = async () => {
    const res = await fetch(`${API_BASE_URL}/api/languages`);
    const data = await res.json();
    setLanguages(data);
  };

  const fetchCategoryData = async () => {
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
  const fetchArticle = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/article/edit/${articleId}`, {
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        const article = data.article;

        setTitle(article.art_title || "");

        setSubtitle(article.art_subtitle || "");

        setContent(article.art_text || "");

        setMetaTitle(article.meta_title || "");

        setMetaDesc(article.meta_description || "");

        setSelectedLanguage(article.language_id || "");

        setSelectedCategory(article.category || "");

        setSelectedSubcategory(article.subcategory || "");

        setSelectedDeepTopic(article.deep_topic || "");

        if (article.meta_keywords) {
          setTags(article.meta_keywords.split(","));
        }

        if (article.art_tags) {
          setArticleTags(article.art_tags.split(","));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkOwnership = async () => {
    try {
      if (!articleId || !loggedInUserId) return;

      const res = await fetch(`${API_BASE_URL}/api/article/edit/${articleId}`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error("Article not found");
        return;
      }

      if (data.article.user_id !== loggedInUserId) {
        toast.error("Unauthorized access");

        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/profile`, {
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setLoggedInUserId(data.user.id);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const addArticleTag = (tag: string) => {
    const cleanTag = tag.trim();

    if (
      cleanTag &&
      !articleTags.includes(cleanTag) &&
      articleTags.length < 20
    ) {
      setArticleTags([...articleTags, cleanTag]);
    }
  };

  const removeArticleTag = (index: number) => {
    setArticleTags(articleTags.filter((_, i) => i !== index));
  };

  const handleArticleTagKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();

      addArticleTag(articleTagInput);

      setArticleTagInput("");
    }
  };
  useEffect(() => {
    if (articleId && loggedInUserId) {
      checkOwnership();

      fetchArticle();
    }
  }, [articleId, loggedInUserId]);

  useEffect(() => {
    fetchLanguages();
    fetchCategoryData();
    fetchCurrentUser();
  }, []);
  useEffect(() => {
    const updateSize = async () => {
      if (!imagePreview || !croppedAreaPixels) return;

      const file = await getCroppedImage();

      if (file) {
        setCroppedImageSize(file.size);
      }
    };

    updateSize();
  }, [crop, zoom, croppedAreaPixels]);

  const handleCategoryChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const categoryValue = e.target.value;
    setSelectedCategory(categoryValue);
    setSelectedSubcategory("");
    setSelectedDeepTopic("");
    setDeepTopics([]);

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/category_section/subcategories/${categoryValue}`
      );
      const data = await res.json();
      setSubcategories(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubcategoryChange = async (subcategoryValue: string) => {
    try {
      const lookupRes = await fetch(
        `${API_BASE_URL}/api/category_section/subcategory/${encodeURIComponent(
          subcategoryValue
        )}`
      );

      const lookupData = await lookupRes.json();

      if (!lookupData) return;

      setSelectedCategory(lookupData.cat_category);
      setSelectedSubcategory(subcategoryValue);
      setSelectedDeepTopic("");

      const subRes = await fetch(
        `${API_BASE_URL}/api/category_section/subcategories/${lookupData.cat_category}`
      );

      const subData = await subRes.json();

      setSubcategories(subData);

      const deepRes = await fetch(
        `${API_BASE_URL}/api/category_section/deep-topics/${subcategoryValue}`
      );

      const deepData = await deepRes.json();

      setDeepTopics(deepData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeepTopicChange = async (deepTopicValue: string) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/category_section/deep-topic/${encodeURIComponent(
          deepTopicValue
        )}`
      );

      const data = await res.json();

      if (!data) return;

      // Auto-select all three
      setSelectedCategory(data.cat_category);
      setSelectedSubcategory(data.cat_subcategory);
      setSelectedDeepTopic(data.cat_sub_subcategory);

      // Load subcategories of selected category
      const subRes = await fetch(
        `${API_BASE_URL}/api/category_section/subcategories/${encodeURIComponent(
          data.cat_category
        )}`
      );

      const subData = await subRes.json();

      setSubcategories(subData);

      // Load deep topics of selected subcategory
      const deepRes = await fetch(
        `${API_BASE_URL}/api/category_section/deep-topics/${encodeURIComponent(
          data.cat_subcategory
        )}`
      );

      const deepData = await deepRes.json();

      setDeepTopics(deepData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setImage(null);
      setImagePreview(null);
      setShowCropper(false);
      return;
    }

    setImageError("");

    const reader = new FileReader();

    reader.onload = () => {
      setImagePreview(reader.result as string);

      setShowCropper(true);
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    setCroppedImageSize(null);
    setShowCropper(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setImageError("");
  };
  // Dark theme input styles
  const inputStyle =
    "w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[var(--accent-primary)]/20 outline-none transition-all duration-200 bg-[var(--black-soft)] text-[var(--text-primary)] border-[var(--border-light)] placeholder:text-[var(--text-tertiary)]";
  const labelStyle =
    "block text-sm font-semibold mb-2 text-[var(--text-secondary)]";
  const selectStyle =
    "w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[var(--accent-primary)]/20 outline-none transition-all duration-200 bg-[var(--black-soft)] text-[var(--text-primary)] border-[var(--border-light)] appearance-none cursor-pointer";
  const customSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: "var(--select-bg)",
      borderColor: state.isFocused
        ? "var(--select-accent)"
        : "var(--select-border)",
      color: "var(--select-text)",
      minHeight: "50px",
      borderRadius: "12px",
      boxShadow: "none",

      "&:hover": {
        borderColor: "var(--select-accent)",
      },
    }),

    singleValue: (provided: any) => ({
      ...provided,
      color: "var(--select-text)",
    }),

    input: (provided: any) => ({
      ...provided,
      color: "var(--select-text)",
    }),

    placeholder: (provided: any) => ({
      ...provided,
      color: "var(--select-placeholder)",
    }),

    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "var(--select-menu-bg)",
      borderRadius: "12px",
      overflow: "hidden",
      zIndex: 9999,
    }),

    menuList: (provided: any) => ({
      ...provided,
      backgroundColor: "var(--select-menu-bg)",
      padding: 0,
    }),

    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "var(--select-accent)"
        : state.isFocused
        ? "var(--select-bg-hover)"
        : "var(--select-menu-bg)",

      color: "#FFFFFF",
      cursor: "pointer",
    }),

    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: "#FFFFFF",

      "&:hover": {
        color: "var(--select-accent)",
      },
    }),

    clearIndicator: (provided: any) => ({
      ...provided,
      color: "#FFFFFF",

      "&:hover": {
        color: "var(--select-accent)",
      },
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),
  };
  return (
    <div
      className="flex justify-center min-h-screen w-full p-6"
      style={{ background: "var(--black-rich)" }}
    >
      <div
        className="grid grid-cols-1 lg:grid-cols-10 gap-8 w-full max-w-[1400px]"
        style={{
          background: "var(--black-warm)",
          borderRadius: "24px",
          padding: "30px",
        }}
      >
        {/* FORM SECTION */}
        <div
          className="lg:col-span-7 rounded-2xl overflow-hidden"
          style={{
            background: "var(--black-card)",
            border: "1px solid var(--border-light)",
          }}
        >
          <div
            className="h-1"
            style={{ background: "var(--gradient-primary)" }}
          ></div>

          <div className="p-6 md:p-8">
            <h1
              className="text-2xl md:text-3xl font-bold text-center mb-2"
              style={{ color: "var(--text-heading)" }}
            >
              Create New Post
            </h1>
            <p
              className="text-center text-sm mb-8"
              style={{ color: "var(--text-secondary)" }}
            >
              Fill in the details below to publish your article
            </p>

            <form
              className="space-y-6"
              style={{ paddingLeft: "10px", paddingRight: "10px" }}
              onSubmit={(e) => e.preventDefault()}
            >
              {/* Title Field with Validation */}
              <div>
                <label className={labelStyle}>
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={inputStyle}
                  placeholder="Enter an engaging title (Max 60 characters, letters, numbers & spaces only)..."
                  value={title}
                  onChange={handleTitleChange}
                />
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {title.length}/60 characters
                </p>
                {titleError && (
                  <p className="text-yellow-500 text-sm mt-2 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    {titleError}
                  </p>
                )}
                {fieldErrors.title && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {fieldErrors.title}
                  </p>
                )}
              </div>

              {/* Subtitle Field */}
              <div>
                <label className={labelStyle}>Subtitle</label>
                <input
                  type="text"
                  className={inputStyle}
                  placeholder="Add a catchy subtitle (Max 160 characters)..."
                  value={subtitle}
                  onChange={handleSubtitleChange}
                />
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {subtitle.length}/160 characters
                </p>
              </div>

              {/* Tiptap Content */}
              <div>
                <label className={labelStyle}>
                  Content <span className="text-red-500">*</span>
                </label>

                <div
                  className="rounded-xl overflow-hidden border"
                  style={{
                    borderColor: "var(--border-light)",
                    background: "var(--black-soft)",
                  }}
                >
                  <TiptapEditor
                    content={content}
                    onChange={(html) => setContent(html)}
                  />
                </div>
              </div>

              {/* Meta Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>Meta Title</label>
                  <input
                    type="text"
                    maxLength={60}
                    className={inputStyle}
                    placeholder="Max 60 chars for SEO"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                  />
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {metaTitle.length}/60 characters
                  </p>
                </div>
              </div>

              {/* Image Upload with Preview */}
              <div>
                <label className={labelStyle}>Featured Image (Max 50KB)</label>
                <div
                  className="border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 flex flex-col items-center justify-center"
                  style={{
                    borderColor: "var(--border-light)",
                    background: "var(--black-soft)",
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageChange(file);
                      }
                      e.target.value = "";
                    }}
                  />

                  {imagePreview ? (
                    <div className="w-full">
                      <div className="flex justify-end mb-3">
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="px-30 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                          style={{
                            width: "50px",
                          }}
                        >
                          X
                        </button>
                      </div>
                      {showCropper ? (
                        <>
                          <div className="relative w-full h-[400px]">
                            <Cropper
                              image={imagePreview}
                              crop={crop}
                              zoom={zoom}
                              aspect={850 / 300}
                              onCropChange={setCrop}
                              onZoomChange={setZoom}
                              onCropComplete={handleCropComplete}
                            />
                          </div>
                          {croppedImageSize !== null && (
                            <p
                              className={`mt-3 text-sm font-medium ${
                                croppedImageSize > 50 * 1024
                                  ? "text-red-500"
                                  : "text-green-500"
                              }`}
                            >
                              Cropped Image Size:{" "}
                              {(croppedImageSize / 1024).toFixed(2)} KB
                              {croppedImageSize > 50 * 1024 &&
                                " (Exceeds 50 KB limit)"}
                            </p>
                          )}
                          <div className="mt-4">
                            <label className="text-sm">Zoom</label>

                            <input
                              type="range"
                              min={1}
                              max={3}
                              step={0.1}
                              value={zoom}
                              onChange={(e) => setZoom(Number(e.target.value))}
                              className="w-full"
                            />
                          </div>
                        </>
                      ) : (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full rounded-lg"
                        />
                      )}
                    </div>
                  ) : (
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer inline-flex flex-col items-center gap-2"
                    >
                      <svg
                        className="w-12 h-12"
                        style={{ color: "var(--text-tertiary)" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span
                        className="text-sm text-center"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Click to upload image (Max 50KB)
                      </span>
                    </label>
                  )}
                </div>
                {imageError && (
                  <p className="text-red-500 text-sm mt-2">{imageError}</p>
                )}
              </div>

              {/* Language & Category Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>
                    Language <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={selectStyle}
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                  >
                    <option value="">Select Language</option>
                    {languages.map((lan) => (
                      <option key={lan.id} value={lan.id}>
                        {lan.lan_name}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.language && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.language}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelStyle}>
                    Category <span className="text-red-500">*</span>
                  </label>
                  <Select
                    styles={customSelectStyles}
                    options={categories.map((cat) => ({
                      value: cat.cat_category,
                      label: cat.cat_category,
                    }))}
                    value={
                      selectedCategory
                        ? {
                            value: selectedCategory,
                            label: selectedCategory,
                          }
                        : null
                    }
                    onChange={(selected) =>
                      handleCategoryChange({
                        target: {
                          value: selected?.value || "",
                        },
                      } as any)
                    }
                    isSearchable
                    placeholder="Search Category..."
                  />
                  {/* <option value="">Select Category</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat.cat_category}>
                        {cat.cat_category}
                      </option>
                    ))} */}
                  {/* </select> */}
                  {fieldErrors.category && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.category}
                    </p>
                  )}
                </div>
              </div>

              {/* Subcategory & Deep Topic Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>
                    Subcategory <span className="text-red-500">*</span>
                  </label>
                  <Select
                    styles={customSelectStyles}
                    options={subcategories.map((sub) => ({
                      value: sub.cat_subcategory,
                      label: sub.cat_subcategory,
                    }))}
                    value={
                      selectedSubcategory
                        ? {
                            value: selectedSubcategory,
                            label: selectedSubcategory,
                          }
                        : null
                    }
                    onChange={(selected) =>
                      handleSubcategoryChange(selected?.value || "")
                    }
                    isSearchable
                    placeholder="Search Subcategory..."
                  />
                  {/* <option value="">Select Subcategory</option>
                    {subcategories.map((sub, index) => (
                      <option key={index} value={sub.cat_subcategory}>
                        {sub.cat_subcategory}
                      </option>
                    ))} */}
                  {/* </select> */}
                  {fieldErrors.subcategory && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.subcategory}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelStyle}>
                    Deep Topic <span className="text-red-500">*</span>
                  </label>
                  <Select
                    styles={customSelectStyles}
                    options={deepTopics.map((topic) => ({
                      value: topic.cat_sub_subcategory,
                      label: topic.cat_sub_subcategory,
                    }))}
                    value={
                      selectedDeepTopic
                        ? {
                            value: selectedDeepTopic,
                            label: selectedDeepTopic,
                          }
                        : null
                    }
                    onChange={(selected) =>
                      handleDeepTopicChange(selected?.value || "")
                    }
                    isSearchable
                    placeholder="Search Deep Topic..."
                  />
                  {/* <option value="">Select Deep Topic</option>
                    {deepTopics.map((topic, index) => (
                      <option key={index} value={topic.cat_sub_subcategory}>
                        {topic.cat_sub_subcategory}
                      </option>
                    ))} */}
                  {/* </select> */}
                  {fieldErrors.deepTopic && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.deepTopic}
                    </p>
                  )}
                </div>
              </div>
{/* category suggestion */}
<div className="space-y-2">
  <label className="block text-sm font-medium">
    Suggest a New Category (Optional)
  </label>

  <textarea
    value={categorySuggestion}
    onChange={(e) =>
      setCategorySuggestion(e.target.value)
    }
    placeholder="Can't find a suitable category? Suggest one here..."
    className="w-full rounded-lg border p-3"
    rows={3}
  />
</div>
              {/* Meta Keywords */}
              <div>
                <label className={labelStyle}>Meta Keywords</label>
                <div
                  className="min-h-[50px] flex flex-wrap gap-2 p-3 border rounded-xl focus-within:ring-2 focus-within:ring-[var(--accent-primary)]/20 transition-all duration-200"
                  style={{
                    borderColor: "var(--border-light)",
                    background: "var(--black-soft)",
                  }}
                >
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1  text-sm flex items-center gap-1"
                      style={{
                        background: "rgba(217, 92, 43, 0.15)",
                        color: "var(--accent-primary)",
                        border: "1px solid rgba(217, 92, 43, 0.2)",
                        borderRadius: "5px",
                        paddingRight: "3px",
                        paddingLeft: "3px",
                      }}
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(idx)}
                        className="ml-1 hover:text-red-500 transition-colors"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 outline-none text-sm px-1 min-w-[120px]"
                    style={{
                      background: "transparent",
                      color: "var(--text-primary)",
                    }}
                    placeholder="Type and press comma..."
                  />
                </div>
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Press comma or enter to add tags (max 10)
                </p>
              </div>

              {/* Article Tags */}
              <div>
                <label className={labelStyle}>Tags</label>

                <div
                  className="min-h-[50px] flex flex-wrap gap-2 p-3 border rounded-xl focus-within:ring-2 focus-within:ring-[var(--accent-primary)]/20 transition-all duration-200"
                  style={{
                    borderColor: "var(--border-light)",
                    background: "var(--black-soft)",
                  }}
                >
                  {articleTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-sm flex items-center gap-1"
                      style={{
                        background: "rgba(217, 92, 43, 0.15)",
                        color: "var(--accent-primary)",
                        border: "1px solid rgba(217, 92, 43, 0.2)",
                        borderRadius: "5px",
                        paddingRight: "3px",
                        paddingLeft: "3px",
                      }}
                    >
                      {tag}

                      <button
                        type="button"
                        onClick={() => removeArticleTag(idx)}
                        className="ml-1 hover:text-red-500 transition-colors"
                        style={{
                          color: "var(--text-tertiary)",
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}

                  <input
                    value={articleTagInput}
                    onChange={(e) => setArticleTagInput(e.target.value)}
                    onKeyDown={handleArticleTagKeyDown}
                    className="flex-1 outline-none text-sm px-1 min-w-[120px]"
                    style={{
                      background: "transparent",
                      color: "var(--text-primary)",
                    }}
                    placeholder="Type tag and press comma..."
                  />
                </div>

                <p
                  className="text-xs mt-1"
                  style={{
                    color: "var(--text-tertiary)",
                  }}
                >
                  Press comma or enter to add tags
                </p>
              </div>

              {/* Captcha */}
                  <div
                    className="mb-4 flex justify-center"
                    style={{
                      marginBottom: "8px",
                    }}
                  >
                    <ReCAPTCHA
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                      onChange={(token) => setCaptchaToken(token || "")}
                    />
                  </div>
                  
              {/* Submit Button */}
              <div className="pt-6 flex justify-center">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="group relative px-10 py-4 font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  style={{
                    background: "var(--gradient-primary)",
                    color: "white",
                    minWidth: "200px",
                    marginBottom: "5px",
                  }}
                >
                  
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Publish Post
                  </span>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(0,0,0,0.2), rgba(0,0,0,0.1))",
                    }}
                  ></div>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ADVERTISEMENT SECTION - Dark Theme */}
        <div className="lg:col-span-3 space-y-6">
          <div
            className="rounded-2xl shadow-xl overflow-hidden sticky top-6"
            style={{
              background: "var(--black-card)",
              border: "1px solid var(--border-light)",
            }}
          >
            <div
              className="h-1"
              style={{ background: "var(--gradient-primary)" }}
            ></div>
            <div className="p-6" style={{ padding: "10px" }}>
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <span className="text-white text-sm">⭐</span>
                </div>
                <h3
                  className="font-bold text-lg"
                  style={{ color: "var(--text-heading)" }}
                >
                  Upgrade to Pro
                </h3>
              </div>
              <p
                className="text-sm mb-4 leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Get access to advanced SEO tools, analytics dashboard, and
                priority support.
              </p>
              <button
                className="w-full py-3 font-medium rounded-xl transition-all duration-300"
                style={{
                  background: "var(--gradient-primary)",
                  color: "white",
                }}
              >
                Learn More →
              </button>
            </div>
          </div>

          <div
            className="rounded-2xl shadow-xl overflow-hidden sticky top-6"
            style={{
              background: "var(--black-card)",
              border: "1px solid var(--border-light)",
            }}
          >
            <div
              className="h-1"
              style={{
                background: "linear-gradient(135deg, #6B7280, #4B5563)",
              }}
            ></div>
            <div className="p-6" style={{ padding: "10px" }}>
              <h3
                className="font-bold mb-4 flex items-center gap-2"
                style={{ color: "var(--text-heading)" }}
              >
                <svg
                  className="w-5 h-5"
                  style={{ color: "var(--accent-primary)" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Sponsored
              </h3>
              <div
                className="h-48 rounded-xl flex items-center justify-center border-2 border-dashed"
                style={{
                  background: "var(--black-soft)",
                  borderColor: "var(--border-light)",
                  color: "var(--text-tertiary)",
                }}
              >
                <div className="text-center">
                  <svg
                    className="w-12 h-12 mx-auto mb-2"
                    style={{ color: "var(--text-tertiary)" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm">Advertisement Space</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
