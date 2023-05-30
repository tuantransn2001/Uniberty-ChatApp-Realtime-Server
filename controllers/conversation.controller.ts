import { Request, Response, NextFunction } from "express";
import { asyncMap } from "../src/common";
import { Conversation } from "../models";
import RestFullAPI from "../src/utils/apiResponse";
import { STATUS_CODE, STATUS_MESSAGE } from "../src/ts/enums/api_enums";
import HttpException from "../src/utils/http.exception";
import { ConversationAttributes } from "../src/ts/interfaces/app_interfaces";
import UnibertyAPIServices from "../src/services/uniberty";
import { ObjectDynamicValueAttributes } from "../src/ts/interfaces/global_interfaces";

class ConversationController {
  public static async getConversationByMembers(req: Request, res: Response) {
    try {
      const { members } = req.body;

      const foundConversation = await Conversation.findOne({
        members: {
          $elemMatch: members[0] && members[1],
        },
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
          .status(STATUS_CODE.STATUS_CODE_404)
          .send(
            RestFullAPI.onSuccess(
              STATUS_CODE.STATUS_CODE_404,
              STATUS_MESSAGE.NOT_FOUND,
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
      const id = req.query.id;
      const type = req.query.type;

      const foundUserContactList = await Conversation.find({
        members: { $elemMatch: { id, type } },
      });

      // * ========================================
      // ? Call api get list user here
      // * ========================================

      const handleFormatUserContactInfo = async (
        members: Array<ConversationAttributes["members"][0]>
      ) => {
        const IDList: ObjectDynamicValueAttributes = members
          .filter((member: ConversationAttributes["members"][0]) => {
            const inputID: string = req.query.id?.toString() as string;
            return member.id.toString() !== inputID.toString();
          })
          .reduce(
            (
              IdListResult: ObjectDynamicValueAttributes,
              member: ConversationAttributes["members"][0]
            ) => {
              const currentUserType =
                member.type as keyof ObjectDynamicValueAttributes;
              const currentUserID: number = +member.id as number;

              IdListResult.ids[currentUserType].push(currentUserID);

              return IdListResult;
            },
            {
              ids: { student: [], admissions_officer: [], admin: [] },
            }
          ) as ObjectDynamicValueAttributes;

        const { data }: ObjectDynamicValueAttributes =
          (await UnibertyAPIServices.searchListUser(
            IDList
          )) as ObjectDynamicValueAttributes;

        return data;
      };

      res.status(STATUS_CODE.STATUS_CODE_200).send(
        RestFullAPI.onSuccess(
          STATUS_CODE.STATUS_CODE_200,
          STATUS_MESSAGE.SUCCESS,
          await asyncMap(foundUserContactList, async (userContactItem: any) => {
            const { id: conversationID, members, messages } = userContactItem;
            return {
              conversationID,
              members: await handleFormatUserContactInfo(members),
              messages,
            };
          })
        )
      );
    } catch (err) {
      next(err);
    }
  }
}

export default ConversationController;
