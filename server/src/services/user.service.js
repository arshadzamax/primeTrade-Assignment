import User from "../models/User.model.js";
import Task from "../models/Task.model.js";
import ApiError from "../utils/ApiError.js";
import { PAGINATION } from "../utils/constants.js";

/**
 * User Service — admin operations on users.
 */
class UserService {
    /**
     * List all users with pagination (admin only).
     */
    static async listAll(queryParams = {}) {
        const {
            page = PAGINATION.DEFAULT_PAGE,
            limit = PAGINATION.DEFAULT_LIMIT,
            role,
            search,
        } = queryParams;

        const filter = {};

        if (role) filter.role = role;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [users, total] = await Promise.all([
            User.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            User.countDocuments(filter),
        ]);

        return {
            users,
            meta: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit)),
            },
        };
    }

    /**
     * Delete a user and all their tasks (admin only).
     * @param {string} userId
     * @param {string} adminId - The admin performing the action
     */
    static async remove(userId, adminId) {
        if (userId === adminId) {
            throw ApiError.badRequest("You cannot delete your own account");
        }

        const user = await User.findById(userId);

        if (!user) {
            throw ApiError.notFound("User not found");
        }

        // Cascade delete: remove all tasks belonging to this user
        await Task.deleteMany({ owner: userId });
        await user.deleteOne();
    }
}

export default UserService;
