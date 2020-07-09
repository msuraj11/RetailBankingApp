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
import KYC from './Components/dashboard/profile/KYC';
import AccountInfo from './Components/account-Info/AccountInfo';
import Transaction from './Components/transaction/Transaction';
// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route path="/register" component={Register} />
              <Route path="/login" component={Login} />
              <Route path="/tokenVerifier" component={TokenVerifier} />
              <PrivateRoute path="/dashboard" component={Dashboard} />
              <PrivateRoute path="/kyc" component={KYC} />
              <PrivateRoute path="/accountInformation" component={AccountInfo} />
              <PrivateRoute path="/transaction" component={Transaction} />
            </Switch>
          </section>
        </Fragment>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
