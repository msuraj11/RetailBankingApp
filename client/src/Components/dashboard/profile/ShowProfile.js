import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import {isEmpty} from 'lodash';

const ShowProfile = ({profile, getCurrentProfile}) => {
    const {firstName, lastName, accountNumber, dateOfBirth, PANCardNo, AadharNo, currentAddress,
        permanentAddress, alternateContactNumber, sourceOfIncome, occupation, company, accountType,
        familyDetails: {fatherName, motherName, spouse}, accBranch, IFSC_Code, gender, date,
        user: {avatar, customerId, mobileNumber}} = profile;

    const dateObj = date[date.length - 1];

    const [isEditEnabled, toggleEdit] = useState(false);
    const [fieldAddress, setFieldAddress] = useState(currentAddress);
    const [alertObj, setAlertObj] = useState({
        isAlert: false,
        alertMsg: '',
        alertType: ''
    });
    const {isAlert, alertMsg, alertType} = alertObj;

    const editAddress = () => {
        toggleEdit(!isEditEnabled);
    };

    const onFieldChange = e => {
        setFieldAddress(e.target.value);
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
            setAlertObj({isAlert: true, alertMsg: 'Updated the Current address!!', alertType: 'success'});
            setTimeout(() => {
                setAlertObj({isAlert: false, alertMsg: '', alertType: ''});
            }, 3000);
            editAddress();
            getCurrentProfile();
        } catch (err) {
            console.error(err.response.data);
            const errors = err.response.data.errors;
            if (errors) {
                setAlertObj({isAlert: true, alertMsg: errors[0].msg, alertType: 'danger'});
                setTimeout(() => {
                    setAlertObj({isAlert: false, alertMsg: '', alertType: ''});
                }, 3000);
            }
        }
    };

    return (
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
                    <i className={isEditEnabled ? 'fas fa-times' : 'fas fa-edit'} onClick={editAddress}></i>
                </div>
                <h2 className="text-primary">You live here</h2>
                {isAlert &&
                    <div className={`alert alert-${alertType}`}>
                        {alertMsg}
                    </div>
                }
                {isEditEnabled ?
                    (
                        <div className="form">
                            <textarea
                                placeholder="* Current Address"
                                name="currentAddress"
                                value={fieldAddress}
                                onChange={e => onFieldChange(e)}
                            />
                            <button
                                className="btn btn-primary m-1"
                                onClick={() => submitAddress()}
                                disabled={isEmpty(fieldAddress)}
                            >
                                submit
                            </button>
                        </div>
                    ) :
                    <p>{currentAddress}</p>
                }
                <div className="line" />
                {permanentAddress &&
                    <Fragment>
                        <h2 className="text-primary">Your Home town/City</h2>
                        <p>{permanentAddress}</p>
                        <div className="line" />
                    </Fragment>
                }
                <h2 className="text-primary">KYC Status</h2>
                <div className="skills">
                    <div className="p-1"><i className="fa fa-check"></i> {AadharNo}</div>
                    <div className="p-1"><i className="fa fa-check"></i> {PANCardNo}</div>
                    <div className="p-1"><i className="fa fa-mobile"></i> {mobileNumber}</div>
                </div>
            </div>

            <div className="profile-exp bg-white p-2">
                <h2 className="text-primary">Personal Information</h2>
                <div>
                    <h3 className="text-dark">Self and Family Details</h3>
                    <br />
                    <p><strong>Date of birth: </strong>{moment(dateOfBirth).format('DD-MM-YYYY')}</p>
                    <p><strong>Gender: </strong>{gender}</p>
                    <p><strong>Father's name: </strong>{fatherName}</p>
                    <p><strong>Mother's name: </strong>{motherName}</p>
                    <p><strong>Spouse: </strong>{spouse || '--'}</p>
                    <p><strong>Alternate Contact: </strong>{alternateContactNumber}</p>
                </div>
            </div>

            <div className="profile-edu bg-white p-2">
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
    );
}

ShowProfile.propTypes = {
    profile: PropTypes.object.isRequired
};

export default ShowProfile;