const axios = require('axios');
const NodeCache = require('node-cache');
const admin = require('../config/firebaseAdmin');

// Cache AI predictions for 15 seconds to prevent spamming the Python service
const cache = new NodeCache({ stdTTL: 15 });

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

exports.getVenueLayout = (req, res) => {
    const layout = {
        zones: [
            { id: 'zone_A', name: 'Main Entrance', type: 'gate' },
            { id: 'zone_B', name: 'Food Court 1', type: 'food' },
            { id: 'zone_C', name: 'Restrooms North', type: 'restroom' },
            { id: 'zone_D', name: 'Seating Block 100s', type: 'seating' }
        ]
    };
    res.json(layout);
};

exports.getCrowdStatus = async (req, res) => {
    try {
        const cacheKey = 'crowd_status';
        const cachedData = cache.get(cacheKey);

        if (cachedData) {
            return res.json({ status: 'success', data: cachedData, cached: true });
        }

        // Fetch AI prediction for zones
        const responseA = await axios.post(`${AI_SERVICE_URL}/predict/density`, {
            zone_id: 'zone_A',
            time: new Date().toISOString()
        });
        
        const responseB = await axios.post(`${AI_SERVICE_URL}/predict/wait-time`, {
            stall_id: 'food_1',
            current_queue_length: 12
        });

        const data = {
            densities: [responseA.data],
            queues: [responseB.data],
            alerts: responseA.data.predicted_density > 0.8 ? ['High congestion at Main Entrance'] : []
        };

        // Save to cache
        cache.set(cacheKey, data);

        res.json({ status: 'success', data, cached: false });
    } catch (error) {
        console.error('Error fetching AI data:', error.message);
        res.status(503).json({
            status: 'error',
            message: 'AI Service unavailable',
            fallback_data: {
                densities: [{ zone_id: 'zone_A', predicted_density: 0.75 }],
                queues: [{ stall_id: 'food_1', predicted_wait_time_minutes: 15 }],
                alerts: []
            }
        });
    }
};

exports.sendAlert = async (req, res) => {
    const { message, severity } = req.body;
    
    // In production: Save alert to Firestore or Realtime DB
    try {
        // await admin.firestore().collection('alerts').add({ message, severity, timestamp: admin.firestore.FieldValue.serverTimestamp() });
        console.log(`[ALERT] ${severity}: ${message}`);
        res.json({ success: true, message: 'Alert broadcasted securely.' });
    } catch (error) {
        console.error('Firestore Error:', error);
        res.status(500).json({ error: 'Failed to broadcast alert' });
    }
};

exports.getOptimalRoute = async (req, res) => {
    const { start, end } = req.body;
    const cacheKey = `route_${start}_${end}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return res.json(cachedData);
    }

    try {
        const response = await axios.get(`${AI_SERVICE_URL}/optimize/routes?start=${start}&end=${end}`);
        cache.set(cacheKey, response.data);
        res.json(response.data);
    } catch (error) {
        res.status(503).json({
            error: 'AI Routing Service unavailable',
            optimal_route: [start, 'Fallback_Zone', end],
            estimated_time_minutes: 10
        });
    }
};
