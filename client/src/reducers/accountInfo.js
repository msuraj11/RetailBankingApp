import {GET_ACCOUNT_INFO, ACCOUNT_INFO_ERROR, CLEAR_ACC_INFO, GET_ACC_STATEMENT, CLEAR_STATEMENT, REMOVE_STATEMENT} from '../actions/types';

const initialState = {
  loading: true,
  accInfo: null,
  statement: null
};

function accountInfoReducer(state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
    case GET_ACCOUNT_INFO:
      return {
        ...state,
        loading: false,
        accInfo: payload
      };

    case GET_ACC_STATEMENT:
      return {
        ...state,
        statement: payload
      };

    case REMOVE_STATEMENT:
      return {
        ...state,
        statement: null
      };

    case ACCOUNT_INFO_ERROR:
    case CLEAR_ACC_INFO:
    case CLEAR_STATEMENT:
      return {
        ...state,
        accInfo: null,
        loading: false,
        statement: null
      };

    default:
      return state;
  }
}

export default accountInfoReducer;
