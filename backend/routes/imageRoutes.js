const express = require("express");
const multer = require("multer");
const Image = require("../models/Image");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Upload Image
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  const { name, folder } = req.body;
  const userId = req.user.id;

  const newImage = new Image({
    name,
    url: `/uploads/${req.file.filename}`,
    folder,
    user: userId,
  });

  await newImage.save();
  res.json(newImage);
});

// Search Images by Name
router.get("/search", authMiddleware, async (req, res) => {
  const { query } = req.query;
  const images = await Image.find({
    user: req.user.id,
    name: { $regex: query, $options: "i" },
  });

  res.json(images);
});

module.exports = router;
