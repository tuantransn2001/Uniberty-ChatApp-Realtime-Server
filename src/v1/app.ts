require("dotenv").config();
import express, { Express } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import logger from "./utils/logger";
import ChatServices from "./services/chat";
import healthCheckRouter from "./routes/healthCheck.router";
import rootRouter from "./routes";
import { corsConfig } from "./constants/common";
// ? ============================== SOCKET SETUP ================================
const app: Express = express();
const server = createServer(app);
const io = new Server(server, {
  cors: corsConfig,
});
// ? ============================== ENV VARIABLES ==================================
const LOCAL_HOST: string = process.env.LOCAL_HOST as string;
const SERVER_HOST: string = process.env.SERVER_HOST as string;
const PORT: string = process.env.PORT as string;
const DB_CONNECT_LINK: string = process.env.DB_CONNECT_LINK as string;
const ROOT_URL: string = process.env.ROOT_URL as string;
const ENVIRONMENT: string = process.env.ENVIRONMENT as string;
// ? ============================== ALLOW CORS ==================================
app.use(cors());
app.use(express.json());
// ? ================================== CHAT ROUTES ==================================
// ? ================================== APP ROUTES ===================================
app.use(`${ROOT_URL}/healthCheck`, healthCheckRouter);
app.use(ROOT_URL, rootRouter);
// ? ============================== RUN SERVER ==================================
mongoose
  .connect(DB_CONNECT_LINK)
  .then(async () => {
    server.listen(PORT, async () => {
      logger.info(`Database has been connected`);
      logger.info(
        `🚀 Server is running on ${ENVIRONMENT} 🚀 - http://${
          ENVIRONMENT.toUpperCase() === "PRODUCTION" ? SERVER_HOST : LOCAL_HOST
        }:${PORT}${ROOT_URL}`
      );
      ChatServices.connect({ io });
    });
  })
  .catch((err) => {
    logger.error(`Can't connect to database`);
    logger.error(`Error: ${err}`);
    process.exit();
  });
