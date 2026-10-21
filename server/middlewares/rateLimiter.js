import rateLimit from "express-rate-limit";

/**
 * General API Rate Limiter
 * Restricts client to 100 requests per 15 minutes window
 */
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        status: 429,
        message: "Too many requests from this IP, please try again after 15 minutes.",
    },
});

/**
 * AI "Denial-of-Wallet" Protection Rate Limiter
 * Restricts sensitive OpenRouter/AI generation endpoints to prevent budget exhaustion
 */
export const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15, // Limit each IP to 15 AI operations per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        message: "AI generation rate limit reached. Please wait a few minutes before starting another round.",
    },
});
