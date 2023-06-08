import { Router } from "express";
import conversationRouter from "./conversation.router";
import healthCheckRouter from "./healthCheck.router";

const rootRouter = Router();

rootRouter.use("/conversation", conversationRouter);
rootRouter.use("/healthCheck", healthCheckRouter);
export default rootRouter;
