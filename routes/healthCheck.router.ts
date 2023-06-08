import { Router } from "express";
import HealthCheckerController from "../controllers/healthChecker.controller";

const healthCheckRouter = Router();

healthCheckRouter
  .get("/screen", HealthCheckerController.checkScreen)
  .get("/database", HealthCheckerController.checkDatabase);

export default healthCheckRouter;
