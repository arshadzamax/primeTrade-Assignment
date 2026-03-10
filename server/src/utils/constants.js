/**
 * Application-wide constants.
 * Centralised so there's a single source of truth.
 */

export const ROLES = Object.freeze({
    USER: "user",
    ADMIN: "admin",
});

export const TASK_STATUS = Object.freeze({
    TODO: "todo",
    IN_PROGRESS: "in_progress",
    DONE: "done",
});

export const TASK_PRIORITY = Object.freeze({
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
});

export const PAGINATION = Object.freeze({
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
});
