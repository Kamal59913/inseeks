import express, { Express } from "express";

export const setupStaticFiles = (app: Express) => {
  app.use(express.static("src/public"));
};
