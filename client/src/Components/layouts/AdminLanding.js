import React, { useState, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setAlert } from '../../actions/alert';
import { setAdminNavLinks } from '../../actions/authAdmin';
import Alert from './Alert';

const AdminLanding = ({isAdminAuthenticated, setAlert, history, setAdminNavLinks}) => {
    const [localState, setLocalState] = useState({
        adminCode: '',
        isAuthorised: false
    });

    const {adminCode, isAuthorised} = localState;

    const onFieldChange = e => {
        setLocalState({...localState, adminCode: e.target.value});
    };

    const onBlurField = e => {
        if (adminCode !== '1413914') {
            setAlert('Access denied', 'danger', 6000);
            setTimeout(() => history.push('/'), 6000);
        }
    };

    const renderInputField = (<Fragment>
        <h1 className="x-large">Admin access point</h1>
        <p className="lead">Type admin access code to enter</p>
        <div className="form">
            <input
                type="password"
                placeholder="Access Code"
                name="adminCode"
                value={adminCode}
                onChange={e => onFieldChange(e)}
                onBlur={e => onBlurField(e)}
            />
        </div>
    </Fragment>);
        

    const renderMainLanding = (isAdminAuthenticated ? <Redirect to='/adminDashboard' /> :
        <Fragment>
            <h1 className="x-large">Customer Connect</h1>
            <p className="lead">Register or Login to handle Customer data</p>
            <div className="buttons">
                <Link to='/adminRegister' className="btn btn-primary">Sign Up</Link>
                <Link to='/adminLogin' className="btn btn-light">Login</Link>
            </div>
        </Fragment>     
    );

    if (adminCode === '1413914' && !isAuthorised) {
        setLocalState({...localState, isAuthorised: true});
        setAdminNavLinks();
    }

    return (isAdminAuthenticated ? <Redirect to='/adminDashboard' /> :
        <section className="landing-admin">
            <div className="dark-overlay">
                <div className="landing-inner">
                    <Alert />
                    {
                        isAuthorised ? renderMainLanding : renderInputField
                    }
                </div>
            </div>
        </section>
    );
};

AdminLanding.propTypes = {
    isAdminAuthenticated: PropTypes.bool,
    setAlert: PropTypes.func
};

const mapStateToProps = state => ({
    isAdminAuthenticated: state.authAdmin.isAdminAuthenticated
});

export default connect(mapStateToProps, {setAlert, setAdminNavLinks})(AdminLanding);