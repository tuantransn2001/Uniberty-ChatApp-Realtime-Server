import { Request, Response, NextFunction } from "express";
import { sortStringArray } from "../src/common";
import { Conversation, User } from "../models";
import RestFullAPI from "../src/utils/apiResponse";
import { STATUS_CODE, STATUS_MESSAGE } from "../src/ts/enums/api_enums";
import HttpException from "../src/utils/http.exception";

class ConversationController {
  public static async getConversationByMemberIDList(
    req: Request,
    res: Response
  ) {
    try {
      const memberIDList: string = req.query.memberIDList as string;
      const foundConversation = await Conversation.findOne({
        members: sortStringArray(memberIDList.split("$")),
      });

      if (foundConversation) {
        res
          .status(STATUS_CODE.STATUS_CODE_200)
          .send(
            RestFullAPI.onSuccess(
              STATUS_CODE.STATUS_CODE_200,
              STATUS_MESSAGE.SUCCESS,
              foundConversation
            )
          );
      } else {
        res
          .status(STATUS_CODE.STATUS_CODE_204)
          .send(
            RestFullAPI.onSuccess(
              STATUS_CODE.STATUS_CODE_204,
              STATUS_MESSAGE.NO_CONTENT,
              "They haven't been chat before!"
            )
          );
      }
    } catch (err) {
      const customErr: HttpException = err as HttpException;

      res
        .status(STATUS_CODE.STATUS_CODE_500)
        .send(RestFullAPI.onFail(STATUS_CODE.STATUS_CODE_500, customErr));
    }
  }
  public static async getContactList(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id: string = req.params.id as string;

      const foundUser = await User.findOne({ id });

      res
        .status(STATUS_CODE.STATUS_CODE_200)
        .send(
          RestFullAPI.onSuccess(
            STATUS_CODE.STATUS_CODE_200,
            STATUS_MESSAGE.SUCCESS,
            foundUser
          )
        );
    } catch (err) {
      next(err);
    }
  }
}

export default ConversationController;
