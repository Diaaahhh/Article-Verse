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

/*
|--------------------------------------------------------------------------
| GET SUBCATEGORIES BY CATEGORY
|--------------------------------------------------------------------------
| Returns unique subcategories based on selected category
|--------------------------------------------------------------------------
*/

router.get("/subcategories/:category", async (req, res) => {
  try {
    // Get category from URL parameter
    const { category } = req.params;

    // Query database
    const [rows] = await db.query(
      `
      SELECT DISTINCT cat_subcategory
      FROM categories
      WHERE cat_category = ?
      AND cat_subcategory IS NOT NULL
      AND cat_subcategory != ''
      ORDER BY cat_subcategory ASC
      `,
      [category]
    );

    // Send result
    res.json(rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET DEEP TOPICS BY SUBCATEGORY
|--------------------------------------------------------------------------
| Returns unique sub-subcategories
|--------------------------------------------------------------------------
*/

router.get("/deep-topics/:subcategory", async (req, res) => {
  try {
    // Get subcategory from URL
    const { subcategory } = req.params;

    // Query database
    const [rows] = await db.query(
      `
      SELECT DISTINCT cat_sub_subcategory
      FROM categories
      WHERE cat_subcategory = ?
      AND cat_sub_subcategory IS NOT NULL
      AND cat_sub_subcategory != ''
      ORDER BY cat_sub_subcategory ASC
      `,
      [subcategory]
    );

    // Send response
    res.json(rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// get all subcategories
router.get("/all-subcategories", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DISTINCT cat_subcategory
      FROM categories
      WHERE cat_subcategory IS NOT NULL
      AND cat_subcategory != ''
      ORDER BY cat_subcategory ASC
    `);

    res.json(rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

//get all dee ptopics
router.get("/all-deep-topics", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DISTINCT cat_sub_subcategory
      FROM categories
      WHERE cat_sub_subcategory IS NOT NULL
      AND cat_sub_subcategory != ''
      ORDER BY cat_sub_subcategory ASC
    `);

    res.json(rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.get("/deep-topic/:deepTopic", async (req, res) => {
  try {
    const { deepTopic } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        cat_category,
        cat_subcategory,
        cat_sub_subcategory
      FROM categories
      WHERE cat_sub_subcategory = ?
      LIMIT 1
      `,
      [deepTopic]
    );

    res.json(rows[0] || null);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.get("/subcategory/:subcategory", async (req, res) => {
  try {
    const { subcategory } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        cat_category,
        cat_subcategory
      FROM categories
      WHERE cat_subcategory = ?
      LIMIT 1
      `,
      [subcategory]
    );

    res.json(rows[0] || null);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

export default router;