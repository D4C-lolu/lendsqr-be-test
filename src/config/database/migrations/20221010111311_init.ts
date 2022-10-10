import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("user_id").primary();
      table.string("first_name", 50).notNullable();
      table.string("last_name", 50).notNullable();
      table.string("email").notNullable().unique();
      table.string("password").notNullable();
      table.boolean("verified_status").defaultTo(false);
      table.enum("role", ["user", "admin"]).defaultTo("user");
      table.timestamps(true, true);
    })
    .createTable("accounts", (table) => {
      table.string("accountNumber").primary();
      table.decimal("balance").defaultTo(0);
      table.boolean("active");
      table.integer("pin");
      table
        .integer("accountUser")
        .unsigned()
        .references("userId")
        .inTable("users");
      table.timestamps(true, true);
    })
    .createTable("transactions", (table) => {
      table.string("transaction_id,50").primary();
      table.string("name").notNullable();
      table.text("message");
      table.decimal("amount").notNullable();
      table
        .string("sender_account_number")
        .references("accountNumber")
        .inTable("accounts");
      table
        .string("receiver_account_number")
        .references("accountNumber")
        .inTable("accounts");
      table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable("users")
    .dropTable("accounts")
    .dropTable("transactions");
}
