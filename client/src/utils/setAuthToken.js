import axios from 'axios';

const setAuthToken = (token, isUser = true) => {
  if (token) {
    // user: x-auth-token, admin: x-auth-admin-token
    axios.defaults.headers.common[`x-auth${isUser ? '' : '-admin'}-token`] = token;
  } else {
    delete axios.defaults.headers.common[`x-auth${isUser ? '' : '-admin'}-token`];
  }
};

export default setAuthToken;
