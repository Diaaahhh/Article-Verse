import express from "express";
import db from "../db.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET ARTICLES BY DEEP TOPIC
|--------------------------------------------------------------------------
| 1. Find ID from categories table using cat_sub_subcategory
| 2. Match with articles.cat_id
| 3. Filter art_status = 1 (accepted only)
|--------------------------------------------------------------------------
*/

router.get("/articles/:deepTopic", async (req, res) => {
  try {
    const { deepTopic } = req.params;

    // STEP 1: Get category ID
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
      return res.json([]); // No category found
    }

    const categoryId = categoryRows[0].id;

    // STEP 2: Get articles using cat_id + status filter
    const [articles] = await db.query(
      `
      SELECT *
      FROM articles
      WHERE cat_id = ?
      AND art_status = 1
      ORDER BY created_at DESC
      `,
      [categoryId]
    );

    res.json(articles);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

export default router;