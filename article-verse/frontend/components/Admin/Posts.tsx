"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/constants/api";
import toast from "react-hot-toast";

interface Article {
  id: number;
  user_id: number;
  art_title: string;
  art_subtitle: string;
  art_text: string;
  art_image: string;
  updated_at: string;
  art_status: number;
  lan_name: string;
  cat_category: string;
  cat_subcategory: string;
  cat_sub_subcategory: string;
  art_cat_suggestion: string;
  cat_id: number;
  lan_id: number;
}
interface Language {
  id: number;
  lan_name: string;
}
export default function Posts() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [deepTopics, setDeepTopics] = useState<any[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [editTitle, setEditTitle] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");
  const [editText, setEditText] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editSubCategory, setEditSubCategory] = useState("");
  const [editDeepTopic, setEditDeepTopic] = useState("");
  const [editLanguage, setEditLanguage] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const itemsPerPage = 6;

  const openViewModal = (article: Article) => {
    setSelectedArticle(article);
    setViewModal(true);
  };

  const openEditModal = async (article: Article) => {
    setSelectedArticle(article);

    setEditTitle(article.art_title);
    setEditSubtitle(article.art_subtitle || "");
    setEditText(article.art_text || "");
    setEditCategory(article.cat_category || "");
    setEditSubCategory(article.cat_subcategory || "");
    setEditDeepTopic(article.cat_sub_subcategory || "");
    setEditLanguage(String(article.lan_id || ""));
    try {
      // Load subcategories
      const subRes = await fetch(
        `${API_BASE_URL}/api/category_section/subcategories/${article.cat_category}`
      );

      const subData = await subRes.json();

      setSubcategories(subData);

      // Load deep topics
      const deepRes = await fetch(
        `${API_BASE_URL}/api/category_section/deep-topics/${article.cat_subcategory}`
      );

      const deepData = await deepRes.json();

      setDeepTopics(deepData);
    } catch (error) {
      console.log(error);
    }
    setEditModal(true);
  };

  const handleUpdate = async () => {
    if (!selectedArticle) return;

    try {
      const formData = new FormData();

      formData.append("art_title", editTitle);
      formData.append("art_subtitle", editSubtitle);
      formData.append("art_text", editText);

      formData.append("cat_category", editCategory);
      formData.append("cat_subcategory", editSubCategory);
      formData.append("cat_sub_subcategory", editDeepTopic);
      formData.append("lan_id", editLanguage);
      if (editImage) {
        formData.append("art_image", editImage);
      }

      await fetch(`${API_BASE_URL}/api/posts/${selectedArticle.id}`, {
        method: "PUT",
        body: formData,
      });

      toast.success("Article updated successfully");

      setEditModal(false);

      fetchArticles();
    } catch (error) {
      console.log(error);

      toast.error("Failed to update article");
    }
  };

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/posts`);
      const data = await res.json();
      setArticles(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch articles");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/category_section`);

      const data = await res.json();

      setCategories(data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchLanguages = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/languages`);
      const data = await res.json();

      setLanguages(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchArticles();
    fetchCategories();
    fetchLanguages();
  }, []);

  const handleAccept = async (id: number) => {
    try {
      await fetch(`${API_BASE_URL}/api/posts/accept/${id}`, { method: "PUT" });
      toast.success("Article accepted successfully");
      fetchArticles();
    } catch (error) {
      toast.error("Failed to accept article");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await fetch(`${API_BASE_URL}/api/posts/reject/${id}`, { method: "PUT" });
      toast.success("Article rejected");
      fetchArticles();
    } catch (error) {
      toast.error("Failed to reject article");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await fetch(`${API_BASE_URL}/api/posts/${id}`, { method: "DELETE" });
      toast.success("Article deleted permanently");
      fetchArticles();
    } catch (error) {
      toast.error("Failed to delete article");
    }
  };

  const handleEditCategoryChange = async (categoryValue: string) => {
    setEditCategory(categoryValue);

    setEditSubCategory("");
    setEditDeepTopic("");

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

  const handleEditSubcategoryChange = async (subcategoryValue: string) => {
    setEditSubCategory(subcategoryValue);

    setEditDeepTopic("");

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
  const filteredArticles = articles.filter(
    (article) =>
      article.art_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.cat_category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: articles.length,
    accepted: articles.filter((a) => a.art_status === 1).length,
    pending: articles.filter((a) => a.art_status === 0).length,
    rejected: articles.filter((a) => a.art_status === 2).length,
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return (
          <span className="admin-badge admin-badge-warning">⏳ Pending</span>
        );
      case 1:
        return (
          <span className="admin-badge admin-badge-success">✅ Accepted</span>
        );
      case 2:
        return (
          <span className="admin-badge admin-badge-error">❌ Rejected</span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Header */}
      <div className="admin-header-title" style={{ marginBottom: "1.5rem" }}>
        <h2>Posts Management</h2>
        <p>Manage and moderate all submitted articles</p>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-title">Total Articles</span>
            <div className="admin-stat-icon" style={{ background: "#EFF6FF" }}>
              📄
            </div>
          </div>
          <div className="admin-stat-value">{stats.total}</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-title">Accepted</span>
            <div className="admin-stat-icon" style={{ background: "#D1FAE5" }}>
              ✅
            </div>
          </div>
          <div className="admin-stat-value" style={{ color: "#059669" }}>
            {stats.accepted}
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-title">Pending</span>
            <div className="admin-stat-icon" style={{ background: "#FEF3C7" }}>
              ⏳
            </div>
          </div>
          <div className="admin-stat-value" style={{ color: "#D97706" }}>
            {stats.pending}
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-title">Rejected</span>
            <div className="admin-stat-icon" style={{ background: "#FEE2E2" }}>
              ❌
            </div>
          </div>
          <div className="admin-stat-value" style={{ color: "#DC2626" }}>
            {stats.rejected}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="admin-search">
        <span className="admin-search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search articles by title or category..."
          className="admin-search-input"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Table Container */}
      <div className="admin-table-container">
        {isLoading ? (
          <div className="admin-loading">
            <div className="admin-spinner"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: "60px" }}>#</th>
                    <th>Article</th>
                    <th style={{ width: "100px" }}>Author</th>
                    <th style={{ width: "100px" }}>Language</th>
                    <th style={{ width: "150px" }}>Category</th>
                    <th style={{ width: "180px" }}>Category Suggestion</th>
                    <th style={{ width: "110px" }}>Status</th>
                    <th style={{ width: "110px" }}>Date</th>
                    <th style={{ width: "280px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedArticles.map((article, idx) => (
                    <tr key={article.id}>
                      <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "8px",
                              background: "#F3F4F6",
                              overflow: "hidden",
                              flexShrink: 0,
                            }}
                          >
                            {article.art_image ? (
                              <img
                                src={`${API_BASE_URL}/uploads/${article.art_image}`}
                                alt={article.art_title}
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
                                  fontSize: "12px",
                                  color: "#9CA3AF",
                                }}
                              >
                                No img
                              </div>
                            )}
                          </div>
                          <div>
                            <div
                              style={{
                                fontWeight: 500,
                                color: "#ffffff",
                                maxWidth: "200px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {article.art_title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        User #{article.user_id}
                      </td>
                      <td>
                        <span className="admin-badge admin-badge-info">
                          {article.lan_name}
                        </span>
                      </td>
                      <td>
                        <div
                          style={{
                            fontWeight: 500,
                            color: "#6B7280",
                            maxWidth: "180px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {article.cat_category}
                        </div>

                        {/* Subcategory */}
                        {article.cat_subcategory && (
                          <div
                            style={{
                              fontSize: "11px",
                              color: "#6B7280",
                              maxWidth: "180px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              marginTop: "2px",
                            }}
                          >
                            📂 {article.cat_subcategory}
                          </div>
                        )}

                        {/* Deep Topic */}
                        {article.cat_sub_subcategory && (
                          <div
                            style={{
                              fontSize: "11px",
                              color: "#9CA3AF",
                              maxWidth: "180px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              marginTop: "2px",
                            }}
                          >
                            🏷️ {article.cat_sub_subcategory}
                          </div>
                        )}
                      </td>
                      <td>
  {article.art_cat_suggestion ? (
    <div
      style={{
        maxWidth: "180px",
        fontSize: "12px",
        color: "#F59E0B",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
      title={article.art_cat_suggestion}
    >
      💡 {article.art_cat_suggestion}
    </div>
  ) : (
    <span
      style={{
        color: "#6B7280",
        fontSize: "12px",
      }}
    >
      —
    </span>
  )}
</td>
                      <td>{getStatusBadge(article.art_status)}</td>
                      <td
                        style={{
                          whiteSpace: "nowrap",
                          fontSize: "13px",
                          color: "#6B7280",
                        }}
                      >
                        {new Date(article.updated_at).toLocaleDateString()}
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            onClick={() => handleAccept(article.id)}
                            className="admin-btn admin-btn-primary"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(article.id)}
                            className="admin-btn admin-btn-warning"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="admin-btn admin-btn-danger"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => openEditModal(article)}
                            className="admin-btn admin-btn-secondary"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => openViewModal(article)}
                            className="admin-btn admin-btn-secondary"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredArticles.length === 0 && (
              <div className="admin-empty">
                <p>No articles found</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && filteredArticles.length > 0 && (
              <div className="admin-pagination">
                <span className="admin-pagination-info">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredArticles.length
                  )}{" "}
                  of {filteredArticles.length} articles
                </span>
                <div className="admin-pagination-buttons">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="admin-pagination-btn"
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`admin-pagination-btn ${
                          currentPage === pageNum
                            ? "admin-pagination-active"
                            : ""
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="admin-pagination-btn"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {/* VIEW MODAL */}

      {viewModal && selectedArticle && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>View Article</h2>

              <button
                onClick={() => setViewModal(false)}
                className="admin-modal-close"
              >
                ✕
              </button>
            </div>

            {selectedArticle.art_image && (
              <img
                src={`${API_BASE_URL}/uploads/${selectedArticle.art_image}`}
                alt={selectedArticle.art_title}
                style={{
                  width: "100%",
                  maxHeight: "350px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  marginBottom: "20px",
                }}
              />
            )}

            <h1
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              {selectedArticle.art_title}
            </h1>

            <h3
              style={{
                color: "#9CA3AF",
                marginBottom: "20px",
              }}
            >
              {selectedArticle.art_subtitle}
            </h3>

            <div
              style={{
                whiteSpace: "pre-line",
                lineHeight: "1.8",
                color: "#E5E7EB",
              }}
            >
              {selectedArticle.art_text}
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>Edit Article</h2>

              <button
                onClick={() => setEditModal(false)}
                className="admin-modal-close"
              >
                ✕
              </button>
            </div>

            {/* Row 1 */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              {/* Title */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                    color: "#E5E7EB",
                  }}
                >
                  Title
                </label>

                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Enter article title"
                  className="admin-input"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                    color: "#E5E7EB",
                  }}
                >
                  Subtitle
                </label>

                <input
                  type="text"
                  value={editSubtitle}
                  onChange={(e) => setEditSubtitle(e.target.value)}
                  placeholder="Enter subtitle"
                  className="admin-input"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              {/* Language */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                    color: "#E5E7EB",
                  }}
                >
                  Language
                </label>

                <select
                  value={editLanguage}
                  onChange={(e) => setEditLanguage(e.target.value)}
                  className="admin-input"
                >
                  <option value="">Select Language</option>

                  {languages.map((lan) => (
                    <option key={lan.id} value={lan.id}>
                      {lan.lan_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                    color: "#E5E7EB",
                  }}
                >
                  Category
                </label>

                <select
                  value={editCategory}
                  onChange={(e) => handleEditCategoryChange(e.target.value)}
                  className="admin-input"
                >
                  <option value="">Select Category</option>

                  {categories.map((cat, index) => (
                    <option key={index} value={cat.cat_category}>
                      {cat.cat_category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                    color: "#E5E7EB",
                  }}
                >
                  Subcategory
                </label>

                <select
                  value={editSubCategory}
                  onChange={(e) => handleEditSubcategoryChange(e.target.value)}
                  className="admin-input"
                  disabled={!editCategory}
                >
                  <option value="">Select Subcategory</option>

                  {subcategories.map((sub, index) => (
                    <option key={index} value={sub.cat_subcategory}>
                      {sub.cat_subcategory}
                    </option>
                  ))}
                </select>
              </div>

              {/* Deep Topic */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                    color: "#E5E7EB",
                  }}
                >
                  Deep Topic
                </label>

                <select
                  value={editDeepTopic}
                  onChange={(e) => setEditDeepTopic(e.target.value)}
                  disabled={!editSubCategory}
                  className="admin-input"
                >
                  <option value="">Select Deep Topic</option>

                  {deepTopics.map((topic, index) => (
                    <option key={index} value={topic.cat_sub_subcategory}>
                      {topic.cat_sub_subcategory}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Article Text */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "600",
                  color: "#E5E7EB",
                }}
              >
                Article Text
              </label>

              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Write article content..."
                rows={8}
                className="admin-textarea"
              />
            </div>

            {/* Current Image */}
            {selectedArticle?.art_image && (
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                    color: "#E5E7EB",
                  }}
                >
                  Current Image
                </label>

                <img
                  src={`${API_BASE_URL}/uploads/${selectedArticle.art_image}`}
                  alt={selectedArticle.art_title}
                  style={{
                    width: "140px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              </div>
            )}

            {/* Upload Image */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "600",
                  color: "#E5E7EB",
                }}
              >
                Upload New Image
              </label>

              <input
                type="file"
                onChange={(e) =>
                  setEditImage(e.target.files ? e.target.files[0] : null)
                }
                className="admin-input"
              />
            </div>

            {/* Update Button */}
            <button
              onClick={handleUpdate}
              className="admin-btn admin-btn-primary"
            >
              Update Article
            </button>
          </div>
        </div>
      )}
    </>
  );
}
