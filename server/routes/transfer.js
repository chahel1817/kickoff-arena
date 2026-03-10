import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { calculatePlayerValue } from '../utils/valuation.js';

const router = express.Router();

// GET /api/transfer
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).lean();
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ budget: user.budget, transfers: user.transfers });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/transfer
router.post('/', protect, async (req, res) => {
    try {
        const { position, playerOut, playerIn } = req.body;
        if (!position || !playerOut || !playerIn) return res.status(400).json({ error: 'Missing fields' });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const marketFee = calculatePlayerValue(playerIn.rating);
        if (user.budget < marketFee) return res.status(422).json({ error: 'Insufficient budget' });

        if (position === 'goalkeeper') {
            user.goalkeeper = playerIn;
        } else {
            const arr = user[position];
            const idx = arr.findIndex(p => p.id === playerOut.id);
            if (idx === -1) return res.status(404).json({ error: 'Player not found in squad' });
            arr[idx] = playerIn;
            user.markModified(position);
        }

        user.budget -= marketFee;
        user.transfers.push({
            date: new Date(),
            playerOut: { name: playerOut.name, position: playerOut.position || position, rating: playerOut.rating, fee: 0 },
            playerIn: { name: playerIn.name, position: playerIn.position, rating: playerIn.rating, fee: marketFee },
        });

        await user.save();
        res.json({ success: true, budget: user.budget, transfers: user.transfers });
    } catch (err) {
        console.error('Transfer Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
