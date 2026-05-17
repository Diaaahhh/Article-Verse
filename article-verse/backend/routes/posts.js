import express from "express";
import db from "../db.js";
import multer from "multer";
const router = express.Router();

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },

});

const upload = multer({ storage });

// ==============================
// GET ALL ARTICLES
// ==============================

router.get("/", async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT
        a.id,
        a.user_id,
        a.art_title,
        a.art_subtitle,
        a.art_text,
        a.art_image,
        a.updated_at,
        a.art_status,
        a.cat_id,
        a.lan_id,

        l.lan_name,

        c.cat_category,
        c.cat_subcategory,
        c.cat_sub_subcategory

      FROM articles a

      LEFT JOIN languages l
      ON a.lan_id = l.id

      LEFT JOIN categories c
      ON a.cat_id = c.id

      ORDER BY a.updated_at DESC
    `);

    return res.status(200).json(rows);

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });

  }
});


// ==============================
// ACCEPT ARTICLE
// ==============================

router.put("/accept/:id", async (req, res) => {

  try {

    const { id } = req.params;

    await db.query(
      `
      UPDATE articles
      SET art_status = 1
      WHERE id = ?
      `,
      [id]
    );

    return res.status(200).json({
      message: "Article accepted",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });

  }
});


// ==============================
// REJECT ARTICLE
// ==============================

router.put("/reject/:id", async (req, res) => {

  try {

    const { id } = req.params;

    await db.query(
      `
      UPDATE articles
      SET art_status = 2
      WHERE id = ?
      `,
      [id]
    );

    return res.status(200).json({
      message: "Article rejected",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });

  }
});


// ==============================
// DELETE ARTICLE
// ==============================

router.delete("/:id", async (req, res) => {

  try {

    const { id } = req.params;

    await db.query(
      `
      DELETE FROM articles
      WHERE id = ?
      `,
      [id]
    );

    return res.status(200).json({
      message: "Article deleted",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });

  }
});

// ==============================
// GET SINGLE ARTICLE
// ==============================

router.get("/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT *
      FROM articles
      WHERE id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    return res.status(200).json(rows[0]);

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });

  }

});

// ==============================
// UPDATE ARTICLE
// ==============================

router.put(
  "/:id",
  upload.single("art_image"),
  async (req, res) => {

    try {

      const { id } = req.params;

      const {
        art_title,
        art_subtitle,
        art_text,
        cat_category,
        cat_subcategory,
        cat_sub_subcategory,
        lan_id,
      } = req.body;

      const lanId = lan_id;

      let imageName = null;

      if (req.file) {
        imageName = req.file.filename;
      }

      // Find category
      const [categoryRows] = await db.query(
        `
        SELECT id
        FROM categories
        WHERE
          cat_category = ?
          AND cat_subcategory = ?
          AND cat_sub_subcategory = ?
        LIMIT 1
        `,
        [
          cat_category,
          cat_subcategory,
          cat_sub_subcategory,
        ]
      );

      let catId = null;

      if (categoryRows.length > 0) {
        catId = categoryRows[0].id;
      }

      if (imageName) {

        await db.query(
          `
          UPDATE articles
          SET
            art_title = ?,
            art_subtitle = ?,
            art_text = ?,
            cat_id = ?,
            art_image = ?,
            lan_id = ?
          WHERE id = ?
          `,
          [
            art_title,
            art_subtitle,
            art_text,
            catId,
            imageName,
            lanId,
            id,
          ]
        );

      } else {

        await db.query(
          `
          UPDATE articles
          SET
            art_title = ?,
            art_subtitle = ?,
            art_text = ?,
            cat_id = ?,
            lan_id = ?
          WHERE id = ?
          `,
          [
            art_title,
            art_subtitle,
            art_text,
            catId,
            lanId,
            id,
          ]
        );

      }

      return res.status(200).json({
        message: "Article updated successfully",
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