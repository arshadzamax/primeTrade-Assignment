import mongoose from "mongoose";
import env from "./env.js";
import { logger } from "../utils/logger.js";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(env.MONGODB_URI);
        logger.info(`✅ MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error(`❌ MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};

// ── Graceful shutdown ──────────────────────────────────────────────
mongoose.connection.on("disconnected", () => {
    logger.warn("⚠️  MongoDB disconnected");
});

process.on("SIGINT", async () => {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed due to app termination");
    process.exit(0);
});

export default connectDB;
