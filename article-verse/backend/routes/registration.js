import express from "express";
import db from "../db.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // check existing user
    const [existingUsers] = await db.query(
      "SELECT * FROM users WHERE user_email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // HASH PASSWORD
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

    // insert user
    await db.query(
      `INSERT INTO users (user_email, user_password)
       VALUES (?, ?)`,
      [email, hashedPassword]
    );

    return res.status(201).json({
      message: "Account created successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;