import { createLogger, format, transports } from "winston";
import env from "../config/env.js";

const { combine, timestamp, printf, colorize, errors } = format;

// ── Custom log format ──────────────────────────────────────────────
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});

export const logger = createLogger({
    level: env.isDev ? "debug" : "info",
    format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true }),
        logFormat
    ),
    defaultMeta: { service: "primetrade-api" },
    transports: [
        // Console — always
        new transports.Console({
            format: combine(colorize(), logFormat),
        }),

        // File — errors only (production-ready)
        new transports.File({
            filename: "logs/error.log",
            level: "error",
            maxsize: 5 * 1024 * 1024, // 5 MB
            maxFiles: 5,
        }),

        // File — combined
        new transports.File({
            filename: "logs/combined.log",
            maxsize: 5 * 1024 * 1024,
            maxFiles: 5,
        }),
    ],
    exceptionHandlers: [
        new transports.File({ filename: "logs/exceptions.log" }),
    ],
    rejectionHandlers: [
        new transports.File({ filename: "logs/rejections.log" }),
    ],
});

/**
 * Morgan stream adapter — pipes HTTP request logs into Winston.
 */
export const morganStream = {
    write: (message) => logger.http(message.trim()),
};
