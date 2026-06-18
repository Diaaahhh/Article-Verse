import express from "express";
import db from "../db.js";
const router = express.Router();

/*
POST /api/likes
Body:
{
  article_id: 1,
  user_id: 12
}
*/

router.post("/", async (req, res) => {
  const { article_id, user_id } = req.body;

  try {
    const [existing] = await db.query(
      `
      SELECT id
      FROM likes
      WHERE article_id = ?
      AND user_id = ?
      `,
      [article_id, user_id]
    );

    // UNLIKE
    if (existing.length > 0) {
      await db.query(
        `
        DELETE FROM likes
        WHERE article_id = ?
        AND user_id = ?
        `,
        [article_id, user_id]
      );

      await db.query(
        `
        UPDATE articles
        SET art_like = GREATEST(art_like - 1, 0)
        WHERE id = ?
        `,
        [article_id]
      );

      return res.json({
        liked: false,
      });
    }

    // LIKE
    await db.query(
      `
      INSERT INTO likes(article_id,user_id)
      VALUES(?,?)
      `,
      [article_id, user_id]
    );

    await db.query(
      `
      UPDATE articles
      SET art_like = art_like + 1
      WHERE id = ?
      `,
      [article_id]
    );

    res.json({
      liked: true,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.get("/:articleId/:userId", async (req, res) => {
  try {
    const { articleId, userId } = req.params;

    const [rows] = await db.query(
      `
      SELECT id
      FROM likes
      WHERE article_id = ?
      AND user_id = ?
      `,
      [articleId, userId]
    );

    res.json({
      liked: rows.length > 0,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});
export default router;