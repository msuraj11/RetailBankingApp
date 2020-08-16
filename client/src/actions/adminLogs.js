import {SET_ADMIN_LOGS, LOGS_ERROR, SET_USERS, USERS_DATA_ERROR, SET_LOADER} from './types';
import axios from 'axios';
import { setAlert } from './alert';

export const getLogs = () => async (dispatch) => {
    try {
        dispatch({type: SET_LOADER});
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

export const getUsers = () => async (dispatch) => {
    try {
        dispatch({type: SET_LOADER});
        const res = await axios.get('api/adminAction/getAllUsers');
        dispatch({
            type: SET_USERS,
            payload: res.data
        });
    } catch (err) {
        const errors = err.response.data.errors || [{msg: 'Something went wrong! Please try again later'}];
        dispatch({type: USERS_DATA_ERROR})
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }  
    }
};
