import { object, string, number, TypeOf } from "zod";

export const createAccountSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }),
    password: string({
      required_error: "Password is required",
    }),
    pin: number({
      required_error: "Pin is required",
      invalid_type_error: "Pin must be a number",
    })
      .int()
      .min(4, { message: "Number must be a 4 digit number" })
      .max(4, { message: "Number must be a 4 digit number" }),
  }),
});

export type CreateAccountInput = TypeOf<typeof createAccountSchema>;
