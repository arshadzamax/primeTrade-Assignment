import ApiError from "../../../utils/ApiError.js";
import { logger } from "../../../utils/logger.js";
import env from "../../../config/env.js";

/**
 * Global error-handling middleware.
 * Catches all errors thrown/forwarded via next(err) and returns
 * a consistent JSON response.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
    let error = err;

    // ── Wrap non-ApiError errors ───────────────────────────────────
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Internal Server Error";
        error = new ApiError(statusCode, message, [], err.stack);
    }

    // ── Handle specific Mongoose errors ────────────────────────────
    if (err.name === "CastError") {
        error = ApiError.badRequest(`Invalid ${err.path}: ${err.value}`);
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue).join(", ");
        error = ApiError.conflict(`Duplicate value for field: ${field}`);
    }

    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message);
        error = ApiError.badRequest("Validation error", messages);
    }

    // ── Log server errors ─────────────────────────────────────────
    if (error.statusCode >= 500) {
        logger.error(err.stack || err.message);
    }

    // ── Send response ─────────────────────────────────────────────
    const response = {
        success: false,
        message: error.message,
        ...(error.errors.length > 0 && { errors: error.errors }),
        ...(env.isDev && { stack: error.stack }),
    };

    res.status(error.statusCode).json(response);
};

export default errorHandler;
