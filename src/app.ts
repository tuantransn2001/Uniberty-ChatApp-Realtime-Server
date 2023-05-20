import express, { Express } from "express";
import config from "config";
import cors from "cors";
import mongoose from "mongoose";
import logger from "./utils/logger";
import socket from "./socket";
import rootRouter from "../routes";
import { createServer } from "http";
import { Server } from "socket.io";
// ? ============================== VARIABLES ==================================
const port = config.get<number>("port");
const host = config.get<string>("host");
const corsOrigin = config.get<string>("corsOrigin");
const mongoose_link = config.get<string>("mongoose_link");
const root_url = config.get<string>("root_url");
const environment = config.get<string>("environment");
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
// ? ============================== SOCKET ROUTER ===============================
app.use(root_url, rootRouter);
// ? ============================== RUN SERVER ==================================
mongoose.connect(mongoose_link).then(() => {
  server.listen(port, async () => {
    logger.info(`Database has been connected`);
    logger.info(
      `🚀 Server is running on ${environment} 🚀 - http://${host}:${port}`
    );

    socket({ io });
  });
});
