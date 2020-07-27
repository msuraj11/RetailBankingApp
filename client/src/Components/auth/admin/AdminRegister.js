import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import {isEmpty} from 'lodash';
import PropTypes from 'prop-types';
import axios from 'axios';
import {animateScroll as scroll} from 'react-scroll';
import { setAlert } from '../../../actions/alert';
import { setTimer } from '../../../actions/timer';
import { setAdminNavLinks } from '../../../actions/authAdmin';
import { resetAdminNavLinks } from '../../../actions/authAdmin';

const AdminRegister = ({setAlert, isAdminAuthenticated, history, setTimer, setAdminNavLinks, resetAdminNavLinks}) => {
    const [formData, setFormData] = useState({
        fields:{
            firstName:'',
            lastName:'',
            mobileNumber: '',
            personalEmail:'',
            experienceInBanking:'',
            gender: '',
            adminBranch:'',
            password: '',
            confirmPassword: ''
        },
        isMobileNumValid: true,
        isPasswordMatch: true,
        isValidEmail: true,
        disableRegButton: false
    });

    // TODO Nav-links for guest admin is to be done using redux
    useEffect(() => {
        setAdminNavLinks();
        return () => {
            resetAdminNavLinks();
        }
    });

    const {fields, isMobileNumValid, isPasswordMatch, isValidEmail, disableRegButton} = formData;
    const {firstName, lastName, mobileNumber, experienceInBanking, gender, adminBranch,
        personalEmail, password, confirmPassword} = fields;

    const onFieldChange = e => {
        setFormData({...formData, fields: {...fields, [e.target.name]: e.target.value}});    
    };

    const onBlurFields = e => {
        if (!isEmpty(confirmPassword) && password !== confirmPassword) {
            setFormData({...formData, isPasswordMatch: false});
        } else {
            setFormData({...formData, isPasswordMatch: true});
        }
        if (e.target.name === 'mobileNumber') {
            const mobNum = `+91${e.target.value}`
            const mobRegX = /^((\+){1}91){1}[6-9]{1}[0-9]{9}$/;
            setFormData({...formData, isMobileNumValid: mobRegX.test(mobNum)});            
        }
        if (e.target.name === 'personalEmail') {
            const emailRegX = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
            setFormData({...formData, isValidEmail: emailRegX.test(personalEmail)});
        }
    };

    const onSubmitForm = async e => {
        e.preventDefault();
        console.log(formData);
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const body = JSON.stringify({...fields, mobileNumber: `+91${mobileNumber}`});

        try {
            const res = await axios.post('/api/admin', body, config);
            console.log(res.data);
            setAlert('Registered Successfully!!', 'success');
            scroll.scrollToTop();
            setFormData({...formData, disableRegButton: true});
            setTimeout(() => {
                history.push('/tokenVerifier/admin');
                setTimer();
            }, 4000);
        } catch (err) {
            console.error(err.response.data);
            const errors = err.response.data.errors;
            if (errors) {
                errors.forEach(error => setAlert(error.msg, 'danger', 10000));
            }
        }
    };

    return (isAdminAuthenticated ?
        <Redirect to='/adminDashboard' /> :
        <Fragment>
            <h1 className="large text-primary">Sign Up Admin</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit={e => onSubmitForm(e)}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="* First name"
                        name="firstName"
                        value={firstName}
                        onChange={e => onFieldChange(e)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="* Last name"
                        name="lastName"
                        value={lastName}
                        onChange={e => onFieldChange(e)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="tel"
                        placeholder="* Mobile Number"
                        name="mobileNumber"
                        minLength="10"
                        value={mobileNumber}
                        onChange={e => onFieldChange(e)}
                        onBlur={e => onBlurFields(e)}
                    />
                    {!isMobileNumValid &&
                        <small className="form-danger">
                            Mobile number entered is not valid.
                        </small>
                    }
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="* Personal Email Address"
                        name="personalEmail"
                        value={personalEmail}
                        onChange={e => onFieldChange(e)}
                        onBlur={e => onBlurFields(e)}
                    />
                    {!isValidEmail &&
                        <small className="form-danger">
                            Invalid E-Mail format.
                        </small>
                    }
                    <small className="form-text">
                        This site uses Gravatar so if you want a profile image, use a
                        Gravatar email
                    </small>
                </div>
                <div className="form-group">
                    <input
                        type="number"
                        placeholder="* Experience in Banking"
                        name="experienceInBanking"
                        value={experienceInBanking}
                        onChange={e => onFieldChange(e)}
                    />
                </div>
                <div className="form-group">
                    <select name="gender" value={gender} onChange={e => onFieldChange(e)}>
                        <option value=''>* --Select gender--</option>
                        <option value='Male'>Male</option>
                        <option value='Female'>Female</option>
                    </select>
                </div>
                <div className="form-group">
                    <select name="adminBranch" value={adminBranch} onChange={e => onFieldChange(e)}>
                        <option value=''>* --Select branch--</option>
                        <option value='Neeladri, Bangalore'>Neeladri, Bangalore</option>
                        <option value='E-City, Bangalore'>E-City, Bangalore</option>
                        <option value='Koramangala, Bangalore'>Koramangala, Bangalore</option>
                        <option value='Kempegowda, Bangalore'>Kempegowda, Bangalore</option>
                    </select>
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="* Password"
                        name="password"
                        value={password}
                        onChange={e => onFieldChange(e)}
                        onBlur={e => onBlurFields(e)}
                        minLength="6"
                    />
                    {!isEmpty(password) && !isEmpty(confirmPassword) && !isPasswordMatch &&
                        <small className="form-danger">
                            Passwords didnot match.
                        </small>
                    }
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="* Confirm Password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={e => onFieldChange(e)}
                        onBlur={e => onBlurFields(e)}
                        minLength="6"
                    />
                    {!isEmpty(password) && !isEmpty(confirmPassword) && !isPasswordMatch &&
                        <small className="form-danger">
                            Passwords didnot match.
                        </small>
                    }
                </div>
                <button
                    type="submit"
                    className='btn btn-primary'
                    disabled={!isPasswordMatch || !isMobileNumValid || !isValidEmail ||
                        isEmpty(firstName) || isEmpty(lastName) || isEmpty(mobileNumber) ||
                        isEmpty(experienceInBanking) || isEmpty(gender) || isEmpty(adminBranch) ||
                        isEmpty(personalEmail) || isEmpty(password) || isEmpty(confirmPassword) ||
                        password.length < 6 || confirmPassword.length < 6 || disableRegButton}
                >
                    Register
                </button>
            </form>
            <p className="my-1">
                Already have an account? <Link to='/adminLogin'>Sign In</Link>
            </p>
        </Fragment>
    );
};

AdminRegister.propTypes = {
    setAlert: PropTypes.func.isRequired,
    history: PropTypes.object,
    isAdminAuthenticated: PropTypes.bool,
    setTimer: PropTypes.func,
    setAdminNavLinks: PropTypes.func
};

const mapStateToProps = state => ({
    isAdminAuthenticated: state.authAdmin.isAdminAuthenticated
});

export default connect(mapStateToProps, {setAlert, setTimer, setAdminNavLinks, resetAdminNavLinks})(AdminRegister);
