import express from "express";
import db from "../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

/* ======================================================
   PROFILE UPLOAD FOLDER
====================================================== */

const profileUploadPath = "uploads/profiles";

/* ======================================================
   CREATE FOLDER IF NOT EXISTS
====================================================== */

if (!fs.existsSync(profileUploadPath)) {

  fs.mkdirSync(profileUploadPath, { recursive: true });

}

/* ======================================================
   MULTER STORAGE
====================================================== */

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, profileUploadPath);

  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() + path.extname(file.originalname);

    cb(null, uniqueName);

  },

});

/* ======================================================
   MULTER CONFIG
====================================================== */

const upload = multer({

  storage,

  limits: {
    fileSize: 10 * 1024, // 10KB
  },

  fileFilter: (req, file, cb) => {

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {

      return cb(
        new Error(
          "Only JPG, PNG, and WEBP images are allowed"
        )
      );

    }

    cb(null, true);

  },

});

/* ======================================================
   GET PROFILE
====================================================== */

router.get("/", async (req, res) => {
  try {

    // Get user id from cookie
    const userId = req.cookies.userId;

    // User not logged in
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Fetch user data
    const [rows] = await db.query(
      `
      SELECT
  id,
  user_name,
  user_email,
  user_about,
  user_image,
  user_followers,
  user_following,
  user_phone,

  DATE_FORMAT(user_dob, '%Y-%m-%d') AS user_dob,

  DATE_FORMAT(user_dob, '%d %M %Y') AS formatted_dob,

  created_at

FROM users
WHERE id = ?
      `,
      [userId]
    );

    // User not found
    if (rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Send user data
    return res.status(200).json({
      user: rows[0],
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });

  }
});

/* ======================================================
   GET USER ALL ARTICLES
====================================================== */

router.get("/:id/articles", async (req, res) => {

  try {

    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT
  id,
  art_title,
  art_subtitle,
  art_description,
  art_image,
  created_at,
  slug,
  art_status,
  art_comment

      FROM articles

      WHERE user_id = ?

      ORDER BY created_at DESC
      `,
      [id]
    );

    return res.status(200).json({
      articles: rows,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });

  }

});

/* ======================================================
   GET PUBLIC PROFILE BY ID
====================================================== */

router.get("/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        id,
        user_name,
        user_email,
        user_about,
        user_image,
        user_followers,
        user_following,
        user_phone,

        DATE_FORMAT(user_dob, '%Y-%m-%d') AS user_dob,

        DATE_FORMAT(user_dob, '%d %M %Y') AS formatted_dob,

        created_at

      FROM users
      WHERE id = ?
      `,
      [id]
    );

    if (rows.length === 0) {

      return res.status(404).json({
        message: "User not found",
      });

    }

    return res.status(200).json({
      user: rows[0],
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });

  }

});

/* ======================================================
   UPDATE PROFILE
====================================================== */

router.put("/update", async (req, res) => {

  try {

    // Get logged in user id
    const userId = req.cookies.userId;

    // Not logged in
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Get data from frontend
    const {
      user_name,
      user_about,
      user_email,
      user_phone,
      user_dob,
    } = req.body;

    // Dynamic update fields
    const fields = [];
    const values = [];



    /* =========================
       FULL NAME
    ========================= */

    if (user_name !== undefined) {

      fields.push("user_name = ?");
      values.push(user_name);

    }



    /* =========================
       BIO
    ========================= */

    if (user_about !== undefined) {

      fields.push("user_about = ?");
      values.push(user_about);

    }



    /* =========================
       EMAIL
    ========================= */

    if (user_email !== undefined) {

      // Check duplicate email
      const [existingEmail] = await db.query(
        `
        SELECT id
        FROM users
        WHERE user_email = ?
        AND id != ?
        `,
        [user_email, userId]
      );

      // Email already exists
      if (existingEmail.length > 0) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }

      fields.push("user_email = ?");
      values.push(user_email);

    }



    /* =========================
       PHONE
    ========================= */

    if (user_phone !== undefined) {

      fields.push("user_phone = ?");
      values.push(user_phone);

    }



    /* =========================
       DATE OF BIRTH
    ========================= */

    if (user_dob !== undefined) {

      fields.push("user_dob = ?");
      values.push(user_dob);

    }



    /* =========================
       NO CHANGES
    ========================= */

    if (fields.length === 0) {

      return res.status(400).json({
        message: "No changes provided",
      });

    }



    // Add user id at end
    values.push(userId);



    /* =========================
       UPDATE QUERY
    ========================= */

    await db.query(
      `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE id = ?
      `,
      values
    );



    return res.status(200).json({
      message: "Profile updated successfully",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });

  }

});

/* ======================================================
   UPLOAD PROFILE IMAGE
====================================================== */

