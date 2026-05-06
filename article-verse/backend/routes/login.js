import express from "express";
import db from "../db.js"; // your mysql connection

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check user by email
    const [rows] = await db.query(
      "SELECT * FROM users WHERE user_email = ?",
      [email]
    );

    // ❌ User not found
    if (rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = rows[0];

    // ❌ Password incorrect
    if (user.user_password !== password) {
      return res.status(401).json({
        message: "Incorrect password",
      });
    }

    // ✅ Update login status
    await db.query(
      "UPDATE users SET user_loggedin = 1 WHERE id = ?",
      [user.id]
    );
res.cookie("userId", user.id, {
  httpOnly: true,
  secure: false, // true in production (HTTPS)
  sameSite: "lax",
});
    // ✅ Success
    return res.status(200).json({
      message: "Welcome to the Chulkani!!",
      user: {
        id: user.id,
        email: user.user_email,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;