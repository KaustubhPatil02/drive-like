const express = require("express");
const multer = require("multer");
const { GridFSBucket } = require("mongodb");
const mongoose = require("mongoose");
const Image = require("../models/Image");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Configure Multer for Buffer Storage (GridFS)
const storage = multer.memoryStorage();
const upload = multer({ storage });
//     const userId = req.user.id;

//     const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });

//     // ✅ Upload Image to GridFS
//     const uploadStream = bucket.openUploadStream(req.file.originalname, {
//       contentType: req.file.mimetype,
//       metadata: { userId, folder },
//     });

//     uploadStream.end(req.file.buffer);

//     uploadStream.on("finish", async () => {
//       try {
//         // ✅ Convert folder ID properly
//         const folderId = 
//         folder === "root" || !folder || !mongoose.Types.ObjectId.isValid(folder) 
//         ? null 
//         : new mongoose.Types.ObjectId(folder);
      
        

        
//         const newImage = new Image({
//           name,
//           url: uploadStream.id, // ✅ Store GridFS file ID
//           folder: folderId,
//           user: userId,
//         });
//         console.log("Folder ID before saving:", folderId);


//         await newImage.save();
//         res.status(201).json(newImage);
//       } catch (error) {
//         console.error("❌ Database Save Error:", error);
//         res.status(500).json({ error: "Error saving image details" });
//       }
//     });

//     uploadStream.on("error", (err) => {
//       console.error("❌ GridFS Upload Error:", err);
//       res.status(500).json({ error: "Error uploading file" });
//     });

//   } catch (err) {
//     console.error("❌ Upload Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const { name, folder } = req.body;
    const userId = req.user.id;

    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });

    // ✅ Check if folder is valid before conversion
    const folderId = 
      folder === "root" || !folder || !mongoose.Types.ObjectId.isValid(folder) 
      ? null 
      : new mongoose.Types.ObjectId(folder);

    console.log("Folder ID before saving:", folderId); // ✅ Debugging

    // ✅ Upload Image to GridFS
    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
      metadata: { userId, folder: folderId },
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", async () => {
      try {
        const newImage = new Image({
          name,
          url: uploadStream.id, // ✅ Store GridFS file ID
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
    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
    const fileId = new mongoose.Types.ObjectId(req.params.id); // Ensure correct ObjectId format

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
