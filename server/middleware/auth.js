import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'kickoff-arena-dev-secret-change-in-prod';

export const protect = async (req, res, next) => {
    try {
        const token = req.cookies.ka_session;

        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
