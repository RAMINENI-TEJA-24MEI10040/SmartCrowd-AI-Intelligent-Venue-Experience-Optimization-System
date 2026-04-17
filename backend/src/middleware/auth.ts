const jwt = require('jsonwebtoken');

// Simple JWT Auth middleware placeholder
module.exports = function(req, res, next) {
    // In production with Firebase, you'd verify the Firebase ID token here:
    // admin.auth().verifyIdToken(token)
    
    const token = req.header('x-auth-token');
    
    // For hackathon/demo purposes, we allow requests to pass if no strict auth is configured
    if (!token && process.env.NODE_ENV === 'production') {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    
    next();
};
