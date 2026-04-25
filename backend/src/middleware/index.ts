import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import errorHandler from "./error/errorHandler";

export const initializeMiddleware = (app: Express) => {
  const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((o) => o.trim());

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile, curl, same-origin)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS blocked: ${origin}`));
      },
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Cookie"],
      exposedHeaders: ["Set-Cookie"],
      credentials: true,
      optionsSuccessStatus: 200, // For IE11 preflight compatibility
    }),
  );

  // Handle all OPTIONS preflight requests immediately
  app.options("*", cors());

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && err.message.includes("Unexpected")) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON syntax",
      });
    }
    next();
  });

  app.use(express.json({ limit: "16kb" }));
  app.use(express.urlencoded({ extended: true, limit: "16kb" }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  app.use(errorHandler);
};
