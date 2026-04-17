/**
 * Venue Service
 * Contains business logic, integrates with the AI Service and handles caching.
 * @module services/venueService
 */

const axios = require('axios');
const NodeCache = require('node-cache');
const venueRepository = require('../repositories/venueRepository');

// Cache AI predictions for 15 seconds to prevent spamming the Python service
const cache = new NodeCache({ stdTTL: 15 });
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

class VenueService {
  /**
   * Gets the static venue layout.
   * @returns {Promise<Object>}
   */
  async getLayout() {
    return await venueRepository.getLayout();
  }

  /**
   * Fetches the current crowd status from the AI service.
   * Leverages caching to improve performance.
   * @returns {Promise<Object>} The live density and queue data.
   */
  async getLiveCrowdStatus() {
    const cacheKey = 'crowd_status';
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return { data: cachedData, cached: true };
    }

    try {
      // Simulate Vertex AI calls via the local Python API
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

      cache.set(cacheKey, data);
      return { data, cached: false };
    } catch (error) {
      console.error('[VenueService] AI fetch error:', error.message);
      throw new Error('AI Service Unavailable');
    }
  }

  /**
   * Processes and broadcasts an alert, then saves it.
   * @param {string} message 
   * @param {string} severity 
   * @returns {Promise<Object>}
   */
  async broadcastAlert(message, severity) {
    const savedAlert = await venueRepository.saveAlert(message, severity);
    return savedAlert;
  }

  /**
   * Calls the AI service to calculate the optimal route.
   * @param {string} start 
   * @param {string} end 
   * @returns {Promise<Object>}
   */
  async calculateOptimalRoute(start, end) {
    const cacheKey = `route_${start}_${end}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) return cachedData;

    try {
      const response = await axios.get(`${AI_SERVICE_URL}/optimize/routes?start=${start}&end=${end}`);
      cache.set(cacheKey, response.data);
      return response.data;
    } catch (error) {
      throw new Error('Routing Service Unavailable');
    }
  }
}

module.exports = new VenueService();
