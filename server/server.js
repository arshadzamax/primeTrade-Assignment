import app from "./src/app.js";
import env from "./src/config/env.js";
import connectDB from "./src/config/db.js";
import { logger } from "./src/utils/logger.js";

const startServer = async () => {
    try {
        await connectDB();

        app.listen(env.PORT, () => {
            logger.info(`🚀 Server running on port ${env.PORT} [${env.NODE_ENV}]`);
            logger.info(`📚 API Docs: http://localhost:${env.PORT}/api-docs`);
            logger.info(`❤️  Health:   http://localhost:${env.PORT}/health`);
        });
    } catch (error) {
        logger.error(`Failed to start server: ${error.message}`);
        process.exit(1);
    }
};

// ── Uncaught exception / rejection handlers ────────────────────────
process.on("uncaughtException", (error) => {
    logger.error(`UNCAUGHT EXCEPTION: ${error.message}`);
    logger.error(error.stack);
    process.exit(1);
});

process.on("unhandledRejection", (reason) => {
    logger.error(`UNHANDLED REJECTION: ${reason}`);
    process.exit(1);
});

startServer();
