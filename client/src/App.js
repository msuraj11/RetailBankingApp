import React, {Fragment, useEffect} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './Components/layouts/Navbar';
import Landing from './Components/layouts/Landing';
import Register from './Components/auth/Register';
import Login from './Components/auth/Login';
import TokenVerifier from './Components/auth/TokenVerifier';
import Alert from './Components/layouts/Alert';
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
            </Switch>
          </section>
        </Fragment>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
