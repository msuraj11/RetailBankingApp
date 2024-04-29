import {combineReducers} from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';
import accountInfo from './accountInfo';
import authAdmin from './authAdmin';
import adminLogs from './adminLogs';

export default combineReducers({
  alert,
  auth,
  profile,
  accountInfo,
  authAdmin,
  adminLogs
});
