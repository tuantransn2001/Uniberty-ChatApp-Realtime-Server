import { Server, Socket } from "socket.io";
import { ObjectDynamicValueAttributes } from "./common";

interface _Socket extends Socket {
  decode?: ObjectDynamicValueAttributes;
}
interface IOAttributes {
  io: Server;
  isAuthenticated?: boolean;
}

interface ClientSentRoomMessData {
  conversationID: string;
  message: {
    sender: { id: string; type: string };
    content: string;
    createdAt: Date;
  };
}

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
export {
  _Socket,
  IOAttributes,
  ClientSentRoomMessData,
  ClientConversationAttributes,
};
