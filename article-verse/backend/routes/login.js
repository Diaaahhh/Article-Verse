import express from "express";
import db from "../db.js"; // your mysql connection
import bcrypt from "bcryptjs";
import axios from "axios";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { loginId, password, captchaToken } = req.body;
    if (!captchaToken) {
  return res.status(400).json({
    message: "Captcha required",
  });
}
const verifyURL =
  "https://www.google.com/recaptcha/api/siteverify";

const response = await axios.post(
  verifyURL,
  null,
  {
    params: {
      secret:
        process.env.RECAPTCHA_SECRET_KEY,
      response: captchaToken,
    },
  }
);

if (!response.data.success) {
  return res.status(400).json({
    message:
      "Captcha verification failed",
  });
}
const [rows] = await db.query(
  `
  SELECT *
  FROM users
  WHERE user_email = ?
     OR user_name = ?
  LIMIT 1
  `,
  [loginId, loginId]
);

    // ❌ User not found
    if (rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = rows[0];

    // ❌ Password incorrect
    const isMatch = await bcrypt.compare(
  password,
  user.user_password
);

if (!isMatch) {
  return res.status(401).json({
    message: "Incorrect password",
  });
}

 
res.cookie("userId", user.id, {
  httpOnly: true,
secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

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