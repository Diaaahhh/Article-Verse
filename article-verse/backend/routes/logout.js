import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  res.clearCookie("userId");

  return res.status(200).json({
    message: "Logged out",
  });
});

export default router;