require("dotenv").config();
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import UnibertyAPIServices from "../services/uniberty";
import { STATUS_CODE, STATUS_MESSAGE } from "../ts/enums/api_enums";
import { UserAuthDataAttributes } from "../ts/types/common";
import RestFullAPI from "../utils/apiResponse";

class AuthController {
  public static async signToken(req: Request, res: Response) {
    try {
      const userAuthData: UserAuthDataAttributes = req.query;
      const checkResult = await UnibertyAPIServices.checkAcceptChat(
        userAuthData
      );

      if (checkResult.statusCode === STATUS_CODE.STATUS_CODE_200) {
        const JWT_TOKEN_SECRET_KEY = process.env.JWT_TOKEN_SECRET_KEY as string;
        const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN as string;
        const token = jwt.sign(userAuthData, JWT_TOKEN_SECRET_KEY, {
          expiresIn: TOKEN_EXPIRES_IN,
        });
        res.status(STATUS_CODE.STATUS_CODE_200).send(
          RestFullAPI.onSuccess(
            STATUS_CODE.STATUS_CODE_200,
            STATUS_MESSAGE.SUCCESS,
            {
              access_token: token,
              expiresIn: TOKEN_EXPIRES_IN,
              userAuthData,
            }
          )
        );
      } else {
        res.status(checkResult.statusCode).send(checkResult);
      }
    } catch (err) {
      console.log(err);
      res
        .status(STATUS_CODE.STATUS_CODE_500)
        .send(
          RestFullAPI.onSuccess(
            STATUS_CODE.STATUS_CODE_500,
            STATUS_MESSAGE.SERVER_ERROR
          )
        );
    }
  }
}

export default AuthController;
