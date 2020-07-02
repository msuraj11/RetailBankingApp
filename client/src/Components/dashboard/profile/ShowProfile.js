import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import {isEmpty} from 'lodash';
import { connect } from 'react-redux';
import {animateScroll as scroll} from 'react-scroll';
import { setAlert } from '../../../actions/alert';

const ShowProfile = ({profile, getCurrentProfile, setAlert}) => {
    const {firstName, lastName, accountNumber, dateOfBirth, PANCardNo, AadharNo, currentAddress,
        permanentAddress, alternateContactNumber, sourceOfIncome, occupation, company, accountType,
        familyDetails: {fatherName, motherName, spouse}, accBranch, IFSC_Code, gender, date,
        user: {avatar, customerId, mobileNumber}} = profile;

    const dateObj = date[date.length - 1];
    const lastUpdatedDate = moment(dateObj.lastUpdated).format('DD-MM-YYYY');
    const currentDate = moment().format('DD-MM-YYYY');
    const dateDiff = moment(currentDate, 'DD-MM-YYYY').diff(moment(lastUpdatedDate, 'DD-MM-YYYY'), 'days') < 15;

    const [componentState, setComponentState] = useState({
        isAboutEditEnabled: false,
        isEditEnabled: false,
        isErrorMessageOnMobNumb: false,
        fieldAddress: currentAddress,
        spouseName: spouse,
        fieldMobileNum: mobileNumber
    });
    const {isAboutEditEnabled, fieldAddress, isEditEnabled,
        spouseName, isErrorMessageOnMobNumb, fieldMobileNum} = componentState;

    const editAddress = () => {
        setComponentState({...componentState, isAboutEditEnabled: !isAboutEditEnabled});
    };

    const editInfo = () => {
        setComponentState({...componentState, isEditEnabled: !isEditEnabled});
    };

    const onFieldChange = e => {
        console.log(e.target.value);
        if (e.target.name === 'currentAddress') {
            setComponentState({...componentState, fieldAddress: e.target.value});
        } else if (e.target.name === 'spouse') {
            setComponentState({...componentState, spouseName: e.target.value});
        } else {
            setComponentState({...componentState, fieldMobileNum: e.target.value});
        }
            
    };

    const submitAddress = async () => {
        console.log(fieldAddress);
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            const res = await axios.post('/api/profile', {currentAddress: fieldAddress}, config);
            console.log(res.data);
            setAlert('Updated address succesfully', 'success', 5000);
            scroll.scrollToTop();
            editAddress();
            getCurrentProfile();
        } catch (err) {
            console.error(err.response.data);
            const errors = err.response.data.errors;
            if (errors) {
                errors.forEach(error => setAlert(error.msg, 'danger', 10000));
            }
            scroll.scrollToTop();
        }
    };

    const onBlurFields = e => {
        if (isEmpty(e.target.value)) {
            setComponentState({...componentState, fieldMobileNum: mobileNumber});
        } else {
            const mobNum = e.target.value;
            const mobRegX = /^((\+){1}91){1}[6-9]{1}[0-9]{9}$/;
            setComponentState({...componentState, isErrorMessageOnMobNumb: !mobRegX.test(mobNum)});
        }
    };

    const submitInfo = () => {

    };

    return (
        <Fragment>
            <div className="profile-grid my-1">
                <div className="profile-top bg-primary p-2">
                    <img
                        className="round-img my-1"
                        src={avatar}
                        alt='Charming face of user'
                    />
                    <h1 className="large">{`${firstName} ${lastName}`}</h1>
                    <p className="lead">{`Account number: ${accountNumber}`}</p>
                    <p>{`Customer-ID: ${customerId}`}</p>
                    <div className="icons my-1">
                        <Link to='#'><i className="fab fa-cc-visa fa-2x"></i></Link>
                        <Link to='#'><i className="fab fa-cc-mastercard fa-2x"></i></Link>
                        <Link to='#'><i className="fab fa-paypal fa-2x"></i></Link>
                        <Link to='#'><i className="fab fa-apple-pay fa-2x"></i></Link>
                        <Link to='#'><i className="fab fa-amazon-pay fa-2x"></i></Link>
                        <Link to='#'><i className="fab fa-google-pay fa-2x"></i></Link>
                    </div>
                    <small>{`Last updated: ${moment(dateObj.lastUpdated).format('DD-MM-YYYY HH:mm:ss')} by ${dateObj.updatedBy}`}</small>
                </div>

                <div className="profile-about bg-light p-2">
                    <div className='edit-icon'>
                        <i className={isAboutEditEnabled ? 'fas fa-times' : 'fas fa-edit'} onClick={editAddress}></i>
                    </div>
                    <h2 className="text-primary">You live here</h2>
                    {isAboutEditEnabled ?
                        (
                            <div className="form">
                                <textarea
                                    placeholder="* Current Address"
                                    name="currentAddress"
                                    value={fieldAddress}
                                    onChange={e => onFieldChange(e)}
                                    disabled={dateDiff}
                                />
                                <button
                                    className="btn btn-primary m-1"
                                    onClick={() => submitAddress()}
                                    disabled={isEmpty(fieldAddress) || dateDiff}
                                >
                                    submit
                                </button>
                                {dateDiff &&
                                    <small className='form-danger'>
                                        You cannot update address again with in 15 days.
                                    </small>
                                }
                            </div>
                        ) :
                        <p>{currentAddress}</p>
                    }
                    <div className="line" />
                    {permanentAddress &&
                        <Fragment>
                            <div className='edit-icon'>
                                <i className={isEditEnabled ? 'fas fa-times' : 'fas fa-edit'} onClick={editInfo}></i>
                            </div>
                            <h2 className="text-primary">Your Home town/City</h2>
                            {isEditEnabled ?
                                (
                                    <div className="form">
                                        <textarea
                                            placeholder="* Current Address"
                                            name="currentAddress"
                                            value={fieldAddress}
                                            onChange={e => onFieldChange(e)}
                                            disabled={dateDiff}
                                        />
                                        {dateDiff &&
                                            <small className='form-danger'>
                                                You cannot update address again with in 15 days.
                                            </small>
                                        }
                                    </div>
                                ) :
                                <p>{permanentAddress}</p>
                            }
                            <div className="line" />
                        </Fragment>
                    }
                    <h2 className="text-primary">KYC Status</h2>
                    <div className="skills">
                        <div className="p-1"><i className="fa fa-check"></i> {AadharNo}</div>
                        <div className="p-1"><i className="fa fa-check"></i> {PANCardNo}</div>
                        <div className="p-1">
                            <i className="fa fa-mobile"></i>
                            {isEditEnabled ?
                                <div className="form">
                                    <input
                                        type="tel"
                                        placeholder="Mobile Number"
                                        name="mobileNumber"
                                        minLength="10"
                                        value={fieldMobileNum}
                                        onChange={e => onFieldChange(e)}
                                        onBlur={e => onBlurFields(e)}
                                        disabled={dateDiff}
                                    />
                                    {isErrorMessageOnMobNumb &&
                                        <small className="form-danger">
                                            Mobile number entered is not valid.
                                        </small>
                                    }
                                </div> : mobileNumber
                            }
                        </div>
                    </div>
                </div>

                <div className="profile-exp bg-white p-2">
                    <div className='edit-icon'>
                        <i className={isEditEnabled ? 'fas fa-times' : 'fas fa-edit'} onClick={editInfo}></i>
                    </div>
                    <h2 className="text-primary">Personal Information</h2>
                    <div>
                        <h3 className="text-dark">Self and Family Details</h3>
                        <br />
                        <p><strong>Date of birth: </strong>{moment(dateOfBirth).format('DD-MM-YYYY')}</p>
                        <p><strong>Gender: </strong>{gender}</p>
                        <p><strong>Father's name: </strong>{fatherName}</p>
                        <p><strong>Mother's name: </strong>{motherName}</p>
                        {isEditEnabled ?
                            <div className='form'>
                                <input
                                    type="text"
                                    placeholder="Spouse"
                                    name="spouse"
                                    value={spouseName}
                                    onChange={e => onFieldChange(e)}
                                    disabled={dateDiff}
                                />
                            </div> : <p><strong>Spouse: </strong>{spouse || '--'}</p>
                        }
                        <p><strong>Alternate Contact: </strong>{alternateContactNumber}</p>
                    </div>
                </div>

                <div className="profile-edu bg-white p-2">
                    <div className='edit-icon'>
                        <i className={isEditEnabled ? 'fas fa-times' : 'fas fa-edit'} onClick={editInfo}></i>
                    </div>
                    <h2 className="text-primary">Professional Information</h2>
                    <div>
                        <h3>Work and branch Details</h3>
                        <br />
                        <p><strong>Occupation: </strong>{occupation}</p>
                        <p><strong>Sourace of Income: </strong>{sourceOfIncome}</p>
                        <p><strong>Working at: </strong>{company}</p>
                        <p><strong>Account type: </strong>{accountType}</p>
                        <p><strong>Account branch </strong>{accBranch}</p>
                        <p><strong>IFSC code </strong>{IFSC_Code}</p>
                    </div>
                </div>
            </div>
            {isEditEnabled &&
                <div className='profile-submit'>
                    <button
                        className="btn btn-primary"
                        onClick={() => submitInfo()}
                    >
                        Request for update
                    </button>
                </div>
            }
        </Fragment>
    );
}

ShowProfile.propTypes = {
    profile: PropTypes.object.isRequired
};

export default connect(null, {setAlert})(ShowProfile);