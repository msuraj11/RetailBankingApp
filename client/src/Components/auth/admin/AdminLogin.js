import React, {useState, useEffect} from 'react';
import {Link, Navigate} from 'react-router-dom';
import {isEmpty} from 'lodash';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {adminLogin} from '../../../actions/authAdmin';
import {setAdminNavLinks, resetAdminNavLinks} from '../../../actions/authAdmin';
import ContainerLayout from '../../layouts/ContainerLayout';

const AdminLogin = ({isAdminAuthenticated, dispatch}) => {
  const [formData, setFormData] = useState({
    fields: {
      emailId: '',
      password: ''
    },
    isValidEmailId: true
  });

  useEffect(() => {
    dispatch(setAdminNavLinks());
    return () => {
      dispatch(resetAdminNavLinks());
    };
  }, [dispatch]);

  const {fields, isValidEmailId} = formData;
  const {emailId, password} = fields;

  const onFieldChange = (e) => {
    setFormData({
      ...formData,
      fields: {...fields, [e.target.name]: e.target.value}
    });
  };

  const onBlurField = (e) => {
    const emailRegX = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
    setFormData({...formData, isValidEmailId: emailRegX.test(emailId)});
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    console.log(formData);
    dispatch(adminLogin(emailId, password));
  };

  return isAdminAuthenticated ? (
    <Navigate to="/adminDashboard" />
  ) : (
    <ContainerLayout>
      <h1 className="large text-primary">Admin Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign Into Your Account
      </p>
      <form className="form" onSubmit={(e) => onSubmitForm(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="* Email-ID"
            name="emailId"
            value={emailId}
            onChange={(e) => onFieldChange(e)}
            onBlur={(e) => onBlurField(e)}
          />
          {!isValidEmailId && <small className="form-danger">Invalid E-Mail format.</small>}
        </div>
        <div className="form-group">
          <input type="password" placeholder="Password" name="password" value={password} onChange={(e) => onFieldChange(e)} minLength="6" />
        </div>
        <button type="submit" className="btn btn-primary" disabled={!isValidEmailId || isEmpty(password) || isEmpty(emailId) || password.length < 6}>
          Login
        </button>
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/adminRegister">Sign Up</Link>
      </p>
    </ContainerLayout>
  );
};

AdminLogin.prototypes = {
  dispatch: PropTypes.func.isRequired,
  isAdminAuthenticated: PropTypes.boolß
};

const mapStateToProps = (state) => ({
  isAdminAuthenticated: state.authAdmin.isAdminAuthenticated
});

export default connect(mapStateToProps)(AdminLogin);
