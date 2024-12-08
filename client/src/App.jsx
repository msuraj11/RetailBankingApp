import {useLayoutEffect} from 'react';
import {connect} from 'react-redux';
import {RouterProvider, createBrowserRouter, createRoutesFromElements, Route} from 'react-router-dom';
import PropTypes from 'prop-types';
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
import ContainerLayout from './Components/layouts/ContainerLayout';
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
      <Route element={<ContainerLayout />}>
        <Route path="/register" element={<Register />} />
        <Route path="/adminRegister" element={<AdminRegister />} />
        <Route path="/login" element={<Login />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/tokenVerifier/:fromScreen" element={<TokenVerifier />} />
        {/* USER PRIVATE ROUTES */} {/* TODO - Add one more path /user/<*> */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/kyc" element={<KYC />} />
        <Route path="/accountInformation" element={<AccountInfo />} />
        <Route path="/transaction" element={<Transaction />} />
        {/* ADMIN PRIVATE ROUTES */} {/* TODO - Add one more path /admin/<*> */}
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/allUsers" element={<AllUsers />} />
      </Route>
      <Route element={<PageNotFound />} />
    </Route>
  )
);

const App = ({dispatch}) => {
  useLayoutEffect(() => {
    dispatch(loadUser());
    dispatch(loadAdmin());
  }, [dispatch]);

  return <RouterProvider router={router} />;
};

App.propTypes = {
  dispatch: PropTypes.func
};

export default connect()(App);
