import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { setAdminNavLinks, resetAdminNavLinks } from '../../../actions/authAdmin';
import Spinner from '../../layouts/Spinner';

const AdminDashboard = ({setAdminNavLinks, resetAdminNavLinks, authAdmin: {loading, admin}}) => {
    useEffect(() => {
        setAdminNavLinks();
        return () => {
            resetAdminNavLinks();
        }
    }, [setAdminNavLinks, resetAdminNavLinks]);

    return (admin === null || loading ? <Spinner /> :
        <Fragment>
            <h1 className='large text-primary'>Admin Info</h1>
            <div className="profiles">
                <div className="profile bg-light">
                    <img
                        className="round-img"
                        src={admin.avatar}
                        alt="profile of user"
                    />
                    <div>
                        <h2>{`${admin.firstName} ${admin.lastName}`}</h2>
                        <p>A/ID: {admin.adminId}</p>
                        <p>{admin.adminBranch}</p>
                    </div>
                    <ul>
                        {
                            admin.permissions && admin.permissions.map((item, index) => (
                                <li key={index} className="text-primary">
                                    <i className="fas fa-check"></i> {`${item} Access`}
                                </li>)
                            )
                        }
                    </ul>
                </div>
            </div>
        </Fragment>
    );
};

const mapStateToProps = state => ({
    authAdmin: state.authAdmin
});

export default connect(mapStateToProps, {setAdminNavLinks, resetAdminNavLinks})(AdminDashboard);