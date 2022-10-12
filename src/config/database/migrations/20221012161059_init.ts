import { Knex } from "knex";
import {
  createTransactionTable,
  createUserTable,
  createAccountTable,
  createSessionTable,
  removeAccountTable,
  removeSessionTable,
  removeUserTable,
  removeTransactionTable,
} from "../../../api/models";

export async function up(knex: Knex): Promise<void> {
  return createUserTable(knex)
    .then(() => createAccountTable(knex))
    .then(() => createTransactionTable(knex))
    .then(() => createSessionTable(knex));
}

export async function down(knex: Knex): Promise<void> {
  return removeSessionTable(knex)
    .then(() => removeTransactionTable(knex))
    .then(() => removeAccountTable(knex))
    .then(() => removeUserTable(knex));
}
