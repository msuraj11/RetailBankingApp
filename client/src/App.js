import React, {Fragment} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './Components/layouts/Navbar';
import Landing from './Components/layouts/Landing';
import Register from './Components/auth/Register';
import Login from './Components/auth/Login';
import TokenVerifier from './Components/auth/TokenVerifier';
// Redux
import { Provider } from 'react-redux';
import store from './store';
import Alert from './Components/layouts/Alert';

const App = () => {
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
