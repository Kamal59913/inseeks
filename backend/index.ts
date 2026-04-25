import express from "express";
import { config } from "dotenv";
import { createServer } from "http";
import { initializeRoutes } from "./src/routes";
import dbConnect from "./src/config/dbConnect";
import { initializeMiddleware } from "./src/middleware";
import { setupStaticFiles } from "./src/config/static";
import { SocketConnect } from "./src/socket/socketconnect";

config();

const app = express();
const httpServer = createServer(app);

dbConnect().catch((err) => {
  console.error("Mongo connection failed", err);
  process.exit(1);
});

initializeMiddleware(app);
setupStaticFiles(app);
initializeRoutes(app);
SocketConnect(httpServer);

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "API working properly",
    database: "mongoose",
    version: "1.0.0",
  });
});

const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
