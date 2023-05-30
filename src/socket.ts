import { v4 as uuidv4 } from "uuid";
import { Server, Socket } from "socket.io";
import logger from "../src/utils/logger";
import User from "../models/User";
import Conversation from "../models/Conversation";
import {
  ConversationAttributes,
  UserAttributes,
} from "./ts/interfaces/app_interfaces";
import RestFullAPI from "./utils/apiResponse";
import { STATUS_CODE, STATUS_MESSAGE } from "./ts/enums/api_enums";
import { ObjectDynamicValueAttributes } from "./ts/interfaces/global_interfaces";

const EVENTS = {
  connection: "connection",
  CLIENT: {
    CREATE_ROOM: "CREATE_ROOM",
    SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
    JOIN_ROOM: "JOIN_ROOM",
    GET_CONTACT_LIST: "GET_CONTACT_LIST",
    ADD_NEW_CONTACT: "ADD_NEW_CONTACT",
  },
  SERVER: {
    ROOMS: "ROOMS",
    JOINED_ROOM: "JOINED_ROOM",
    ROOM_MESSAGE: "ROOM_MESSAGE",
    GET_CONTACT_LIST: "GET_CONTACT_LIST",
    SEND_NEW_CONTACT_SENDER: "SEND_NEW_CONTACT_SENDER",
    CREATED_AND_JOIN_ROOM: "CREATED_AND_JOIN_ROOM",
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

function socket({ io }: { io: Server }) {
  logger.info(`Sockets enabled`);

  io.on(EVENTS.connection, (socket: Socket) => {
    logger.info(`User connected ${socket.id}`);

    /*
     * Set user status online
     */
    socket.on(EVENTS.SERVER.STATUS.ONLINE, (currentUserLoginID: string) => {
      logger.info(`${currentUserLoginID} is online`);
      (async () => {
        await User.updateOne(
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
    socket.on(EVENTS.SERVER.STATUS.OFFLINE, (currentUserLoginID: string) => {
      logger.info(`${currentUserLoginID} is offline`);
      (async () => {
        await User.updateOne(
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
    interface ClientConversationAttributes {
      members: Array<{ id: string; type: string }>;
      message: {
        sender: {
          id: string;
          type: string;
        };
        content: string;
      };
    }
    socket.on(
      EVENTS.CLIENT.CREATE_ROOM,
      ({ members, message }: ClientConversationAttributes) => {
        (async () => {
          // * Add a new conversation to the conversations object
          const newConversationRow: ConversationAttributes = {
            id: uuidv4(),
            members: members.map((member) => {
              return {
                id: member.id,
                type: member.type,
              };
            }),
            messages: [
              {
                sender: {
                  id: message.sender.id.toString(),
                  type: message.sender.type,
                },
                content: message.content,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ],
          };

          const foundConversation = await Conversation.create(
            newConversationRow
          );

          socket.join(newConversationRow.id);

          io.emit(
            EVENTS.SERVER.CREATED_AND_JOIN_ROOM,
            RestFullAPI.onSuccess(
              STATUS_CODE.STATUS_CODE_200,
              STATUS_MESSAGE.SUCCESS,
              {
                conversation_id: foundConversation.id,
                members: foundConversation.members,
                messages: foundConversation.messages,
              }
            )
          );
        })();
      }
    );
    /*
     * When a user sends a room message
     */
    interface ClientSentRoomMessData {
      conversationID: string;
      message: {
        sender: { id: string; type: string };
        content: string;
        createdAt: Date;
      };
    }
    socket.on(
      EVENTS.CLIENT.SEND_ROOM_MESSAGE,
      (messageData: ClientSentRoomMessData) => {
        const newMess = { ...messageData.message, createdAt: new Date() };

        (async () => {
          await Conversation.findOneAndUpdate(
            { id: messageData.conversationID },
            {
              $push: { messages: newMess },
            }
          );

          // ? Send back data to sender
          const updatedConversations: ObjectDynamicValueAttributes =
            (await Conversation.findOne({
              id: messageData.conversationID,
            })) as ObjectDynamicValueAttributes;

          socket.emit(
            EVENTS.SERVER.SEND_MESSAGE.UPDATE_SENDER_MESSAGE,
            RestFullAPI.onSuccess(
              STATUS_CODE.STATUS_CODE_200,
              STATUS_MESSAGE.SUCCESS,
              updatedConversations
            )
          );
          // ? Send back data to all user in room expect sender
          socket.to(messageData.conversationID).emit(
            EVENTS.SERVER.SEND_MESSAGE.UPDATE_MESSAGE_EXPECT_SENDER,
            RestFullAPI.onSuccess(
              STATUS_CODE.STATUS_CODE_200,
              STATUS_MESSAGE.SUCCESS,
              {
                conversation_id: updatedConversations.id,
                messages: updatedConversations.messages,
              }
            )
          );
        })();
      }
    );
    /*
     * When a user joins a room
     */
    socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId: string) => {
      socket.join(roomId);
      socket.emit(
        EVENTS.SERVER.JOINED_ROOM,
        RestFullAPI.onSuccess(
          STATUS_CODE.STATUS_CODE_200,
          STATUS_MESSAGE.SUCCESS,
          { roomId }
        )
      );
    });
  });
}

export default socket;
