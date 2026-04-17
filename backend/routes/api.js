const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venueController');
const { validate, schemas } = require('../middleware/validate');
const firebaseAuth = require('../middleware/firebaseAuth');

// Public routes
router.get('/venue', venueController.getVenueLayout);
router.get('/crowd-status', venueController.getCrowdStatus);

// Protected routes (requires Firebase JWT)
// Using firebaseAuth middleware for these endpoints
router.post('/route', firebaseAuth, validate(schemas.routeSchema), venueController.getOptimalRoute);

// Admin routes (would check role in production, using auth for now)
router.post('/admin/alerts', firebaseAuth, validate(schemas.alertSchema), venueController.sendAlert);

module.exports = router;
