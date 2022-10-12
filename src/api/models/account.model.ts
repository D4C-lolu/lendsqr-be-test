import { Knex } from "knex";

export async function createAccountTable(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("accounts", (table) => {
      table.increments("account_number").unique().primary();
      table.decimal("balance").defaultTo(0);
      table.string("pin", 4).defaultTo("0000");
      table
        .integer("account_user")
        .unsigned()
        .references("user_id")
        .inTable("users")
        .onDelete("CASCADE");
      table.timestamps(true, true);
    })
    .raw("ALTER TABLE accounts AUTO_INCREMENT = 1000000001");
}

export interface Account {
  account_number: string;
  balance: number;
  pin: string;
  account_user: number;
  created_at: Date;
  updated_at: Date;
}

export async function removeAccountTable(knex: Knex): Promise<void> {
  return knex.schema.dropTable("accounts");
}
