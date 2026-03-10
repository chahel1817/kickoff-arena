import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/matches
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).lean();
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ matchHistory: user.matchHistory || [] });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/matches
router.post('/', protect, async (req, res) => {
    try {
        const { score, total, shooters, breakdown } = req.body;
        const reward = (score || 0) * 3_500_000;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                $push: {
                    matchHistory: {
                        $each: [{ date: new Date(), score, total: total ?? 5, shooters: shooters ?? [], breakdown: breakdown ?? [], reward }],
                        $slice: -50,
                    }
                },
                $inc: { budget: reward }
            },
            { new: true, lean: true }
        );

        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ success: true, matchHistory: user.matchHistory, budget: user.budget });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
