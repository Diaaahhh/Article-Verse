import dotenv from "dotenv";
dotenv.config();

import express from "express";

import cookieParser from "cookie-parser";
import cors from "cors";

import db from "./db.js";

import hero_sectionRoutes from "./routes/hero_section.js";
import category_sectionRoutes from "./routes/category_section.js";
import content_sectionRoutes from "./routes/content_section.js";
import loginRoute from "./routes/login.js";
import addPostRoute from "./routes/add_post.js";
import registrationRoutes from "./routes/registration.js";
import logoutRoute from "./routes/logout.js";
import checkAuthRoute from "./routes/check_auth.js";
import categoryRoutes from "./routes/category_section.js";
import languageRoutes from "./routes/languages.js";
import postsRoutes from "./routes/posts.js";

const app = express();

app.use(express.json());
app.use(cookieParser()); 
app.use("/uploads", express.static("uploads"));
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
app.use("/api/add-post", addPostRoute);
app.use("/api/register", registrationRoutes);
app.use("/api/logout", logoutRoute);
app.use("/api/check-auth", checkAuthRoute);
app.use("/api/categories", categoryRoutes);
app.use("/api/languages", languageRoutes);
app.use("/api/posts", postsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
