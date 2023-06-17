import React from 'react';
import {connect} from 'react-redux';
import {Route, Navigate} from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRouteAdmin = ({
  component: Component,
  authAdmin: {isAdminAuthenticated, loading},
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      !isAdminAuthenticated && !loading ? (
        <Navigate to="/adminLanding" />
      ) : (
        <Component {...props} />
      )
    }
  />
);

PrivateRouteAdmin.propTypes = {
  authAdmin: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  authAdmin: state.authAdmin
});

export default connect(mapStateToProps)(PrivateRouteAdmin);
