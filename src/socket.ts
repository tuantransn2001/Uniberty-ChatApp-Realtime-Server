import { v4 as uuidv4 } from "uuid";
import { Server, Socket } from "socket.io";
import { sortStringArray } from "../src/common";

import User from "../Model/User";
import Conversation from "../Model/Conversation";
import logger from "./utils/logger";
const EVENTS = {
  connection: "connection",
  CLIENT: {
    CREATE_ROOM: "CREATE_ROOM",
    SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
    JOIN_ROOM: "JOIN_ROOM",
  },
  SERVER: {
    ROOMS: "ROOMS",
    JOINED_ROOM: "JOINED_ROOM",
    ROOM_MESSAGE: "ROOM_MESSAGE",
    SEND_MESSAGE: {
      UPDATE_SENDER_MESSAGE: "UPDATE_SENDER_MESSAGE",
      UPDATE_MESSAGE_EXPECT_SENDER: "UPDATE_MESSAGE_EXPECT_SENDER",
    },
    STATUS: {
      ONLINE: "ONLINE",
      OFFLINE: "OFFLINE",
    },
  },
};

const rooms: Record<string, { name: string }> = {};

function socket({ io }: { io: Server }) {
  logger.info(`Sockets enabled`);

  io.on(EVENTS.connection, (socket: Socket) => {
    logger.info(`User connected ${socket.id}`);

    /*
     * Set user status online
     */
    socket.on(EVENTS.SERVER.STATUS.ONLINE, (currentUserLoginID) => {
      console.log(`${currentUserLoginID} is online`);
      (async () => {
        await User.updateMany(
          { id: currentUserLoginID },
          {
            status: "online",
          }
        );
      })();
    });
    /*
     * Set user status offline
     */
    socket.on(EVENTS.SERVER.STATUS.OFFLINE, (currentUserLoginID) => {
      console.log(`${currentUserLoginID} is offline`);
      (async () => {
        await User.updateMany(
          { id: currentUserLoginID },
          {
            status: "offline",
          }
        );
      })();
    });
    /*
     * When a user creates a new room
     */
    socket.on(EVENTS.CLIENT.CREATE_ROOM, (conversationData) => {
      // add a new conversation to the conversations object
      const newConversation = {
        id: uuidv4(),
        members: sortStringArray(conversationData.members),
        messages: conversationData.messages.map((mess: any) => ({
          ...mess,
          createdAt: new Date(),
        })),
        createdAt: new Date(),
      };

      (async () => {
        const foundConversation = await Conversation.create(newConversation);
        const severRoomID = newConversation.members.join("");
        socket.join(severRoomID);
        socket.emit(
          "CREATED_AND_JOIN_ROOM_SENDER",
          severRoomID,
          foundConversation
        );
        socket
          .to(severRoomID)
          .emit("CREATED_AND_JOIN_ROOM", severRoomID, foundConversation);
      })();
    });
    /*
     * When a user sends a room message
     */
    socket.on(EVENTS.CLIENT.SEND_ROOM_MESSAGE, (messageData) => {
      const newMess: Array<any> = messageData.message;

      (async () => {
        const foundConversation: any = await Conversation.findOne({
          id: messageData.conversationID,
        });

        foundConversation.messages.push(newMess);
        foundConversation.save();

        const serverRoomID: string = foundConversation.members.join("");
        // ? Send back data to sender
        const updateMessArr: Array<any> = foundConversation.messages
        socket.emit(
          EVENTS.SERVER.SEND_MESSAGE.UPDATE_SENDER_MESSAGE,
          updateMessArr
        );
        // ? Send back data to all user in room expect sender
        socket
          .to(serverRoomID)
          .emit(
            EVENTS.SERVER.SEND_MESSAGE.UPDATE_MESSAGE_EXPECT_SENDER,
            serverRoomID,
            foundConversation
          );
      })();
    });
    /*
     * When a user joins a room
     */
    socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId) => {
      socket.join(roomId);
      socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
    });
  });
}

export default socket;
