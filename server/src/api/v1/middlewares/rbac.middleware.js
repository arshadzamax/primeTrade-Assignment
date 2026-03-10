import ApiError from "../../../utils/ApiError.js";

/**
 * Role-Based Access Control (RBAC) middleware factory.
 * Returns middleware that restricts access to the specified roles.
 *
 * @param  {...string} allowedRoles - Roles allowed to access the route
 * @returns {Function} Express middleware
 *
 * @example
 * router.get("/admin-only", authenticate, authorize("admin"), handler);
 * router.get("/both", authenticate, authorize("admin", "user"), handler);
 */
const authorize = (...allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user) {
            throw ApiError.unauthorized("Authentication required before authorization");
        }

        if (!allowedRoles.includes(req.user.role)) {
            throw ApiError.forbidden(
                `Role '${req.user.role}' does not have permission to access this resource`
            );
        }

        next();
    };
};

export default authorize;
