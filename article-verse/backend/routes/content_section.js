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

/*
|--------------------------------------------------------------------------
| GET ARTICLES BY DEEP TOPIC (CURSOR PAGINATION)
|--------------------------------------------------------------------------
*/

router.get("/articles/:deepTopic", async (req, res) => {
  try {
    const { deepTopic } = req.params;

    const limit = parseInt(req.query.limit) || 10;

    const cursorDate = req.query.cursorDate;
    const cursorId = req.query.cursorId;
console.log("deepTopic received:", deepTopic);
    // STEP 1: FIND CATEGORY ID
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
      return res.json({
        articles: [],
        nextCursor: null,
      });
    }

    const categoryId = categoryRows[0].id;

    // STEP 2: BUILD QUERY
    let query = `
      SELECT *
      FROM articles
      WHERE cat_id = ?
      AND art_status = 1
    `;

    let values = [categoryId];

    // CURSOR PAGINATION
    if (cursorDate && cursorId) {
      query += `
        AND (
          created_at < ?
          OR (created_at = ? AND id < ?)
        )
      `;

      values.push(cursorDate, cursorDate, cursorId);
    }

    query += `
      ORDER BY created_at DESC, id DESC
      LIMIT ?
    `;

    values.push(limit);

    const [articles] = await db.query(query, values);

    res.json({
      articles,
      nextCursor:
        articles.length > 0
          ? {
              cursorDate: articles[articles.length - 1].created_at,
              cursorId: articles[articles.length - 1].id,
            }
          : null,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET TOP LATEST ARTICLES
|--------------------------------------------------------------------------
| Shows latest accepted articles when no category is selected
|--------------------------------------------------------------------------
*/

router.get("/latest", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const cursorDate = req.query.cursorDate;
    const cursorId = req.query.cursorId;

    let query = `
      SELECT *
      FROM articles
      WHERE art_status = 1
    `;

    let values = [];

    // Cursor pagination
    if (cursorDate && cursorId) {
      query += `
        AND (
          created_at < ?
          OR (created_at = ? AND id < ?)
        )
      `;

      values.push(cursorDate, cursorDate, cursorId);
    }

    query += `
      ORDER BY created_at DESC, id DESC
      LIMIT ?
    `;

    values.push(limit);

    const [articles] = await db.query(query, values);

    res.json({
      articles,
      nextCursor:
        articles.length > 0
          ? {
              cursorDate: articles[articles.length - 1].created_at,
              cursorId: articles[articles.length - 1].id,
            }
          : null,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});
export default router;