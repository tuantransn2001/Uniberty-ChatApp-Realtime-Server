import { Request, Response, NextFunction } from "express";
import { sortStringArray } from "../src/common";
import Conversation from "../Model/Conversation";

class Controller {
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
        res.status(200).send({
          status: "Success",
          data: foundConversation,
        });
      } else {
        res.status(204).send({
          status: "No content",
          message: "They have not chat each other before!",
        });
      }
    } catch (err) {
      next(err);
    }
  }
}

export default Controller;
