import { ADMIN_LOADED, ADMIN_AUTH_ERROR, ADMIN_LOGIN_FAIL, ADMIN_LOGIN_SUCCESS, ADMIN_LOGOUT,
    SET_ADMIN_NAV_LINKS, RESET_ADMIN_NAV_LINKS } from './types';
import setAuthToken from '../utils/setAuthToken';
import axios from 'axios';
import { setAlert } from './alert';

export const loadAdmin = () => async dispatch => {
    if (localStorage.adminToken) {
        setAuthToken(localStorage.adminToken, false);
    }
    try {
        const res = await axios.get('/api/authAdmin');
        dispatch({
            type: ADMIN_LOADED,
            payload: res.data
        });
    } catch (err) {
        dispatch({ type: ADMIN_AUTH_ERROR });
    }
};


export const adminLogin = (email, password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({email, password});

    try {
        const res = await axios.post('/api/authAdmin', body, config);
        console.log(res.data);
        dispatch({
            type: ADMIN_LOGIN_SUCCESS,
            payload: res.data
        });
        dispatch(loadAdmin());
        dispatch(setAlert('Login Success', 'success', 2000));
    } catch (err) {
        console.error(err.response.data);
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger', 10000)));
        }
        dispatch({
            type: ADMIN_LOGIN_FAIL
        });
    }
};

export const setAdminNavLinks = () => dispatch => {
    dispatch({ type: SET_ADMIN_NAV_LINKS });
};

export const resetAdminNavLinks = () => dispatch => {
    dispatch({ type: RESET_ADMIN_NAV_LINKS });
};

export const logout = () => dispatch => {
    dispatch({ type: ADMIN_LOGOUT });
};
