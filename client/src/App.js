import React, {Fragment, useEffect} from 'react';
import {connect} from 'react-redux';
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import './App.css';
import Navbar from './Components/layouts/Navbar';
import Landing from './Components/layouts/Landing';
import Register from './Components/auth/Register';
import Login from './Components/auth/Login';
import TokenVerifier from './Components/auth/TokenVerifier';
import Alert from './Components/layouts/Alert';
import Dashboard from './Components/dashboard/Dashboard';
import KYC from './Components/dashboard/profile/KYC';
import AccountInfo from './Components/account-Info/AccountInfo';
import Transaction from './Components/transaction/Transaction';
import AdminRegister from './Components/auth/admin/AdminRegister';
import AdminLogin from './Components/auth/admin/AdminLogin';
import AdminLanding from './Components/layouts/AdminLanding';
import AdminDashboard from './Components/dashboard/admin/AdminDashboard';
import PageNotFound from './Components/routing/PageNotFound';
import Logs from './Components/admin-tabs/Logs';
import AllUsers from './Components/admin-tabs/AllUsers';
// Redux
import {loadUser} from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import {loadAdmin} from './actions/authAdmin';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

if (localStorage.adminToken) {
  setAuthToken(localStorage.adminToken, false);
}

const App = ({isAuthenticated, isAdminAuthenticated, loadingUser, loadingAdmin, dispatch}) => {
  useEffect(() => {
    dispatch(loadUser());
    dispatch(loadAdmin());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Fragment>
        <Navbar />
        <Alert />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/adminLanding" element={<AdminLanding />} />
          <Route path="/register" element={<Register />} />
          <Route path="/adminRegister" element={<AdminRegister />} />
          <Route path="/login" element={<Login />} />
          <Route path="/adminLogin" element={<AdminLogin />} />
          <Route path="/tokenVerifier/:fromScreen" element={<TokenVerifier />} />
          {/* USER PRIVATE ROUTES */}
          <Route path="/dashboard" element={!isAuthenticated && !loadingUser ? <Navigate to="/login" /> : <Dashboard />} />
          <Route path="/kyc" element={!isAuthenticated && !loadingUser ? <Navigate to="/login" /> : <KYC />} />
          <Route path="/accountInformation" element={!isAuthenticated && !loadingUser ? <Navigate to="/login" /> : <AccountInfo />} />
          <Route path="/transaction" element={!isAuthenticated && !loadingUser ? <Navigate to="/login" /> : <Transaction />} />
          {/* ADMIN PRIVATE ROUTES */}
          <Route path="/adminDashboard" element={!isAdminAuthenticated && !loadingAdmin ? <Navigate to="/adminLanding" /> : <AdminDashboard />} />
          <Route path="/logs" element={!isAdminAuthenticated && !loadingAdmin ? <Navigate to="/adminLanding" /> : <Logs />} />
          <Route path="/allUsers" element={!isAdminAuthenticated && !loadingAdmin ? <Navigate to="/adminLanding" /> : <AllUsers />} />
          <Route element={<PageNotFound />} />
        </Routes>
      </Fragment>
    </BrowserRouter>
  );
};

App.propTypes = {
  isAuthenticated: PropTypes.bool,
  isAdminAuthenticated: PropTypes.bool,
  loadingUser: PropTypes.bool,
  loadingAdmin: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  isAdminAuthenticated: state.authAdmin.isAdminAuthenticated,
  loadingUser: state.auth.loading,
  loadingAdmin: state.authAdmin.loading
});

export default connect(mapStateToProps)(App);
