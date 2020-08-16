import React, { useEffect, Fragment } from 'react';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import moment from 'moment';
import {Element} from 'react-scroll';
import { setAdminNavLinks, resetAdminNavLinks } from '../../actions/authAdmin';
import Spinner from '../layouts/Spinner';
import { getUsers } from '../../actions/adminLogs';

const AllUsers = ({users, getUsers, setAdminNavLinks, resetAdminNavLinks, loading, permissions}) => {
    useEffect(() => {
        setAdminNavLinks();
        if (isEmpty(users)) {
            getUsers();
        }
        return () => {
            resetAdminNavLinks();
        }
    }, [users, getUsers, setAdminNavLinks, resetAdminNavLinks]);

    return (
        <Fragment>
            {
                !isEmpty(users) && users.length > 0 ? 
                    users.map(user => (
                        <Element name={user._id} key={user._id} >
                            <div className="post bg-light p-1 my-1">
                                <div>
                                    <img
                                        className="round-img"
                                        src={user.user.avatar}
                                        alt="user-profile"
                                    />
                                    <h4>{`${user.firstName} ${user.lastName}`}</h4>
                                    <p className="post-date">{user.accountNumber}</p>
                                    <p className="post-date">{user.accountType}</p>
                                    <div className="py">
                                        <i className='fa fa-check'></i>
                                        {' '}{user.accBranch}
                                    </div>
                                    <div>
                                        <i className='fa fa-check'></i>
                                        {' '}{user.IFSC_Code}
                                    </div>
                                </div>
                                <div>
                                    <p className="my-1"><strong>Mobile-Number: </strong>{user.user.mobileNumber}</p>
                                    {user.permanentAddress &&
                                        <p className="my-1"><strong>Permanent Address: </strong>{user.permanentAddress}</p>
                                    }
                                    {user.familyDetails.spouseName &&
                                        <p className="my-1"><strong>Spouse: </strong>{user.familyDetails.spouseName}</p>
                                    }
                                    <p className="my-1"><strong>Alternate contact: </strong>{user.alternateContactNumber}</p>
                                    <p className="my-1"><strong>Source of Income: </strong>{user.sourceOfIncome}</p>
                                    <p className="my-1"><strong>Occupation: </strong>{user.occupation}</p>
                                    <p className="my-1"><strong>Company: </strong>{user.company}</p>
                                    
                                    <p className="post-date">
                                        Updated on: {moment(user.date[user.date.length - 1].lastUpdated).format('DD-MM-YYYY HH:mm:ss')} by: {user.date[user.date.length - 1].updatedBy}
                                    </p>
                                </div>
                                <div>
                                    <h3>Actions here!!</h3>
                                </div>
                            </div>
                        </Element>
                    )) : (loading ? <Spinner /> : <h1>Oops..!! Something went wrong!</h1>)
            }
        </Fragment>
    );
};

const mapStateToProps = state => ({
    users: state.adminLogs.allUsers,
    loading: state.adminLogs.loading,
    permissions: state.authAdmin.admin && state.authAdmin.admin.permissions
});

export default connect(mapStateToProps, {getUsers, setAdminNavLinks, resetAdminNavLinks})(AllUsers);