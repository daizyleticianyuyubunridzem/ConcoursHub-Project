import rateLimit from "express-rate-limit";

const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: {
        success: false,
        message: "Too many authentication attempts. Please try again later.",
    },

    standardHeaders: true, 
    legacyHeaders: false,
});

export default authRateLimiter;

export const passwordResetRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many password reset attempts. Please try again later.",
});
