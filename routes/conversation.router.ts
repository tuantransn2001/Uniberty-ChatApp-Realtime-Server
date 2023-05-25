import { Router } from "express";
import ConversationController from "../controllers/conversation.controller";
const conversationRouter = Router();

conversationRouter
  .get("/get-by-ids", ConversationController.getConversationByMemberIDList)
  .get("/contact/get-by-user-id/:id", ConversationController.getContactList);

export default conversationRouter;
