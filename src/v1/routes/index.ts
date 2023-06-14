import { Router } from "express";
import authRouter from "./auth.router";
import conversationRouter from "./conversation.router";

const rootRouter = Router();

rootRouter.use("/conversation", conversationRouter);
rootRouter.use("/auth", authRouter);

export default rootRouter;
