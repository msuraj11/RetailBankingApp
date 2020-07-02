import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import axios from 'axios';
import {isEmpty} from 'lodash';
import { connect } from 'react-redux';
import {animateScroll as scroll} from 'react-scroll';
import { setAlert } from '../../../actions/alert';
import ProfileTop from '../subComponents/ProfileTop';
import ProfileAbout from '../subComponents/ProfileAbout';

const ShowProfile = ({profile, getCurrentProfile, setAlert}) => {
    const {dateOfBirth, currentAddress, permanentAddress, alternateContactNumber,
        sourceOfIncome, occupation, company, accountType, familyDetails: {fatherName, motherName, spouse},
        accBranch, IFSC_Code, gender, date, user: {mobileNumber}} = profile;

    const dateObj = date[date.length - 1];
    const lastUpdatedDate = moment(dateObj.lastUpdated).format('DD-MM-YYYY');
    const currentDate = moment().format('DD-MM-YYYY');
    const dateDiff = moment(currentDate, 'DD-MM-YYYY').diff(moment(lastUpdatedDate, 'DD-MM-YYYY'), 'days') < 15;

    const [componentState, setComponentState] = useState({
        isAboutEditEnabled: false,
        isEditEnabled: false,
        isErrorMessageOnMobNumb: false,
        fieldCurrAddress: currentAddress,
        fieldPermAddress: permanentAddress,
        spouseName: spouse,
        fieldMobileNum: mobileNumber
    });
    const {isAboutEditEnabled, fieldCurrAddress, isEditEnabled, fieldPermAddress,
        isErrorMessageOnMobNumb, spouseName, fieldMobileNum} = componentState;

    const editAddress = () => {
        setComponentState({...componentState, isAboutEditEnabled: !isAboutEditEnabled});
    };

    const editInfo = () => {
        setComponentState({...componentState, isEditEnabled: !isEditEnabled});
    };

    const onFieldChange = e => {
        console.log(e.target.value);
        setComponentState({...componentState, [e.target.name]: e.target.value});   
    };

    const submitAddress = async () => {
        console.log(fieldCurrAddress);
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            const res = await axios.post('/api/profile', {currentAddress: fieldCurrAddress}, config);
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
            if (isErrorMessageOnMobNumb) {
                setComponentState({...componentState, fieldMobileNum: mobileNumber, isErrorMessageOnMobNumb: false});
            } else {
                setComponentState({...componentState, fieldMobileNum: mobileNumber});
            }
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
                <ProfileTop profile={profile} />

                <ProfileAbout
                    profile={{...profile, ...componentState}}
                    editAddress={editAddress}
                    editInfo={editInfo}
                    onFieldChange={onFieldChange}
                    onBlurFields={onBlurFields}
                    submitAddress={submitAddress}
                />
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