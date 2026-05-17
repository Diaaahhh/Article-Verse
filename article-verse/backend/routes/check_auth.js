import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {

  try {

    const userId = req.cookies.userId;

    // Not logged in
    if (!userId) {
      return res.status(401).json({
        loggedIn: false,
      });
    }

    // Get user from database
    const [rows] = await db.query(
      `
      SELECT id, user_email
      FROM users
      WHERE id = ?
      `,
      [userId]
    );

    // User not found
    if (rows.length === 0) {
      return res.status(401).json({
        loggedIn: false,
      });
    }

    const user = rows[0];

    // Success
    return res.status(200).json({
      loggedIn: true,
      user: {
        id: user.id,
        email: user.user_email,
      },
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      loggedIn: false,
    });

  }

});

export default router;