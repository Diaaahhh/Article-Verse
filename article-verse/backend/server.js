import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import hero_sectionRoutes from "./routes/hero_section.js";
import category_sectionRoutes from "./routes/category_section.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/hero_section", hero_sectionRoutes);
app.use("/api/category_section", category_sectionRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});