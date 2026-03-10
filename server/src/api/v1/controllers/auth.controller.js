import AuthService from "../../../services/auth.service.js";
import ApiResponse from "../../../utils/ApiResponse.js";
import asyncHandler from "../../../utils/asyncHandler.js";

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const { user, tokens } = await AuthService.register({ name, email, password });

    res.status(201).json(
        ApiResponse.created({
            user,
            ...tokens,
        })
    );
});

/**
 * @desc    Log in user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const { user, tokens } = await AuthService.login({ email, password });

    res.status(200).json(
        ApiResponse.ok({
            user,
            ...tokens,
        }, "Login successful")
    );
});

/**
 * @desc    Refresh access token
 * @route   POST /api/v1/auth/refresh
 * @access  Public
 */
export const refresh = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    const tokens = await AuthService.refresh(refreshToken);

    res.status(200).json(ApiResponse.ok(tokens, "Token refreshed"));
});

/**
 * @desc    Get current user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
    const user = await AuthService.getProfile(req.user._id);

    res.status(200).json(ApiResponse.ok(user));
});
