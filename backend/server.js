import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import { generateMockData } from './utils/mockDataGenerator.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:5173", // Vite's default port
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/activities', activityRoutes);

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Test route to generate mock data
app.post('/api/generate-mock-data', async (req, res) => {
    try {
        await generateMockData();
        res.json({ message: 'Mock data generated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

