import knex from "knex";
import config from "../../config/database/knexfile";
import logger from "./logger";
import { NODE_ENV } from "../../config/constants";
export const db = knex(config[NODE_ENV]);

//connect to DB
export async function connectToDatabase() {
  await db
    .raw("SELECT 1")
    .then(() => {
      logger.info("MYSQL connected");
    })
    .catch((e) => {
      logger.info("MYSQL not connected");
      logger.error(e);
    });
  return db;
}

//Destroy DB connection
export async function disconnectFromDatabase() {
  await db.destroy();
  await logger.info("MYSQL disconnected");
}
