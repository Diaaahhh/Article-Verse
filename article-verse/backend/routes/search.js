import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let { q } = req.query;

    if (!q || q.trim() === "") {
      return res.json([]);
    }

    // =========================
    // CLEAN QUERY
    // =========================

    q = q.trim();

    // Split words
    let words = q.split(/\s+/);

    // Max 7 words
    words = words.slice(0, 7);

    const finalQuery = words.join(" ");

    const wordCount = words.length;

    let sql = "";
    let values = [];

    // =========================
    // SEARCH IN TITLE
    // =========================

    if (wordCount <= 3) {
      sql = `
        SELECT *,
        
        CASE
          WHEN art_title LIKE ? THEN 1
          WHEN art_title LIKE ? THEN 2
          ELSE 3
        END AS priority,

        MATCH(art_title)
        AGAINST(? IN NATURAL LANGUAGE MODE) AS relevance

        FROM articles

        WHERE
          art_status = 1
          AND (
            MATCH(art_title)
            AGAINST(? IN NATURAL LANGUAGE MODE)
            OR art_title LIKE ?
          )

        ORDER BY
          priority ASC,
          relevance DESC,
          created_at DESC

        LIMIT 20
      `;

      values = [
        `${finalQuery}%`,
        `%${finalQuery}%`,
        finalQuery,
        finalQuery,
        `%${finalQuery}%`,
      ];
    }

    // =========================
    // SEARCH IN DESCRIPTION
    // =========================

    else {
      sql = `
        SELECT *,
        
        CASE
          WHEN art_description LIKE ? THEN 1
          WHEN art_description LIKE ? THEN 2
          ELSE 3
        END AS priority,

        MATCH(art_description)
        AGAINST(? IN NATURAL LANGUAGE MODE) AS relevance

        FROM articles

        WHERE
          art_status = 1
          AND (
            MATCH(art_description)
            AGAINST(? IN NATURAL LANGUAGE MODE)
            OR art_description LIKE ?
          )

        ORDER BY
          priority ASC,
          relevance DESC,
          created_at DESC

        LIMIT 20
      `;

      values = [
        `${finalQuery}%`,
        `%${finalQuery}%`,
        finalQuery,
        finalQuery,
        `%${finalQuery}%`,
      ];
    }

    const [rows] = await db.query(sql, values);

    res.json(rows);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

export default router;