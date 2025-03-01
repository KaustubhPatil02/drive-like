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
    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });

    // ✅ Upload Image to GridFS with explicit contentType
    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype, // Ensure correct content type
      metadata: { userId, folder },
    });

    // ✅ Handle success and error listeners before calling `end()`
    uploadStream.on("finish", async () => {
      try {
        const newImage = new Image({
          name,
          url: uploadStream.id, // ✅ Store GridFS file ID
          folder,
          user: userId,
        });

        await newImage.save();
        res.json(newImage);
      } catch (error) {
        console.error("Database Save Error:", error);
        res.status(500).json({ error: "Error saving image details" });
      }
    });

    uploadStream.on("error", (err) => {
      console.error("GridFS Upload Error:", err);
      res.status(500).json({ error: "Error uploading file" });
    });

    // ✅ Upload file buffer after event listeners are set
    uploadStream.end(req.file.buffer);

  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get a specific image by ID from GridFS
router.get("/:id", async (req, res) => {
  try {
    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
    const fileId = new mongoose.Types.ObjectId(req.params.id);

    // ✅ Check if the file exists
    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ error: "File not found" });
    }

    // ✅ Send the image as a response with correct content type
    res.set("Content-Type", files[0].contentType || "application/octet-stream");
    bucket.openDownloadStream(fileId).pipe(res);

  } catch (err) {
    console.error("File Fetch Error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });

    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const downloadStream = bucket.openDownloadStream(fileId);

    res.set("Content-Type", "image/jpeg"); // Adjust content type if needed
    downloadStream.pipe(res);
  } catch (error) {
    console.error("Error retrieving image:", error);
    res.status(500).json({ error: "Failed to retrieve image" });
  }
});


module.exports = router;

