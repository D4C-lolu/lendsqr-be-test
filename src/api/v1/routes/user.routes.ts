import express, { Request, Response } from "express";
import userController from "../../controllers/user.controller";
import validateResource from "../../middlewares/validateResource";
import { createUserSchema } from "../../schemas/user.schema";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  return res.send("E-wallet API up and running!");
});

/**
 * @openapi
 * '/api/v1/users':
 * post:
 *  tags:
 *    - User
 *  summary: Register a user
 *  requestBody:
 *    required: true
 *    contents:
 *      application/json:
 *        schema:
 *          $ref: '#/components/schemas/CreateUserInput'
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json
 *            schema:
 *              $ref:'#/components/schemas/CreateUserResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 *
 *
 *
 */
router.post("/", validateResource(createUserSchema), userController.createUser);

export default router;
