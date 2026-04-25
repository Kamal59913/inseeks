import { Request, Response, NextFunction } from "express";
import { ApiError } from "./ApiError"; // Adjust import path as needed

const asyncHandler = (
    requestHandler: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => {
            if (err instanceof ApiError) {
                return res.status(err.statusCode).json({
                    success: false,
                    message: err.message,
                    errors: err.errors || []
                });
            }
            
            // For other errors
            console.error(err);
            return res.status(500).json({
                success: false,
                message: err instanceof Error ? err.message : "An unexpected error occurred",
                errors: []
            });
        });
    };
};

export { asyncHandler };