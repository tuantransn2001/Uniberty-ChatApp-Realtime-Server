import { v4 as uuidv4 } from "uuid";

import { Conversation } from "../../models";
import { EVENTS } from "../../constants/common";
import {
  ConversationAttributes,
  ObjectDynamicValueAttributes,
} from "../../ts/interfaces/common";
import logger from "../../utils/logger";
import RestFullAPI from "../../utils/apiResponse";
import { STATUS_CODE, STATUS_MESSAGE } from "../../ts/enums/api_enums";
import {
  ClientConversationAttributes,
  ClientSentRoomMessData,
  IOAttributes,
  _Socket,
} from "../../ts/interfaces/socket";

class SocketServices {
  public static onAuthenticate({ io }: IOAttributes) {
    io.on(EVENTS.connection, (socket: _Socket) => {
      const isAuth = socket.decode?.isAuth;
      if (isAuth) {
        logger.info({
          status: RestFullAPI.onSuccess(
            STATUS_CODE.STATUS_CODE_200,
            STATUS_MESSAGE.SUCCESS,
            { message: `User has authenticate: ${socket.id}` }
          ),
        });
        socket.emit(
          "authenticate",
          RestFullAPI.onSuccess(
            STATUS_CODE.STATUS_CODE_200,
            STATUS_MESSAGE.SUCCESS
          )
        );
        /*
         * When a user creates a new room
         */
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
      } else {
        logger.info({
          status: RestFullAPI.onSuccess(
            STATUS_CODE.STATUS_CODE_401,
            STATUS_MESSAGE.UN_AUTHORIZE
          ),
        });
        socket.emit(
          "unAuthenticate",
          RestFullAPI.onSuccess(
            STATUS_CODE.STATUS_CODE_401,
            STATUS_MESSAGE.UN_AUTHORIZE
          )
        );
      }
    });
  }
}

export default SocketServices;
