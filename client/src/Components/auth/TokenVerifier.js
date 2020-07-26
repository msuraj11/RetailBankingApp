import React, {Fragment, useState} from 'react';
import { Link, Redirect } from 'react-router-dom';
import {isEmpty} from 'lodash';
import axios from 'axios';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import PropTypes from 'prop-types';
import Timer from '../layouts/Timer';

const TokenVerifier = ({setAlert, isAuthenticated, isAdminAuthenticated, history, showTimer, match: {params}}) => {
    const [tokenData, setTokenData] = useState({
        token: '',
        resendData: {
            email: '',
            password: ''
        },
        isValidToken: true,
        isValidUser: true,
        displayResendFields: false
    });

    const {token, resendData, isValidToken, displayResendFields, isValidUser} = tokenData;
    const {email, password} = resendData;
    const {fromScreen} = params;
    const tokenKey = fromScreen === 'user' ? 'x-auth-token' : 'x-auth-admin-token';

    const onFieldChange = e => setTokenData({...tokenData, token: e.target.value, isValidToken: true});

    const onResendFieldChange = e => setTokenData(
        {...tokenData, resendData: {...resendData, [e.target.name]: e.target.value}});

    const onLinkClick = () => setTokenData({...tokenData, displayResendFields: !displayResendFields});

    const onSubmitForm = async e => {
        e.preventDefault();
        const config = {
            headers: {
                [tokenKey]: token
            }
        };

        try {
            const res = await axios.get(fromScreen === 'user' ?
                '/api/auth/verifyToken' : '/api/authAdmin/verifyToken', config);
            console.log(res.data);
            setAlert('Your login details has been sent to your E-Mail you registered. Please use them to login.',
                'success', 12000);
            setTokenData({...tokenData, token: ''});
            setTimeout(() => history.push(fromScreen === 'user' ? '/login' : '/adminLogin'), 12000);
        } catch (error) {
            console.error(error.response.data);
            setTokenData({...tokenData, isValidToken: false});
        }
    };

    const onSubmitResendForm = e => {
        e.preventDefault();
        console.log(resendData);
    };

    return (isAuthenticated ? //TODO componentDidMount of Admin is stored in redux-state and can be used here for navigation
        <Redirect to='/dashboard' /> : (isAdminAuthenticated ? <Redirect to='/adminDashboard' /> :
        <Fragment>
            <h1 className="large text-primary">Verify Token</h1>
            <p className="lead"><i className="fas fa-paper-plane"></i> Check for Token in your Inbox of E-Mail you provided</p>
            {showTimer && <Timer />}
            <form className="form" onSubmit={e => onSubmitForm(e)}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Token"
                        name="token"
                        value={token}
                        onChange={e => onFieldChange(e)}
                    />
                    {!isValidToken &&
                        <small className="form-danger">
                            Invalid token.
                        </small>
                    }
                </div>
                <button
                    type="submit"
                    className='btn btn-primary'
                    disabled={isEmpty(token) || !isValidToken}
                >
                    Verify
                </button>
            </form>
            <p className="my-1">
                Didn't get token? <Link to='#' onClick={onLinkClick}>Click here</Link> to get token again.
            </p>
            {displayResendFields &&
                <Fragment>
                    <hr />
                    <br />
                    <p className="lead"><i className="fas fa-envelope-open-text"></i> Enter registered E-mail to get token again</p>
                    <form className="form" onSubmit={e => onSubmitResendForm(e)}>
                        <div className="form-group">
                            <input
                                type="email"
                                placeholder="Email Address"
                                name="email"
                                value={email}
                                onChange={e => onResendFieldChange(e)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={password}
                                onChange={e => onResendFieldChange(e)}
                                minLength="6"
                            />
                            {!isValidUser &&
                                <small className="form-danger">
                                    Invalid credentials.
                                </small>
                            }
                        </div>
                        <button
                            type="submit"
                            className='btn btn-primary'
                            disabled={isEmpty(email) || isEmpty(password) || !isValidUser}
                        >
                            Get Token
                        </button>
                    </form>
                </Fragment>
            }
        </Fragment>)
    );
};

TokenVerifier.prototypes = {
    setAlert: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    showTimer: PropTypes.bool,
    history: PropTypes.object
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    isAdminAuthenticated: state.authAdmin.isAdminAuthenticated,
    showTimer: state.auth.showTimer
});

export default connect(mapStateToProps, {setAlert})(TokenVerifier);