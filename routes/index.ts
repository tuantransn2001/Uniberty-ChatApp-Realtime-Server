import { Router } from "express";
import errorHandler from "../middlewares/errorHandler";
import Controller from "../controllers";
const rootRouter = Router();
rootRouter.post("/login", Controller.login, errorHandler);
rootRouter.get("/search/:name", Controller.searchUserByName, errorHandler);
rootRouter.get("/get-by-id/:id", Controller.getUserByID, errorHandler);
rootRouter.get(
  "/get-conversation-by-id-list",
  Controller.getConversationByMemberIDList,
  errorHandler
);

export default rootRouter;
