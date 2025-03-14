import React, {Fragment} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {logout} from '../../actions/auth';
import {adminLogout} from '../../actions/authAdmin';

const Navbar = ({
  auth: {isAuthenticated, loading},
  logout,
  profile,
  adminLogout,
  authAdmin: {activateAdminNavLinks, isAdminAuthenticated, admin}
}) => {
  const location = useLocation();
  const authLinks = (
    <ul>
      <li>
        <Link to="/dashboard">
          <i className="fas fa-user"></i>
          <span className="hide-sm"> Dashboard</span>
        </Link>
      </li>
      {profile && (
        <Fragment>
          <li>
            <Link to="/accountInformation">
              <i className="fas fa-info"></i>
              <span className="hide-sm"> Account Info</span>
            </Link>
          </li>
          <li>
            <Link to="/transaction">
              <i className="fas fa-rupee-sign"></i>
              <span className="hide-sm"> Transaction</span>
            </Link>
          </li>
        </Fragment>
      )}
      <li>
        <Link to="/" onClick={logout}>
          <i className="fas fa-sign-out-alt"></i>
          <span className="hide-sm"> Logout</span>
        </Link>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <strong>
          <Link to="/register">Register</Link>
        </strong>
      </li>
      <li>
        <strong>
          <Link to="/login">Login</Link>
        </strong>
      </li>
      <li>
        <strong>
          <Link to="/adminLanding">Admin</Link>
        </strong>
      </li>
    </ul>
  );

  const adminLandingLinks = (
    <ul>
      <li>
        <Link to="/adminRegister">Register</Link>
      </li>
      <li>
        <Link to="/adminLogin">Login</Link>
      </li>
    </ul>
  );

  const adminAuthLinks = (
    <ul>
      <li>
        <Link to="/adminDashboard">
          <i className="fas fa-user-shield"></i>
          <span className="hide-sm"> Dashboard</span>
        </Link>
      </li>
      <li>
        <Link to="/allUsers">
          <i className="fas fa-user"></i>
          <span className="hide-sm"> Users</span>
        </Link>
      </li>
      {admin?.permissions?.length > 1 && (
        <li>
          <Link to="/logs">
            <i className="fas fa-info"></i>
            <span className="hide-sm"> Logs</span>
          </Link>
        </li>
      )}
      <li>
        <Link to="/adminLanding" onClick={adminLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span className="hide-sm"> Logout</span>
        </Link>
      </li>
    </ul>
  );

  let logoLink = '/',
    navFragment = null;
  if (activateAdminNavLinks) {
    logoLink = isAdminAuthenticated ? '/adminDashboard' : '/adminLanding';
    navFragment = isAdminAuthenticated ? adminAuthLinks : adminLandingLinks;
  } else if (!location.pathname.includes('admin')) {
    logoLink = isAuthenticated ? '/dashboard' : '/';
    navFragment = isAuthenticated ? authLinks : guestLinks;
  }

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to={logoLink}>
          <i className="fas fa-landmark"></i> BOS
        </Link>
      </h1>
      {!loading && <Fragment>{navFragment}</Fragment>}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  authAdmin: PropTypes.object.isRequired,
  adminLogout: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  authAdmin: state.authAdmin,
  profile: state.profile.profile
});

export default connect(mapStateToProps, {logout, adminLogout})(Navbar);
