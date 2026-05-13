import express from "express";
import db from "../db.js";
import multer from "multer";
import path from "path";

const router = express.Router();


// ============================
// MULTER CONFIG
// ============================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024, // 5 KB
  },
});


// ============================
// ADD POST
// ============================

router.post(
  "/",
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        title,
        subtitle,
        slug,
        content,
        metaTitle,
        metaDesc,
        metaKeywords,
        languageId,
        category,
        subcategory,
        deepTopic,
      } = req.body;

      // Validation
      if (!title || !content) {
        return res.status(400).json({
          message: "Title and content required",
        });
      }

      // Find category ID using deep topic
      const [categoryRows] = await db.query(
        `
        SELECT id
        FROM categories
        WHERE cat_sub_subcategory = ?
        LIMIT 1
        `,
        [deepTopic]
      );

      if (categoryRows.length === 0) {
        return res.status(400).json({
          message: "Deep topic not found",
        });
      }

      const cat_id = categoryRows[0].id;

      // Image path
      const imagePath = req.file
        ? req.file.filename
        : null;

      // Convert keywords array
      const keywordsString = Array.isArray(
        JSON.parse(metaKeywords)
      )
        ? JSON.parse(metaKeywords).join(",")
        : metaKeywords;

        // ============================
// GENERATE ARTICLE DESCRIPTION
// ============================

const articleDescription = `
${title || ""}

${subtitle || ""}

${content || ""}

${metaTitle || ""}

${metaDesc || ""}

${keywordsString || ""}
`.trim();
      // Insert article
      await db.query(
        `
        INSERT INTO articles
        (
          cat_id,
          art_title,
          art_subtitle,
          slug,
          art_text,
          art_image,
          lan_id,
          art_status,
          art_meta_title,
          art_meta_desc,
          art_meta_keywords,
          art_description
        )

VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
  cat_id,
  title,
  subtitle || null,
  slug,
  content,
  imagePath,
  languageId,
  0,
  metaTitle || null,
  metaDesc || null,
  keywordsString || null,
  articleDescription,
]
      );

      return res.status(201).json({
        message: "Post submitted successfully",
      });

    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: "Server error",
      });
    }
  }
);

export default router;