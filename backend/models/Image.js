const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: mongoose.Schema.Types.ObjectId, ref: "uploads.files", required: true },
  folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null }, // Allow null
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Image", ImageSchema);