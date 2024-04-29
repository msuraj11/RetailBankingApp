import axios from 'axios';

const setAuthToken = (token, isUser = true) => {
  if (token) {
    if (isUser) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      axios.defaults.headers.common['x-auth-admin-token'] = token;
    }
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
    delete axios.defaults.headers.common['x-auth-admin-token'];
  }
};

export default setAuthToken;
