import axios from 'axios';
import {GET_PROFILE, PROFILE_ERROR} from './types';

export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/profile/me');
    const isMultiStatusSuccess = res?.status === 207;
    dispatch({
      type: isMultiStatusSuccess ? PROFILE_ERROR : GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    console.error(err);
    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};
