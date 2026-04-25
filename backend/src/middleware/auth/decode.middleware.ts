import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { Request, Response, NextFunction } from "express";
import UserModel from "../../model/user.model";

config();

interface AuthRequest extends Request {
  user?: any;
}

const Decode = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header("authorization");

    const token =
      req.cookies?.token ||
      req.body?.token ||
      (authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.replace("Bearer ", "")
        : undefined);

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Token missing",
      });
      return;
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);

      req.user = decodedToken;

      next();
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || "Invalid access token",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({
      success: false,
      error: "Something went wrong during token validation",
    });
  }
};

export { Decode };
