import { HealthCheckAttributes } from "../ts/types/app_types";

const sortStringArray = (rootArray: Array<string>): Array<string> => {
  return rootArray.sort(function (a: string, b: string) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });
};

const asyncMap = async (arr: Array<any>, callback: Function) => {
  return Promise.all(arr.map(async (item) => await callback(item)));
};

const healthCheck: HealthCheckAttributes = {
  uptime: process.uptime(),
  message: "OK",
  timestamp: Date.now(),
};

export { sortStringArray, asyncMap, healthCheck };
