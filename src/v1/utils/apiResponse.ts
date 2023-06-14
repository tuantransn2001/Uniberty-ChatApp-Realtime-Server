import { STATUS_CODE } from "../ts/enums/api_enums";
import HttpException from "./http.exception";
class RestFullAPI {
  public data: any;
  public message: string;
  public statusCode: number;

  constructor() {
    this.data = {};
    this.message = "";
    this.statusCode = STATUS_CODE.STATUS_CODE_200;
  }

  public static onSuccess(statusCode: number, message: string, data?: any) {
    return { statusCode, message, data };
  }

  public static onFail(statusCode: number, error: HttpException) {
    return {
      statusCode,
      error: error,
    };
  }
}

export default RestFullAPI;
