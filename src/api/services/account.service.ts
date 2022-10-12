import { db } from "../utils";
import { Account } from "../models/account.model";
import { BANK_ACCOUNT_NUMBER } from "../../config/constants";
import argon2 from "argon2";
import { omit } from "lodash";

//create account and link to user
export async function createAccount(userId: string, pin: number) {
  //hash pin before storing
  const hashedPin = hashPin(pin.toString());
  //insert new record into account table
  const account_number = await db("accounts").insert({
    account_user: userId,
    pin: hashedPin,
  });

  return account_number;
}

//return balance and account number of user
export async function getAccountDetails(userId: string) {
  const [account_number, balance] = await db("accounts")
    .where({
      account_user: userId,
    })
    .first();

  return { account_number, balance };
}

//return user associated with account
export async function getAccountOwner(userAccount: string) {
  const user = await db<Account>("accounts")
    .where({
      account_number: userAccount,
    })
    .first();

  return omit(user, "password");
}

//verify that account number and pin match
export async function verifyAccount(userAccount: string, pin: string) {
  //get account user
  const account = await getAccountOwner(userAccount);
  if (!account) {
    return false;
  }

  //compare pin with hash in DB
  const isValid = await comparePin(pin, account.pin);
  if (!isValid) {
    return false;
  }

  return omit(account, "pin");
}

//create new transaction record
export async function createTransaction(
  senderAccount: string,
  receiverAccount: string,
  amount: number,
  name: string,
  message?: string
) {
  //get accounts of sender and receiver
  const sender = await getAccountOwner(senderAccount);
  const receiver = await getAccountOwner(receiverAccount);
  if (!sender || !receiver) {
    return "User does not exist";
  }

  //check if balance is sufficient for transfer
  if (sender?.balance < amount) {
    return "Insufficient funds";
  }

  //insert new transaction record
  const newTransaction = await db("transaction").insert({
    name,
    message,
    amount,
    sender_account_number: senderAccount,
    receiver_account_number: receiverAccount,
  });

  //adjust sender and receiver account balances
  if (newTransaction) {
    await db
      .where({ account_number: senderAccount })
      .decrement("balance", amount);
    await db
      .where({ account_number: receiverAccount })
      .increment("balance", amount);
  }

  return newTransaction;
}

//transfer funds from Mock Bank account to wallet
export async function fundAccount(
  accountNumber: string,
  amount: number,
  name: string,
  message?: string
) {
  const transaction = await createTransaction(
    BANK_ACCOUNT_NUMBER,
    accountNumber,
    amount,
    name
  );

  return transaction;
}

//Transfer funds between wallets
export async function transferAmount(
  senderAccount: string,
  receiverAccount: string,
  amount: number,
  name: string,
  message?: string
) {
  const transaction = await createTransaction(
    senderAccount,
    receiverAccount,
    amount,
    name,
    message
  );

  return transaction;
}

//Transfer fund to mock bank account from wallet
export async function withdrawFunds(
  accountNumber: string,
  amount: number,
  name: string,
  message?: string
) {
  const transaction = await createTransaction(
    accountNumber,
    BANK_ACCOUNT_NUMBER,
    amount,
    name,
    message
  );

  return transaction;
}

//return an array of all transactions on account
export async function getTransactionHistory(accountNumber: string) {
  const transactions = await db("transactions")
    .where({
      sender_account_number: accountNumber,
    })
    .orWhere({
      receiver_account_number: accountNumber,
    });

  return transactions;
}

export async function hashPin(pin: string) {
  const hash = await argon2.hash(pin);
  return hash;
}

export async function comparePin(pin: string, hash: string) {
  const isVerified = await argon2.verify(hash, pin);
  return isVerified;
}

export async function updatePin(userId: string, pin: number) {
  const hashedPin = hashPin(pin.toString());
  const account = await db("accounts")
    .where({
      account_user: userId,
    })
    .update({
      pin: hashedPin,
    });

  return account;
}
