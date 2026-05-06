"use client";

import React, { useState, KeyboardEvent } from "react";
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

const handleSubmit = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/add-post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        subtitle,
        content,
        metaTitle,
        metaDesc,
        metaKeywords: tags,
      }),
      credentials: "include", // important (auth)
    });

    const data = await res.json();

    if (res.status === 201) {
      toast.success("Post submitted for review 🚀");

      // reset form
      setTitle("");
      setSubtitle("");
      setContent("");
      setMetaTitle("");
      setMetaDesc("");
      setTags([]);
    } else {
      toast.error(data.message || "Failed to submit");
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

  const inputStyle = "w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all";
  const labelStyle = "block text-sm font-semibold text-gray-700 mb-1";

  return (
    // Added flex classes here to center the content on the screen
    <div className="flex justify-center  min-h-screen w-full p-6">
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 max-w-7xl w-full">
        
        {/* FORM SECTION (70%) */}
        <div className="lg:col-span-7 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 mb-6 text-center ">Add Post</h1>
          
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className={labelStyle}>Title</label>
              <input type="text" className={inputStyle} placeholder="Enter title"  value={title}
  onChange={(e) => setTitle(e.target.value)}/>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>Subtitle</label>
                <input type="text" className={inputStyle} placeholder="Enter subtitle"  value={subtitle}
  onChange={(e) => setSubtitle(e.target.value)}/>
              </div>
              <div>
                <label className={labelStyle}>Meta Title</label>
                <input type="text" maxLength={60} className={inputStyle} placeholder="Max 60 chars"  value={metaTitle}
  onChange={(e) => setMetaTitle(e.target.value)}/>
              </div>
            </div>

            <div>
              <label className={labelStyle}>Text Content</label>
              <textarea rows={6} className={inputStyle} placeholder="Write your content..."  value={content}
  onChange={(e) => setContent(e.target.value)} />
            </div>

            <div>
              <label className={labelStyle}>Meta Description</label>
              <textarea maxLength={160} rows={2} className={inputStyle} placeholder="Max 160 chars"  value={metaDesc}
  onChange={(e) => setMetaDesc(e.target.value)} />
            </div>

            <div>
              <label className={labelStyle}>Meta Keywords</label>
              <div className="min-h-[42px] flex flex-wrap gap-2 p-2 border border-gray-300 rounded focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                {tags.map((tag, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm flex items-center border border-gray-200">
                    {tag} <button onClick={() => removeTag(idx)} className="ml-2 text-gray-400 hover:text-red-500">×</button>
                  </span>
                ))}
                <input 
                  value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleKeyDown}
                  className="flex-1 outline-none text-sm px-1" placeholder="Type and press comma..."
                />
              </div>
            </div>

           <div className="pt-4 flex justify-center" style={{ marginTop: "5px" }}>
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
            <p className="text-gray-500 text-sm mb-4">Get access to advanced SEO tools and analytics.</p>
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