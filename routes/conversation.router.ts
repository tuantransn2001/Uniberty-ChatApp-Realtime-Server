import { Router } from "express";
import ConversationController from "../controllers/conversation.controller";
const conversationRouter = Router();

conversationRouter
  .post("/get-by-members", ConversationController.getConversationByMembers)
  .get("/contact", ConversationController.getContactList);

export default conversationRouter;
