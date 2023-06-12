import { Request, Response } from "express";
import mongoose from "mongoose";
import { healthCheck } from "../common";
import { STATUS_CODE, STATUS_MESSAGE } from "../ts/enums/api_enums";
import RestFullAPI from "../utils/apiResponse";
import HttpException from "../utils/http.exception";

class HealthCheckerController {
  public static async checkScreen(_: Request, res: Response) {
    try {
      res
        .status(STATUS_CODE.STATUS_CODE_200)
        .send(
          RestFullAPI.onSuccess(
            STATUS_CODE.STATUS_CODE_200,
            STATUS_MESSAGE.SUCCESS,
            healthCheck
          )
        );
    } catch (error) {
      healthCheck.message = error as HttpException;
      res
        .status(STATUS_CODE.STATUS_CODE_503)
        .end(
          RestFullAPI.onSuccess(
            STATUS_CODE.STATUS_CODE_503,
            STATUS_MESSAGE.SERVICES_UNAVAILABLE,
            healthCheck
          )
        );
    }
  }
  public static async checkDatabase(_: Request, res: Response) {
    // Health Check Schema
    const HealthCheck = mongoose.model(
      "HealthCheck",
      new mongoose.Schema(
        {
          event: String,
        },
        {
          collection: "HealthCheck",
          minimize: false,
        }
      )
    );
    async function checkData() {
      return await HealthCheck.findOneAndUpdate(
        { event: "check" },
        { event: "check" },
        {
          new: true,
          upsert: true,
        }
      );
    }
    try {
      const isUp: boolean = (await checkData()) !== undefined;

      if (isUp) {
        res
          .status(STATUS_CODE.STATUS_CODE_200)
          .send(
            RestFullAPI.onSuccess(
              STATUS_CODE.STATUS_CODE_200,
              STATUS_MESSAGE.SUCCESS,
              await checkData()
            )
          );
      } else {
        res
          .status(STATUS_CODE.STATUS_CODE_503)
          .end(
            RestFullAPI.onSuccess(
              STATUS_CODE.STATUS_CODE_503,
              STATUS_MESSAGE.SERVICES_UNAVAILABLE
            )
          );
      }
    } catch (error) {
      res
        .status(STATUS_CODE.STATUS_CODE_503)
        .end(
          RestFullAPI.onSuccess(
            STATUS_CODE.STATUS_CODE_503,
            STATUS_MESSAGE.SERVICES_UNAVAILABLE
          )
        );
    }
  }
}

export default HealthCheckerController;
