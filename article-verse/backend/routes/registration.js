import express from "express";
import db from "../db.js";
import bcrypt from "bcryptjs";

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
} = req.body;

    // validation
    if (
  !first_name ||
  !last_name ||
  !email ||
  !password ||
  !gender ||
  !dob ||
  !user_id
) {
  return res.status(400).json({
    message: "All fields are required",
  });
}
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_@$!%*?&.#])[A-Za-z\d_@$!%*?&.#-]{8,}$/;

if (!passwordRegex.test(password)) {
  return res.status(400).json({
    message:
      "Password must contain 1 uppercase, 1 lowercase, 1 number, 1 special character and minimum 8 characters",
  });
}
const [existingUserId] = await db.query(
  "SELECT id FROM users WHERE user_name = ?",
  [user_id]
);

if (existingUserId.length > 0) {
  return res.status(409).json({
    message: "User ID already exists",
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
  `INSERT INTO users
  (
    user_name,
    first_name,
    last_name,
    user_email,
    user_password,
    gender,
    user_dob
  )
  VALUES (?, ?, ?, ?, ?, ?, ?)`,
  [
    user_id,
    first_name,
    last_name,
    email,
    hashedPassword,
    gender,
    dob,
  ]
);
const [dbName] = await db.query("SELECT DATABASE() as db");
console.log(dbName);
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