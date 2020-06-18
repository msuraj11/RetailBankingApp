import React, {Fragment, useState} from 'react';
import { Link } from 'react-router-dom';
import {isEmpty} from 'lodash';
import axios from 'axios';

const TokenVerifier = () => {
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

    const onFieldChange = e => setTokenData({...tokenData, token: e.target.value, isValidToken: true});

    const onResendFieldChange = e => setTokenData(
        {...tokenData, resendData: {...resendData, [e.target.name]: e.target.value}});

    const onLinkClick = () => setTokenData({...tokenData, displayResendFields: !displayResendFields});

    const onSubmitForm = async e => {
        e.preventDefault();
        const config = {
            headers: {
                'x-auth-token': token
            }
        };

        try {
            const res = await axios.get('/api/auth', config);
            console.log(res.data);
        } catch (error) {
            console.error(error.response.data);
            setTokenData({...tokenData, isValidToken: false})
        }
    };

    const onSubmitResendForm = e => {
        e.preventDefault();
        console.log(resendData);
    };

    return (
        <Fragment>
            <h1 className="large text-primary">Verify Token</h1>
            <p className="lead"><i className="fas fa-paper-plane"></i> Check for Token in your Inbox of E-Mail you provided</p>
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
        </Fragment>
    );
};

export default TokenVerifier;