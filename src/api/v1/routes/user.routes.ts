import express, { Request, Response } from "express";
import userController from "../../controllers/user.controller";
import validateResource from "../../middlewares/validateResource";
import { createUserSchema } from "../../schemas/user.schema";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  return res.send("E-wallet API up and running!");
});

router.post("/", validateResource(createUserSchema), userController.createUser);

export default router;
