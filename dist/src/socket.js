"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./utils/logger"));
const EVENTS = {
    connection: "connection",
    disConnection: "disConnection",
    CLIENT: {
        CREATE_ROOM: "CREATE_ROOM",
        SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
        JOIN_ROOM: "JOIN_ROOM",
    },
    SERVER: {
        ROOMS: "ROOMS",
        JOINED_ROOM: "JOINED_ROOM",
        ROOM_MESSAGE: "ROOM_MESSAGE",
    },
};
const rooms = {};
function socket({ io }) {
    logger_1.default.info(`Sockets enabled`);
    io.on(EVENTS.connection, (socket) => {
        console.log(`User has been connected - socketID: ${socket.id}`);
    });
}
exports.default = socket;
