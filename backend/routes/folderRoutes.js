const express = require("express");
const Folder = require("../models/Folder");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create Folder
router.post("/", authMiddleware, async (req, res) => {
  const { name, parentFolder } = req.body;
  const userId = req.user.id;

  const newFolder = new Folder({ name, parentFolder, user: userId });
  await newFolder.save();

  res.json(newFolder);
});

// Get Folders for a User
router.get("/", authMiddleware, async (req, res) => {
  const folders = await Folder.find({ user: req.user.id });
  res.json(folders);
});

module.exports = router;
