const request = require('supertest');
const express = require('express');
const apiRoutes = require('../routes/api');
const { validate, schemas } = require('../middleware/validate');

const app = express();
app.use(express.json());

// Mock auth middleware for testing
app.use((req, res, next) => {
    if (req.headers.authorization === 'Bearer valid-token') {
        req.user = { uid: 'test-user' };
        return next();
    }
    // Let it pass without user if no token, auth middleware handles rejection in real app
    // For unit testing routes independently we can inject mock middleware,
    // but since we required it in the router, we test the rejection.
    next();
});

app.use('/api', apiRoutes);

describe('Backend API Tests', () => {
    it('GET /api/venue should return layout', async () => {
        const res = await request(app).get('/api/venue');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('zones');
    });

    it('GET /api/crowd-status should return fallback or success', async () => {
        const res = await request(app).get('/api/crowd-status');
        // Because AI service is not running in this unit test, it should return 503 fallback
        expect(res.statusCode).toEqual(503);
        expect(res.body).toHaveProperty('fallback_data');
    });

    it('POST /api/route should reject without auth token', async () => {
        const res = await request(app)
            .post('/api/route')
            .send({ start: 'zone_A', end: 'zone_D' });
        expect(res.statusCode).toEqual(401);
    });

    it('POST /api/route should reject invalid payload (zod validation)', async () => {
        // Here we simulate passing auth but failing validation
        process.env.BYPASS_AUTH = 'true';
        process.env.NODE_ENV = 'development';
        
        const res = await request(app)
            .post('/api/route')
            .set('Authorization', 'Bearer valid-token') // Bypass actual token verification using our local mock
            .send({ start: 'A' }); // Missing 'end', and 'start' is too short
            
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual('Validation failed');
    });
});
