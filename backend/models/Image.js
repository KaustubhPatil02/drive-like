const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Image", ImageSchema);
