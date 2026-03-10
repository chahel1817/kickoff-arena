import express from 'express';
import User from '../models/User.js';
import Team from '../models/Team.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/teams - Get all teams managed by the user
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('teams');
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({ teams: user.teams || [] });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/teams - Create a new team
router.post('/', protect, async (req, res) => {
    try {
        const { name, leagueId } = req.body;
        if (!name || !leagueId) return res.status(400).json({ error: 'Name and League ID required' });

        const newTeam = await Team.create({
            name,
            leagueId,
            userId: req.user.id
        });

        await User.findByIdAndUpdate(req.user.id, {
            $push: { teams: newTeam._id },
            activeTeamId: newTeam._id
        });

        res.status(201).json({ success: true, team: newTeam });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
