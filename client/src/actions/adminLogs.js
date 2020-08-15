import {SET_ADMIN_LOGS, LOGS_ERROR} from './types';
import axios from 'axios';
import { setAlert } from './alert';

export const getLogs = () => async (dispatch) => {
    try {
        const res = await axios.get('api/adminAction/logs');
        dispatch({
            type: SET_ADMIN_LOGS,
            payload: res.data
        });
    } catch (err) {
        const errors = err.response.data.msg || {msg: 'Something went wrong! Please try again later'};
        dispatch({type: LOGS_ERROR})
        if (errors) {
            dispatch(setAlert(errors, 'danger'));
        }   
    }
};
