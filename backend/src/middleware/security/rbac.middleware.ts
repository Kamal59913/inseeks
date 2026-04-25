import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../utils/response/ApiError";
import { ROLES } from "../../constant/roles";

interface AuthRequest extends Request {
  user?: any;
}

export const checkRole = (allowedRoles: string[]) => {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new ApiError(401, "User not authenticated");
      }

      const userRole = req.user.roleId?.name;
      console.log(
        `[RBAC] Checking Access - Required Roles: [${allowedRoles.join(
          ", "
        )}], User Role: "${userRole}"`
      );

      if (!userRole) {
        console.warn("[RBAC] Access Denied - User role not found");
        throw new ApiError(403, "User role not found");
      }

      const treatAsAgent = req.headers["x-treat-as-agent"];
      if (treatAsAgent === "true" && allowedRoles.includes(ROLES.USER)) {
        console.log("[RBAC] Access Granted via x-treat-as-agent override");
        return next();
      }

      if (!allowedRoles.includes(userRole)) {
        console.warn(
          `[RBAC] Access Denied - User role "${userRole}" not in allowed list`
        );
        throw new ApiError(
          403,
          "Insufficient permissions to access this resource"
        );
      }

      console.log("[RBAC] Access Granted");

      next();
    } catch (error: any) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Error checking user permissions",
        });
      }
    }
  };
};
