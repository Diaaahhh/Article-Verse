import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  const userId = req.cookies.userId;

  if (!userId) {
    return res.status(401).json({ loggedIn: false });
  }

  return res.status(200).json({ loggedIn: true, userId });
});

export default router;