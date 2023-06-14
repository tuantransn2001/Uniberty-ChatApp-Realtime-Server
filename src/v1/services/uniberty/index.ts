require("dotenv").config();
import HttpException from "../../utils/http.exception";
import {
  API_STUFF,
  API_RESPONSE_STATUS,
  STATUS_CODE,
  STATUS_MESSAGE,
  API_PATH,
} from "../../ts/enums/api_enums";
import RestFullAPIRequest from "../../utils/apiRequest";
import RestFullAPI from "../../utils/apiResponse";
import { USER_ROLE } from "../../ts/enums/user_enum";
import { UserAuthDataAttributes } from "../../ts/types/common";
type IDListAttributes = {
  [type: string]: Array<string>;
};

class UnibertyAPIServices {
  public static async getAccessToken() {
    try {
      const formData = new FormData();
      formData.append("email", process.env.ADMIN_EMAIL as string);
      formData.append("password", process.env.ADMIN_PASSWORD as string);

      const loginResult = await RestFullAPIRequest.createInstance(
        API_STUFF.uniberty_baseURL
      ).post(API_PATH.admin_login, formData);

      return loginResult.data.access_token;
    } catch (err) {
      return undefined;
    }
  }
  public static async searchListUser(ids: IDListAttributes) {
    try {
      const searchListUserResult = {};
      await RestFullAPIRequest.createInstance(API_STUFF.uniberty_baseURL)
        .post(API_PATH.search_list_user, ids, {
          headers: { Authorization: `Bearer ${API_STUFF.token}` },
        })
        .then((response: any) => {
          Object.assign(searchListUserResult, {
            status: API_RESPONSE_STATUS.SUCCESS,
            data: response.data,
          });
        });

      return searchListUserResult;
    } catch (err) {
      const customErr: HttpException = err as HttpException;
      return {
        status: API_RESPONSE_STATUS.SUCCESS,
        message: customErr,
      };
    }
  }
  public static async checkAcceptChat<Params extends UserAuthDataAttributes>(
    userData: Params
  ) {
    try {
      const { type } = userData;

      // ? Case [ student , admin , admission_officer ]
      switch (type) {
        case USER_ROLE.STUDENT: {
          const { id } = userData;
          const access_token = await UnibertyAPIServices.getAccessToken();
          const studentLoginResult = await RestFullAPIRequest.createInstance(
            API_STUFF.uniberty_baseURL
          ).get(`${API_PATH.student_login}/${id}`, {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });

          if (studentLoginResult.status === STATUS_CODE.STATUS_CODE_200) {
            return RestFullAPI.onSuccess(
              STATUS_CODE.STATUS_CODE_200,
              STATUS_MESSAGE.SUCCESS
            );
          } else {
            return RestFullAPI.onSuccess(
              STATUS_CODE.STATUS_CODE_406,
              STATUS_MESSAGE.NOT_ACCEPTABLE
            );
          }
        }
        case USER_ROLE.ADMIN: {
          const { access_token } = userData;
          const adminLoginResult = await RestFullAPIRequest.createInstance(
            API_STUFF.uniberty_baseURL
          ).get(API_PATH.admin_me, {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });
          if (adminLoginResult.status === STATUS_CODE.STATUS_CODE_200) {
            return RestFullAPI.onSuccess(
              STATUS_CODE.STATUS_CODE_200,
              STATUS_MESSAGE.SUCCESS
            );
          } else {
            return RestFullAPI.onSuccess(
              STATUS_CODE.STATUS_CODE_406,
              STATUS_MESSAGE.NOT_ACCEPTABLE
            );
          }
        }
        default: {
          return RestFullAPI.onSuccess(
            STATUS_CODE.STATUS_CODE_406,
            `User type: "${type}" in-correct`
          );
        }
      }
    } catch (err) {
      const checkAcceptChatResultErr: HttpException = {
        message: STATUS_MESSAGE.NOT_ACCEPTABLE,
      } as HttpException;
      return RestFullAPI.onFail(
        STATUS_CODE.STATUS_CODE_406,
        checkAcceptChatResultErr
      );
    }
  }
}

export default UnibertyAPIServices;
