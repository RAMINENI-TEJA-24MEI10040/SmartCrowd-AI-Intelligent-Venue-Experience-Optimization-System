import express from 'express';
import venueController from '../controllers/venueController';
import { validate, schemas } from '../middleware/validate';
import { firebaseAuth, requireRole } from '../middleware/firebaseAuth';

const router = express.Router();

// Public routes
router.get('/venue', venueController.getVenueLayout);
router.get('/crowd-status', venueController.getCrowdStatus);

// Protected routes (requires Firebase JWT)
router.post('/route', firebaseAuth, validate(schemas.routeSchema), venueController.getOptimalRoute);

// Admin routes (requires strict Admin Role)
router.post('/admin/alerts', firebaseAuth, requireRole('admin'), validate(schemas.alertSchema), venueController.sendAlert);

export default router;
