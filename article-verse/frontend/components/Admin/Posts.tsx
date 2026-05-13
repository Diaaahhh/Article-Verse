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
}

export default function Posts() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 6;

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

  useEffect(() => {
    fetchArticles();
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

  const filteredArticles = articles.filter(article =>
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
    accepted: articles.filter(a => a.art_status === 1).length,
    pending: articles.filter(a => a.art_status === 0).length,
    rejected: articles.filter(a => a.art_status === 2).length,
  };

  const getStatusBadge = (status: number) => {
    switch(status) {
      case 0: return <span className="admin-badge admin-badge-warning">⏳ Pending</span>;
      case 1: return <span className="admin-badge admin-badge-success">✅ Accepted</span>;
      case 2: return <span className="admin-badge admin-badge-error">❌ Rejected</span>;
      default: return null;
    }
  };

  return (
    <>
      {/* Header */}
      <div className="admin-header-title" style={{ marginBottom: '1.5rem' }}>
        <h2>Posts Management</h2>
        <p>Manage and moderate all submitted articles</p>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-title">Total Articles</span>
            <div className="admin-stat-icon" style={{ background: '#EFF6FF' }}>📄</div>
          </div>
          <div className="admin-stat-value">{stats.total}</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-title">Accepted</span>
            <div className="admin-stat-icon" style={{ background: '#D1FAE5' }}>✅</div>
          </div>
          <div className="admin-stat-value" style={{ color: '#059669' }}>{stats.accepted}</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-title">Pending</span>
            <div className="admin-stat-icon" style={{ background: '#FEF3C7' }}>⏳</div>
          </div>
          <div className="admin-stat-value" style={{ color: '#D97706' }}>{stats.pending}</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-title">Rejected</span>
            <div className="admin-stat-icon" style={{ background: '#FEE2E2' }}>❌</div>
          </div>
          <div className="admin-stat-value" style={{ color: '#DC2626' }}>{stats.rejected}</div>
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
                    <th style={{ width: '60px' }}>#</th>
                    <th>Article</th>
                    <th style={{ width: '100px' }}>Author</th>
                    <th style={{ width: '100px' }}>Language</th>
                    <th style={{ width: '150px' }}>Category</th>
                    <th style={{ width: '150px' }}>Sub Category</th>
                    <th style={{ width: '150px' }}>Deep Topics</th>
                    <th style={{ width: '110px' }}>Status</th>
                    <th style={{ width: '110px' }}>Date</th>
                    <th style={{ width: '280px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedArticles.map((article, idx) => (
                    <tr key={article.id}>
                      <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ 
                            width: '48px', 
                            height: '48px', 
                            borderRadius: '8px', 
                            background: '#F3F4F6', 
                            overflow: 'hidden', 
                            flexShrink: 0 
                          }}>
                            {article.art_image ? (
                              <img 
                                src={`${API_BASE_URL}/uploads/${article.art_image}`} 
                                alt={article.art_title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                              />
                            ) : (
                              <div style={{ 
                                width: '100%', 
                                height: '100%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                fontSize: '12px', 
                                color: '#9CA3AF' 
                              }}>
                                No img
                              </div>
                            )}
                          </div>
                          <div>
                            <div style={{ 
                              fontWeight: 500, 
                              color: '#1F2937', 
                              maxWidth: '200px', 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              whiteSpace: 'nowrap' 
                            }}>
                              {article.art_title}
                            </div>
                            <div style={{ 
                              fontSize: '12px', 
                              color: '#6B7280', 
                              maxWidth: '200px', 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              whiteSpace: 'nowrap' 
                            }}>
                              {article.art_subtitle}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>User #{article.user_id}</td>
                      <td>
                        <span className="admin-badge admin-badge-info">{article.lan_name}</span>
                      </td>
                      <td>
  <div
    style={{
      fontWeight: 500,
      color: '#1F2937',
      maxWidth: '180px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }}
  >
    {article.cat_category}
  </div>

  {/* Subcategory */}
  {article.cat_subcategory && (
    <div
      style={{
        fontSize: '11px',
        color: '#6B7280',
        maxWidth: '180px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        marginTop: '2px'
      }}
    >
      📂 {article.cat_subcategory}
    </div>
  )}

  {/* Deep Topic */}
  {article.cat_sub_subcategory && (
    <div
      style={{
        fontSize: '11px',
        color: '#9CA3AF',
        maxWidth: '180px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        marginTop: '2px'
      }}
    >
      🏷️ {article.cat_sub_subcategory}
    </div>
  )}
</td>
                      <td>{getStatusBadge(article.art_status)}</td>
                      <td style={{ whiteSpace: 'nowrap', fontSize: '13px', color: '#6B7280' }}>
                        {new Date(article.updated_at).toLocaleDateString()}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
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
                          <button className="admin-btn admin-btn-secondary">
                            Edit
                          </button>
                          <button className="admin-btn admin-btn-secondary">
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
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredArticles.length)} of{' '}
                  {filteredArticles.length} articles
                </span>
                <div className="admin-pagination-buttons">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
                        className={`admin-pagination-btn ${currentPage === pageNum ? 'admin-pagination-active' : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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
    </>
  );
}