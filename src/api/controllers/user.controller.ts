import { createUser } from "../services/user.service";
import { Request, Response } from "express";
import { logger } from "../utils";
import { StatusCodes } from "http-status-codes";
import { CreateUserInput } from "../schemas/user.schema";

class UserController {
  async createUser(
    req: Request<{}, {}, CreateUserInput["body"]>,
    res: Response
  ) {
    try {
      const user = await createUser(req.body);
      return res.status(StatusCodes.CREATED).send(user);
    } catch (err: any) {
      logger.error(err);
      return res.status(StatusCodes.BAD_REQUEST).send(err.message);
    }
  }
}

const userController = new UserController();
export default userController;
