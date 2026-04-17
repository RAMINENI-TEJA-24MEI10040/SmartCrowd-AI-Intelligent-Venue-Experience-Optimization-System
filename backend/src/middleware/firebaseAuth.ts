const admin = require('../config/firebaseAdmin');

/**
 * Firebase JWT Authentication Middleware
 * Validates the token and attaches the decoded user to the request object.
 */
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
        console.error('[FirebaseAuth] Error:', error.message);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

/**
 * Role-Based Access Control (RBAC) Middleware
 * @param {string} requiredRole - The required role (e.g., 'admin', 'user').
 */
const requireRole = (requiredRole) => {
    return (req, res, next) => {
        // Assume req.user.role is set via Custom Claims in Firebase Auth
        const userRole = req.user?.role || req.user?.customClaims?.role;
        
        if (userRole !== requiredRole) {
            return res.status(403).json({ error: `Forbidden: Requires ${requiredRole} role` });
        }
        next();
    };
};

module.exports = { firebaseAuth, requireRole };
