import React, {useState, useEffect, Fragment} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {setAlert} from '../../actions/alert';
import {setAdminNavLinks} from '../../actions/authAdmin';

const AdminLanding = ({isAdminAuthenticated, setAlert, setAdminNavLinks, activateAdminNavLinks}) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/adminDashboard');
    }
  }, [isAdminAuthenticated]);

  const [adminCode, setAdminCode] = useState('');

  const onFieldChange = (e) => {
    setAdminCode(e.target.value);
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    if (adminCode !== '1413914') {
      setAlert('Access denied', 'danger', 6000);
      setTimeout(() => navigate('/'), 1000);
    } else {
      setAdminNavLinks();
    }
  };

  const renderInputField = (
    <Fragment>
      <h1 className="x-large">Admin access point</h1>
      <p className="lead">Type admin access code to enter</p>
      <form className="form statement-dates" onSubmit={(e) => onSubmitForm(e)}>
        <input type="password" placeholder="Access Code" name="adminCode" value={adminCode} onChange={(e) => onFieldChange(e)} />
        <button type="submit" className="btn btn-primary">
          <i className="fas fa-arrow-right"></i>
        </button>
      </form>
    </Fragment>
  );

  const renderMainLanding = (
    <Fragment>
      <h1 className="x-large">Welcome to Admin portal of Customer Connect</h1>
      <p className="lead">Sign-up or Login to handle Customer data</p>
      <div className="buttons">
        <Link to="/adminRegister" className="btn btn-primary">
          Sign Up
        </Link>
        <Link to="/adminLogin" className="btn btn-light">
          Login
        </Link>
      </div>
    </Fragment>
  );

  return (
    <section className="landing-admin">
      <div className="dark-overlay">
        <div className="landing-inner">{activateAdminNavLinks ? renderMainLanding : renderInputField}</div>
      </div>
    </section>
  );
};

AdminLanding.propTypes = {
  isAdminAuthenticated: PropTypes.bool,
  activateAdminNavLinks: PropTypes.string,
  setAlert: PropTypes.func
};

const mapStateToProps = (state) => ({
  isAdminAuthenticated: state.authAdmin.isAdminAuthenticated,
  activateAdminNavLinks: state.authAdmin.activateAdminNavLinks
});

export default connect(mapStateToProps, {setAlert, setAdminNavLinks})(AdminLanding);
