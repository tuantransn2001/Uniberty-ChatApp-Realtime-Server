import { Router } from "express";
import errorHandler from "../middlewares/errorHandler";
import ConversationController from "../controllers/conversation.controller";
const conversationRouter = Router();

conversationRouter.get(
  "/get-by-ids",
  ConversationController.getConversationByMemberIDList,
  errorHandler
);

export default conversationRouter;
