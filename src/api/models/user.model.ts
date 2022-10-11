import { Knex } from "knex";

export async function createUserTable(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("user_id").primary();
      table.string("name").notNullable();
      table.string("email").notNullable().unique();
      table.string("password").notNullable();
      table.timestamps(true, true);
    })
    .raw("ALTER TABLE users AUTO_INCREMENT = 100000");
}

export async function removeUserTable(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
