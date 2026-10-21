import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/connectDb.js"
import cookieParser from "cookie-parser"
import cors from "cors"

dotenv.config()

import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import interviewRouter from "./routes/interview.route.js"
import paymentRouter from "./routes/payment.route.js"
import healthRouter from "./routes/health.route.js"

import { generalLimiter, aiLimiter } from "./middlewares/rateLimiter.js"
import { errorHandler } from "./middlewares/errorHandler.js"

const app = express()

// Trust proxy for rate limiting behind reverse proxies (Nginx, AWS ALB, Render)
app.set("trust proxy", 1)

// Dynamic CORS configuration supporting local dev, Docker, and production deployments
const allowedOrigins = [
    "https://hirepilot-8vii.onrender.com",
    "http://localhost:5173",
    "http://localhost:80",
    process.env.CLIENT_URL,
].filter(Boolean)

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error("CORS policy violation"))
        }
    },
    credentials: true,
}))

app.use(express.json())
app.use(cookieParser())

// Apply general rate limiting across all API routes
app.use("/api/", generalLimiter)

// Cloud Liveness & Readiness probe (Unrestricted for AWS/Docker health checks)
app.use("/api/health", healthRouter)

// Core feature routers
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)

// Protect expensive AI interview generation with Denial-of-Wallet rate limiter
app.use("/api/interview", aiLimiter, interviewRouter)
app.use("/api/payment", paymentRouter)

// Centralized error handler (must be registered after all routes)
app.use(errorHandler)

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    connectDb()
})
