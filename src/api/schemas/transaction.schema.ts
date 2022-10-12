import { object, string, number, TypeOf } from "zod";

export const createTransactionSchema = object({
  body: object({
    receiver_account_number: string({
      required_error: "Receiver's account number is required",
    }),
    sender_account_number: string({
      required_error: "Sender's account number is required",
    }),
    pin: number({
      required_error: "Pin is required",
      invalid_type_error: "Pin must be a number",
    })
      .int()
      .min(4, { message: "Number must be a 4 digit number" })
      .max(4, { message: "Number must be a 4 digit number" }),
    amount: number({
      required_error: "Amount to be transferred required",
    }),
    name: string({
      required_error: "Transaction name required",
    }),
    message: string().optional(),
  }),
});

export type CreateTransactionInput = TypeOf<typeof createTransactionSchema>;
