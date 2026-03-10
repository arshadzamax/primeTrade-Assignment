import mongoose from "mongoose";
import { TASK_STATUS, TASK_PRIORITY } from "../utils/constants.js";

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Task title is required"],
            trim: true,
            maxlength: [120, "Title cannot exceed 120 characters"],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [1000, "Description cannot exceed 1000 characters"],
            default: "",
        },
        status: {
            type: String,
            enum: Object.values(TASK_STATUS),
            default: TASK_STATUS.TODO,
        },
        priority: {
            type: String,
            enum: Object.values(TASK_PRIORITY),
            default: TASK_PRIORITY.MEDIUM,
        },
        dueDate: {
            type: Date,
            default: null,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Task must belong to a user"],
            index: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(_, ret) {
                delete ret.__v;
                return ret;
            },
        },
    }
);

// ── Compound indexes for common query patterns ─────────────────────
taskSchema.index({ owner: 1, status: 1 });
taskSchema.index({ owner: 1, createdAt: -1 });
taskSchema.index({ owner: 1, priority: 1 });

const Task = mongoose.model("Task", taskSchema);

export default Task;
