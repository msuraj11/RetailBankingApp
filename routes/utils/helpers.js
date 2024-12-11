const getStringifiedObject = (reqBody = {}) => {
  return Object.keys(reqBody).reduce((acc, key) => {
    acc[key] = reqBody[key].toString();
    return acc;
  }, {});
};

module.exports = {getStringifiedObject};
