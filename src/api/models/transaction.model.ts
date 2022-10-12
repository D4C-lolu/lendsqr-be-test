import { Knex } from "knex";

export async function createTransactionTable(knex: Knex): Promise<void> {
  return knex.schema.createTable("transactions", (table) => {
    table.increments("transaction_id");
    table.primary([
      "sender_account_number",
      "receiver_account_number",
      "transaction_id",
    ]);
    table.string("name").notNullable();
    table.text("message");
    table.decimal("amount").notNullable();
    table
      .string("sender_account_number")
      .references("account_number")
      .inTable("accounts");
    table
      .string("receiver_account_number")
      .references("account_number")
      .inTable("accounts");
    table.timestamps(true, true);
  });
}
export async function removeTransactionTable(knex: Knex): Promise<void> {
  return knex.schema.dropTable("transactions");
}
