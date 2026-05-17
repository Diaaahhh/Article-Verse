"use client";

import React, { useState, KeyboardEvent, useEffect } from "react";
import { API_BASE_URL } from "@/constants/api";
import toast from "react-hot-toast";
import slugify from "slugify";
// import dynamic from "next/dynamic";

// const CKEditor = dynamic(
//   () => import("@ckeditor/ckeditor5-react").then((mod) => mod.CKEditor),
//   { ssr: false }
// );

// import {
//   ClassicEditor,
//   Bold,
//   Essentials,
//   Italic,
//   Paragraph,
//   Heading,
//   List,
//   Link,
//   BlockQuote,
//   Image,
//   ImageToolbar,
//   ImageCaption,
//   ImageStyle,
//   ImageUpload,
//   Table,
//   TableToolbar,

//   Undo
// } from "ckeditor5";
export default function AddPost() {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [languages, setLanguages] = useState<any[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");

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
    if (validateTitle(value)) {
      setTitle(value);
    }
  };

  const handleSubmit = async () => {
    try {
      if (image && image.size > 5 * 1024) {
        toast.error("Image must be below 5KB");
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
      formData.append("metaTitle", metaTitle);
      formData.append("metaDesc", metaDesc);
      formData.append("metaKeywords", JSON.stringify(tags));
      formData.append("languageId", selectedLanguage);
      formData.append("category", selectedCategory);
      formData.append("subcategory", selectedSubcategory);
      formData.append("deepTopic", selectedDeepTopic);

      if (image) {
        formData.append("image", image);
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

  const fetchCategories = async () => {
    const res = await fetch(`${API_BASE_URL}/api/category_section`);
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchLanguages(); 
    fetchCategories();
  }, []);


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
    setSelectedSubcategory(subcategoryValue);
    setSelectedDeepTopic("");

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/category_section/deep-topics/${subcategoryValue}`
      );
      const data = await res.json();
      setDeepTopics(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setImage(null);
      setImagePreview(null);
      return;
    }

    if (file.size > 5 * 1024) {
      setImageError("Image must be below 5KB");
      setImage(null);
      setImagePreview(null);
      return;
    }

    setImage(file);
    setImageError("");

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Dark theme input styles
  const inputStyle =
    "w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[var(--accent-primary)]/20 outline-none transition-all duration-200 bg-[var(--black-soft)] text-[var(--text-primary)] border-[var(--border-light)] placeholder:text-[var(--text-tertiary)]";
  const labelStyle =
    "block text-sm font-semibold mb-2 text-[var(--text-secondary)]";
  const selectStyle =
    "w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[var(--accent-primary)]/20 outline-none transition-all duration-200 bg-[var(--black-soft)] text-[var(--text-primary)] border-[var(--border-light)] appearance-none cursor-pointer";

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
                  placeholder="Enter an engaging title (letters, numbers & spaces only)..."
                  value={title}
                  onChange={handleTitleChange}
                />
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
                  placeholder="Add a catchy subtitle..."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                />
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

                <div>
                  <label className={labelStyle}>Meta Description</label>
                  <textarea
                    maxLength={160}
                    rows={2}
                    className={inputStyle}
                    placeholder="Max 160 chars for SEO"
                    value={metaDesc}
                    onChange={(e) => setMetaDesc(e.target.value)}
                  />
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {metaDesc.length}/160 characters
                  </p>
                </div>
              </div>

              {/* Image Upload with Preview */}
              <div>
                <label className={labelStyle}>Featured Image (Max 5KB)</label>
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
                    <div className="relative flex flex-col items-center">
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-48 h-48 object-cover rounded-lg mx-auto mb-3"
                        />
                        <button
                          type="button"
                          onClick={() => handleImageChange(null)}
                          className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <p
                        className="text-sm text-center"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {image?.name}
                      </p>
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
                        Click to upload image (Max 5KB)
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
                  <select
                    className={selectStyle}
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat.cat_category}>
                        {cat.cat_category}
                      </option>
                    ))}
                  </select>
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
                  <select
                    className={selectStyle}
                    value={selectedSubcategory}
                    onChange={(e) => handleSubcategoryChange(e.target.value)}
                    disabled={!selectedCategory}
                  >
                    <option value="">Select Subcategory</option>
                    {subcategories.map((sub, index) => (
                      <option key={index} value={sub.cat_subcategory}>
                        {sub.cat_subcategory}
                      </option>
                    ))}
                  </select>
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
                  <select
                    className={selectStyle}
                    value={selectedDeepTopic}
                    onChange={(e) => setSelectedDeepTopic(e.target.value)}
                    disabled={!selectedSubcategory}
                  >
                    <option value="">Select Deep Topic</option>
                    {deepTopics.map((topic, index) => (
                      <option key={index} value={topic.cat_sub_subcategory}>
                        {topic.cat_sub_subcategory}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.deepTopic && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.deepTopic}
                    </p>
                  )}
                </div>
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
                      className="px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      style={{
                        background: "rgba(217, 92, 43, 0.15)",
                        color: "var(--accent-primary)",
                        border: "1px solid rgba(217, 92, 43, 0.2)",
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
