import { Router } from "express";
import errorHandler from "../middlewares/errorHandler";
import Controller from "../controllers";
const rootRouter = Router();

rootRouter.get(
  "/get-conversation-by-id-list",
  Controller.getConversationByMemberIDList,
  errorHandler
);

export default rootRouter;
