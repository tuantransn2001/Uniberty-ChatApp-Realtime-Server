import express, { Express } from "express";
import config from "config";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { createServer } from "http";
import logger from "./utils/logger";
import socket from "./socket";
import rootRouter from "../routes";
import { User } from "../Model";
import { USER_ARRAY } from "./data/seed";
// ? ============================== VARIABLES ==================================
const port = config.get<number>("port");
const host = config.get<string>("host");
const corsOrigin = config.get<string>("corsOrigin");
const mongoose_link = config.get<string>("mongoose_link");
const root_url = config.get<string>("root_url");
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
    logger.info(`🚀 Server is running 🚀 - http://${host}:${port}`);

    await User.deleteMany();
    await User.insertMany(USER_ARRAY);

    socket({ io });
  });
});
