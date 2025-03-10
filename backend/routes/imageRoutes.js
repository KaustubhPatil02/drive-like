const express = require("express");
const multer = require("multer");
const { GridFSBucket } = require("mongodb");
const mongoose = require("mongoose");
const Image = require("../models/Image");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Configure Multer for Buffer Storage (GridFS)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const { name, folder } = req.body;
    const userId = req.user.id;

    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });

    // Validate `folder` before converting to ObjectId
    const folderId = mongoose.Types.ObjectId.isValid(folder) ? new mongoose.Types.ObjectId(folder) : null;
    console.log("Folder ID before saving:", folderId);

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
      metadata: { userId, folder: folderId },
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", async () => {
      try {
        const newImage = new Image({
          name,
          url: uploadStream.id, // Store GridFS file ID
          folder: folderId,
          user: userId,
        });

        await newImage.save();
        res.status(201).json(newImage);
      } catch (error) {
        console.error("❌ Database Save Error:", error);
        res.status(500).json({ error: "Error saving image details" });
      }
    });

    uploadStream.on("error", (err) => {
      console.error("❌ GridFS Upload Error:", err);
      res.status(500).json({ error: "Error uploading file" });
    });

  } catch (err) {
    console.error("❌ Upload Error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid file ID" });
    }

    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
    const fileId = new mongoose.Types.ObjectId(req.params.id);

    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files.length) {
      return res.status(404).json({ error: "File not found" });
    }

    res.set("Content-Type", files[0].contentType || "application/octet-stream");
    bucket.openDownloadStream(fileId).pipe(res);
  } catch (err) {
    console.error("❌ File Fetch Error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const images = await Image.find({ user: req.user.id });
    res.json(images);
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;