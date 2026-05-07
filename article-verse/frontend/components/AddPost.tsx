"use client";

import React, { useState, KeyboardEvent, useEffect } from "react";
import { API_BASE_URL } from "@/constants/api";
import toast from "react-hot-toast";

export default function AddPost() {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [image, setImage] = useState<File | null>(null);

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
  const handleSubmit = async () => {
    try {
      // image validation
      if (image && image.size > 5 * 1024) {
        toast.error("Image must be below 5KB");
        return;
      }
      const errors: any = {};

      if (!title.trim()) {
        errors.title = "Title is required";
      }

      if (!content.trim()) {
        errors.content = "Content is required";
      }

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

      // clear old errors
      setFieldErrors({});
      const formData = new FormData();

      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("content", content);

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

    // reset
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
  const inputStyle =
    "w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all";
  const labelStyle = "block text-sm font-semibold text-gray-700 mb-1";

  return (
    // Added flex classes here to center the content on the screen
    <div className="flex justify-center  min-h-screen w-full p-6">
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 max-w-7xl w-full">
        {/* FORM SECTION (70%) */}
        <div className="lg:col-span-7 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 mb-6 text-center ">
            Add Post
          </h1>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className={labelStyle}>Title</label>
              <input
                type="text"
                className={inputStyle}
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {fieldErrors.title && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.title}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>Subtitle</label>
                <input
                  type="text"
                  className={inputStyle}
                  placeholder="Enter subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className={labelStyle}>Text Content</label>
              <textarea
                rows={6}
                className={inputStyle}
                placeholder="Write your content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              {fieldErrors.content && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.content}
                </p>
              )}
            </div>
            <div>
              <label className={labelStyle}>Meta Title</label>

              <input
                type="text"
                maxLength={60}
                className={inputStyle}
                placeholder="Max 60 chars"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
              />
            </div>
            <div>
              <label className={labelStyle}>Meta Description</label>
              <textarea
                maxLength={160}
                rows={2}
                className={inputStyle}
                placeholder="Max 160 chars"
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
              />
            </div>

            {/* IMAGE */}

            <div>
              <label className={labelStyle}>Upload Image (Max 5KB)</label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (!file) return;

                  // Clear previous error
                  setImageError("");

                  // Validate immediately
                  if (file.size > 5 * 1024) {
                    setImage(null);

                    setImageError("Image must be below 5KB");

                    // remove selected file visually
                    e.target.value = "";

                    return;
                  }

                  setImage(file);
                }}
              />

              {imageError && (
                <p className="text-red-500 text-sm mt-1">{imageError}</p>
              )}
            </div>

            {/* LANGUAGE */}

            <div>
              <label className={labelStyle}>Language</label>

              <select
                className={inputStyle}
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
              {fieldErrors.selectedLanguage && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.selectedLanguage}
                </p>
              )}
            </div>

            {/* CATEGORY */}

            <div>
              <label className={labelStyle}>Category</label>

              <select
                className={inputStyle}
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
              {fieldErrors.selectedCategory && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.selectedCategory}
                </p>
              )}
            </div>

            {/* SUBCATEGORY */}

            <div>
              <label className={labelStyle}>Subcategory</label>

              <select
                className={inputStyle}
                value={selectedSubcategory}
                onChange={(e) => handleSubcategoryChange(e.target.value)}
              >
                <option value="">Select Subcategory</option>

                {subcategories.map((sub, index) => (
                  <option key={index} value={sub.cat_subcategory}>
                    {sub.cat_subcategory}
                  </option>
                ))}
              </select>
              {fieldErrors.selectedSubcategory && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.selectedSubcategory}
                </p>
              )}
            </div>

            {/* DEEP TOPIC */}

            <div>
              <label className={labelStyle}>Deep Topic</label>

              <select
                className={inputStyle}
                value={selectedDeepTopic}
                onChange={(e) => setSelectedDeepTopic(e.target.value)}
              >
                <option value="">Select Deep Topic</option>

                {deepTopics.map((topic, index) => (
                  <option key={index} value={topic.cat_sub_subcategory}>
                    {topic.cat_sub_subcategory}
                  </option>
                ))}
              </select>
              {fieldErrors.selectedDeepTopic && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.selectedDeepTopic}
                </p>
              )}
            </div>
            <div>
              <label className={labelStyle}>Meta Keywords</label>
              <div className="min-h-[42px] flex flex-wrap gap-2 p-2 border border-gray-300 rounded focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm flex items-center border border-gray-200"
                  >
                    {tag}{" "}
                    <button
                      onClick={() => removeTag(idx)}
                      className="ml-2 text-gray-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 outline-none text-sm px-1"
                  placeholder="Type and press comma..."
                />
              </div>
            </div>

            <div
              className="pt-4 flex justify-center"
              style={{ marginTop: "5px" }}
            >
              <button
                type="button"
                onClick={handleSubmit}
                className="w-64 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded shadow-sm transition-all"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        {/* ADVERTISEMENT SECTION (30%) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="font-bold text-gray-900 mb-2">Upgrade to Pro</h3>
            <p className="text-gray-500 text-sm mb-4">
              Get access to advanced SEO tools and analytics.
            </p>
            <button className="w-full py-2 border border-blue-600 text-blue-600 font-medium rounded hover:bg-blue-50 transition-all">
              Learn More
            </button>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Sponsored</h3>
            <div className="h-40 bg-gray-50 rounded flex items-center justify-center text-gray-400 border border-dashed border-gray-300">
              Ad Space
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
