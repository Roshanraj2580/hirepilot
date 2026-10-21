/**
 * Centralized Global Error Handler Middleware
 * Prevents leaking database internals, file paths, or sensitive traces to clients
 */
export const errorHandler = (err, req, res, next) => {
    // Structured server-side error logging
    console.error(`[ERROR] ${new Date().toISOString()} - ${req.method} ${req.originalUrl}:`, err.stack || err.message);

    // Determine status code (default to 500)
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : (err.status || 500);

    // Return sanitized, user-safe message
    return res.status(statusCode).json({
        success: false,
        message: process.env.NODE_ENV === "production" 
            ? "An unexpected internal server error occurred. Please try again later."
            : (err.message || "Internal Server Error"),
        timestamp: new Date().toISOString(),
    });
};
