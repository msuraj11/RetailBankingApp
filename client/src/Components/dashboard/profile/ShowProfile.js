import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import axios from 'axios';
import {isEmpty, omit} from 'lodash';
import { connect } from 'react-redux';
import {animateScroll as scroll} from 'react-scroll';
import { setAlert } from '../../../actions/alert';
import ProfileTop from '../subComponents/ProfileTop';
import ProfileAbout from '../subComponents/ProfileAbout';
import PersonalInfo from '../subComponents/PersonalInfo';

const ShowProfile = ({profile, getCurrentProfile, setAlert}) => {
    const {currentAddress, permanentAddress, alternateContactNumber, occupation, sourceOfIncome, company,
        familyDetails: {spouse}, date, user: {mobileNumber}} = profile;

    const dateObj = date[date.length - 1];
    const lastUpdatedDate = moment(dateObj.lastUpdated).format('DD-MM-YYYY');
    const currentDate = moment().format('DD-MM-YYYY');
    const dateDiff = moment(currentDate, 'DD-MM-YYYY').diff(moment(lastUpdatedDate, 'DD-MM-YYYY'), 'days') < 15;

    const [componentState, setComponentState] = useState({
        isAboutEditEnabled: false,
        isEditEnabled: false,
        isValidMobNumb: true,
        isValidAltCont: true,
        fieldCurrAddress: currentAddress,
        fieldPermAddress: permanentAddress,
        spouseName: spouse,
        fieldMobileNum: mobileNumber,
        fieldAltContNum: alternateContactNumber,
        fieldOccupation: occupation,
        fieldSOI: sourceOfIncome,
        fieldCompany: company
    });
    const {isAboutEditEnabled, fieldCurrAddress, isEditEnabled, isValidMobNumb, isValidAltCont} = componentState;

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
            if (!isValidMobNumb) {
                setComponentState({...componentState, fieldMobileNum: mobileNumber, isValidMobNumb: true});
            } else {
                setComponentState({...componentState, fieldMobileNum: mobileNumber});
            }
        } else {
            const mobNum = e.target.value;
            const mobRegX = /^((\+){1}91){1}[6-9]{1}[0-9]{9}$/;
            setComponentState({...componentState, isValidMobNumb: mobRegX.test(mobNum)});
        }
    };

    const onBlurAltContField = e => {
        if (isEmpty(e.target.value)) {
            if (!isValidAltCont) {
                setComponentState({...componentState, fieldAltContNum: alternateContactNumber, isValidAltCont: true});
            } else {
                setComponentState({...componentState, fieldAltContNum: alternateContactNumber});
            }
        } else {
            const mobNum = e.target.value;
            const mobRegX = /^((\+){1}91){1}[6-9]{1}[0-9]{9}$/;
            setComponentState({...componentState, isValidAltCont: mobRegX.test(mobNum)});
        }
    };

    const submitInfo = () => {
        console.log(omit(componentState, ['isAboutEditEnabled', 'isEditEnabled', 'isValidMobNumb', 'isValidAltCont']));
        setAlert('Request submitted successfully', 'success', 5000);
        editInfo();
    };

    return (
        <Fragment>
            <div className="profile-grid my-1">
                <ProfileTop profile={profile} />
                <ProfileAbout
                    profile={{...profile, ...componentState, dateDiff}}
                    editAddress={editAddress}
                    editInfo={editInfo}
                    onFieldChange={onFieldChange}
                    onBlurFields={onBlurFields}
                    submitAddress={submitAddress}
                />
                <PersonalInfo
                    profile={{...profile, ...componentState, dateDiff}}
                    editInfo={editInfo}
                    onFieldChange={onFieldChange}
                    onBlurAltContField={onBlurAltContField}
                />
            </div>
            {isEditEnabled &&
                <div className='profile-submit'>
                    <button
                        className="btn btn-primary"
                        onClick={() => submitInfo()}
                        disabled={dateDiff || !isValidMobNumb || !isValidAltCont}
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