import { Request, Response, NextFunction } from "express";
import { sortStringArray } from "../src/common";
import Conversation from "../models/Conversation";
import RestFullAPI from "../src/utils/apiResponse";
import { STATUS_CODE, STATUS_MESSAGE } from "../src/ts/enums/api_enums";

class ConversationController {
  public static async getConversationByMemberIDList(
    req: Request,
    res: Response,
    next: NextFunction
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
      next(err);
    }
  }
}

export default ConversationController;
