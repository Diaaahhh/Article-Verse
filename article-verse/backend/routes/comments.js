import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/:articleId", async (req, res) => {
  try {
    const { articleId } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        comments.*,
        users.user_name,
        users.user_image
      FROM comments
      JOIN users
        ON comments.user_id = users.id
      WHERE comments.article_id = ?
      ORDER BY comments.created_at DESC
      `,
      [articleId]
    );

    res.json(rows);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
});

router.post("/", async (req, res) => {

  try {

    const {
      article_id,
      user_id,
      comment_text
    } = req.body;

    if (!comment_text.trim()) {
      return res.status(400).json({
        message: "Comment required"
      });
    }
console.log(req.body);
console.log({
  article_id,
  user_id,
  comment_text
});
    await db.query(
      `
      INSERT INTO comments
      (
        article_id,
        user_id,
        comment_text
      )
      VALUES (?, ?, ?)
      `,
      [
        article_id,
        user_id,
        comment_text
      ]
    );

    res.status(201).json({
      message: "Comment added"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
});

export default router;