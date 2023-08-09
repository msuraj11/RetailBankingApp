import React, {Fragment} from 'react';
import {Outlet} from 'react-router-dom';
import Navbar from './Navbar';
import Alert from './Alert';

const RootLayout = () => (
  <Fragment>
    <Navbar />
    <Alert />
    <Outlet />
  </Fragment>
);

export default RootLayout;
