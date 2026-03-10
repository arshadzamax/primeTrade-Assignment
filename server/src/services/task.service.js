import Task from "../models/Task.model.js";
import ApiError from "../utils/ApiError.js";
import { PAGINATION } from "../utils/constants.js";

/**
 * Task Service — encapsulates all task-related business logic.
 */
class TaskService {
    /**
     * Create a new task for the authenticated user.
     * @param {Object} data - Task fields
     * @param {string} ownerId - User ID
     * @returns {Object} Created task
     */
    static async create(data, ownerId) {
        const task = await Task.create({ ...data, owner: ownerId });
        return task;
    }

    /**
     * List tasks for a specific owner with pagination, filtering, and sorting.
     * @param {string} ownerId - User ID
     * @param {Object} queryParams - Query parameters
     * @returns {{ tasks: Array, meta: Object }}
     */
    static async listByOwner(ownerId, queryParams = {}) {
        const {
            page = PAGINATION.DEFAULT_PAGE,
            limit = PAGINATION.DEFAULT_LIMIT,
            status,
            priority,
            sortBy = "createdAt",
            order = "desc",
            search,
        } = queryParams;

        const filter = { owner: ownerId };

        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (search) {
            filter.title = { $regex: search, $options: "i" };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sortOrder = order === "asc" ? 1 : -1;

        const [tasks, total] = await Promise.all([
            Task.find(filter)
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(parseInt(limit))
                .populate("owner", "name email")
                .lean(),
            Task.countDocuments(filter),
        ]);

        return {
            tasks,
            meta: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit)),
            },
        };
    }

    /**
     * List ALL tasks (admin). Same filters apply.
     */
    static async listAll(queryParams = {}) {
        const {
            page = PAGINATION.DEFAULT_PAGE,
            limit = PAGINATION.DEFAULT_LIMIT,
            status,
            priority,
            sortBy = "createdAt",
            order = "desc",
            search,
        } = queryParams;

        const filter = {};

        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (search) {
            filter.title = { $regex: search, $options: "i" };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sortOrder = order === "asc" ? 1 : -1;

        const [tasks, total] = await Promise.all([
            Task.find(filter)
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(parseInt(limit))
                .populate("owner", "name email")
                .lean(),
            Task.countDocuments(filter),
        ]);

        return {
            tasks,
            meta: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit)),
            },
        };
    }

    /**
     * Get a single task by ID. Checks ownership unless admin.
     * @param {string} taskId
     * @param {string} userId
     * @param {string} userRole
     * @returns {Object} task
     */
    static async getById(taskId, userId, userRole) {
        const task = await Task.findById(taskId).populate("owner", "name email");

        if (!task) {
            throw ApiError.notFound("Task not found");
        }

        // Non-admin can only view own tasks
        if (userRole !== "admin" && task.owner._id.toString() !== userId) {
            throw ApiError.forbidden("You do not have access to this task");
        }

        return task;
    }

    /**
     * Update a task. Only the owner can update their task.
     * @param {string} taskId
     * @param {Object} updateData
     * @param {string} userId
     * @returns {Object} Updated task
     */
    static async update(taskId, updateData, userId) {
        const task = await Task.findById(taskId);

        if (!task) {
            throw ApiError.notFound("Task not found");
        }

        if (task.owner.toString() !== userId) {
            throw ApiError.forbidden("You can only update your own tasks");
        }

        Object.assign(task, updateData);
        await task.save();

        return task.populate("owner", "name email");
    }

    /**
     * Delete a task. Only the owner can delete their task.
     * @param {string} taskId
     * @param {string} userId
     * @param {string} userRole
     */
    static async remove(taskId, userId, userRole) {
        const task = await Task.findById(taskId);

        if (!task) {
            throw ApiError.notFound("Task not found");
        }

        // Admin can delete any task, user can only delete own
        if (userRole !== "admin" && task.owner.toString() !== userId) {
            throw ApiError.forbidden("You can only delete your own tasks");
        }

        await task.deleteOne();
    }
}

export default TaskService;
