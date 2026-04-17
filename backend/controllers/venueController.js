const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

exports.getVenueLayout = (req, res) => {
    // Mock layout for the hackathon
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
        // Fetch AI prediction for zones
        const responseA = await axios.post(`${AI_SERVICE_URL}/predict/density`, {
            zone_id: 'zone_A',
            time: new Date().toISOString()
        });
        
        const responseB = await axios.post(`${AI_SERVICE_URL}/predict/wait-time`, {
            stall_id: 'food_1',
            current_queue_length: 12
        });

        res.json({
            status: 'success',
            data: {
                densities: [responseA.data],
                queues: [responseB.data],
                alerts: responseA.data.predicted_density > 0.8 ? ['High congestion at Main Entrance'] : []
            }
        });
    } catch (error) {
        console.error('Error fetching AI data:', error.message);
        // Fallback simulated data if AI service is not running locally
        res.json({
            status: 'fallback',
            data: {
                densities: [
                    { zone_id: 'zone_A', predicted_density: 0.75 },
                    { zone_id: 'zone_B', predicted_density: 0.3 }
                ],
                queues: [
                    { stall_id: 'food_1', predicted_wait_time_minutes: 15 }
                ],
                alerts: []
            }
        });
    }
};

exports.sendAlert = (req, res) => {
    const { message, severity } = req.body;
    // In a real scenario, you'd save this to Firebase/MongoDB and push to websockets
    console.log(`[ALERT] ${severity}: ${message}`);
    res.json({ success: true, message: 'Alert broadcasted successfully.' });
};

exports.getOptimalRoute = async (req, res) => {
    const { start, end } = req.body;
    try {
        const response = await axios.get(`${AI_SERVICE_URL}/optimize/routes?start=${start}&end=${end}`);
        res.json(response.data);
    } catch (error) {
        res.json({
            start,
            end,
            optimal_route: [start, 'Fallback_Zone', end],
            estimated_time_minutes: 10
        });
    }
};
