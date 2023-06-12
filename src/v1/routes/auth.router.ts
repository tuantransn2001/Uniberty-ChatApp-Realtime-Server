import { Router } from "express";
import AuthController from "../controllers/auth.controller";

const authRouter = Router();

authRouter.get("/get-token", AuthController.signToken);

export default authRouter;
