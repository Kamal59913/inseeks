import { Express } from "express";
import userRouter from "./user/user.route";
import createpostRouter from "./createpost/createpost.route";
import followRouter from "./follow/follow.route";
import commentRouter from "./comment/comment.route";
import likeRouter from "./like/like.route";
import envRouter from "./env/env.route";

export const initializeRoutes = (app: Express) => {
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/createpost", createpostRouter);
  app.use("/api/v1/follow", followRouter);
  app.use("/api/v1/comment", commentRouter);
  app.use("/api/v1/like", likeRouter);
  app.use("/api/v1/env", envRouter);
};
