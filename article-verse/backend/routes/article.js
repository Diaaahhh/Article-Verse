import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/:slug", async (req, res) => {
  try {

    const { slug } = req.params;

    const [rows] = await db.query(
  `
  SELECT 
    articles.*,
    users.user_name,
    users.user_image
  FROM articles
  LEFT JOIN users
  ON articles.user_id = users.id
  WHERE articles.slug = ?
  LIMIT 1
  `,
  [slug]
);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    res.json(rows[0]);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
});

router.get("/edit/:id", async (req, res) => {

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

    return res.status(200).json({
      article: rows[0],
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });

  }

});
export default router;