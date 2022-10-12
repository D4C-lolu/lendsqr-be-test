import { Knex } from "knex";

export async function createTransactionTable(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("transactions", (table) => {
      table.increments("transaction_id").primary();
      table.string("name").notNullable();
      table.text("message");
      table.decimal("amount").notNullable();
      table
        .integer("sender_account_number")
        .unsigned()
        .references("account_number")
        .inTable("accounts");
      table
        .integer("receiver_account_number")
        .unsigned()
        .references("account_number")
        .inTable("accounts");
      table.timestamps(true, true);
    })
    .raw("ALTER TABLE transactions AUTO_INCREMENT = 1000000000");
}
export async function removeTransactionTable(knex: Knex): Promise<void> {
  return knex.schema.dropTable("transactions");
}
