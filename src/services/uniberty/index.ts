import HttpException from "../../utils/http.exception";
import { ObjectDynamicValueAttributes } from "../../ts/interfaces/common";
import { API_STUFF, API_RESPONSE_STATUS } from "../../ts/enums/api_enums";
import RestFullAPIRequest from "../../utils/apiRequest";
interface IDListAttributes {
  [type: string]: Array<string>;
}
class UnibertyAPIServices {
  public static async searchListUser(ids: IDListAttributes) {
    try {
      const searchListUserResult: ObjectDynamicValueAttributes = {};
      await (
        await RestFullAPIRequest.createInstance(API_STUFF.uniberty_baseURL)
      )
        .post(`/api/admin/search-list-user`, ids, {
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
}

export default UnibertyAPIServices;
