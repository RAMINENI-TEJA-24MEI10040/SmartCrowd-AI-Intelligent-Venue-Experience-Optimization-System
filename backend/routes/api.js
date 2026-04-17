const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venueController');

// In a real app, you would add auth middleware here
// const auth = require('../middleware/auth');

// Get venue layout and zones
router.get('/venue', venueController.getVenueLayout);

// Get real-time crowd data (this bridges to the Python AI service)
router.get('/crowd-status', venueController.getCrowdStatus);

// Admin: Send an alert
router.post('/admin/alerts', venueController.sendAlert);

// Get optimal route
router.post('/route', venueController.getOptimalRoute);

module.exports = router;
