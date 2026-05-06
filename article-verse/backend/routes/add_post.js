import express from "express";
import db from "../db.js";

const router = express.Router();

// ADD POST API
router.post("/", async (req, res) => {
  try {
    const {
      title,
      subtitle,
      content,
      metaTitle,
      metaDesc,
      metaKeywords,
    } = req.body;

    // Basic validation
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content required" });
    }

    // Default values (you can change later)
    const cat_id = 1;
    const lan_id = 1;
    const art_status = 0; // pending

    // Convert keywords array → string
    const keywordsString = Array.isArray(metaKeywords)
      ? metaKeywords.join(",")
      : metaKeywords;

    const query = `
      INSERT INTO articles
      (cat_id, art_title, art_subtitle, art_text, art_image, lan_id, art_status, art_meta_title, art_meta_desc, art_meta_keywords)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      cat_id,
      title,
      subtitle || null,
      content,
      null, // art_image (you can add later)
      lan_id,
      art_status,
      metaTitle || null,
      metaDesc || null,
      keywordsString || null,
    ];

    await db.query(query, values);

    return res.status(201).json({
      message: "Post created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;