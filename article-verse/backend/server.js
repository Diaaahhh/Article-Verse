import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import db from "./db.js";

import hero_sectionRoutes from "./routes/hero_section.js";
import category_sectionRoutes from "./routes/category_section.js";
import content_sectionRoutes from "./routes/content_section.js";
import loginRoute from "./routes/login.js";
import cookieParser from "cookie-parser";
import addPostRoute from "./routes/add_post.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://article-frontend.chulkani.com",
      "https://chulkani.com",
    "https://www.chulkani.com",
    ],
    credentials: true,
  })
);

db.query("SELECT 1")
  .then(() => {
    console.log("Database Connected!");
  })
  .catch((err) => {
    console.log("DB ERROR:", err);
  });

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.use("/api/hero_section", hero_sectionRoutes);
app.use("/api/category_section", category_sectionRoutes);
app.use("/api/content_section", content_sectionRoutes);
app.use("/api/login", loginRoute);
app.use(cookieParser());
app.use("/api/add-post", addPostRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
