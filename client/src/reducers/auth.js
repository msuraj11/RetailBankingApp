import { USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, SET_TIMER, CLEAR_TIMER } from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true,
    user: null,
    startTimer: false,
    showTimer: false
};

export default function(state = initialState, action) {
    const {type, payload} = action;

    switch (type) {
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload
            };
            
        case LOGIN_SUCCESS:
            localStorage.setItem('token', payload.token);
            return{
                ...state,
                ...payload,
                isAuthenticated:true,
                loading: false
            };

        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false
            };

        case SET_TIMER:
            return {
                ...state,
                startTimer: true,
                showTimer: true
            }
        
        case CLEAR_TIMER:
            return {
                ...state,
                startTimer: false
            }

        default:
            return state;
    }
}