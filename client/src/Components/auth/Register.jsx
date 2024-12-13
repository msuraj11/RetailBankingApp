import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Link, Navigate, useNavigate} from 'react-router-dom';
import {isEmpty} from 'lodash';
import {setAlert} from '../../actions/alert';
import {setTimer} from '../../actions/timer';
import PropTypes from 'prop-types';
import axios from 'axios';

const Register = ({setAlert, isAuthenticated, setTimer}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fields: {
      name: '',
      email: '',
      mobileNumber: '',
      password: '',
      confirmPassword: ''
    },
    isErrorMessageOnMobNumb: false,
    isPasswordMatch: true,
    isEmailError: false,
    disableRegButton: false
  });

  const {fields, isErrorMessageOnMobNumb, isPasswordMatch, isEmailError, disableRegButton} = formData;
  const {name, email, mobileNumber, password, confirmPassword} = fields;

  const onFieldChange = (e) => {
    setFormData({
      ...formData,
      fields: {...fields, [e.target.name]: e.target.value}
    });
  };

  const onBlurFields = (e) => {
    if (!isEmpty(confirmPassword) && password !== confirmPassword) {
      setFormData({...formData, isPasswordMatch: false});
    } else {
      setFormData({...formData, isPasswordMatch: true});
    }
    if (e.target.name === 'mobileNumber') {
      const mobNum = `+91${e.target.value}`;
      const mobRegX = /^\+91[6-9]\d{9}$/;
      setFormData({
        ...formData,
        isErrorMessageOnMobNumb: !mobRegX.test(mobNum)
      });
    }
    if (e.target.name === 'email') {
      const emailRegX = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
      setFormData({...formData, isEmailError: !emailRegX.test(email)});
    }
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const body = JSON.stringify({
      name,
      email,
      mobileNumber: `+91${mobileNumber}`,
      // password: Buffer.from(password).toString('base64')
      password: btoa(password)
    });

    try {
      const res = await axios.post('/api/users', body, config);
      if (res.token) {
        setAlert('Registered Successfully!!', 'success');
        setFormData({...formData, disableRegButton: true});
        setTimeout(() => {
          navigate('/tokenVerifier/user');
          setTimer();
        }, 4000);
      } else {
        throw new Error('You are now registered successfully. There might be issue in receiving an email, Please contact support');
      }
    } catch (err) {
      console.error(err.response.data);
      const errors = err.response.data.errors || [{msg: typeof err === 'string' ? err : 'Something went wrong please try again later!'}];
      if (errors) {
        errors.forEach((error) => setAlert(error.msg, 'danger', 10000));
      }
    }
  };

  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <React.Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form className="form" onSubmit={(e) => onSubmitForm(e)}>
        <div className="form-group">
          <input type="text" placeholder="Name" name="name" value={name} onChange={(e) => onFieldChange(e)} />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => onFieldChange(e)}
            onBlur={(e) => onBlurFields(e)}
          />
          {isEmailError && <small className="form-danger">Invalid E-Mail format.</small>}
          <small className="form-text">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
        </div>
        <div className="form-group">
          <input
            type="tel"
            placeholder="Mobile Number"
            name="mobileNumber"
            minLength="10"
            value={mobileNumber}
            onChange={(e) => onFieldChange(e)}
            onBlur={(e) => onBlurFields(e)}
          />
          {isErrorMessageOnMobNumb && <small className="form-danger">Mobile number entered is not valid.</small>}
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => onFieldChange(e)}
            onBlur={(e) => onBlurFields(e)}
            minLength="6"
          />
          {!isEmpty(password) && !isEmpty(confirmPassword) && !isPasswordMatch && <small className="form-danger">Passwords didnot match.</small>}
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => onFieldChange(e)}
            onBlur={(e) => onBlurFields(e)}
            minLength="6"
          />
          {!isEmpty(password) && !isEmpty(confirmPassword) && !isPasswordMatch && <small className="form-danger">Passwords didnot match.</small>}
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={
            !isPasswordMatch ||
            isErrorMessageOnMobNumb ||
            isEmailError ||
            isEmpty(name) ||
            isEmpty(email) ||
            isEmpty(mobileNumber) ||
            isEmpty(password) ||
            isEmpty(confirmPassword) ||
            password.length < 6 ||
            confirmPassword.length < 6 ||
            disableRegButton
          }
        >
          Register
        </button>
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </React.Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  history: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  setTimer: PropTypes.func
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {setAlert, setTimer})(Register);
