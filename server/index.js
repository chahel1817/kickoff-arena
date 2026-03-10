import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import User from './models/User.js';


// Routes
import authRoutes from './routes/auth.js';
import squadRoutes from './routes/squad.js';
import matchRoutes from './routes/matches.js';
import transferRoutes from './routes/transfer.js';
import keeperRoutes from './routes/keeper.js';
import playerImageRoutes from './routes/player-image.js';
import teamRoutes from './routes/teams.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const clientOrigin = (process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/$/, '');
app.use(cors({
    origin: clientOrigin,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kickoff-arena')
    .then(async () => {
        console.log('✅ Connected to Kickoff Arena Database');
        // One-time migration: Force reset budgets to 0 for the new economy overhaul
        try {
            const result = await User.updateMany(
                { budget: { $gt: 0 } },
                { $set: { budget: 0 } }
            );

            if (result.modifiedCount > 0) {
                console.log(`🧹 Economy Migration: Reset budget for ${result.modifiedCount} users to €0`);
            }
        } catch (e) {
            console.warn('⚠️ Migration notice: Use existing models if already registered');
        }
    })
    .catch(err => console.error('❌ Database connection error:', err));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/squad', squadRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/transfer', transferRoutes);
app.use('/api/keeper', keeperRoutes);
app.use('/api/player-image', playerImageRoutes);
app.use('/api/teams', teamRoutes);


app.get('/', (req, res) => {
    res.json({ message: 'Kickoff Arena API is operational' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
