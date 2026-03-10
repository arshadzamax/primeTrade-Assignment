import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import swaggerUi from "swagger-ui-express";

import env from "./config/env.js";
import { swaggerSpec } from "./config/swagger.js";
import { morganStream } from "./utils/logger.js";
import v1Routes from "./api/v1/routes/index.js";
import errorHandler from "./api/v1/middlewares/errorHandler.middleware.js";
import ApiError from "./utils/ApiError.js";

const app = express();

// ── Security Middleware ────────────────────────────────────────────
app.use(helmet());
app.use(
    cors({
        origin: env.CLIENT_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// ── Rate Limiting ──────────────────────────────────────────────────
const limiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
        res.status(429).json({
            success: false,
            message: "Too many requests, slow down",
        });
    },
});
app.use("/api", limiter);

// ── Body Parsing ───────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ── Data Sanitization (Express 5 compatible) ──────────────────────
// express-mongo-sanitize is incompatible with Express 5 (req.query is read-only).
// Custom middleware strips NoSQL injection operators from req.body and req.params.
const sanitize = (obj) => {
    if (obj && typeof obj === "object") {
        for (const key of Object.keys(obj)) {
            if (key.startsWith("$") || key.includes(".")) {
                delete obj[key];
            } else if (typeof obj[key] === "object") {
                sanitize(obj[key]);
            }
        }
    }
    return obj;
};
app.use((req, _res, next) => {
    if (req.body) sanitize(req.body);
    if (req.params) sanitize(req.params);
    next();
});

// ── Logging ────────────────────────────────────────────────────────
if (env.isDev) {
    app.use(morgan("dev"));
} else {
    app.use(morgan("combined", { stream: morganStream }));
}

// ── Health Check ───────────────────────────────────────────────────
app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "PrimeTrade API is running",
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV,
    });
});

// ── API Documentation ──────────────────────────────────────────────
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "PrimeTrade API Docs",
}));

// ── API Routes ─────────────────────────────────────────────────────
app.use("/api/v1", v1Routes);

// ── 404 Handler ────────────────────────────────────────────────────
app.use((req, _res, next) => {
    next(ApiError.notFound(`Route ${req.originalUrl} not found`));
});

// ── Global Error Handler ───────────────────────────────────────────
app.use(errorHandler);

export default app;
