import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.query(
      "SELECT id FROM users WHERE user_name = ? LIMIT 1",
      [userId]
    );

    res.json({
      available: rows.length === 0,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      available: false,
      message: "Server error",
    });
  }
});

export default router;