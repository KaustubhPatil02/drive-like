const mongoose = require("mongoose");
const Grid = require("gridfs-stream");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected!");

    // ✅ Initialize GridFS Stream
    Grid.mongo = mongoose.mongo;
    const gfs = Grid(conn.connection.db);
    gfs.collection("uploads");

    return gfs;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
