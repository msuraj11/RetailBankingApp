import { GET_ACCOUNT_INFO, ACCOUNT_INFO_ERROR, CLEAR_ACC_INFO } from '../actions/types';

const initialState = {
    loading: true,
    accInfo: null
};

export default function(state = initialState, action) {
    const {type, payload} = action;

    switch (type) {
        case GET_ACCOUNT_INFO:
            return {
                ...state,
                loading: false,
                accInfo: payload
            };
            
        case ACCOUNT_INFO_ERROR:
        case CLEAR_ACC_INFO:
            return {
                ...state,
                accInfo: null,
                loading: false
            }

        default:
            return state;
    }
};