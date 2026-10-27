import {AADHAR_REGEX, EMAIL_REGEX, MOBILE_NUMBER_REGEX, PAN_REGEX} from './constants.js';

export const getCleanRequestBody = (reqBody = {}) => {
  return Object.keys(reqBody).reduce((acc, key) => {
    acc[key] = reqBody[key].toString();
    return acc;
  }, {});
};

export const isValidMobileNumber = (mobileNumber) => {
  return MOBILE_NUMBER_REGEX.test(mobileNumber);
};

export const isValidEmail = (email) => {
  return EMAIL_REGEX.test(email);
};

export const isValidPAN = (pan) => {
  return PAN_REGEX.test(pan);
};

export const isValidAadhar = (aadhar) => {
  return AADHAR_REGEX.test(aadhar);
};
