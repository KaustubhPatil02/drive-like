import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from "./routes/authRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";


dotenv.config();
const app = express();

app.use(cors(
    {
        origin: ['https://drive-like-frontend-8uug8y3vb-kaustubh-patils-projects-d98e276b.vercel.app',
        'https://drive-like.vercel.app',],
        methods: ['GET', 'POST'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization']
    }
));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running');
});
// routes
app.use('/api/auth', authRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/images', imageRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`✅ Backend server is running on port ${PORT}!`);
        });
    })
    .catch(err => console.log(err));

// Add this for Vercel
export default app;