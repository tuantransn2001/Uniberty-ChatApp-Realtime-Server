import { Router } from "express";
import conversationRouter from "./conversation.router";

const rootRouter = Router();

rootRouter.use("/conversation", conversationRouter);

export default rootRouter;
