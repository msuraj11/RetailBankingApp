import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {RouterProvider, createBrowserRouter, createRoutesFromElements, Route, Navigate} from 'react-router-dom';
import './App.css';
import Landing from './Components/layouts/Landing';
import Register from './Components/auth/Register';
import Login from './Components/auth/Login';
import TokenVerifier from './Components/auth/TokenVerifier';
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
import RootLayout from './Components/layouts/RootLayout';
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Landing />} />
      <Route path="/adminLanding" element={<AdminLanding />} />
      <Route path="/register" element={<Register />} />
      <Route path="/adminRegister" element={<AdminRegister />} />
      <Route path="/login" element={<Login />} />
      <Route path="/adminLogin" element={<AdminLogin />} />
      <Route path="/tokenVerifier/:fromScreen" element={<TokenVerifier />} />
      {/* USER PRIVATE ROUTES */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/kyc" element={<KYC />} />
      <Route path="/accountInformation" element={<AccountInfo />} />
      <Route path="/transaction" element={<Transaction />} />
      {/* ADMIN PRIVATE ROUTES */}
      <Route path="/adminDashboard" element={<AdminDashboard />} />
      <Route path="/logs" element={<Logs />} />
      <Route path="/allUsers" element={<AllUsers />} />
      <Route element={<PageNotFound />} />
    </Route>
  )
);

const App = ({dispatch}) => {
  useEffect(() => {
    dispatch(loadUser());
    dispatch(loadAdmin());
  }, []);

  return <RouterProvider router={router} />;
};

export default connect()(App);
