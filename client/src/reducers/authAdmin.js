import {
  ADMIN_LOADED,
  ADMIN_AUTH_ERROR,
  ADMIN_LOGIN_FAIL,
  ADMIN_LOGIN_SUCCESS,
  ADMIN_LOGOUT,
  SET_ADMIN_NAV_LINKS,
  RESET_ADMIN_NAV_LINKS
} from '../actions/types';

const initialState = {
  adminToken: localStorage.getItem('adminToken'),
  isAdminAuthenticated: false,
  loading: true,
  admin: null,
  activateAdminNavLinks: localStorage.getItem('adminNav')
};

function authAdminReducer(state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
    case ADMIN_LOADED:
      return {
        ...state,
        isAdminAuthenticated: true,
        loading: false,
        admin: payload
      };

    case ADMIN_LOGIN_SUCCESS:
      localStorage.setItem('adminToken', payload.token);
      return {
        ...state,
        adminToken: payload.token,
        isAdminAuthenticated: true,
        loading: false
      };

    case SET_ADMIN_NAV_LINKS:
      sessionStorage.setItem('adminNav', true);
      return {
        ...state,
        activateAdminNavLinks: sessionStorage.getItem('adminNav')
      };

    case RESET_ADMIN_NAV_LINKS:
      sessionStorage.removeItem('adminNav');
      return {
        ...state,
        activateAdminNavLinks: sessionStorage.getItem('adminNav')
      };

    case ADMIN_AUTH_ERROR:
      localStorage.removeItem('adminToken');
      return {
        ...state,
        adminToken: null,
        isAdminAuthenticated: false,
        admin: null,
        loading: false
      };

    case ADMIN_LOGIN_FAIL:
    case ADMIN_LOGOUT:
      localStorage.removeItem('adminToken');
      return {
        ...initialState,
        adminToken: null,
        loading: false
      };

    default:
      return state;
  }
}

export default authAdminReducer;