router.put("/upload-image", (req, res) => {

  upload.single("user_image")(req, res, async (err) => {

    try {

      /* =========================
         MULTER ERRORS
      ========================= */

      if (err instanceof multer.MulterError) {

        if (err.code === "LIMIT_FILE_SIZE") {

          return res.status(400).json({
            message: "Image must be under 10KB",
          });

        }

        return res.status(400).json({
          message: err.message,
        });

      }

      if (err) {

        return res.status(400).json({
          message: err.message,
        });

      }

      /* =========================
         AUTH CHECK
      ========================= */

      const userId = req.cookies.userId;

      if (!userId) {

        return res.status(401).json({
          message: "Unauthorized",
        });

      }

      /* =========================
         FILE CHECK
      ========================= */

      if (!req.file) {

        return res.status(400).json({
          message: "No image uploaded",
        });

      }

      /* =========================
         GET OLD IMAGE
      ========================= */

      const [rows] = await db.query(
        `
        SELECT user_image
        FROM users
        WHERE id = ?
        `,
        [userId]
      );

      const oldImage = rows[0]?.user_image;

      /* =========================
         STORE ONLY FILE NAME
      ========================= */

      const imageName = req.file.filename;

      /* =========================
         UPDATE DATABASE
      ========================= */

      await db.query(
        `
        UPDATE users
        SET user_image = ?
        WHERE id = ?
        `,
        [imageName, userId]
      );

      /* =========================
         DELETE OLD IMAGE
      ========================= */

      if (oldImage) {

        const oldImagePath = path.join(
          profileUploadPath,
          oldImage
        );

        if (fs.existsSync(oldImagePath)) {

          fs.unlinkSync(oldImagePath);

        }

      }

      /* =========================
         SUCCESS
      ========================= */

      return res.status(200).json({
        message: "Image uploaded successfully",
        image: imageName,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        message: "Server Error",
      });

    }

  });

});

/* ======================================================
   follow profile
====================================================== */

router.get("/:id/follow-status", async (req, res) => {
  try {
    const followerId = req.cookies.userId;
    const followingId = req.params.id;

    if (!followerId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const [rows] = await db.query(
      `
      SELECT id
      FROM followers
      WHERE follower_id = ?
      AND following_id = ?
      `,
      [followerId, followingId]
    );

    return res.json({
      following: rows.length > 0,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });

  }
});

/* ======================================================
   follow-unfollow profile
====================================================== */

router.post("/:id/follow", async (req, res) => {

  try {

    const followerId = req.cookies.userId;

    const followingId = req.params.id;

    if (!followerId) {

      return res.status(401).json({
        message: "Unauthorized",
      });

    }

    if (Number(followerId) === Number(followingId)) {

      return res.status(400).json({
        message: "You cannot follow yourself",
      });

    }

    const [existing] = await db.query(
      `
      SELECT id
      FROM followers
      WHERE follower_id = ?
      AND following_id = ?
      `,
      [followerId, followingId]
    );

    // Unfollow
    if (existing.length > 0) {

      await db.query(
        `
        DELETE FROM followers
        WHERE follower_id = ?
        AND following_id = ?
        `,
        [followerId, followingId]
      );

      await db.query(
        `
        UPDATE users
        SET user_followers = user_followers - 1
        WHERE id = ?
        `,
        [followingId]
      );

      await db.query(
        `
        UPDATE users
        SET user_following = user_following - 1
        WHERE id = ?
        `,
        [followerId]
      );

      return res.json({
        following: false,
      });

    }

    // Follow
    await db.query(
      `
      INSERT INTO followers
      (follower_id, following_id)
      VALUES (?, ?)
      `,
      [followerId, followingId]
    );

    await db.query(
      `
      UPDATE users
      SET user_followers = user_followers + 1
      WHERE id = ?
      `,
      [followingId]
    );

    await db.query(
      `
      UPDATE users
      SET user_following = user_following + 1
      WHERE id = ?
      `,
      [followerId]
    );

    return res.json({
      following: true,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });

  }

});

/* ======================================================
   followers list
====================================================== */

router.get("/:id/followers", async (req, res) => {

  try {

    const [rows] = await db.query(
      `
      SELECT
        users.id,
        users.user_name,
        users.user_image

      FROM followers

      JOIN users
      ON users.id = followers.follower_id

      WHERE followers.following_id = ?
      `,
      [req.params.id]
    );

    return res.status(200).json({
      followers: rows,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });

  }

});

/* ======================================================
   following list
====================================================== */

router.get("/:id/following", async (req, res) => {

  try {

    const [rows] = await db.query(
      `
      SELECT
        users.id,
        users.user_name,
        users.user_image

      FROM followers

      JOIN users
      ON users.id = followers.following_id

      WHERE followers.follower_id = ?
      `,
      [req.params.id]
    );

    return res.status(200).json({
      following: rows,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });

  }

});
export default router;