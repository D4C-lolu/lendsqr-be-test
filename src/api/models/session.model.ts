import { Knex } from "knex";

export async function createSessionTable(knex: Knex): Promise<void> {
  return knex.schema.createTable("sessions", (table) => {
    table.string("session_id").primary();
    table.integer("session_user").references("user_id").inTable("users");
    table.boolean("valid").defaultTo(true);
    table.string("user_agent");
    table.timestamps(true, true);
  });
}

export interface Session {
  session_id: string;
  session_user: number;
  valid: boolean;
  user_agent: string;
  created_at: Date;
  updated_at: Date;
}

export async function removeSessionTable(knex: Knex): Promise<void> {
  return knex.schema.dropTable("sessions");
}
