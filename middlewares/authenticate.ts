import { IncomingHttpHeaders } from "http2";
import { Request, Response, NextFunction } from "express";
import config from "config";
import jwt from "jsonwebtoken";
import { STATUS_CODE, STATUS_MESSAGE } from "../src/ts/enums/api_enums";
import RestFullAPI from "../src/utils/apiResponse";

interface MyCustomsHeaders {
  token: string;
}
type IncomingCustomHeaders = IncomingHttpHeaders & MyCustomsHeaders;

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const JWT_TOKEN_SECRET_KEY = config.get<string>("jwt_secret_key");
    const { token } = req.headers as IncomingCustomHeaders;

    const isAuth = jwt.verify(token, JWT_TOKEN_SECRET_KEY) as {
      id: string;
    };
    if (isAuth) {
      return next();
    } else {
      res
        .status(STATUS_CODE.STATUS_CODE_401)
        .send(
          RestFullAPI.onSuccess(
            STATUS_CODE.STATUS_CODE_200,
            STATUS_MESSAGE.UN_AUTHORIZE,
            { message: "Client-Error && In-Valid Token" }
          )
        );
    }
  } catch (err) {
    res
      .status(STATUS_CODE.STATUS_CODE_500)
      .send(
        RestFullAPI.onSuccess(
          STATUS_CODE.STATUS_CODE_500,
          STATUS_MESSAGE.SERVER_ERROR
        )
      );
  }
};
export default authenticate;
