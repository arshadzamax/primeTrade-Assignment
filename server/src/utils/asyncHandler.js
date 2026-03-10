/**
 * Higher-order function that wraps async route handlers to catch errors
 * and forward them to Express's error-handling middleware.
 *
 * Eliminates try/catch boilerplate in every controller.
 *
 * @param {Function} fn - Async Express route handler
 * @returns {Function} Express middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
