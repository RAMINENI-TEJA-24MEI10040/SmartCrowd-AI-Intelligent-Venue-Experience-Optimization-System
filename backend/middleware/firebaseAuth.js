const admin = require('../config/firebaseAdmin');

const firebaseAuth = async (req, res, next) => {
    // For local development bypass if explicitly set
    if (process.env.NODE_ENV !== 'production' && process.env.BYPASS_AUTH === 'true') {
        req.user = { uid: 'dev-user', role: 'admin' };
        return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Firebase Auth Error:', error.message);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

module.exports = firebaseAuth;
