import rateLimit from 'express-rate-limit';

const WINDOW_MS = 15 * 60 * 1000;

// Same error envelope the rest of the API uses
const limiter = (max, message, extra = {}) =>
  rateLimit({
    windowMs: WINDOW_MS,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: { message, status: 429 } },
    ...extra
  });

export const globalLimiter = limiter(100, 'Too many requests from this IP, please try again later.');

// Failed attempts only, so normal logins never count
export const authLimiter = limiter(5, 'Too many login/register attempts, please try again later.', {
  skipSuccessfulRequests: true
});

// Counts every request: these calls spend the Groq quota
export const llmLimiter = limiter(10, 'Too many requests to AI endpoints, please try again later.');
