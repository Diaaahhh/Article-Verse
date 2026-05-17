import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  // Clear authentication cookie
  res.clearCookie("userId", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export default router;