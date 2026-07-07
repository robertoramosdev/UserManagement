import rateLimit from "express-rate-limit";

// Throttle authentication attempts (login/signup) per IP to slow down
// brute-force and credential-stuffing attacks.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max auth requests per IP per window
  standardHeaders: true, // send RateLimit-* headers
  legacyHeaders: false,
  message: {
    message: "Too many attempts from this IP, please try again in 15 minutes",
  },
});
