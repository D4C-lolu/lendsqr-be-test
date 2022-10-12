import config from "../../config/database/knexfile";
import knex from "knex";
import { logger } from "../utils";
const db = knex(config.development);

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
