// try 1
// const mongoose = require("mongoose");

// const ImageSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   url: { type: mongoose.Schema.Types.ObjectId, required: true }, // ✅ Correct type for GridFS ID
//   folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// });

// module.exports = mongoose.model("Image", ImageSchema);


// try 2
// const mongoose = require("mongoose");

// const ImageSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   url: { type: String, required: true }, // ✅ Changed ObjectId to String to store image URL
//   folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null }, // ✅ Default to null if no folder
//   folder: mongoose.Types.ObjectId.isValid(folder) ? new mongoose.Types.ObjectId(folder) : null,

//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Required field
// }, { timestamps: true }); // ✅ Adds createdAt and updatedAt fields automatically

// module.exports = mongoose.model("Image", ImageSchema);

// try 3, this works well
const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: mongoose.Schema.Types.ObjectId, ref: "uploads.files", required: true },
  folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null }, // ✅ Allow null
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Image", ImageSchema);
