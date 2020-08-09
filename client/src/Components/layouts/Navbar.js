import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import { adminLogout } from '../../actions/authAdmin';

const Navbar = ({auth:{isAuthenticated, loading}, logout, profile, adminLogout,
    authAdmin: {activateAdminNavLinks, isAdminAuthenticated}}) => {
    const authLinks = (
        <ul>
            <li>
                <Link to='/dashboard'>
                    <i className='fas fa-user'></i>
                    <span className='hide-sm'> Dashboard</span>
                </Link>
            </li>
            {profile &&
                <Fragment>
                    <li>
                        <Link to='/accountInformation'>
                            <i className='fas fa-info'></i>
                            <span className='hide-sm'> Account Info</span>
                        </Link>
                    </li>
                    <li>
                        <Link to='/transaction'>
                            <i className='fas fa-rupee-sign'></i>
                            <span className='hide-sm'> Transaction</span>
                        </Link>
                    </li>
                </Fragment>
            }
            <li>
                <Link to='/' onClick={logout}>
                    <i className='fas fa-sign-out-alt'></i>
                    <span className='hide-sm'> Logout</span>
                </Link>
            </li>
        </ul>
    );

    const guestLinks = (
        <ul>
            <li><strong><Link to='/register'>Register</Link></strong></li>
            <li><strong><Link to='/login'>Login</Link></strong></li>
            <li><strong><Link to='/adminLanding'>Admin</Link></strong></li>
        </ul>
    );

    const adminLandingLinks = (
        <ul>
            <li><Link to='/adminRegister'>Register</Link></li>
            <li><Link to='/adminLogin'>Login</Link></li>
        </ul>
    );

    const adminAuthLinks = (
        <ul>
            <li>
                <Link to='/adminDashboard'>
                    <i className='fas fa-user'></i>
                    <span className='hide-sm'> Dashboard</span>
                </Link>
            </li>
            <li>
                <Link to='/adminLanding' onClick={adminLogout}>
                    <i className='fas fa-sign-out-alt'></i>
                    <span className='hide-sm'> Logout</span>
                </Link>
            </li>
        </ul>
    );

    let logoLink;
    if (activateAdminNavLinks) {
        logoLink = isAdminAuthenticated ? '/adminDashboard' : '/adminLanding';
    } else {
        logoLink = isAuthenticated ? '/dashboard' : '/';
    }

    return (
        <nav className="navbar bg-dark">
            <h1>
                <Link to={logoLink}><i className="fas fa-landmark"></i> BOS</Link>
            </h1>
            {!loading &&
                <Fragment>{ activateAdminNavLinks ?
                    (isAdminAuthenticated ? adminAuthLinks : adminLandingLinks ) :
                    (isAuthenticated ? authLinks : guestLinks) }
                </Fragment>}
        </nav>
    );
};

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    authAdmin: PropTypes.object.isRequired,
    adminLogout: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    authAdmin: state.authAdmin,
    profile: state.profile.profile
});

export default connect(mapStateToProps, {logout, adminLogout})(Navbar);
