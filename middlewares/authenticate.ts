import { IncomingHttpHeaders } from "http2";
import { Request, Response, NextFunction } from "express";
import config from "config";
import jwt from "jsonwebtoken";

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
      res.status(401).send({
        status: "Unauthorised",
        message: "Client-Error && In-Valid Token",
      });
    }
  } catch (err) {
    res.status(500).send({
      status: "Fail",
      message: "You are not logged in!",
    });
  }
};
export default authenticate;
