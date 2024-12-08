import React from 'react';
import {Outlet} from 'react-router-dom';

const ContainerLayout = () => (
  <section className="container">
    <Outlet />
  </section>
);

export default ContainerLayout;
