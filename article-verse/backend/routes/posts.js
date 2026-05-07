import express from "express";
import db from "../db.js";

const router = express.Router();


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

export default router;