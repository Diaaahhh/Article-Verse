"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/constants/api";
import toast from "react-hot-toast";

export default function Settings() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fb_app_id: "",
    google_site_verification: "",
    pinterest_domain_verify: "",
  });

  const [icon, setIcon] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings`);
      const data = await res.json();

      setFormData({
        fb_app_id: data.fb_app_id || "",
        google_site_verification:
          data.google_site_verification || "",
        pinterest_domain_verify:
          data.pinterest_domain_verify || "",
      });

      if (data.site_icon) {
        setIconPreview(
          `${API_BASE_URL}/uploads/settings/${data.site_icon}`
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load settings");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleIconChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setIcon(file);

    setIconPreview(URL.createObjectURL(file));
  };

  const uploadIcon = async () => {
    if (!icon) return;

    const fd = new FormData();
    fd.append("icon", icon);

    const res = await fetch(
      `${API_BASE_URL}/api/settings/icon`,
      {
        method: "POST",
        body: fd,
      }
    );

    return res.json();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (icon) {
        await uploadIcon();
      }

      const res = await fetch(
        `${API_BASE_URL}/api/settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Settings updated");
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-card">
        <h1 className="settings-title">
          Website Settings
        </h1>

        <div className="settings-grid">

          {/* Facebook App ID */}
          <div className="settings-group">
            <label>
              Facebook App ID
            </label>

            <input
              type="text"
              name="fb_app_id"
              value={formData.fb_app_id}
              onChange={handleChange}
              placeholder="123456789"
            />
          </div>

          {/* Google Verification */}
          <div className="settings-group">
            <label>
              Google Site Verification
            </label>

            <input
              type="text"
              name="google_site_verification"
              value={formData.google_site_verification}
              onChange={handleChange}
              placeholder="google123456"
            />
          </div>

          {/* Pinterest Verification */}
          <div className="settings-group">
            <label>
              Pinterest Verification
            </label>

            <input
              type="text"
              name="pinterest_domain_verify"
              value={formData.pinterest_domain_verify}
              onChange={handleChange}
              placeholder="pinterest123456"
            />
          </div>

          {/* Website Icon */}
          <div className="settings-group">
            <label>
              Website Icon
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleIconChange}
            />

            {iconPreview && (
              <img
                src={iconPreview}
                alt="Website Icon"
                className="settings-icon-preview"
              />
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="settings-save-btn"
          >
            {loading
              ? "Saving..."
              : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}