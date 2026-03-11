import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'kickoff-arena-dev-secret-change-in-prod';

// Cookie options
const isProd = process.env.NODE_ENV === 'production';
const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax', // 'none' required for cross-domain cookies in prod
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'
};


// Register
router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        console.log('Register request received:', { username, passwordLength: password?.length });

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        const normalizedUsername = username.toLowerCase().trim();
        const existing = await User.findOne({ username: normalizedUsername });
        if (existing) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        console.log('Creating user:', normalizedUsername);
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username: normalizedUsername,
            password: hashedPassword,
            email: email ? email.toLowerCase() : undefined,
            displayName: username
        });

        console.log('User created successfully:', user._id);

        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

        res.cookie('ka_session', token, cookieOptions);
        res.status(201).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                displayName: user.displayName
            }
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: err.message || 'Server error during registration' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        const user = await User.findOne({ username: username.toLowerCase().trim() });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
        res.cookie('ka_session', token, cookieOptions);
        res.json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                displayName: user.displayName
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    res.cookie('ka_session', '', { ...cookieOptions, maxAge: 0 });
    res.json({ success: true });
});

// Me (Get Current User)
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Profile
router.patch('/profile', protect, async (req, res) => {
    try {
        const body = req.body;
        const allowed = ['displayName', 'profilePicture', 'bio', 'country', 'activeTeamId', 'theme', 'language'];
        const update = {};
        for (const key of allowed) {
            if (key in body) update[key] = body[key];
        }

        const user = await User.findByIdAndUpdate(req.user.id, { $set: update }, { returnDocument: 'after' }).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default router;
