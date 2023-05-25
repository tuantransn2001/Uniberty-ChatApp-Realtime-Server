import { v4 as uuidv4 } from "uuid";
import { Server, Socket } from "socket.io";
import { sortStringArray } from "../src/common";
import logger from "../src/utils/logger";
import User from "../models/User";
import Conversation from "../models/Conversation";
import {
  ConversationAttributes,
  UserAttributes,
} from "./ts/interfaces/app_interfaces";
import RestFullAPI from "./utils/apiResponse";
import { STATUS_CODE, STATUS_MESSAGE } from "./ts/enums/api_enums";

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
    CREATED_AND_JOIN_ROOM_SENDER: "CREATED_AND_JOIN_ROOM_SENDER",
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
      members: Array<{
        id: string;
        type: string;
      }>;
      messages: Array<{ author: string; content: string }>;
    }
    socket.on(
      EVENTS.CLIENT.CREATE_ROOM,
      (conversationData: ClientConversationAttributes) => {
        (async () => {
          // add a new user
          const newUserRowArr = conversationData.members.map((member) => {
            return {
              db_id: member.id,
              chat_id: uuidv4(),
              type: member.type,
            };
          });
          await User.insertMany(newUserRowArr);
          // add a new conversation to the conversations object
          const newConversation: ConversationAttributes = {
            id: uuidv4(),
            members: sortStringArray(
              conversationData.members.map((member: any) => {
                return member.id;
              })
            ),
            messages: conversationData.messages.map((mess: any) => ({
              ...mess,
              createdAt: new Date(),
            })),
          };
          const foundConversation = await Conversation.create(newConversation);
          const severRoomID = newConversation.members.join("");
          socket.join(severRoomID);
          socket.emit(
            EVENTS.SERVER.CREATED_AND_JOIN_ROOM_SENDER,
            RestFullAPI.onSuccess(
              STATUS_CODE.STATUS_CODE_200,
              STATUS_MESSAGE.SUCCESS,
              {
                severRoomID,
                foundConversation,
              }
            )
          );
          socket
            .to(severRoomID)
            .emit(
              EVENTS.SERVER.CREATED_AND_JOIN_ROOM,
              severRoomID,
              foundConversation
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
        author: string;
        content: string;
        createdAt: Date;
      };
    }
    socket.on(
      EVENTS.CLIENT.SEND_ROOM_MESSAGE,
      (messageData: ClientSentRoomMessData) => {
        const newMess = messageData.message;

        (async () => {
          const foundConversation: ConversationAttributes =
            (await Conversation.findOne({
              id: messageData.conversationID,
            })) as ConversationAttributes;

          await Conversation.findOneAndUpdate(
            { id: messageData.conversationID },
            {
              $push: { messages: newMess },
            }
          );

          const serverRoomID: string = foundConversation.members.join("");
          // ? Send back data to sender
          const updateMessArr: ConversationAttributes["messages"] =
            foundConversation.messages;
          socket.emit(
            EVENTS.SERVER.SEND_MESSAGE.UPDATE_SENDER_MESSAGE,
            RestFullAPI.onSuccess(
              STATUS_CODE.STATUS_CODE_200,
              STATUS_MESSAGE.SUCCESS,
              { updateMessArr }
            )
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
    /*
     * Add new contact
     */
    socket.on(
      EVENTS.CLIENT.ADD_NEW_CONTACT,
      ({ userID, contactUserID }: { [id: string]: string }) => {
        // add new contact
        (async () => {
          // ? Add contact to sender
          const newContactInfoItemToSender: UserAttributes =
            (await User.findOne({
              db_id: contactUserID,
            })) as UserAttributes;

          await User.findOneAndUpdate(
            { db_id: userID },
            {
              $push: { contactList: newContactInfoItemToSender },
            }
          );
          // ? Add contact to contact user

          const newContactInfoItemToContact = await User.findOne({
            db_id: userID,
          });

          await User.findOneAndUpdate(
            { db_id: contactUserID },
            {
              $push: { contactList: newContactInfoItemToContact },
            }
          );

          const foundUser: UserAttributes = (await User.findOne({
            db_id: userID,
          })) as UserAttributes;
          const contactList: UserAttributes["contactList"] =
            foundUser?.contactList;
          socket.emit(
            EVENTS.SERVER.SEND_NEW_CONTACT_SENDER,
            RestFullAPI.onSuccess(
              STATUS_CODE.STATUS_CODE_200,
              STATUS_MESSAGE.SUCCESS,
              { contactList }
            )
          );
        })();
      }
    );
    /*
     * Get contact list
     */
    socket.on(EVENTS.CLIENT.GET_CONTACT_LIST, (userID: string) => {
      (async () => {
        const foundUser: UserAttributes = (await User.findOne({
          db_id: userID,
        })) as UserAttributes;

        const contactList: UserAttributes["contactList"] =
          foundUser?.contactList;

        socket.emit(
          EVENTS.SERVER.GET_CONTACT_LIST,
          RestFullAPI.onSuccess(
            STATUS_CODE.STATUS_CODE_200,
            STATUS_MESSAGE.SUCCESS,
            { contactList }
          )
        );
      })();
    });
  });
}

export default socket;
