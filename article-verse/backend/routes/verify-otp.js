import express from "express";
import db from "../db.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/", async (req, res) => {

  try {

    const { email, otp } = req.body;

    const [rows] = await db.query(
      `
      SELECT *
      FROM email_otps
      WHERE email=?
      ORDER BY id DESC
      LIMIT 1
      `,
      [email]
    );

    if (!rows.length) {
      return res.status(400).json({
        message: "OTP not found",
      });
    }

    const record = rows[0];

    if (record.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (
      new Date(record.expires_at)
      < new Date()
    ) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    const data = JSON.parse(
      record.registration_data
    );

    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        data.password,
        salt
      );

    const fullName =
      `${data.first_name} ${data.last_name}`;

    await db.query(
      `
      INSERT INTO users
      (
        user_name,
        user_id,
        first_name,
        last_name,
        user_email,
        user_password,
        gender,
        user_dob
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        fullName,
        data.user_id,
        data.first_name,
        data.last_name,
        data.email,
        hashedPassword,
        data.gender,
        data.dob,
      ]
    );

    await db.query(
      `
      DELETE FROM email_otps
      WHERE email=?
      `,
      [email]
    );

    return res.status(201).json({
      message:
        "Account created successfully",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });

  }

});

export default router;