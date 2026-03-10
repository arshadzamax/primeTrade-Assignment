/**
 * Standardised API response wrapper.
 * Every successful response follows the same shape.
 */
class ApiResponse {
    /**
     * @param {number} statusCode - HTTP status code
     * @param {*} data - Response payload
     * @param {string} message - Human-readable message
     * @param {object} meta - Optional pagination or extra metadata
     */
    constructor(statusCode, data, message = "Success", meta = null) {
        this.success = statusCode < 400;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;

        if (meta) {
            this.meta = meta;
        }
    }

    // ── Factory methods ────────────────────────────────────────────

    static ok(data, message = "Success", meta) {
        return new ApiResponse(200, data, message, meta);
    }

    static created(data, message = "Resource created") {
        return new ApiResponse(201, data, message);
    }

    static noContent(message = "Deleted successfully") {
        return new ApiResponse(204, null, message);
    }
}

export default ApiResponse;
