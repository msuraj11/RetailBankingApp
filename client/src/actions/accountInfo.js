import {GET_ACCOUNT_INFO, ACCOUNT_INFO_ERROR, GET_ACC_STATEMENT, REMOVE_STATEMENT} from './types';
import axios from 'axios';
import {scroller} from 'react-scroll';
import { setAlert } from './alert';

export const getAccountInfo = () => async dispatch => {
    try {
        const res = await axios.get('/api/accountInfo');
        dispatch({
            type: GET_ACCOUNT_INFO,
            payload: res.data
        });
    } catch (err) {
        const errors = err.response.data.errors || [{msg: 'Something went wrong! Please try again later'}];
        dispatch({
            type: ACCOUNT_INFO_ERROR
        });
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
    }
};

export const getStatement = (fromDate, toDate) => async dispatch => {
    try {
        const res = await axios.get(`/api/accountInfo/statement/${fromDate}/${toDate}`);
        dispatch({
            type: GET_ACC_STATEMENT,
            payload: res.data
        });
        scroller.scrollTo('table', {duration: 1000, smooth: true});
    } catch (err) {
        const error = err.response.data.msg;
        if (error) {
            dispatch(setAlert(error, 'danger'));
        }
    }
};

export const removeStatement = () => dispatch => {
    dispatch({ type: REMOVE_STATEMENT });
}
