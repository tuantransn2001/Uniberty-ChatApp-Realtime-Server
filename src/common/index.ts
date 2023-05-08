export const sortStringArray = (rootArray: Array<string>): Array<string> => {
  return rootArray.sort(function (a: string, b: string) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });
};
