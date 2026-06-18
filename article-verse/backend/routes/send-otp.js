import express from "express";
import db from "../db.js";
import axios from "axios";
import { sendOTPEmail } from "../utils/sendEmail.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {

    const {
      first_name,
      last_name,
      email,
      password,
      gender,
      dob,
      user_id,
      captchaToken,
    } = req.body;

    // captcha validation

    const captchaResponse =
      await axios.post(
        "https://www.google.com/recaptcha/api/siteverify",
        null,
        {
          params: {
            secret:
              process.env.RECAPTCHA_SECRET_KEY,
            response: captchaToken,
          },
        }
      );

    if (!captchaResponse.data.success) {
      return res.status(400).json({
        message:
          "Captcha verification failed",
      });
    }

    const [emailExists] =
      await db.query(
        "SELECT id FROM users WHERE user_email=?",
        [email]
      );

    if (emailExists.length > 0) {
      return res.status(409).json({
        message:
          "Email already exists",
      });
    }

    const [userExists] =
      await db.query(
        "SELECT id FROM users WHERE user_id=?",
        [user_id]
      );

    if (userExists.length > 0) {
      return res.status(409).json({
        message:
          "User ID already exists",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const expiry = new Date(
      Date.now() + 5 * 60 * 1000
    );

    await db.query(
      `
      INSERT INTO email_otps
      (
        email,
        otp,
        registration_data,
        expires_at
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        email,
        otp,
        JSON.stringify(req.body),
        expiry,
      ]
    );

    await sendOTPEmail(email, otp);

    return res.status(200).json({
      message: "OTP sent",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: error.message,
    });

  }
});

export default router;