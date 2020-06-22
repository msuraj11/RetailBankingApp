import { SET_TIMER, CLEAR_TIMER } from './types';

export const setTimer = () => dispatch => {
    dispatch({
        type: SET_TIMER
    });
    setTimeout(() => {
        dispatch({ type: CLEAR_TIMER });
    }, 300000);
};
