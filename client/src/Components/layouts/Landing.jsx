import React, {useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

const Landing = ({isAuthenticated}) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated]);

  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">Customer Connect</h1>
          <p className="lead">
            Create your Bank-account Online and get started Savings/Current
            account with Zero account-balance.
          </p>
          <div className="buttons">
            <Link to="/register" className="btn btn-primary">
              Sign Up
            </Link>
            <Link to="/login" className="btn btn-light">
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(Landing);
