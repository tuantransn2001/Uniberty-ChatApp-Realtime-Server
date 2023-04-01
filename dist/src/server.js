"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const routes_1 = __importDefault(require("./routes"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const Message_1 = __importDefault(require("./Models/Message"));
dotenv_1.default.config();
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : "default is string";
const DB_PW = (_b = process.env.DB_PW) !== null && _b !== void 0 ? _b : "default is string";
const app = (0, express_1.default)();
// ? Lấy thông tin các tin nhắn của phòng chat hiện tại trong DB
async function getLastMessagesFromRoom(room) {
    let roomMessages = await Message_1.default.aggregate([
        // ? Choose only room want to work with
        { $match: { to: room } },
        { $group: { _id: "$date", messagesByDate: { $push: "$$ROOT" } } },
    ]);
    return roomMessages;
}
// ? Sắp xếp tin nhắn vừa lấy được theo thứ tự ngày
function sortRoomMessagesByDate(messages) {
    return messages.sort(function (a, b) {
        let date1 = a._id.split("/");
        let date2 = b._id.split("/");
        date1 = date1[2] + date1[0] + date1[1];
        date2 = date2[2] + date2[0] + date2[1];
        return date1 < date2 ? -1 : 1;
    });
}
// ? Router Set up
app.use("/uniberty-chatApp-realtime-api/v1/", routes_1.default);
// ? Socket IO Set up
const server = http_1.default.createServer(app);
const io = new socket_io_1.default.Server(server);
// ? Socket connection
io.on("connection", (socket) => {
    // ? Handle logic...
});
// ? DB Connect
mongoose_1.default
    .connect(`mongodb+srv://tuantransn2001:${DB_PW}@realtime-chatapp.ffdweqe.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => {
    app.listen(PORT, () => {
        console.log("Connected Database");
        console.log(`Server is running http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    throw Error(error);
});
