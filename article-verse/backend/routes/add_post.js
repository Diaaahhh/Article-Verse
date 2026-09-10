import express from "express";
import db from "../db.js";
import multer from "multer";
import path from "path";
import axios from "axios";
import sharp from "sharp";
import fs from "fs/promises";

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
    // You can increase this if users upload large photos.
    fileSize: 5 * 1024 * 1024, // 5 MB
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
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
        categorySuggestion,
      } = req.body;


      // ============================
      // CAPTCHA
      // ============================

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
            secret: process.env.RECAPTCHA_SECRET_KEY,
            response: captchaToken,
          },
        }
      );

      if (!response.data.success) {
        return res.status(400).json({
          message: "Captcha verification failed",
        });
      }


      // ============================
      // EDITOR IMAGES
      // ============================

      let artMedia = [];

      try {
        if (editorImages) {
          artMedia = JSON.parse(editorImages);
        }
      } catch (err) {
        artMedia = [];
      }


      // ============================
      // VALIDATION
      // ============================

      if (!title || !content) {
        return res.status(400).json({
          message: "Title and content required",
        });
      }


      // ============================
      // FIND CATEGORY
      // ============================

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


      // ============================
      // IMAGE PATH
      // ============================

      const imagePath = req.file
        ? req.file.filename
        : null;


      // ============================
      // GENERATE OG IMAGE
      // ============================

      let ogImagePath = null;

      if (req.file) {
        const originalImagePath = req.file.path;

        const originalExtension = path.extname(
          req.file.filename
        );

        const originalName = path.basename(
          req.file.filename,
          originalExtension
        );

        ogImagePath = `${originalName}-og.jpg`;

        const ogImageFullPath = path.join(
          "uploads",
          ogImagePath
        );

        try {
          await sharp(originalImagePath)
            .resize({
              width: 1200,
              height: 600,

              // IMPORTANT:
              // contain = NO CROPPING
              fit: "contain",

              // Background around the image
              // when aspect ratio doesn't match 2:1
              background: {
                r: 255,
                g: 255,
                b: 255,
                alpha: 1,
              },
            })
            .jpeg({
              quality: 90,
            })
            .toFile(ogImageFullPath);

          console.log(
            "OG image generated:",
            ogImageFullPath
          );
        } catch (imageError) {
          console.log(
            "OG image generation failed:",
            imageError
          );

          ogImagePath = null;
        }
      }


      // ============================
      // KEYWORDS
      // ============================

      let keywordsString = metaKeywords;

      try {
        const parsedKeywords = JSON.parse(metaKeywords);

        if (Array.isArray(parsedKeywords)) {
          keywordsString = parsedKeywords.join(",");
        }
      } catch (err) {
        // Already a normal string
      }


      // ============================
      // ARTICLE DESCRIPTION
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

        if (imagePath) {

          await db.query(
            `
            UPDATE articles
            SET
              cat_id = ?,
              art_title = ?,
              art_subtitle = ?,
              slug = ?,
              art_text = ?,
              art_image = ?,
              art_og_image = ?,
              art_media = ?,
              lan_id = ?,
              art_status = 0,
              art_meta_title = ?,
              art_meta_desc = ?,
              art_meta_keywords = ?,
              art_tags = ?,
              art_description = ?,
              art_cat_suggestion = ?,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ? AND user_id = ?
            `,
            [
              cat_id,
              title,
              subtitle || null,
              slug,
              content,
              imagePath,
              ogImagePath,
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
              art_tags = ?,
              art_description = ?,
              art_cat_suggestion = ?,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ? AND user_id = ?
            `,
            [
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
        }

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
            art_og_image,
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
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            cat_id,
            title,
            subtitle || null,
            slug,
            content,
            imagePath,
            ogImagePath,
            JSON.stringify(artMedia),
            languageId,
            0,
            metaTitle || null,
            metaDesc || null,
            keywordsString || null,
            art_tags || null,
            articleDescription,
            categorySuggestion,
            userId,
          ]
        );
      }


      // ============================
      // SUCCESS
      // ============================

      return res.status(201).json({
        message: "Post submitted successfully",
        image: imagePath,
        ogImage: ogImagePath,
      });

    } catch (error) {
  console.error("ADD POST ERROR:", error);

  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "Image size must be less than 5 MB",
    });
  }

  return res.status(500).json({
    message: "Server error",
    error: error instanceof Error ? error.message : String(error),
    code: error?.code || null,
    sqlMessage: error?.sqlMessage || null,
  });
}
  }
);

export default router;