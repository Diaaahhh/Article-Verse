import express from "express";
import multer from "multer";
import path from "path";
import db from "../db.js";

const router = express.Router();

// ======================
// Multer Storage
// ======================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/settings/");
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    cb(
      null,
      "site-icon-" + Date.now() + ext
    );
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/x-icon",
      "image/vnd.microsoft.icon",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// =====================================
// POST /api/settings/icon
// =====================================

router.post(
  "/icon",
  upload.single("icon"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const filename = req.file.filename;

      await db.query(
        `
        UPDATE settings
        SET site_icon = ?
        WHERE id = 1
        `,
        [filename]
      );

      return res.json({
        success: true,
        message: "Icon uploaded successfully",
        filename,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  });
/*
GET SETTINGS
GET /api/settings
*/
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM settings WHERE id = 1 LIMIT 1"
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Settings not found",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("GET SETTINGS ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/*
UPDATE SETTINGS
PUT /api/settings
*/
router.put("/", async (req, res) => {
  try {
    const {
      fb_app_id,
      google_site_verification,
      pinterest_domain_verify,
    } = req.body;

    await db.query(
      `
      UPDATE settings
      SET
        fb_app_id = ?,
        google_site_verification = ?,
        pinterest_domain_verify = ?
      WHERE id = 1
      `,
      [
        fb_app_id || "",
        google_site_verification || "",
        pinterest_domain_verify || "",
      ]
    );

    const [updatedRows] = await db.query(
      "SELECT * FROM settings WHERE id = 1 LIMIT 1"
    );

    res.json({
      success: true,
      message: "Settings updated successfully",
      data: updatedRows[0],
    });
  } catch (error) {
    console.error("UPDATE SETTINGS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

export default router;