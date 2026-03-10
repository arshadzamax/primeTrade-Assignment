import swaggerJsdoc from "swagger-jsdoc";
import env from "./env.js";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "PrimeTrade API",
            version: "1.0.0",
            description:
                "Scalable REST API with JWT Authentication & Role-Based Access Control",
            contact: {
                name: "API Support",
            },
        },
        servers: [
            {
                url: `http://localhost:${env.PORT}/api/v1`,
                description: "Development server",
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter your JWT access token",
                },
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d1" },
                        name: { type: "string", example: "John Doe" },
                        email: { type: "string", example: "john@example.com" },
                        role: { type: "string", enum: ["user", "admin"], example: "user" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                Task: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d1" },
                        title: { type: "string", example: "Build REST API" },
                        description: {
                            type: "string",
                            example: "Implement authentication and CRUD",
                        },
                        status: {
                            type: "string",
                            enum: ["todo", "in_progress", "done"],
                            example: "todo",
                        },
                        priority: {
                            type: "string",
                            enum: ["low", "medium", "high"],
                            example: "medium",
                        },
                        dueDate: { type: "string", format: "date-time" },
                        owner: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d1" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                Error: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: false },
                        message: { type: "string", example: "Something went wrong" },
                        errors: {
                            type: "array",
                            items: { type: "object" },
                        },
                    },
                },
                AuthTokens: {
                    type: "object",
                    properties: {
                        accessToken: { type: "string" },
                        refreshToken: { type: "string" },
                    },
                },
            },
        },
    },
    apis: ["./src/api/v1/routes/*.js"],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
