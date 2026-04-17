import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import http from 'http';
import { Server, Socket } from 'socket.io';
import apiRoutes from './routes/api';
import venueService from './services/venueService';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ["GET", "POST"]
    }
});

// Extend Express Request interface to include io
declare global {
  namespace Express {
    interface Request {
      io: Server;
    }
  }
}

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    optionsSuccessStatus: 200
}));

// Rate limiting: 100 requests per 15 minutes per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: { error: 'Too many requests from this IP' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);

// Strict body parsing limits
app.use(express.json({ limit: '10kb' }));

// Inject Socket.io into the request object for use in controllers
app.use((req: Request, res: Response, next: NextFunction) => {
    req.io = io;
    next();
});

// Routes
app.use('/api', apiRoutes);

// Socket.io Event Handling
io.on('connection', (socket: Socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);
    
    // Simulate real-time live density updates broadcasting to clients every 10 seconds
    const interval = setInterval(async () => {
        try {
            const { data } = await venueService.getLiveCrowdStatus();
            socket.emit('live_update', data);
        } catch (e) {
            // Ignore if AI service is not running during dev simulation
            console.error('[Socket] Error fetching live status', e);
        }
    }, 10000);

    socket.on('disconnect', () => {
        console.log(`[Socket] Client disconnected: ${socket.id}`);
        clearInterval(interval);
    });
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('[Global Error]', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Enterprise Server running securely with WebSockets on port ${PORT}`);
});
