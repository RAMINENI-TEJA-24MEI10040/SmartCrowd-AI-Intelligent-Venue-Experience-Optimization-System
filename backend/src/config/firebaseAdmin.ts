const admin = require('firebase-admin');

// In a real production app, ensure your service account credentials are in the .env or mounted securely.
// For example: const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      // credential: admin.credential.cert(serviceAccount)
      // Using default application credentials if running on GCP:
      credential: admin.credential.applicationDefault(),
    });
  }
} catch (error) {
  console.error('Firebase Admin Initialization Error:', error);
}

module.exports = admin;
