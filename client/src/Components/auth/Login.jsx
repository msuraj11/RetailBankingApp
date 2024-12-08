import React, {useState} from 'react';
import {Link, Navigate} from 'react-router-dom';
import {isEmpty} from 'lodash';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {login} from '../../actions/auth';

const Login = ({login, isAuthenticated}) => {
  const [formData, setFormData] = useState({
    fields: {
      customerId: '',
      password: ''
    },
    isErrorCustomerId: false
  });

  const {fields, isErrorCustomerId} = formData;
  const {customerId, password} = fields;

  const onFieldChange = (e) => {
    setFormData({
      ...formData,
      fields: {...fields, [e.target.name]: e.target.value}
    });
  };

  const onBlurField = (e) => {
    if (e.target.name === 'customerId') {
      const numbersOnlyRegx = /^[0-9]{9}$/;
      setFormData({
        ...formData,
        isErrorCustomerId: !numbersOnlyRegx.test(customerId)
      });
    }
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    // const pwd = Buffer.from(password).toString('base64'); // buf.toString('base64')
    const pwd = btoa(password);
    login(customerId, pwd);
  };

  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <React.Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign Into Your Account
      </p>
      <form className="form" onSubmit={(e) => onSubmitForm(e)}>
        <div className="form-group">
          <input
            type="number"
            placeholder="Customer-ID"
            name="customerId"
            value={customerId}
            onChange={(e) => onFieldChange(e)}
            onBlur={(e) => onBlurField(e)}
          />
          {isErrorCustomerId && <small className="form-danger">Invalid Customer-ID format.</small>}
        </div>
        <div className="form-group">
          <input type="password" placeholder="Password" name="password" value={password} onChange={(e) => onFieldChange(e)} minLength="6" />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isErrorCustomerId || isEmpty(password) || isEmpty(customerId) || password.length < 6}
        >
          Login
        </button>
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </React.Fragment>
  );
};

Login.prototypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {login})(Login);
