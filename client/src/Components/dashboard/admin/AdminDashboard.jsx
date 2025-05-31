import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {setAdminNavLinks, resetAdminNavLinks} from '../../../actions/authAdmin';
import Spinner from '../../layouts/Spinner';

const AdminDashboard = ({dispatch, authAdmin: {loading, admin}}) => {
  useEffect(() => {
    dispatch(setAdminNavLinks());
    return () => {
      dispatch(resetAdminNavLinks());
    };
  }, [dispatch]);

  return admin === null || loading ? (
    <Spinner />
  ) : (
    <React.Fragment>
      <h1 className="large text-primary">Admin Info</h1>
      <div className="profiles">
        <div className="profile bg-light">
          <img className="round-img" src={admin.avatar} alt="profile of user" />
          <div>
            <h2>{`${admin.firstName} ${admin.lastName}`}</h2>
            <p>
              <strong>A/ID: </strong>
              {admin.adminId}
            </p>
            <p>{admin.adminBranch}</p>
          </div>
          <ul>
            {admin?.permissions?.map((item, index) => (
              <li key={index + item} className="text-primary">
                <i className="fas fa-check"></i> {`${item} Access`}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  authAdmin: state.authAdmin
});

export default connect(mapStateToProps)(AdminDashboard);
