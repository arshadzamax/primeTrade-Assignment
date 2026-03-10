import { Router } from "express";
import { listUsers, deleteUser } from "../controllers/user.controller.js";
import authenticate from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/rbac.middleware.js";
import { ROLES } from "../../../utils/constants.js";

const router = Router();

// All user management routes require admin role
router.use(authenticate, authorize(ROLES.ADMIN));

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management (admin only)
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: List all users (admin only)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: role
 *         schema: { type: string, enum: [user, admin] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Admin access required
 */
router.get("/", listUsers);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user and their tasks (admin only)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User deleted
 *       400:
 *         description: Cannot delete yourself
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 */
router.delete("/:id", deleteUser);

export default router;
