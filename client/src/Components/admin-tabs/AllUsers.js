import React, { useEffect, Fragment, useState } from 'react';
import { isEmpty, omitBy } from 'lodash';
import { connect } from 'react-redux';
import moment from 'moment';
import {Element, animateScroll as scroll} from 'react-scroll';
import { setAdminNavLinks, resetAdminNavLinks } from '../../actions/authAdmin';
import Spinner from '../layouts/Spinner';
import { getUsers } from '../../actions/adminLogs';
import RenderInputFields from './sub-components/RenderInputFields';
import { setAlert } from '../../actions/alert';
import axios from 'axios';

const AllUsers = ({users, getUsers, setAdminNavLinks, resetAdminNavLinks, loading, permissions, setAlert}) => {
    useEffect(() => {
        setAdminNavLinks();
        if (isEmpty(users)) {
            getUsers();
        }
        return () => {
            resetAdminNavLinks();
        }
    }, [users, getUsers, setAdminNavLinks, resetAdminNavLinks]);

    const [componentState, setTheState] = useState({
        isEditEnabled: false,
        isValidMobNumb: true,
        isValidAltMobNumb: true,
        id: null,
        fieldMobileNumber: null,
        fieldPermanentAddress: null,
        fieldSpouseName: null,
        fieldAltContact: null,
        fieldSOI: null,
        fieldOcc: null,
        fieldCompany: null
    });

    const {isEditEnabled, id, isValidMobNumb, isValidAltMobNumb} = componentState;

    const editInfo = (user) => {
        const { _id, user: {mobileNumber}, permanentAddress, familyDetails: {spouseName},
            alternateContactNumber, sourceOfIncome, occupation, company } = user;
        setTheState({...componentState,
            isEditEnabled: !isEditEnabled,
            isValidMobNumb: !isEditEnabled,  //Idea is to reset the previous state's error bool if any
            isValidAltMobNumb: !isEditEnabled,
            id: _id,
            fieldMobileNumber: mobileNumber,
            fieldPermanentAddress: permanentAddress,
            fieldSpouseName: spouseName,
            fieldAltContact: alternateContactNumber,
            fieldSOI: sourceOfIncome,
            fieldOcc: occupation,
            fieldCompany: company
        });
    };

    const onFieldChange = e => {
        setTheState({...componentState, [e.target.name]: e.target.value});
    };

    const onBlurFields = e => {
        const mobNum = (e.target.value).substring(0, 3) === '+91' ? e.target.value : `+91${e.target.value}`
        const mobRegX = /^((\+){1}91){1}[6-9]{1}[0-9]{9}$/;
        if (e.target.name === 'fieldMobileNumber') {
            setTheState({...componentState, isValidMobNumb: mobRegX.test(mobNum)});
        } else {
            setTheState({...componentState, isValidAltMobNumb: mobRegX.test(mobNum)});
        }
    };

    const submitHandler = async (user) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        //Object.fromEntries(Object.entries(obj).filter(([key, value]) => value !== ''));
        const payload = {
            userId: user.user._id,
            mobileNumber: (componentState.fieldMobileNumber).substring(0, 3) === '+91' ?
                componentState.fieldMobileNumber : `+91${componentState.fieldMobileNumber}`,
            permanentAddress: componentState.fieldPermanentAddress,
            spouseName: componentState.fieldSpouseName,
            alternateContactNumber: (componentState.fieldAltContact).substring(0, 3) === '+91' ?
                componentState.fieldAltContact : `+91${componentState.fieldAltContact}`,
            sourceOfIncome: componentState.fieldSOI,
            occupation: componentState.fieldOcc,
            company: componentState.fieldCompany
        }
        const updatedPayload = omitBy(payload, (value, key) => isEmpty(value) || value === user[key] || value === user.user[key]);
        console.log(updatedPayload);

        const body = JSON.stringify(updatedPayload);

        try {
            const res = await axios.put('/api/adminAction/updateUserInfo', body, config);
            console.log(res.data);
            setAlert(`Updated ${user.firstName}'s data Successfully!!`, 'success');
            scroll.scrollToTop();
            setTimeout(() => {
                getUsers();
            }, 2000);
        } catch (err) {
            const errors = err.response.data.errors || [{msg: 'Something went wrong please try again later!'}];
            if (errors) {
                errors.forEach(error => setAlert(error.msg, 'danger', 10000));
            }
            scroll.scrollToTop();
        }
    };

    const deleteUserHandler = () => {

    };

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
                                {isEditEnabled && id === user._id ?
                                    <RenderInputFields
                                        state={componentState}
                                        onFieldChange={onFieldChange}
                                        onBlurFields={onBlurFields}
                                        submitHandler={submitHandler}
                                    /> :
                                    <div>
                                        <p className="my-1"><strong>Mobile-Number: </strong>{user.user.mobileNumber}</p>
                                        {user.permanentAddress &&
                                            <p className="my-1"><strong>Permanent Address: </strong>{user.permanentAddress}</p>
                                        }
                                        {user.familyDetails.spouseName &&
                                            <p className="my-1"><strong>Spouse: </strong>{user.familyDetails.spouseName || '--'}</p>
                                        }
                                        <p className="my-1"><strong>Alternate contact: </strong>{user.alternateContactNumber}</p>
                                        <p className="my-1"><strong>Source of Income: </strong>{user.sourceOfIncome}</p>
                                        <p className="my-1"><strong>Occupation: </strong>{user.occupation}</p>
                                        <p className="my-1"><strong>Company: </strong>{user.company}</p>
                                        
                                        <p className="post-date">
                                            Updated on: {moment(user.date[user.date.length - 1].lastUpdated).format('DD-MM-YYYY HH:mm:ss')} by: {user.date[user.date.length - 1].updatedBy}
                                        </p>
                                    </div>
                                }
                                <ul className={permissions.length > 1 ? 'admin-actions' : 'read-permission-only'}>
                                    <li>
                                        <i
                                            className={isEditEnabled && id === user._id ? 'fas fa-times' : 'fas fa-edit'}
                                            onClick={permissions.length > 1 ? () => editInfo(user) : null}
                                        ></i>
                                    </li>
                                    <li>
                                        <button
                                            className='btn btn-primary btn-curved'
                                            onClick={() => submitHandler(user)}
                                            disabled={id !== user._id || permissions.length < 2 || !isEditEnabled ||
                                                !isValidMobNumb || !isValidAltMobNumb}
                                        >
                                            Update
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className='btn btn-danger btn-curved'
                                            onClick={deleteUserHandler}
                                            disabled={permissions.length < 2}
                                        >
                                            <i className='fas fa-times'></i>
                                        </button>
                                    </li>
                                </ul>
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

export default connect(mapStateToProps, {getUsers, setAdminNavLinks, resetAdminNavLinks, setAlert})(AllUsers);