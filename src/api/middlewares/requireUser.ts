import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.user) {
    return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");
  }
  return next();
};

export default requireUser;
