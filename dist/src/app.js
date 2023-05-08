"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const logger_1 = __importDefault(require("./utils/logger"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const socket_1 = __importDefault(require("./socket"));
const http_1 = require("http");
const routes_1 = __importDefault(require("../routes"));
const User_1 = __importDefault(require("../Model/User"));
const socket_io_1 = require("socket.io");
const seed_1 = require("./data/seed");
const port = config_1.default.get("port");
const host = config_1.default.get("host");
const corsOrigin = config_1.default.get("corsOrigin");
const mongoose_link = config_1.default.get("mongoose_link");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: corsOrigin,
        credentials: true,
    },
});
app.use("/", routes_1.default);
mongoose_1.default.connect(mongoose_link).then(() => {
    httpServer.listen(port, host, async () => {
        logger_1.default.info(`Database has been connected`);
        logger_1.default.info(`🚀 Server is running 🚀 - http://${host}:${port}`);
        await User_1.default.deleteMany();
        await User_1.default.insertMany(seed_1.USER_ARRAY);
        (0, socket_1.default)({ io });
    });
});
