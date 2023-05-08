import { Request, Response, NextFunction } from "express";
import { sortStringArray } from "../src/common";
import User from "../Model/User";
import Conversation from "../Model/Conversation";
import jwt from "jsonwebtoken";
import config from "config";
class Controller {
  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, password } = req.body;
      const foundUser = await User.findOne({ name }).exec();
      // ? Check user is exist or not by phone
      if (foundUser) {
        // * Case Exist
        const isMatchPassword: boolean = foundUser.password === password;
        switch (isMatchPassword) {
          case true: {
            const { id, name, contactList, status } = foundUser;

            const tokenPayload: {
              id: string | undefined;
              name: string | undefined;
            } = {
              id,
              name,
            };

            const jwtSecretKey = config.get<string>("jwt_secret_key");
            const token = jwt.sign(tokenPayload, jwtSecretKey, {
              expiresIn: "3d",
            });

            res.status(201).send({
              status: "Login Success",
              userInfo: { id, status, name, contactList },
              token,
            });
            break;
          }
          case false: {
            res.status(403).send({
              status: "Fail",
              message: `Password is in-correct ! Please check it and try again!`,
            });
            break;
          }
        }
      } else {
        // * Case does not exist
        res.status(404).send({
          status: "Not found",
          message: `User with name: ${name} doesn't exist ! Please check it and try again!`,
        });
      }
    } catch (err) {
      next(err);
    }
  }
  public static async searchUserByName(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { name } = req.params;
      const userList = await User.find({ name: new RegExp(name, "i") });
      res.status(200).send({
        status: "success",
        data: userList,
      });
    } catch (err) {
      next(err);
    }
  }
  public static async getUserByID(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const foundUser = await User.findOne({
        id,
      });
      res.status(200).send({
        status: "success",
        data: foundUser,
      });
    } catch (err) {
      next(err);
    }
  }
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
        res.status(201).send({
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
