require("dotenv").config();
import express, { Express } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import config from "config";
import cors from "cors";
import mongoose from "mongoose";
import logger from "./utils/logger";
import socket from "./socket";
import rootRouter from "../routes";
// ? ============================== ENV VARIABLES ==================================
const HOST: string = process.env.HOST as string;
const PORT: string = process.env.PORT as string;
const DB_CONNECT_LINK: string = process.env.DB_CONNECT_LINK as string;
const ROOT_URL: string = process.env.ROOT_URL as string;
const ENVIRONMENT: string = process.env.ENVIRONMENT as string;
// ? ============================== CONFIG VARIABLES =============================
const corsOrigin = config.get<string>("corsOrigin");
// ? ============================== INITIATE SERVER =============================
const app: Express = express();
// ? ============================== ALLOW CORS ==================================
app.use(cors());
app.use(express.json());
// ? ============================== SOCKET SETUP ================================
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    credentials: true,
  },
});
// ? ================================== ROUTES ===================================
app.use(ROOT_URL, rootRouter);
// ? ============================== RUN SERVER ==================================
mongoose
  .connect(DB_CONNECT_LINK)
  .then(() => {
    server.listen(PORT, async () => {
      logger.info(`Database has been connected`);
      logger.info(
        `🚀 Server is running on ${ENVIRONMENT} 🚀 - http://${HOST}:${PORT}${ROOT_URL}`
      );
      socket({ io });
    });
  })
  .catch((err) => {
    logger.error(`Can't connect to database`);
    logger.error(`Error: ${err}`);
    process.exit();
  });
