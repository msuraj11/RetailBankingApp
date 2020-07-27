import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = ({auth:{isAuthenticated, loading}, logout, profile}) => {
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
                <li><Link to='/register'>Register</Link></li>
                <li><Link to='/login'>Login</Link></li>
                <li><Link to='/adminLanding'>Admin</Link></li>
        </ul>
    );

    return (
        <nav className="navbar bg-dark">
            <h1>
                <Link to={isAuthenticated ? '/dashboard' : '/'}><i className="fas fa-landmark"></i> BOS</Link>
            </h1>
            {!loading && <Fragment>{ isAuthenticated ? authLinks : guestLinks }</Fragment>}
        </nav>
    );
};

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile.profile
});

export default connect(mapStateToProps, {logout})(Navbar);
