import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { Request, Response, NextFunction } from "express";
import { User } from "../../model/user.model";
import { ApiError } from "../../utils/response/ApiError";
import { asyncHandler } from "../../utils/response/asyncHandler";

config();

interface AuthRequest extends Request {
  user?: any;
}

const auth = asyncHandler(
  async (req: AuthRequest, _res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(
      token,
      (process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET) as string,
    ) as { _id?: string; id?: string };

    const userId = decodedToken?._id || decodedToken?.id;
    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
  },
);

export { auth };
