import express, { Express } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import rootRouter from "./routes";
import http from "http";
import socketio from "socket.io";
import Message from "./Models/Message";
dotenv.config();

const PORT: string = process.env.PORT ?? "default is string";
const DB_PW: string = process.env.DB_PW ?? "default is string";
const app: Express = express();

// ? Lấy thông tin các tin nhắn của phòng chat hiện tại trong DB
async function getLastMessagesFromRoom(room: string) {
  let roomMessages = await Message.aggregate([
    // ? Choose only room want to work with
    { $match: { to: room } },

    { $group: { _id: "$date", messagesByDate: { $push: "$$ROOT" } } },
  ]);
  return roomMessages;
}
// ? Sắp xếp tin nhắn vừa lấy được theo thứ tự ngày
function sortRoomMessagesByDate(messages: [{ _id: string }]) {
  return messages.sort(function (a, b) {
    let date1: string[] | any[] = a._id.split("/");
    let date2: string[] | any[] = b._id.split("/");

    date1 = date1[2] + date1[0] + date1[1];
    date2 = date2[2] + date2[0] + date2[1];

    return date1 < date2 ? -1 : 1;
  });
}
// ? Router Set up
app.use("/uniberty-chatApp-realtime-api/v1/", rootRouter);

// ? Socket IO Set up
const server = http.createServer(app);
const io = new socketio.Server(server);

// ? Socket connection
io.on("connection", (socket) => {
  // ? Handle logic...
});

// ? DB Connect
mongoose
  .connect(
    `mongodb+srv://tuantransn2001:${DB_PW}@realtime-chatapp.ffdweqe.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(PORT, (): void => {
      console.log("Connected Database");
      console.log(`Server is running http://localhost:${PORT}`);
    });
  })
  .catch((error): void => {
    throw Error(error);
  });
