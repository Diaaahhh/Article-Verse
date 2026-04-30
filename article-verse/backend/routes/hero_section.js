import express from "express";

const router = express.Router();

import db from "../db.js";

router.get("/", async (req, res) => {
  try {
    const  [rows] = await db.query("SELECT * FROM information");

    res.json(rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

export default router;