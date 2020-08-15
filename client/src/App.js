import React, {Fragment, useEffect} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './Components/layouts/Navbar';
import Landing from './Components/layouts/Landing';
import Register from './Components/auth/Register';
import Login from './Components/auth/Login';
import TokenVerifier from './Components/auth/TokenVerifier';
import Alert from './Components/layouts/Alert';
import Dashboard from './Components/dashboard/Dashboard';
import PrivateRoute from './Components/routing/PrivateRoute';
import PrivateRouteAdmin from './Components/routing/PrivateRouteAdmin';
import KYC from './Components/dashboard/profile/KYC';
import AccountInfo from './Components/account-Info/AccountInfo';
import Transaction from './Components/transaction/Transaction';
import AdminRegister from './Components/auth/admin/AdminRegister';
import AdminLogin from './Components/auth/admin/AdminLogin';
import AdminLanding from './Components/layouts/AdminLanding';
import AdminDashboard from './Components/dashboard/admin/AdminDashboard';
import PageNotFound from './Components/routing/PageNotFound';
import Logs from './Components/admin-tabs/Logs';
// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import { loadAdmin } from './actions/authAdmin';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

if (localStorage.adminToken) {
  setAuthToken(localStorage.adminToken, false);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
    store.dispatch(loadAdmin());
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Fragment>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/adminLanding" component={AdminLanding} />
            <section className="container">
              <Alert />
              <Switch>
                <Route exact path="/register" component={Register} />
                <Route exact path="/adminRegister" component={AdminRegister} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/adminLogin" component={AdminLogin} />
                <Route exact path="/tokenVerifier/:fromScreen" component={TokenVerifier} />
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute exact path="/kyc" component={KYC} />
                <PrivateRoute exact path="/accountInformation" component={AccountInfo} />
                <PrivateRoute exact path="/transaction" component={Transaction} />
                <PrivateRouteAdmin exact path="/adminDashboard" component={AdminDashboard} />
                <PrivateRouteAdmin exact path="/logs" component={Logs} />
                <Route component={PageNotFound} />
              </Switch>
            </section>
          </Switch>
        </Fragment>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
