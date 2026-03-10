import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import env from "../config/env.js";

/**
 * Auth Service — encapsulates all authentication business logic.
 */
class AuthService {
    /**
     * Generate access + refresh token pair for a user.
     * @param {Object} user - Mongoose user document
     * @returns {{ accessToken: string, refreshToken: string }}
     */
    static generateTokens(user) {
        const payload = { sub: user._id, role: user.role };

        const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
            expiresIn: env.JWT_ACCESS_EXPIRES_IN,
        });

        const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
            expiresIn: env.JWT_REFRESH_EXPIRES_IN,
        });

        return { accessToken, refreshToken };
    }

    /**
     * Register a new user.
     * @param {{ name: string, email: string, password: string }} data
     * @returns {{ user: Object, tokens: Object }}
     */
    static async register({ name, email, password }) {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw ApiError.conflict("Email is already registered");
        }

        const user = await User.create({ name, email, password });

        const tokens = this.generateTokens(user);

        // Persist refresh token (hashed ideally, plain for simplicity)
        user.refreshToken = tokens.refreshToken;
        await user.save({ validateBeforeSave: false });

        return { user, tokens };
    }

    /**
     * Log in an existing user.
     * @param {{ email: string, password: string }} data
     * @returns {{ user: Object, tokens: Object }}
     */
    static async login({ email, password }) {
        const user = await User.findOne({ email }).select("+password +refreshToken");

        if (!user) {
            throw ApiError.unauthorized("Invalid email or password");
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            throw ApiError.unauthorized("Invalid email or password");
        }

        const tokens = this.generateTokens(user);

        user.refreshToken = tokens.refreshToken;
        await user.save({ validateBeforeSave: false });

        return { user, tokens };
    }

    /**
     * Refresh the access token using a valid refresh token.
     * @param {string} refreshToken
     * @returns {{ accessToken: string, refreshToken: string }}
     */
    static async refresh(refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);

            const user = await User.findById(decoded.sub).select("+refreshToken");

            if (!user || user.refreshToken !== refreshToken) {
                throw ApiError.unauthorized("Invalid refresh token");
            }

            const tokens = this.generateTokens(user);

            // Rotate refresh token
            user.refreshToken = tokens.refreshToken;
            await user.save({ validateBeforeSave: false });

            return tokens;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw ApiError.unauthorized("Invalid or expired refresh token");
        }
    }

    /**
     * Get user profile by ID.
     * @param {string} userId
     * @returns {Object} user
     */
    static async getProfile(userId) {
        const user = await User.findById(userId);

        if (!user) {
            throw ApiError.notFound("User not found");
        }

        return user;
    }
}

export default AuthService;
