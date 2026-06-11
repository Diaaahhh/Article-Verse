import fs from "fs";
import db from "../db.js";

const data = JSON.parse(
  fs.readFileSync("./routes/medium_categories.json", "utf8")
);

const values = [];

for (const category of data) {

  const categoryName = category.category;

  for (const subcategory of category.subcategories) {

    const subcategoryName = subcategory.name;

    for (const topic of subcategory.topics) {

      const topicName = topic.name.trim();

      values.push([
        categoryName,
        subcategoryName,
        topicName
      ]);

    }
  }
}

console.log("Total rows:", values.length);

await db.query(
  `
  INSERT INTO categories
  (
    cat_category,
    cat_subcategory,
    cat_sub_subcategory
  )
  VALUES ?
  `,
  [values]
);

console.log("Import completed");
process.exit();