export const getCleanRequestBody = (reqBody = {}) => {
  return Object.keys(reqBody).reduce((acc, key) => {
    acc[key] = reqBody[key].toString();
    return acc;
  }, {});
};
