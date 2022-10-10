import type { Knex } from "knex";

import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "../constants";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    connection: () => {
      return {
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
      };
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "mysql2",
    connection: () => {
      return {
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
      };
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

export default config;
