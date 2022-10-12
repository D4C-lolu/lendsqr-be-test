import { Knex } from "knex";
import { db } from "../utils";
import { Account } from "../models/account.model";
import { BANK_ACCOUNT_NUMBER } from "../../config/constants";
import argon2 from "argon2";
import { omit } from "lodash";

export class AccountService {
  knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  async createAccount(userId: string, pin: number) {
    const hashedPin = this.hashPin(pin.toString());
    const [account_number] = await this.knex("accounts").insert({
      account_user: userId,
      pin: hashedPin,
    });

    return account_number;
  }

  async getAccountDetails(userId: string) {
    const [account_number, balance] = await this.knex("accounts").where({
      account_user: userId,
    });

    return { account_number, balance };
  }

  async getAccountOwner(userAccount: string) {
    const user = await this.knex<Account>("accounts")
      .where({
        account_number: userAccount,
      })
      .first();

    return user;
  }

  async verifyAccount(userAccount: string, pin: string) {
    const account = await this.getAccountOwner(userAccount);
    if (!account) {
      return false;
    }

    const isValid = await this.comparePin(pin, account.pin);
    if (!isValid) {
      return false;
    }

    return omit(account, "pin");
  }

  async createTransaction(
    senderAccount: string,
    receiverAccount: string,
    amount: number,
    name: string,
    message?: string
  ) {
    const sender = await this.getAccountOwner(senderAccount);
    const receiver = await this.getAccountOwner(receiverAccount);
    if (!sender || !receiver) {
      return "User does not exist";
    }
    if (sender?.balance < amount) {
      return "Insufficient funds";
    }
    const newTransaction = await this.knex("transaction").insert({
      name,
      message,
      amount,
      sender_account_number: senderAccount,
      receiver_account_number: receiverAccount,
    });

    if (newTransaction) {
      await this.knex
        .where({ account_number: senderAccount })
        .decrement("balance", amount);
      await this.knex
        .where({ account_number: receiverAccount })
        .increment("balance", amount);
    }

    return newTransaction;
  }

  async fundAccount(
    accountNumber: string,
    amount: number,
    name: string,
    message?: string
  ) {
    const transaction = await this.createTransaction(
      BANK_ACCOUNT_NUMBER,
      accountNumber,
      amount,
      name
    );

    return transaction;
  }

  async transferAmount(
    senderAccount: string,
    receiverAccount: string,
    amount: number,
    name: string,
    message?: string
  ) {
    const transaction = await this.createTransaction(
      senderAccount,
      receiverAccount,
      amount,
      name,
      message
    );

    return transaction;
  }

  async withdrawFunds(
    accountNumber: string,
    amount: number,
    name: string,
    message?: string
  ) {
    const transaction = await this.createTransaction(
      accountNumber,
      BANK_ACCOUNT_NUMBER,
      amount,
      name,
      message
    );

    return transaction;
  }

  async getTransactionHistory(accountNumber: string) {
    const transactions = await this.knex("transactions")
      .where({
        sender_account_number: accountNumber,
      })
      .orWhere({
        receiver_account_number: accountNumber,
      });

    return transactions;
  }

  async hashPin(pin: string) {
    const hash = await argon2.hash(pin);
    return hash;
  }

  async comparePin(pin: string, hash: string) {
    const isVerified = await argon2.verify(hash, pin);
    return isVerified;
  }
}

export default new AccountService(db);
