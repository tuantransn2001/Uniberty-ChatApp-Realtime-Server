require("dotenv").config();
import { ObjectDynamicValueAttributes } from "../../ts/interfaces/common";
import jwt from "jsonwebtoken";
import HttpException from "../../utils/http.exception";
import { IOAttributes, _Socket } from "../../ts/interfaces/socket";
import SocketServices from "../socket";

class ChatServices {
  public static connect({ io }: IOAttributes) {
    io.use((socket: _Socket, next) => {
      try {
        const { token } = socket.handshake.query;
        const decode = jwt.verify(
          token as string,
          process.env.JWT_TOKEN_SECRET_KEY as string
        );
        socket.decode = {
          ...(decode as ObjectDynamicValueAttributes),
          isAuth: false,
        };
        next();
      } catch (err) {
        const { message } = err as HttpException;
        socket.decode = { message, isAuth: false };
        next();
      }
    });

    SocketServices.onAuthenticate({ io });
  }
}

export default ChatServices;
