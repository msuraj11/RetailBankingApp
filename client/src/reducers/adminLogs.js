import {SET_ADMIN_LOGS, CLEAR_LOGS, LOGS_ERROR} from '../actions/types';

const initialState = {
    logs: null,
    allUsers: null,
    loading: true
};

export default function(state = initialState, action) {
    const {type, payload} = action;

    switch(type) {
        case SET_ADMIN_LOGS:
            return {
                ...state,
                logs: payload,
                loading: false
            };

        case LOGS_ERROR:
            return {
                ...state,
                logs: null,
                loading: false
            };

        case CLEAR_LOGS:
            return initialState;

        default:
            return state;
    }
};