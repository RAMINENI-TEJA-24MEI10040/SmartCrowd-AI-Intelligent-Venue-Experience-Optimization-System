/**
 * Venue Repository
 * Responsible for all direct database interactions (Firestore/MongoDB).
 * @module repositories/venueRepository
 */

const admin = require('../config/firebaseAdmin');

class VenueRepository {
  /**
   * Retrieves the static layout of the venue.
   * @returns {Promise<Object>} The venue layout object.
   */
  async getLayout() {
    // In a real app, this would fetch from Firestore: admin.firestore().collection('venue').doc('layout').get()
    return {
      zones: [
        { id: 'zone_A', name: 'Main Entrance', type: 'gate' },
        { id: 'zone_B', name: 'Food Court 1', type: 'food' },
        { id: 'zone_C', name: 'Restrooms North', type: 'restroom' },
        { id: 'zone_D', name: 'Seating Block 100s', type: 'seating' }
      ]
    };
  }

  /**
   * Saves a broadcasted alert to the database.
   * @param {string} message The alert message.
   * @param {string} severity The severity level (e.g., 'high', 'critical').
   * @returns {Promise<Object>} The saved alert record.
   */
  async saveAlert(message, severity) {
    const alertRecord = { message, severity, timestamp: new Date().toISOString() };
    console.log('[DB Mock] Saved alert:', alertRecord);
    return alertRecord;
  }
}

module.exports = new VenueRepository();
