import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {isEmpty} from 'lodash';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {setAdminNavLinks, resetAdminNavLinks, adminLogin} from '../../../actions/authAdmin';

const AdminLogin = ({isAdminAuthenticated, dispatch, activateAdminNavLinks}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/adminDashboard');
    }
  }, [isAdminAuthenticated]);

  useEffect(() => {
    if (!activateAdminNavLinks) {
      navigate('/adminLanding');
    } else {
      dispatch(setAdminNavLinks());
    }
    return () => {
      dispatch(resetAdminNavLinks());
    };
  }, [dispatch, activateAdminNavLinks, navigate]);

  const [formData, setFormData] = useState({
    fields: {
      emailId: '',
      password: ''
    },
    isValidEmailId: true
  });


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
    dispatch(adminLogin(emailId, password));
  };

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

AdminLogin.prototypes = {
  dispatch: PropTypes.func.isRequired,
  isAdminAuthenticated: PropTypes.bool,
  activateAdminNavLinks: PropTypes.string
};

const mapStateToProps = (state) => ({
  isAdminAuthenticated: state.authAdmin.isAdminAuthenticated,
  activateAdminNavLinks: state.authAdmin.activateAdminNavLinks
});

export default connect(mapStateToProps)(AdminLogin);
