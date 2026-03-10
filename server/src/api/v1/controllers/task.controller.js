import TaskService from "../../../services/task.service.js";
import ApiResponse from "../../../utils/ApiResponse.js";
import asyncHandler from "../../../utils/asyncHandler.js";

/**
 * @desc    Create a new task
 * @route   POST /api/v1/tasks
 * @access  Private
 */
export const createTask = asyncHandler(async (req, res) => {
    const task = await TaskService.create(req.body, req.user._id);

    res.status(201).json(ApiResponse.created(task));
});

/**
 * @desc    List own tasks (paginated, filterable, sortable)
 * @route   GET /api/v1/tasks
 * @access  Private
 */
export const listTasks = asyncHandler(async (req, res) => {
    const { tasks, meta } = await TaskService.listByOwner(
        req.user._id,
        req.query
    );

    res.status(200).json(ApiResponse.ok(tasks, "Tasks retrieved", meta));
});

/**
 * @desc    List ALL tasks (admin only)
 * @route   GET /api/v1/tasks/all
 * @access  Admin
 */
export const listAllTasks = asyncHandler(async (req, res) => {
    const { tasks, meta } = await TaskService.listAll(req.query);

    res.status(200).json(ApiResponse.ok(tasks, "All tasks retrieved", meta));
});

/**
 * @desc    Get single task by ID
 * @route   GET /api/v1/tasks/:id
 * @access  Private
 */
export const getTask = asyncHandler(async (req, res) => {
    const task = await TaskService.getById(
        req.params.id,
        req.user._id.toString(),
        req.user.role
    );

    res.status(200).json(ApiResponse.ok(task));
});

/**
 * @desc    Update a task
 * @route   PUT /api/v1/tasks/:id
 * @access  Private (owner only)
 */
export const updateTask = asyncHandler(async (req, res) => {
    const task = await TaskService.update(
        req.params.id,
        req.body,
        req.user._id.toString()
    );

    res.status(200).json(ApiResponse.ok(task, "Task updated"));
});

/**
 * @desc    Delete a task
 * @route   DELETE /api/v1/tasks/:id
 * @access  Private (owner or admin)
 */
export const deleteTask = asyncHandler(async (req, res) => {
    await TaskService.remove(
        req.params.id,
        req.user._id.toString(),
        req.user.role
    );

    res.status(200).json(ApiResponse.ok(null, "Task deleted"));
});
