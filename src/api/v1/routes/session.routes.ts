import express from "express";
import validate from "../../middlewares/validateResource";
import sessionController from "../../controllers/session.controller";
import { createSessionSchema } from "../../schemas/session.schema";
import requireUser from "../../middlewares/requireUser";

const router = express.Router();

router.get("/", requireUser, sessionController.getUserSession);

router.post(
  "/",
  validate(createSessionSchema),
  sessionController.createUserSession
);
router.delete("/", requireUser, sessionController.deleteUserSession);

export default router;
