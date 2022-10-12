import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { CORS_ORIGIN } from "../../config/constants";
import deserializeUser from "../middlewares/deserializeUsers";
import { userRoutes, sessionRoutes, accountRoutes } from "../v1/routes";

function createServer() {
  const app = express();

  //middleware
  app.use(cookieParser());
  app.use(express.json());
  app.use(
    cors({
      origin: CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(helmet());
  app.use(deserializeUser);

  //routes
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/sessions", sessionRoutes);
  app.use("api/v1/accounts", accountRoutes);
  return app;
}

export default createServer;
