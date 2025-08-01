import {GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE} from '../actions/types';

const initialState = {
  profile: null,
  loading: true,
  error: {}
};

function profileReducer(state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
    case GET_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false
      };

    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };

    case CLEAR_PROFILE:
    default:
      return state;
  }
}

export default profileReducer;
