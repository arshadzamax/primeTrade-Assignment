import { createLogger, format, transports } from "winston";
import env from "../config/env.js";

const { combine, timestamp, printf, colorize, errors, json } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack, service }) => {
  return `${timestamp} [${service}] [${level}]: ${stack || message}`;
});

// Development format 
const devFormat = combine(
  colorize(),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  logFormat
);

// Production format 
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

// Logger instance
export const logger = createLogger({
  level: env.isDev ? "debug" : "info",
  format: env.isDev ? devFormat : prodFormat,

  defaultMeta: {
    service: "primetrade-api",
  },

  transports: [
    new transports.Console(),
  ],

  exceptionHandlers: [
    new transports.Console(),
  ],

  rejectionHandlers: [
    new transports.Console(),
  ],

  exitOnError: false,
});

// Morgan stream adapter
export const morganStream = {
  write: (message) => {
    logger.http(message.trim());
  },
};