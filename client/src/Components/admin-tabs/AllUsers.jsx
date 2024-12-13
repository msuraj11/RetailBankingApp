import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {isEmpty, omitBy} from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import {Element, animateScroll as scroll} from 'react-scroll';
import {setAdminNavLinks, resetAdminNavLinks} from '../../actions/authAdmin';
import Spinner from '../layouts/Spinner';
import {getUsers} from '../../actions/adminLogs';
import RenderInputFields from './sub-components/RenderInputFields';
import {setAlert} from '../../actions/alert';
import Modal from '../layouts/Modal';
import axios from 'axios';

const INIT_STATE = {
  isEditEnabled: false,
  isValidMobNumb: true,
  isValidAltMobNumb: true,
  isModalVisible: false,
  userId: null,
  id: null,
  fieldMobileNumber: null,
  fieldPermanentAddress: null,
  fieldSpouseName: null,
  fieldAltContact: null,
  fieldSOI: null,
  fieldOcc: null,
  fieldCompany: null
};

const AllUsers = ({users, dispatch, loading, permissions, setAlert, isAdminAuthenticated}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminAuthenticated && !loading) {
      navigate('/adminLanding');
    }
  }, [isAdminAuthenticated, loading, navigate]);

  useEffect(() => {
    dispatch(setAdminNavLinks());
    if (isEmpty(users)) {
      dispatch(getUsers());
    }
    return () => {
      dispatch(resetAdminNavLinks());
    };
  }, [users, dispatch]);

  const [componentState, setComponentState] = useState(INIT_STATE);

  const {isEditEnabled, id, isValidMobNumb, isValidAltMobNumb, userId, isModalVisible} = componentState;

  const editInfo = (user) => {
    const {
      _id,
      user: {mobileNumber},
      permanentAddress,
      familyDetails: {spouseName},
      alternateContactNumber,
      sourceOfIncome,
      occupation,
      company
    } = user;
    setComponentState({
      ...componentState,
      isEditEnabled: !isEditEnabled,
      isValidMobNumb: !isEditEnabled, //Idea is to reset the previous state's error bool if any
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

  const onFieldChange = (e) => {
    setComponentState({...componentState, [e.target.name]: e.target.value});
  };

  const onBlurFields = (e) => {
    const mobNum = e.target.value.substring(0, 3) === '+91' ? e.target.value : `+91${e.target.value}`;
    const mobRegX = /^\+91[6-9]\d{9}$/;
    if (e.target.name === 'fieldMobileNumber') {
      setComponentState({...componentState, isValidMobNumb: mobRegX.test(mobNum)});
    } else {
      setComponentState({...componentState, isValidAltMobNumb: mobRegX.test(mobNum)});
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
      mobileNumber:
        componentState.fieldMobileNumber.substring(0, 3) === '+91' ? componentState.fieldMobileNumber : `+91${componentState.fieldMobileNumber}`,
      permanentAddress: componentState.fieldPermanentAddress,
      spouseName: componentState.fieldSpouseName,
      alternateContactNumber:
        componentState.fieldAltContact.substring(0, 3) === '+91' ? componentState.fieldAltContact : `+91${componentState.fieldAltContact}`,
      sourceOfIncome: componentState.fieldSOI,
      occupation: componentState.fieldOcc,
      company: componentState.fieldCompany
    };
    const updatedPayload = omitBy(
      payload,
      (value, key) => isEmpty(value) || (key === 'spouseName' ? value === user.familyDetails[key] : value === user[key]) || value === user.user[key]
    );

    const body = JSON.stringify(updatedPayload);

    try {
      const res = await axios.put('/api/adminAction/updateUserInfo', body, config);
      res?.data && setAlert(res.data.success, 'success');
      setTimeout(() => {
        navigate('/logs');
        dispatch(getUsers());
      }, 3000);
    } catch (err) {
      const errors = err.response.data.errors || [{msg: 'Something went wrong please try again later!'}];
      if (errors) {
        errors.forEach((error) => setAlert(error.msg, 'danger', 10000));
      }
    }
    scroll.scrollToTop();
  };

  const deleteUserHandler = async (userId) => {
    try {
      const res = await axios.delete(`api/adminAction/deleteUser/${userId}`);
      res?.data && setAlert(res.data.success, 'success');
      setComponentState({...componentState, isModalVisible: false, userId: null});
      setTimeout(() => {
        navigate('/logs');
        dispatch(getUsers());
      }, 3000);
    } catch (err) {
      const errors = err.response.data.errors || [{msg: 'Something went wrong please try again later!'}];
      if (errors) {
        errors.forEach((error) => setAlert(error.msg, 'danger', 10000));
      }
    }
    scroll.scrollToTop();
  };

  const onDeleClick = (id) => {
    setComponentState({...componentState, isModalVisible: true, userId: id});
  };

  let usersListJsx;
  if (!isEmpty(users) && users.length > 0) {
    usersListJsx = users.map((user) => (
      <Element name={user._id} key={user._id}>
        <div className="post bg-light p-1 my-1">
          <div>
            <img className="round-img" src={user.user.avatar} alt="user-profile" />
            <h4>{`${user.firstName} ${user.lastName}`}</h4>
            <p className="post-date">{user.accountNumber}</p>
            <p className="post-date">{user.accountType}</p>
            <div className="py">
              <i className="fa fa-check"></i> {user.accBranch}
            </div>
            <div>
              <i className="fa fa-check"></i> {user.IFSC_Code}
            </div>
          </div>
          {isEditEnabled && id === user._id ? (
            <RenderInputFields state={componentState} onFieldChange={onFieldChange} onBlurFields={onBlurFields} submitHandler={submitHandler} />
          ) : (
            <div>
              <p className="my-1">
                <strong>Mobile-Number: </strong>
                {user.user.mobileNumber}
              </p>
              {user.permanentAddress && (
                <p className="my-1">
                  <strong>Permanent Address: </strong>
                  {user.permanentAddress}
                </p>
              )}
              {user.familyDetails.spouseName && (
                <p className="my-1">
                  <strong>Spouse: </strong>
                  {user.familyDetails.spouseName || '--'}
                </p>
              )}
              <p className="my-1">
                <strong>Alternate contact: </strong>
                {user.alternateContactNumber}
              </p>
              <p className="my-1">
                <strong>Source of Income: </strong>
                {user.sourceOfIncome}
              </p>
              <p className="my-1">
                <strong>Occupation: </strong>
                {user.occupation}
              </p>
              <p className="my-1">
                <strong>Company: </strong>
                {user.company}
              </p>

              <p className="post-date">
                Updated on: {moment(user.date[user.date.length - 1].lastUpdated).format('DD-MM-YYYY HH:mm:ss')} by:{' '}
                {user.date[user.date.length - 1].updatedBy}
              </p>
            </div>
          )}
          <ul className={permissions.length > 1 ? 'admin-actions' : 'read-permission-only'}>
            <li>
              <i
                className={isEditEnabled && id === user._id ? 'fas fa-times' : 'fas fa-edit'}
                onClick={permissions.length > 1 ? () => editInfo(user) : undefined}
                onKeyDown={permissions.length > 1 ? () => editInfo(user) : undefined}
                role="button"
              ></i>
            </li>
            <li>
              <button
                className="btn btn-primary btn-curved"
                onClick={() => submitHandler(user)}
                disabled={id !== user._id || permissions.length < 2 || !isEditEnabled || !isValidMobNumb || !isValidAltMobNumb}
              >
                Update
              </button>
            </li>
            <li>
              <button className="btn btn-danger btn-curved" onClick={() => onDeleClick(user.user._id)} disabled={permissions.length < 2}>
                <i className="fas fa-times"></i>
              </button>
            </li>
          </ul>
        </div>
      </Element>
    ));
  } else if (loading) {
    usersListJsx = <Spinner />;
  } else {
    usersListJsx = <h1>Oops..!! Something went wrong!</h1>;
  }

  return (
    <React.Fragment>
      {isModalVisible && (
        <Modal
          handleClose={() =>
            setComponentState({
              ...componentState,
              isModalVisible: false,
              userId: null
            })
          }
          handleSubmit={() => deleteUserHandler(userId)}
        />
      )}
      {usersListJsx}
    </React.Fragment>
  );
};

AllUsers.propTypes = {
  users: PropTypes.array,
  loading: PropTypes.bool,
  permissions: PropTypes.array,
  isAdminAuthenticated: PropTypes.bool,
  dispatch: PropTypes.func,
  setAlert: PropTypes.func
};

const mapStateToProps = (state) => ({
  users: state.adminLogs.allUsers,
  loading: state.adminLogs.loading,
  permissions: state.authAdmin?.admin?.permissions,
  isAdminAuthenticated: state.authAdmin.isAdminAuthenticated
});

export default connect(mapStateToProps, (dispatch) => ({
  dispatch,
  ...bindActionCreators({setAlert}, dispatch)
}))(AllUsers);
