import {GET_ACCOUNT_INFO, ACCOUNT_INFO_ERROR} from './types';
import axios from 'axios';
import { setAlert } from './alert';

export const getAccountInfo = () => async dispatch => {
    try {
        const res = await axios.get('/api/accountInfo');
        dispatch({
            type: GET_ACCOUNT_INFO,
            payload: res.data
        });
    } catch (err) {
        const errors = err.response.data.errors;
        dispatch({
            type: ACCOUNT_INFO_ERROR
        });
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
    }
};