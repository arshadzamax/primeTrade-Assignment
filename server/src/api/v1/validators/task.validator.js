import { body, param, query } from "express-validator";
import { TASK_STATUS, TASK_PRIORITY } from "../../../utils/constants.js";

export const createTaskValidator = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 120 })
        .withMessage("Title cannot exceed 120 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters"),

    body("status")
        .optional()
        .isIn(Object.values(TASK_STATUS))
        .withMessage(`Status must be one of: ${Object.values(TASK_STATUS).join(", ")}`),

    body("priority")
        .optional()
        .isIn(Object.values(TASK_PRIORITY))
        .withMessage(`Priority must be one of: ${Object.values(TASK_PRIORITY).join(", ")}`),

    body("dueDate")
        .optional()
        .isISO8601()
        .withMessage("Due date must be a valid ISO 8601 date"),
];

export const updateTaskValidator = [
    param("id").isMongoId().withMessage("Invalid task ID"),

    body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty if provided")
        .isLength({ max: 120 })
        .withMessage("Title cannot exceed 120 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters"),

    body("status")
        .optional()
        .isIn(Object.values(TASK_STATUS))
        .withMessage(`Status must be one of: ${Object.values(TASK_STATUS).join(", ")}`),

    body("priority")
        .optional()
        .isIn(Object.values(TASK_PRIORITY))
        .withMessage(`Priority must be one of: ${Object.values(TASK_PRIORITY).join(", ")}`),

    body("dueDate")
        .optional()
        .isISO8601()
        .withMessage("Due date must be a valid ISO 8601 date"),
];

export const taskIdValidator = [
    param("id").isMongoId().withMessage("Invalid task ID"),
];

export const listTasksValidator = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer"),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100"),

    query("status")
        .optional()
        .isIn(Object.values(TASK_STATUS))
        .withMessage(`Status filter must be one of: ${Object.values(TASK_STATUS).join(", ")}`),

    query("priority")
        .optional()
        .isIn(Object.values(TASK_PRIORITY))
        .withMessage(`Priority filter must be one of: ${Object.values(TASK_PRIORITY).join(", ")}`),

    query("sortBy")
        .optional()
        .isIn(["createdAt", "updatedAt", "dueDate", "priority", "status", "title"])
        .withMessage("Invalid sort field"),

    query("order")
        .optional()
        .isIn(["asc", "desc"])
        .withMessage("Order must be 'asc' or 'desc'"),
];
