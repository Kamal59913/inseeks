import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../utils/response/ApiError";

interface AuthRequest extends Request {
  user?: any;
}

export const checkPermission = (requiredPermissions: string[]) => {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new ApiError(401, "User not authenticated");
      }

      const role = req.user.roleId;
      if (!role) {
        throw new ApiError(403, "User has no role assigned");
      }

      const userPermissions: string[] =
        role.permissions?.map((p: any) => p.name) || [];

      console.log(
        `[ABAC] Checking Permissions - Required: [${requiredPermissions.join(
          ", "
        )}], User has: [${userPermissions.join(", ")}]`
      );

      const hasAllPermissions = requiredPermissions.every((perm) =>
        userPermissions.includes(perm)
      );

      if (!hasAllPermissions) {
        console.warn(
          `[ABAC] Access Denied - Missing required granular permissions`
        );
        throw new ApiError(
          403,
          "Insufficient granular permissions to access this resource"
        );
      }

      console.log("[ABAC] Access Granted");

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
          message: "Error checking granular permissions",
        });
      }
    }
  };
};
