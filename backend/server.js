const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve images

// Import Routes
const authRoutes = require("./routes/authRoutes");
const folderRoutes = require("./routes/folderRoutes");
const imageRoutes = require("./routes/imageRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/images", imageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
