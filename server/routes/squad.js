import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/squad
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).lean();
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({
            goalkeeper: user.goalkeeper,
            defenders: user.defenders,
            midfielders: user.midfielders,
            forwards: user.forwards,
            formation: user.formation,
            selectedTeam: user.selectedTeam,
            selectedManager: user.selectedManager,
            selectedCaptain: user.selectedCaptain,
            tacticsLayout: user.tacticsLayout,
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// PATCH /api/squad
router.patch('/', protect, async (req, res) => {
    try {
        const body = req.body;
        const allowed = [
            'userName', 'selectedLeague', 'selectedTeam', 'selectedManager',
            'formation', 'goalkeeper', 'defenders', 'midfielders', 'forwards',
            'selectedCaptain', 'tacticsLayout',
        ];

        const update = {};
        for (const key of allowed) {
            if (key in body) update[key] = body[key];
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: update },
            { returnDocument: 'after', lean: true }
        );

        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
