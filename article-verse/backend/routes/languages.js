import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT *
      FROM languages
      ORDER BY lan_name ASC
    `);

    res.json(rows);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

export default router;