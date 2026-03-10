import UserService from "../../../services/user.service.js";
import ApiResponse from "../../../utils/ApiResponse.js";
import asyncHandler from "../../../utils/asyncHandler.js";

/**
 * @desc    List all users (admin only)
 * @route   GET /api/v1/users
 * @access  Admin
 */
export const listUsers = asyncHandler(async (req, res) => {
    const { users, meta } = await UserService.listAll(req.query);

    res.status(200).json(ApiResponse.ok(users, "Users retrieved", meta));
});

/**
 * @desc    Delete a user and their tasks (admin only)
 * @route   DELETE /api/v1/users/:id
 * @access  Admin
 */
export const deleteUser = asyncHandler(async (req, res) => {
    await UserService.remove(req.params.id, req.user._id.toString());

    res.status(200).json(ApiResponse.ok(null, "User and associated tasks deleted"));
});
