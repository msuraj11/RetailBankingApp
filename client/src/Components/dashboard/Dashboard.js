import React, {useEffect, Fragment} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Link, useNavigate} from 'react-router-dom';
import {getCurrentProfile} from '../../actions/profile';
import Spinner from '../layouts/Spinner';
import ShowProfile from './profile/ShowProfile';
import ContainerLayout from '../layouts/ContainerLayout';

const Dashboard = ({getCurrentProfile, auth: {user, isAuthenticated, loadingUser}, profile: {profile, loading}}) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated && !loadingUser) {
      navigate('/login');
    }
  }, [isAuthenticated, loadingUser]);

  useEffect(() => {
    if (!profile) {
      getCurrentProfile();
    }
  }, [getCurrentProfile, profile]);

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <ContainerLayout>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <ShowProfile profile={profile} getCurrentProfile={getCurrentProfile} />
      ) : (
        <Fragment>
          <p>You have not yet done KYC, Please provide details by clicking below</p>
          <Link to="/kyc" className="btn btn-primary my-1">
            Complete KYC
          </Link>
        </Fragment>
      )}
    </ContainerLayout>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, {getCurrentProfile})(Dashboard);
