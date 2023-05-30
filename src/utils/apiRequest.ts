import axios from "axios";
import { API_STUFF } from "../ts/enums/api_enums";
class RestFullAPIRequest {
  public static URL: string = API_STUFF.uniberty_baseURL;
  public static token: string = API_STUFF.token;
  public static message: string = "";

  public static async createInstance(baseURL: string | null) {
    return await axios.create({
      baseURL: baseURL ? baseURL : RestFullAPIRequest.URL,
    });
  }
}

export default RestFullAPIRequest;
