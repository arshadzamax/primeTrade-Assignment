/**
 * Admin Seed Script
 * Creates the initial admin user in the database.
 *
 * Usage:
 *   node src/scripts/seed-admin.js
 *   node src/scripts/seed-admin.js --email admin@example.com --password Admin123 --name "Super Admin"
 */

import mongoose from "mongoose";
import env from "../config/env.js";
import User from "../models/User.model.js";
import { logger } from "../utils/logger.js";

const DEFAULT_ADMIN = {
    name: process.argv.includes("--name")
        ? process.argv[process.argv.indexOf("--name") + 1]
        : "Admin",
    email: process.argv.includes("--email")
        ? process.argv[process.argv.indexOf("--email") + 1]
        : "admin@primetrade.ai",
    password: process.argv.includes("--password")
        ? process.argv[process.argv.indexOf("--password") + 1]
        : "Admin123",
    role: "admin",
};

async function seedAdmin() {
    try {
        await mongoose.connect(env.MONGODB_URI);
        logger.info("✅ Connected to MongoDB");

        const existing = await User.findOne({ email: DEFAULT_ADMIN.email });

        if (existing) {
            if (existing.role === "admin") {
                logger.info(`⚠️  Admin already exists: ${existing.email} (role: ${existing.role})`);
            } else {
                // Promote existing user to admin
                existing.role = "admin";
                await existing.save({ validateBeforeSave: false });
                logger.info(`🔑 Promoted existing user to admin: ${existing.email}`);
            }
        } else {
            const admin = await User.create(DEFAULT_ADMIN);
            logger.info(`🎉 Admin user created successfully!`);
            logger.info(`   Email:    ${admin.email}`);
            logger.info(`   Password: ${DEFAULT_ADMIN.password}`);
            logger.info(`   Role:     ${admin.role}`);
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        logger.error(`❌ Seed failed: ${error.message}`);
        await mongoose.connection.close();
        process.exit(1);
    }
}

seedAdmin();
