import HttpException from "../../utils/http.exception";

type HealthCheckAttributes = {
  uptime: number;
  message: string | HttpException;
  timestamp: number;
};

export { HealthCheckAttributes };
