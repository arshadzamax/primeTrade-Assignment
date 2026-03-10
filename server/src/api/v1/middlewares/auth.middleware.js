import jwt from "jsonwebtoken";
import User from "../../../models/User.model.js";
import ApiError from "../../../utils/ApiError.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import env from "../../../config/env.js";

/**
 * JWT Authentication Middleware.
 * Extracts the Bearer token from the Authorization header,
 * verifies it, and attaches the user to `req.user`.
 */
const authenticate = asyncHandler(async (req, _res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw ApiError.unauthorized("Access token is missing or malformed");
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

        const user = await User.findById(decoded.sub).select("-password -refreshToken");

        if (!user) {
            throw ApiError.unauthorized("User belonging to this token no longer exists");
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof ApiError) throw error;

        if (error.name === "TokenExpiredError") {
            throw ApiError.unauthorized("Access token has expired");
        }

        throw ApiError.unauthorized("Invalid access token");
    }
});

export default authenticate;
