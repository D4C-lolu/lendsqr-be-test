import {
  createAccount,
  getAccountDetails,
  getTransactionHistory,
  transferAmount,
  verifyAccount,
  withdrawFunds,
} from "../services/account.service";
import { Request, Response } from "express";
import { logger } from "../utils";
import { StatusCodes } from "http-status-codes";
import { CreateAccountInput } from "../schemas/account.schema";
import { verifyUser } from "../services/user.service";
import { CreateTransactionInput } from "../schemas/transaction.schema";
import { WithdrawFundsInput } from "../schemas/withdrawFunds.schema";
import { FundAccountInput } from "../schemas/fundAccount.schema";

class AccountController {
  async createAccount(
    req: Request<{}, {}, CreateAccountInput["body"]>,
    res: Response
  ) {
    try {
      const { email, pin, password } = req.body;
      //validate user password
      const user = await verifyUser({ email, password });
      if (!user) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .send("Invalid username or password");
      }
      const { user_id } = user;
      //create account
      const account_number = await createAccount(user_id, pin);
      return res.status(StatusCodes.CREATED).send(account_number);
    } catch (err: any) {
      logger.error(err);
      return res.status(StatusCodes.BAD_REQUEST).send(err.message);
    }
  }

  async getAccountDetails(req: Request, res: Response) {
    const userId = res.locals.user.user_id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).send("No active user");
    }
    const details = await getAccountDetails(userId);
    return res.json(details);
  }

  async transferAmount(
    req: Request<{}, {}, CreateTransactionInput["body"]>,
    res: Response
  ) {
    const {
      receiver_account_number,
      sender_account_number,
      pin,
      amount,
      name,
      message,
    } = req.body;
    try {
      //validate user pin
      const account = await verifyAccount(
        sender_account_number,
        pin.toString()
      );
      if (!account) {
        return res.status(StatusCodes.UNAUTHORIZED).send("Invalid pin");
      }
      //create transaction
      const transaction = await transferAmount(
        sender_account_number,
        receiver_account_number,
        amount,
        name,
        message
      );
      return res.status(StatusCodes.CREATED).send(transaction);
    } catch (err: any) {
      logger.error(err);
      return res.status(StatusCodes.BAD_REQUEST).send(err.message);
    }
  }

  async withdrawFunds(
    req: Request<{}, {}, WithdrawFundsInput["body"]>,
    res: Response
  ) {
    const { sender_account_number, pin, amount, name, message } = req.body;
    try {
      const account = await verifyAccount(
        sender_account_number,
        pin.toString()
      );
      if (!account) {
        return res.status(StatusCodes.UNAUTHORIZED).send("Invalid pin");
      }
      //create transaction
      const transaction = await withdrawFunds(
        sender_account_number,
        amount,
        name,
        message
      );
      return res.status(StatusCodes.CREATED).send(transaction);
    } catch (err: any) {
      logger.error(err);
      return res.status(StatusCodes.BAD_REQUEST).send(err.message);
    }
  }

  async fundAccount(
    req: Request<{}, {}, FundAccountInput["body"]>,
    res: Response
  ) {
    const { receiver_account_number, pin, amount, name, message } = req.body;
    try {
      const account = await verifyAccount(
        receiver_account_number,
        pin.toString()
      );
      if (!account) {
        return res.status(StatusCodes.UNAUTHORIZED).send("Invalid pin");
      }
      //create transaction
      const transaction = await withdrawFunds(
        receiver_account_number,
        amount,
        name,
        message
      );
      return res.status(StatusCodes.CREATED).send(transaction);
    } catch (err: any) {
      logger.error(err);
      return res.status(StatusCodes.BAD_REQUEST).send(err.message);
    }
  }

  async getTransactionHistory(req: Request, res: Response) {
    const userId = res.locals.user.user_id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).send("No active user");
    }
    const { account_number } = await getAccountDetails(userId);
    const history = await getTransactionHistory(account_number);
    return res.json(history);
  }
}

export default new AccountController();
