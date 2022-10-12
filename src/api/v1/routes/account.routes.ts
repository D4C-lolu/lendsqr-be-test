import express from "express";
import validate from "../../middlewares/validateResource";
import accountController from "../../controllers/account.controller";
import { createAccountSchema } from "../../schemas/account.schema";
import { createTransactionSchema } from "../../schemas/transaction.schema";
import requireUser from "../../middlewares/requireUser";
import { withdrawFundsSchema } from "../../schemas/withdrawFunds.schema";
import { fundAccountSchema } from "../../schemas/fundAccount.schema";

const router = express.Router();

router.post(
  "/",
  [validate(createAccountSchema), requireUser],
  accountController.createAccount
);

router.get("/details", requireUser, accountController.getAccountDetails);

router.post(
  "/transfer",
  [validate(createTransactionSchema), requireUser],
  accountController.transferAmount
);

router.post(
  "/withdraw",
  [validate(withdrawFundsSchema), requireUser],
  accountController.withdrawFunds
);

router.post(
  "/fund",
  [validate(fundAccountSchema), requireUser],
  accountController.fundAccount
);

router.get("/history", requireUser, accountController.getTransactionHistory);

export default router;
