"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { API_BASE_URL } from "@/constants/api";
import {
  Mail,
  Phone,
  Cake,
  Calendar,
  Edit,
  MapPin,
  Link2,
  Users,
  BookOpen,
  Activity,
  BarChart3,
  Twitter,
  Instagram,
  Facebook,
  Github,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";

interface UserProfile {
  user_name: string;
  user_email: string;
  user_about: string;
  user_image: string;
  user_followers: number;
  user_following: number;
  user_phone: string;
  user_dob: string;
  user_location: string;
  user_website: string;
  created_at: string;
}

interface UserArticle {
  id: number;
  art_title: string;
  art_subtitle: string;
  art_description: string;
  art_image: string;
  created_at: string;
  slug: string;

  art_status: number;
  art_comment: string;
}

export default function Profile() {
  const router = useRouter();
  const params = useParams();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

const [selectedComment, setSelectedComment] = useState("");
const [selectedImage, setSelectedImage] = useState<File | null>(null);

const [previewImage, setPreviewImage] = useState("");
  const [activeTab, setActiveTab] = useState("about");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
  const [articles, setArticles] = useState<UserArticle[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    user_name: "",
    user_about: "",
    user_email: "",
    user_phone: "",
    user_dob: "",
  });

  const isOwnProfile =
  loggedInUserId === Number(params.id);

  useEffect(() => {

  fetchCurrentUser();

  if (params.id) {

    fetchProfile();

    fetchArticles();

  }

}, [params.id]);

const fetchCurrentUser = async () => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/profile`,
      {
        credentials: "include",
      }
    );

    const data = await res.json();

    if (res.ok) {
      setLoggedInUserId(data.user.id);
    }
  } catch (error) {
    console.log(error);
  }
};

  const fetchProfile = async () => {
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/profile/${params.id}`, {
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);

        setFormData({
          user_name: data.user.user_name || "",
          user_about: data.user.user_about || "",
          user_email: data.user.user_email || "",
          user_phone: data.user.user_phone || "",
          user_dob: data.user.user_dob
            ? new Date(data.user.user_dob).toISOString().split("T")[0]
            : "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchArticles = async () => {

  try {

    const res = await fetch(
      `${API_BASE_URL}/api/profile/${params.id}/articles`
    );

    const data = await res.json();

    if (res.ok) {

      setArticles(data.articles);

    }

  } catch (error) {

    console.log(error);

  }

};

  const handleImageChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  // 10KB limit
  if (file.size > 10 * 1024) {
    toast.error("Image must be under 10KB");
    return;
  }

  setSelectedImage(file);

  const imageUrl = URL.createObjectURL(file);

  setPreviewImage(imageUrl);
};

const handleUploadImage = async () => {
  try {
    if (!selectedImage) {
      toast.error("Please select an image");
      return;
    }

    const formData = new FormData();

    formData.append("user_image", selectedImage);

    const res = await fetch(
      `${API_BASE_URL}/api/profile/upload-image`,
      {
        method: "PUT",
        credentials: "include",
        body: formData,
      }
    );

    const data = await res.json();

    if (res.ok) {
      toast.success("Profile image updated");

      setIsImageModalOpen(false);

      setSelectedImage(null);

      setPreviewImage("");

      fetchProfile();
    } else {
      toast.error(data.message || "Upload failed");
    }
  } catch (error) {
    console.log(error);

    toast.error("Server Error");
  }
};

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

const handleSaveProfile = async () => {
  try {

    // Check changed fields only
    const updatedFields: any = {};

    if (formData.user_name !== user?.user_name) {
      updatedFields.user_name = formData.user_name;
    }

    if (formData.user_about !== user?.user_about) {
      updatedFields.user_about = formData.user_about;
    }

    if (formData.user_email !== user?.user_email) {
      updatedFields.user_email = formData.user_email;
    }

    if (formData.user_phone !== user?.user_phone) {
      updatedFields.user_phone = formData.user_phone;
    }

    const currentDob = user?.user_dob
      ? new Date(user.user_dob).toISOString().split("T")[0]
      : "";

    if (formData.user_dob !== currentDob) {
      updatedFields.user_dob = formData.user_dob;
    }

    // No changes
    if (Object.keys(updatedFields).length === 0) {
      toast.error("No changes detected");
      return;
    }

    const res = await fetch(`${API_BASE_URL}/api/profile/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updatedFields),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Profile updated successfully");

      setIsEditing(false);

      fetchProfile();
    } else {
      toast.error(data.message || "Failed to update profile");
    }

  } catch (error) {

    console.log(error);

    toast.error("Server Error");

  }
};
  const tabs = [
  { id: "about", label: "About" },
  { id: "published", label: "Published" },

  ...(isOwnProfile
    ? [
        { id: "activity", label: "Activity" },
        { id: "statistics", label: "Stats" },
      ]
    : []),
];

  const socialLinks = [
    { name: "Twitter", icon: Twitter, color: "#1DA1F2" },
    { name: "Instagram", icon: Instagram, color: "#E4405F" },
    { name: "Facebook", icon: Facebook, color: "#1877F2" },
    { name: "Github", icon: Github, color: "#333" },
  ];

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--black-rich)" }}
      >
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p style={{ color: "var(--text-secondary)" }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      {/* Back Button */}
      <div className="profile-back-button">
        <button onClick={() => router.back()} className="profile-back-btn">
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="profile-inner-container">
        <div className="profile-container">
          {/* Profile Header Card */}
          <div className="profile-header-card">
            {/* Cover Image */}
            <div className="profile-cover"></div>

            {/* Profile Info */}
            <div className="profile-info-wrapper">
              {/* Avatar */}
              <div className="profile-avatar-wrapper">
                <div className="profile-avatar">
                  {user?.user_image ? (
                    <img
                      src={`${API_BASE_URL}/uploads/profiles/${user.user_image}`}
                      alt={user.user_name}
                      className="profile-avatar-img"
                    />
                  ) : (
                    <span className="profile-avatar-text">
                      {user?.user_name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                {isOwnProfile && (
  <button
    onClick={() => setIsImageModalOpen(true)}
    className="profile-avatar-edit"
  >
    <Edit className="w-3 h-3" />
  </button>
)}
              </div>

              {/* User Details */}
              <div className="profile-details">
                <div className="profile-name-section">
                  <div>
                    <h1 className="profile-name">
                      {user?.user_name
                        ? user.user_name
                        : user?.user_email
                        ? user.user_email.split("@")[0]
                        : "User Name"}
                    </h1>
                    <p className="profile-bio">
                      {user?.user_about ||
                        "No bio added yet. Click edit to add a bio."}
                    </p>
                  </div>
                  {isOwnProfile && (
  <button
    onClick={() => setIsEditing(true)}
    className="profile-edit-btn"
  >
    Edit Profile
  </button>
)}
                </div>

                {/* Follow Stats */}
                <div className="profile-stats">
                  <div className="profile-stat">
                    <h3 className="profile-stat-number">
                      {user?.user_following || 0}
                    </h3>
                    <p className="profile-stat-label">Following</p>
                  </div>
                  <div className="profile-stat">
                    <h3 className="profile-stat-number">
                      {user?.user_followers || 0}
                    </h3>
                    <p className="profile-stat-label">Followers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="profile-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`profile-tab ${
                    activeTab === tab.id ? "active" : ""
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="profile-tab-content">
              {/* ABOUT TAB */}
              {activeTab === "about" && (
                <div className="profile-about-grid">
                  {/* Personal Information */}
                  <div>
                    <h3 className="profile-section-title">
                      <Users className="w-5 h-5" />
                      Personal Information
                    </h3>
                    <div className="profile-info-list">
                      <div className="profile-info-item">
                        <Mail className="profile-info-icon" />
                        <div>
                          <p className="profile-info-label">Email Address</p>
                          <p className="profile-info-value">
                            {user?.user_email || "Not added"}
                          </p>
                        </div>
                      </div>
                      <div className="profile-info-item">
                        <Phone className="profile-info-icon" />
                        <div>
                          <p className="profile-info-label">Phone Number</p>
                          <p className="profile-info-value">
                            {user?.user_phone || "Not added"}
                          </p>
                        </div>
                      </div>
                      <div className="profile-info-item">
                        <Cake className="profile-info-icon" />
                        <div>
                          <p className="profile-info-label">Date of Birth</p>
                          <p className="profile-info-value">
                            {user?.user_dob || "Not added"}
                          </p>
                        </div>
                      </div>
                      <div className="profile-info-item">
                        <Calendar className="profile-info-icon" />
                        <div>
                          <p className="profile-info-label">Joined</p>
                          <p className="profile-info-value">
                            {user?.created_at
                              ? new Date(user.created_at).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )
                              : "Not added"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PUBLISHED TAB */}
{activeTab === "published" && (
  <div className="space-y-5">
    {articles.filter(article => article.art_status === 1).length > 0 ? (
      articles
  .filter(article => article.art_status === 1)
  .map((article) => (
        <div
          key={article.id}
          onClick={() => router.push(`/article/${article.slug}`)}
          className="group relative rounded-2xl border cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-visible"
          style={{
            borderColor: "var(--border-light)",
            backgroundColor: "var(--black-soft)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "12px",
            gap: "12px",
          }}
        >
          {/* IMAGE */}
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
                  background:
                    "linear-gradient(135deg, rgba(217,92,43,0.15), rgba(30,107,107,0.15))",
                }}
              >
                <BookOpen
                  className="w-10 h-10"
                  style={{ color: "var(--accent-primary)" }}
                />
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <h4
                className="text-lg font-bold group-hover:text-[var(--accent-primary)] transition-colors duration-300 line-clamp-1"
                style={{ color: "var(--text-heading)" }}
              >
                {article.art_title}
              </h4>

              <p
                className="mt-2 text-sm font-medium line-clamp-1"
                style={{ color: "var(--text-secondary)" }}
              >
                {article.art_subtitle}
              </p>

              <p
                className="mt-2 text-sm line-clamp-2"
                style={{ color: "var(--text-tertiary)" }}
              >
                {article.art_description?.replace(/<[^>]*>/g, "").slice(0, 120)}
                ...
              </p>

              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1">
                  <Calendar
                    className="w-3 h-3"
                    style={{ color: "var(--text-tertiary)" }}
                  />

                  <span
                    className="text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {new Date(article.created_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <BarChart3
                    className="w-3 h-3"
                    style={{ color: "var(--accent-primary)" }}
                  />

                  <span
                    className="text-xs"
                    style={{ color: "var(--accent-primary)" }}
                  >
                    Published
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-2">
                <span
                  className="text-xs font-semibold"
                  style={{ color: "var(--accent-primary)" }}
                >
                  Read full article
                </span>

                <Link2
                  className="w-3 h-3"
                  style={{ color: "var(--accent-primary)" }}
                />
              </div>
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className="profile-empty-state">
        <BookOpen className="profile-empty-icon" />

        <h3 className="profile-empty-title">
          No Published Content Yet
        </h3>

        <p className="profile-empty-text">
          Published articles will appear here.
        </p>
      </div>
    )}
  </div>
)}
            
{/* ACTIVITY TAB */}
{isOwnProfile && activeTab === "activity" && (
  <div
    className="admin-table-wrapper"
    style={{
      width: "100%",
      overflowX: "auto",
      overflowY: "hidden",
      WebkitOverflowScrolling: "touch",
    }}
  >
    <table
      className="admin-table"
      style={{
        minWidth: "1200px",
        width: "100%",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr>
          <th>ID</th>
          <th>Image</th>
          <th>Title</th>
          <th>Description</th>
          <th>Created</th>
          <th>Status</th>
          <th>Comment</th>
        </tr>
      </thead>

      <tbody>
        {articles.length > 0 ? (
          articles.map((article, index) => (
            <tr
              key={article.id}
             >
              {/* ID */}
              <td>{index + 1}</td>

              {/* IMAGE */}
              <td>
                {article.art_image ? (
                  <img
                    src={`${API_BASE_URL}/uploads/${article.art_image}`}
                    alt={article.art_title}
                    style={{
                      width: "70px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "70px",
                      height: "50px",
                      borderRadius: "8px",
                      background: "var(--black-soft)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <BookOpen
                      className="w-5 h-5"
                      style={{
                        color: "var(--accent-primary)",
                      }}
                    />
                  </div>
                )}
              </td>

              {/* TITLE */}
<td
  style={{
    minWidth: "260px",
    maxWidth: "260px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    lineHeight: "1.6",
  }}
>
  <div
    style={{
      fontWeight: 700,
      color: "var(--text-heading)",
    }}
  >
    {article.art_title
      ?.match(/.{1,30}(\s|$)/g)
      ?.join("\n")}
  </div>
</td>


             {/* DESCRIPTION */}
<td style={{ minWidth: "220px", maxWidth: "220px" }}>
  <div
    onClick={() => router.push(`/add-post?id=${article.id}`)}
    style={{
      color: "var(--text-tertiary)",
      cursor: "pointer",
      transition: "0.3s",
      textDecoration: "underline",
    }}
  >
    {article.art_description
      ?.replace(/<[^>]*>/g, "")
      .slice(0, 25)}
    ...
  </div>
</td>

              {/* CREATED DATE */}
              <td style={{ whiteSpace: "nowrap" }}>
                {new Date(article.created_at).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )}
              </td>

              {/* STATUS */}
              <td>
  {article.art_status === 0 ? (
    <span className="admin-status admin-status-pending">
      Pending
    </span>
  ) : article.art_status === 1 ? (
    <span className="admin-status admin-status-approved">
      Accepted
    </span>
  ) : (
    <span className="admin-status admin-status-rejected">
      Rejected
    </span>
  )}
</td>
{/* COMMENT */}
<td>
  <button
    onClick={(e) => {
      e.stopPropagation();

      setSelectedComment(
        article.art_comment || "No comment available"
      );

      setIsCommentModalOpen(true);
    }}
    className="profile-comment-btn"
  >
    View Comment
  </button>
</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={8}>
              <div className="profile-empty-state">
                <BookOpen className="profile-empty-icon" />

                <h3 className="profile-empty-title">
                  No Published Content Yet
                </h3>

                <p className="profile-empty-text">
                  Published articles will appear here.
                </p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)}

              {/* STATISTICS TAB */}
              {isOwnProfile && activeTab === "statistics" && (
                <div>
                  <div className="profile-stats-grid">
                    <div className="profile-stat-card">
                      <div
                        className="profile-stat-card-number"
                        style={{ color: "var(--accent-primary)" }}
                      >
                        {user?.user_followers || 0}
                      </div>
                      <p className="profile-stat-card-label">Total Followers</p>
                    </div>
                    <div className="profile-stat-card">
                      <div
                        className="profile-stat-card-number"
                        style={{ color: "var(--accent-secondary)" }}
                      >
                        {user?.user_following || 0}
                      </div>
                      <p className="profile-stat-card-label">Following</p>
                    </div>
                  </div>
                  <div className="profile-stat-message">
                    <p>
                      More statistics will appear as you engage more with the
                      platform.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

{/* IMAGE UPLOAD MODAL */}
{isOwnProfile && isImageModalOpen && (
  <div
    className="profile-modal-overlay"
    onClick={() => setIsImageModalOpen(false)}
  >
    <div
      className="profile-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="profile-modal-header">
        <h2>Upload Profile Picture</h2>

        <button
          className="profile-modal-close"
          onClick={() => setIsImageModalOpen(false)}
        >
          ✕
        </button>
      </div>

      <div className="profile-modal-body">

        {/* Preview */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid var(--border-light)",
            }}
          >
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--black-soft)",
                  color: "var(--text-secondary)",
                }}
              >
                Preview
              </div>
            )}
          </div>
        </div>

        {/* File Input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="profile-modal-input"
        />

        <p
          style={{
            marginTop: "10px",
            fontSize: "13px",
            color: "var(--text-secondary)",
          }}
        >
          Maximum image size: 10KB
        </p>

        <div className="profile-modal-actions">
          <button
            className="profile-modal-save"
            onClick={handleUploadImage}
          >
            Upload
          </button>

          <button
            className="profile-modal-cancel"
            onClick={() => setIsImageModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{/* COMMENT MODAL */}
{isCommentModalOpen && (
  <div
    className="profile-modal-overlay"
    onClick={() => setIsCommentModalOpen(false)}
  >
    <div
      className="profile-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="profile-modal-header">
        <h2>Admin Comment</h2>

        <button
          className="profile-modal-close"
          onClick={() => setIsCommentModalOpen(false)}
        >
          ✕
        </button>
      </div>

      <div className="profile-modal-body">
        <textarea
          readOnly
          value={selectedComment}
          className="profile-modal-input"
          rows={8}
        />

        <div className="profile-modal-actions">
          <button
            className="profile-modal-cancel"
            onClick={() => setIsCommentModalOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Edit Profile Modal */}
      {isOwnProfile && isEditing && (
        <div
          className="profile-modal-overlay"
          onClick={() => setIsEditing(false)}
        >
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h2>Edit Profile</h2>
              <button
                className="profile-modal-close"
                onClick={() => setIsEditing(false)}
              >
                ✕
              </button>
            </div>
            <div className="profile-modal-body">

  {/* Full Name */}
  <div className="profile-input-group">
    <label className="profile-input-label">Full Name</label>

    <input
      type="text"
      name="user_name"
      value={formData.user_name}
      onChange={handleChange}
      placeholder="Enter full name"
      className="profile-modal-input"
    />
  </div>

  {/* Bio */}
  <div className="profile-input-group">
    <label className="profile-input-label">Bio</label>

    <textarea
      rows={4}
      name="user_about"
      value={formData.user_about}
      onChange={handleChange}
      placeholder="Write something about yourself"
      className="profile-modal-input"
    />
  </div>

  {/* Email */}
  <div className="profile-input-group">
    <label className="profile-input-label">Email</label>

    <input
      type="email"
      name="user_email"
      value={formData.user_email}
      onChange={handleChange}
      placeholder="Enter email"
      className="profile-modal-input"
    />
  </div>

  {/* Phone */}
  <div className="profile-input-group">
    <label className="profile-input-label">Phone</label>

    <input
      type="text"
      name="user_phone"
      value={formData.user_phone}
      onChange={handleChange}
      placeholder="Enter phone number"
      className="profile-modal-input"
    />
  </div>

  {/* Birthdate */}
  <div className="profile-input-group">
    <label className="profile-input-label">Birthdate</label>

    <input
      type="date"
      name="user_dob"
      value={formData.user_dob}
      onChange={handleChange}
      className="profile-modal-input"
    />
  </div>

  <div className="profile-modal-actions">

    <button
      className="profile-modal-save"
      onClick={handleSaveProfile}
    >
      Save Changes
    </button>

    <button
      className="profile-modal-cancel"
      onClick={() => setIsEditing(false)}
    >
      Cancel
    </button>

  </div>
</div>
          </div>
        </div>
      )}
    </div>
  );
}
