import express from "express";
import db from "../db.js";
import multer from "multer";
import path from "path";
import axios from "axios";

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
    fileSize: 50 * 1024, // 5 KB
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
       const userId = req.cookies.userId;

      if (!userId) {
        return res.status(401).json({
          message: "Please login first",
        });
      }
      const {
  articleId,
  title,
  subtitle,
  slug,
  content,
  metaTitle,
  metaDesc,
  metaKeywords,
  art_tags,
  languageId,
  category,
  subcategory,
  deepTopic,
  editorImages,
  captchaToken,
  categorySuggestion
} = req.body;
if (!captchaToken) {
  return res.status(400).json({
    message: "Captcha required",
  });
}

const response = await axios.post(
  "https://www.google.com/recaptcha/api/siteverify",
  null,
  {
    params: {
      secret:
        process.env.RECAPTCHA_SECRET_KEY,
      response: captchaToken,
    },
  }
);

if (!response.data.success) {
  return res.status(400).json({
    message:
      "Captcha verification failed",
  });
}
let artMedia = [];

try {
  if (editorImages) {
    artMedia = JSON.parse(editorImages);
  }
} catch (err) {
  artMedia = [];
}

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

${art_tags || ""} 

`.trim();
      // ============================
// UPDATE EXISTING ARTICLE
// ============================

if (articleId) {

  await db.query(
    `
    UPDATE articles
    SET
      cat_id = ?,
      art_title = ?,
      art_subtitle = ?,
      slug = ?,
      art_text = ?,
      art_media = ?,
      lan_id = ?,
      art_status = 0,
      art_meta_title = ?,
      art_meta_desc = ?,
      art_meta_keywords = ?,
      art_tags=?,
      art_description = ?,
      art_cat_suggestion=?,
      updated_at = CURRENT_TIMESTAMP
      ${imagePath ? ", art_image = ?" : ""}
    WHERE id = ? AND user_id = ?
    `,
    imagePath
      ? [
          cat_id,
          title,
          subtitle || null,
          slug,
          content,
          JSON.stringify(artMedia),
          languageId,
          metaTitle || null,
          metaDesc || null,
          keywordsString || null,
          art_tags || null,
          articleDescription,
          categorySuggestion,
          imagePath,
          articleId,
          userId,
        ]
      : [
          cat_id,
          title,
          subtitle || null,
          slug,
          content,
          JSON.stringify(artMedia),
          languageId,
          metaTitle || null,
          metaDesc || null,
          keywordsString || null,
          art_tags || null,
          articleDescription,
          categorySuggestion,
          articleId,
          userId,
        ]
  );

} else {

  // ============================
  // CREATE NEW ARTICLE
  // ============================

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
  art_media,
  lan_id,
  art_status,
  art_meta_title,
  art_meta_desc,
  art_meta_keywords,
  art_tags,
  art_description,
  art_cat_suggestion,
  user_id
)

    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      cat_id,
      title,
      subtitle || null,
      slug,
      content,
      imagePath,
      JSON.stringify(artMedia),
      languageId,
      0,
      metaTitle || null,
      metaDesc || null,
      keywordsString || null,
      art_tags|| null,
      articleDescription,
      categorySuggestion,
      userId,
    ]
  );
}

      return res.status(201).json({
        message: "Post submitted successfully",
      });

    } catch (error) {
  console.log(error);

  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "Image size must be less than 50 KB",
    });
  }

  return res.status(500).json({
    message: "Server error",
  });
}
  }
);

export default router;