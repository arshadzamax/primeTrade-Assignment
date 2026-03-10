import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { ROLES } from "../utils/constants.js";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            maxlength: [60, "Name cannot exceed 60 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
            select: false, // never returned in queries by default
        },
        role: {
            type: String,
            enum: Object.values(ROLES),
            default: ROLES.USER,
        },
        refreshToken: {
            type: String,
            select: false,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(_, ret) {
                delete ret.password;
                delete ret.refreshToken;
                delete ret.__v;
                return ret;
            },
        },
    }
);

// ── Indexes ────────────────────────────────────────────────────────
// email index is already created by `unique: true` above
userSchema.index({ role: 1 });

// ── Pre-save: hash password ────────────────────────────────────────
// Mongoose 8: async pre hooks don't receive `next` — just return/throw.
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// ── Instance method: compare password ──────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
