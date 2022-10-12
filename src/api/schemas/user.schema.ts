import { object, string, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type:object
 *      required:
 *        - email
 *        - name
 *        - password
 *        - passwordConfirmation
 *      properties:
 *        email:
 *          type:string
 *          default: johndoe@example.com
 *        name:
 *          type:string
 *          default:John Doe
 *        password:
 *          type:string
 *          default:StringPassword
 *        passwordConfirmation
 *          type:string
 *          default:StringPassword
 *
 *
 */
export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("A valid email address is required"),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password is too short- should be 8 chars minimum"),
    passwordConfirmation: string({
      required_error: "Password confirmation is required",
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>;
