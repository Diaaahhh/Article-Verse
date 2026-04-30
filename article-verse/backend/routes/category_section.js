import express from "express";
import db from "../db.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET UNIQUE CATEGORIES
|--------------------------------------------------------------------------
| Returns only unique category names from categories table
| Limited initially to all unique rows
|--------------------------------------------------------------------------
*/

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DISTINCT cat_category
      FROM categories
      ORDER BY cat_category ASC
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