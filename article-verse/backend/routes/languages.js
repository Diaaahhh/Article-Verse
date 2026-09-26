import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    console.log("LANGUAGES API CALLED");

    console.log("DB CONFIG:", {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
    });

    const [rows] = await db.query(`
      SELECT *
      FROM languages
      ORDER BY lan_name ASC
    `);

    console.log("LANGUAGES RESULT:", rows);

    res.json(rows);
  } catch (error) {
    console.error("LANGUAGES API ERROR:", error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
      code: error.code,
      errno: error.errno,
      sqlMessage: error.sqlMessage,
    });
  }
});

export default router;