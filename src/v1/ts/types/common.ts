import HttpException from "../../utils/http.exception";

type UserAuthDataAttributes = {
  id?: number;
  type?: string;
  access_token?: string;
};

type HealthCheckAttributes = {
  uptime: number;
  message: string | HttpException;
  timestamp: number;
};

export { HealthCheckAttributes, UserAuthDataAttributes };
