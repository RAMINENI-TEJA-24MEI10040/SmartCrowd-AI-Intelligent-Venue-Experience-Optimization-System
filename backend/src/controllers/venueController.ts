import { Request, Response, NextFunction } from 'express';
import venueService from '../services/venueService';

class VenueController {
    public async getVenueLayout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const layout = await venueService.getLayout();
            res.json(layout);
        } catch (error) {
            next(error);
        }
    }

    public async getCrowdStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { data, cached } = await venueService.getLiveCrowdStatus();
            res.json({ status: 'success', data, cached });
        } catch (error: any) {
            res.status(503).json({
                status: 'error',
                message: error.message,
                fallback_data: {
                    densities: [{ zone_id: 'zone_A', predicted_density: 0.75 }],
                    queues: [{ stall_id: 'food_1', predicted_wait_time_minutes: 15 }],
                    alerts: []
                }
            });
        }
    }

    public async sendAlert(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { message, severity } = req.body;
            const alertRecord = await venueService.broadcastAlert(message, severity);
            
            if (req.io) {
                req.io.emit('emergency_alert', alertRecord);
            }

            res.json({ success: true, message: 'Alert broadcasted securely.', alert: alertRecord });
        } catch (error) {
            next(error);
        }
    }

    public async getOptimalRoute(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { start, end } = req.body;
            const routeData = await venueService.calculateOptimalRoute(start, end);
            res.json(routeData);
        } catch (error: any) {
            res.status(503).json({
                error: error.message,
                optimal_route: [req.body.start, 'Fallback_Zone', req.body.end],
                estimated_time_minutes: 10
            });
        }
    }
}

export default new VenueController();
