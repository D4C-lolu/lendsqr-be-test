import * as dotenv from "dotenv";

//Load environment variables
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { CORS_ORIGIN, PORT } from "./config/constants";
import { logger, connectToDatabase, disconnectFromDatabase } from "./api/utils";
import { accountRoutes, sessionRoutes, userRoutes } from "./api/v1/routes";
import deserializeUser from "./api/middlewares/deserializeUsers";

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

const server = app.listen(PORT, async () => {
  await connectToDatabase();
  logger.info(`Server listening at htp://localhost:${PORT}`);
});

const signals = ["SIGINT", "SIGTERM", "SIGQUIT"];

function gracefulShutdown(signal: string) {
  process.on(signal, async () => {
    logger.info("Goodbye, got signal", signal);
    server.close();
    // disconnect from the db
    await disconnectFromDatabase();
    logger.info("My work here is done");
    process.exit(0);
  });
}

for (let signal of signals) {
  gracefulShutdown(signal);
}
