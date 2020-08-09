import React from 'react';
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRouteAdmin = ({component: Component, authAdmin:{isAdminAuthenticated, loading}, ...rest}) => (
    <Route
        {...rest}
        render={props => !isAdminAuthenticated && !loading ? <Redirect to='/adminLanding' /> : <Component {...props} />}
    />
);

PrivateRouteAdmin.propTypes = {
    authAdmin: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    authAdmin: state.authAdmin
});

export default connect(mapStateToProps)(PrivateRouteAdmin);