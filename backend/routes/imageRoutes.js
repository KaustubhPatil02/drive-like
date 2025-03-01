const express = require("express");
const multer = require("multer");
const { GridFSBucket } = require("mongodb");
const mongoose = require("mongoose");
const Image = require("../models/Image");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Configure Multer to Use Buffer Storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Upload Image to MongoDB GridFS
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const { name, folder } = req.body;
    const userId = req.user.id;

    // ✅ Get GridFS Bucket
    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });

    // ✅ Upload Image to GridFS
    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      metadata: { userId, folder },
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", async () => {
      const newImage = new Image({
        name,
        url: uploadStream.id, // ✅ Store GridFS file ID
        folder,
        user: userId,
      });

      await newImage.save();
      res.json(newImage);
    });

    uploadStream.on("error", (err) => {
      console.error("GridFS Upload Error:", err);
      res.status(500).json({ error: "Error uploading file" });
    });

  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: err.message });
  }
});
// ✅ Get a specific image by ID from GridFS
router.get("/:id", async (req, res) => {
  try {
    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });

    // ✅ Check if the file exists
    const file = await bucket.find({ _id: new mongoose.Types.ObjectId(req.params.id) }).toArray();
    if (!file || file.length === 0) {
      return res.status(404).json({ error: "File not found" });
    }

    // ✅ Send the image as a response
    res.set("Content-Type", file[0].contentType);
    bucket.openDownloadStream(new mongoose.Types.ObjectId(req.params.id)).pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
