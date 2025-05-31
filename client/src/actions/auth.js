import {USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, CLEAR_PROFILE, CLEAR_ACC_INFO, CLEAR_STATEMENT} from './types';
import setAuthToken from '../utils/setAuthToken';
import axios from 'axios';
import {setAlert} from './alert';

export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
    try {
      const res = await axios.get('/api/auth');
      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
    } catch (err) {
      dispatch({type: AUTH_ERROR});
    }
  } else {
    setAuthToken();
    dispatch({type: AUTH_ERROR});
  }
};

export const login = (customerId, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({customerId, password});

  try {
    const res = await axios.post('/api/auth', body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());
    dispatch(setAlert('Login Success', 'success', 2000));
  } catch (err) {
    console.error(err.response.data);
    const errors = err.response.data.errors || [{msg: 'Something went wrong! Please try again later'}];
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger', 10000)));
    }
    dispatch({
      type: LOGIN_FAIL
    });
  }
};

export const logout = () => (dispatch) => {
  setAuthToken();
  dispatch({type: LOGOUT});
  dispatch({type: CLEAR_PROFILE});
  dispatch({type: CLEAR_ACC_INFO});
  dispatch({type: CLEAR_STATEMENT});
};
