import React, { Fragment, useState } from 'react';
import moment from 'moment';
import {omit, includes, isEmpty} from 'lodash';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { setAlert } from '../../../actions/alert';

const KYC = ({setAlert, history}) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        fatherName: '',
        motherName: '',
        spouse: '',
        PANCardNo: '',
        AadharNo: '',     
        currentAddress: '',
        permanentAddress: '',
        alternateContactNumber: '',
        sourceOfIncome: '',
        occupation: '',
        company: '',       
        accountType: '',    
        accBranch: '',
        IFSC_Code: ''
    });

    const [errorMsgs, setErrorMsgs] = useState({
        isValidMobNumb: true,
        isValidDOB: true,
        isValidPAN: true,
        isValidAadhar: true,
        disableSubmitButton: false
    });

    const [toggleForm, setToggle] = useState({
        showPersonalInfo: true,
        showContactInfo: false,
        showProfessionalInfo: false
    });

    const {firstName, lastName, dateOfBirth, PANCardNo, AadharNo, currentAddress, permanentAddress,
        alternateContactNumber, sourceOfIncome, occupation, company, fatherName, accountType, gender,
        motherName, spouse, accBranch, IFSC_Code} = formData;

    const omittedForm = omit(formData, ['permanentAddress', 'spouse']);

    const {isValidDOB, isValidMobNumb, isValidPAN, isValidAadhar} = errorMsgs;
    const {showPersonalInfo, showContactInfo, showProfessionalInfo} = toggleForm;

    const mappingIFSC = {
        'Neeladri, Bangalore': 'BOS12319867',
        'E-City, Bangalore': 'BOS12319567',
        'Koramangala, Bangalore': 'BOS12789233',
        'Kempegowda, Bangalore': 'BOS11284320'
    };


    const onFieldChange = e => {
        const {name, value} = e.target;
        if (name === 'AadharNo' && (value.length === 4 || value.length === 9)) {
            setFormData({...formData, [name]: `${value}-`});
        } else if (name === 'accBranch') {
            setFormData({...formData, [name]: value, IFSC_Code: !isEmpty(value) ? mappingIFSC[value] : ''});
        } else {
            setFormData({...formData, [name]: value}); 
        }   
    };

    const onBlurFields = e => {
        if (e.target.name === 'alternateContactNumber') {
            const mobNum = `+91${e.target.value}`
            const mobRegX = /^((\+){1}91){1}[6-9]{1}[0-9]{9}$/;
            setErrorMsgs({...errorMsgs, isValidMobNumb: mobRegX.test(mobNum)});            
        }
        if (e.target.name === 'dateOfBirth') {
            setErrorMsgs({
                ...errorMsgs,
                isValidDOB: moment(e.target.value).isValid() &&
                    moment(e.target.value).isBetween('1930-01-01',
                        moment(moment().subtract(18, 'years')).format('YYYY-MM-DD'))
            });
        }
        if (e.target.name === 'PANCardNo') {
            const panRegX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
            setErrorMsgs({...errorMsgs, isValidPAN: panRegX.test(e.target.value)});
        }
        if (e.target.name === 'AadharNo') {
            const aadharRegX = /^[2-9]{1}[0-9]{3}-[0-9]{4}-[0-9]{4}$/;
            setErrorMsgs({...errorMsgs, isValidAadhar: aadharRegX.test(e.target.value)});
        }
    };

    const ontoggleForm = (type) => {
        if (type === 'personal') {
            setToggle({showPersonalInfo: true, showContactInfo: false, showProfessionalInfo: false});
        } else if (type === 'contact') {
            setToggle({showPersonalInfo: false, showContactInfo: true, showProfessionalInfo: false});
        } else {
            setToggle({showPersonalInfo: false, showContactInfo: false, showProfessionalInfo: true});
        }
    };

    const onSubmitForm = async e => {
        e.preventDefault();
        console.log(formData);
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const updatedForm = {...formData, alternateContactNumber: `+91${alternateContactNumber}`};
        try {
            const res = await axios.post('/api/profile', updatedForm, config);
            console.log(res.data);
            setAlert('Congratulations your KYC is done!!', 'success');
            setErrorMsgs({...errorMsgs, disableSubmitButton: true});
            setTimeout(() => {
                history.push('/dashboard');
            }, 4000);
        } catch (err) {
            console.error(err.response.data);
            const errors = err.response.data.errors || ['Something went wrong please try again later!'];
            if (errors) {
                errors.forEach(error => setAlert(error.msg, 'danger', 10000));
            }
        }
    };

    return (
        <Fragment>
            <h1 className="large text-primary">KYC Profile</h1>
            <p className="lead"><i className="fas fa-user"></i> Complete your KYC to get started your transactions</p>
            <div className="dash-buttons">
                <button
                    className={showPersonalInfo ? 'btn btn-dark' : 'btn btn-light'}
                    onClick={() => ontoggleForm('personal')}
                >
                    <i className="fas fa-user-circle text-primary"></i> Personal Info
                </button>
                <button
                    className={showContactInfo ? 'btn btn-dark' : 'btn btn-light'}
                    onClick={() => ontoggleForm('contact')}
                >
                    <i className="fas fa-address-card text-primary"></i> Contact Info & Govt. ID
                </button>
                <button
                    className={showProfessionalInfo ? 'btn btn-dark' : 'btn btn-light'}
                    onClick={() => ontoggleForm('professional')}
                >
                    <i className="fab fa-black-tie text-primary"></i> Professional Info
                </button>
            </div>
            
            <form className="form" onSubmit={e => onSubmitForm(e)}>
                {showPersonalInfo &&
                    <Fragment>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="* First Name"
                                name="firstName"
                                value={firstName}
                                onChange={e => onFieldChange(e)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="* Last Name"
                                name="lastName"
                                value={lastName}
                                onChange={e => onFieldChange(e)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="date"
                                placeholder="* DOB"
                                name="dateOfBirth"
                                value={dateOfBirth}
                                min="1930-01-01"
                                max={moment(moment().subtract(18, 'years')).format('YYYY-MM-DD')}
                                onChange={e => onFieldChange(e)}
                                onBlur={e => onBlurFields(e)}
                            />
                            {!isValidDOB &&
                                <small className="form-danger">
                                    Invalid Date format or User should be 18 years old.
                                </small>
                            }
                        </div>
                        <div className="form-group">
                            <select name="gender" value={gender} onChange={e => onFieldChange(e)}>
                                <option value=''>* --Select gender--</option>
                                <option value='Male'>Male</option>
                                <option value='Female'>Female</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="* Father's name"
                                name="fatherName"
                                value={fatherName}
                                onChange={e => onFieldChange(e)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="* Mother's name"
                                name="motherName"
                                value={motherName}
                                onChange={e => onFieldChange(e)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Spouse"
                                name="spouse"
                                value={spouse}
                                onChange={e => onFieldChange(e)}
                            />
                        </div>
                        <button className="btn btn-primary" onClick={() => ontoggleForm('contact')}>
                            Next
                        </button>
                    </Fragment>
                }
                {showContactInfo &&     
                    <Fragment>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="* PAN Card number"
                                name="PANCardNo"
                                value={PANCardNo}
                                onChange={e => onFieldChange(e)}
                                onBlur={e => onBlurFields(e)}
                            />
                            {!isValidPAN &&
                                <small className="form-danger">
                                    Invalid PAN format.
                                </small>
                            }
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="* Aadhar Card number"
                                name="AadharNo"
                                value={AadharNo}
                                minLength="14"
                                onChange={e => onFieldChange(e)}
                                onBlur={e => onBlurFields(e)}
                            />
                            {!isValidAadhar &&
                                <small className="form-danger">
                                    Invalid Aadhar number format.
                                </small>
                            }
                        </div>
                        <div className="form-group">
                            <textarea
                                placeholder="* Current Address"
                                name="currentAddress"
                                value={currentAddress}
                                onChange={e => onFieldChange(e)}
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                placeholder="Permanent Address"
                                name="permanentAddress"
                                value={permanentAddress}
                                onChange={e => onFieldChange(e)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="tel"
                                placeholder="* Alternate contact Number"
                                name="alternateContactNumber"
                                minLength="10"
                                value={alternateContactNumber}
                                onChange={e => onFieldChange(e)}
                                onBlur={e => onBlurFields(e)}
                            />
                            {!isValidMobNumb &&
                                <small className="form-danger">
                                    Mobile number entered is not valid.
                                </small>
                            }
                        </div>
                        <button className="btn btn-primary" onClick={() => ontoggleForm('professional')}>
                            Next
                        </button>
                    </Fragment>
                }
                {showProfessionalInfo &&        
                    <Fragment>
                        <div className="form-group">
                            <select name="occupation" value={occupation} onChange={e => onFieldChange(e)}>
                                <option value=''>* --Select occupation--</option>
                                <option value='Salaried with PVT.'>Salaried with PVT.</option>
                                <option value='Salaried with Govt.'>Salaried with Govt.</option>
                                <option value='Self-Employed'>Self-Employed</option>
                                <option value='Retired'>Retired</option>
                                <option value='House-wife'>House-wife</option>
                                <option value='Student'>Student</option>
                                <option value='Others'>Others</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <select name="sourceOfIncome" value={sourceOfIncome} onChange={e => onFieldChange(e)}>
                                <option value=''>* --Select source of Income--</option>
                                <option value='Salary'>Salary</option>
                                <option value='Business-income'>Business-income</option>
                                <option value='Agriculture'>Agriculture</option>
                                <option value='Investment-income'>Investment-income</option>
                                <option value='Others'>Others</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="* Company"
                                name="company"
                                value={company}
                                onChange={e => onFieldChange(e)}
                            />
                        </div>
                        <div className="form-group">
                            <select name="accountType" value={accountType} onChange={e => onFieldChange(e)}>
                                <option value=''>* --Select account-type--</option>
                                <option value='Savings'>Savings</option>
                                <option value='Current'>Current</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <select name="accBranch" value={accBranch} onChange={e => onFieldChange(e)}>
                                <option value=''>* --Select account-branch--</option>
                                <option value='Neeladri, Bangalore'>Neeladri, Bangalore</option>
                                <option value='E-City, Bangalore'>E-City, Bangalore</option>
                                <option value='Koramangala, Bangalore'>Koramangala, Bangalore</option>
                                <option value='Kempegowda, Bangalore'>Kempegowda, Bangalore</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="* IFSC Code"
                                name="IFSC_Code"
                                value={IFSC_Code}
                                onChange={e => onFieldChange(e)}
                                disabled
                            />
                        </div>
                        <button
                            type="submit"
                            className='btn btn-primary'
                            disabled={includes(omittedForm, '') || !isValidDOB || 
                                !isValidMobNumb || !isValidPAN || !isValidAadhar}
                        >
                            Submit
                        </button>
                        <Link to='/dashboard' className='btn btn-light'>Go back</Link>
                    </Fragment>
                }
            </form>
        </Fragment>
    );
};

KYC.propTypes = {
    setAlert: PropTypes.func.isRequired,
    history: PropTypes.object
};

export default connect(null, {setAlert})(KYC);