import express from "express";
import mongoose from "mongoose";

const healthRouter = express.Router();

/**
 * GET /api/health
 * Active Liveness & Readiness probe for AWS Application Load Balancers and Docker
 */
healthRouter.get("/", (req, res) => {
    // Check MongoDB Connection State: 1 = connected, 2 = connecting, 0 = disconnected
    const isDbConnected = mongoose.connection.readyState === 1;

    const healthStatus = {
        status: isDbConnected ? "healthy" : "degraded",
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
        database: {
            status: isDbConnected ? "connected" : "disconnected",
            readyState: mongoose.connection.readyState,
        },
        memory: {
            heapUsedMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            rssMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
        },
        environment: process.env.NODE_ENV || "development",
    };

    if (!isDbConnected) {
        // Return 503 so AWS Load Balancer or Docker marks the container as unhealthy
        return res.status(503).json(healthStatus);
    }

    return res.status(200).json(healthStatus);
});

export default healthRouter;
