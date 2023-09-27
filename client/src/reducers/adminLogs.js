import {SET_ADMIN_LOGS, CLEAR_LOGS, LOGS_ERROR, SET_USERS, SET_LOADER, USERS_DATA_ERROR} from '../actions/types';

const initialState = {
  logs: null,
  allUsers: null,
  loading: true
};

function adminLogsReducer(state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
    case SET_ADMIN_LOGS:
      return {
        ...state,
        logs: payload,
        loading: false
      };

    case SET_LOADER:
      return {
        ...state,
        loading: true
      };

    case SET_USERS:
      return {
        ...state,
        allUsers: payload,
        loading: false
      };

    case USERS_DATA_ERROR:
      return {
        ...state,
        allUsers: null,
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
}

export default adminLogsReducer;
