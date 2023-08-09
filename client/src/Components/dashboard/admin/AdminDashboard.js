import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {setAdminNavLinks, resetAdminNavLinks} from '../../../actions/authAdmin';
import Spinner from '../../layouts/Spinner';
import ContainerLayout from '../../layouts/ContainerLayout';

const AdminDashboard = ({setAdminNavLinks, resetAdminNavLinks, authAdmin: {loading, admin, isAdminAuthenticated}}) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAdminAuthenticated && !loading) {
      navigate('/adminLanding');
    }
  }, [isAdminAuthenticated, loading]);

  useEffect(() => {
    setAdminNavLinks();
    return () => {
      resetAdminNavLinks();
    };
  }, [setAdminNavLinks, resetAdminNavLinks]);

  return admin === null || loading ? (
    <Spinner />
  ) : (
    <ContainerLayout>
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
            {admin.permissions &&
              admin.permissions.map((item, index) => (
                <li key={index} className="text-primary">
                  <i className="fas fa-check"></i> {`${item} Access`}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </ContainerLayout>
  );
};

const mapStateToProps = (state) => ({
  authAdmin: state.authAdmin
});

export default connect(mapStateToProps, {setAdminNavLinks, resetAdminNavLinks})(AdminDashboard);
