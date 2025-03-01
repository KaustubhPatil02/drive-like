import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from "./routes/authRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/images', imageRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(5000, () => {
            console.log("✅ Backend server is running!");
        });
    })
    .catch(err => console.log(err))