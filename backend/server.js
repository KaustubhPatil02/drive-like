import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from "./routes/authRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
dotenv.config();
const app = express();

// CORS configuration (MUST be before any middleware)
const allowedOrigins = [
    'https://drive-like-frontend.vercel.app',
  'http://localhost:5173'
];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200); // Handle preflight request
    }
    next();
});
app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true
  }));
  
// Middleware
app.use(express.json());

// Debugging: Log incoming requests
app.use((req, res, next) => {
    console.log(`➡️ ${req.method} ${req.path}`);
    console.log("Headers:", req.headers);
    next();
});

// Health check route
app.get('/', (req, res) => {
    res.send('✅ Server is running');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/search', searchRoutes);
// Database Connection & Server Start
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`✅ Backend server is running on port ${PORT}!`);
        });
    })
    .catch(err => console.log("❌ MongoDB Connection Error:", err));

// Export for Vercel deployment
export default app;
