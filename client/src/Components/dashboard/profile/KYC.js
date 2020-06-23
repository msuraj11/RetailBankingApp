import React, { Fragment, useState } from 'react';

const KYC = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        PANCardNo: '',
        AadharNo: '',
        fatherName: '',
        motherName: '',
        spouse: '',
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

    const {firstName, lastName, dateOfBirth, PANCardNo, AadharNo, currentAddress, permanentAddress,
        alternateContactNumber, sourceOfIncome, occupation, company, fatherName, accountType, gender,
        motherName, spouse, accBranch, IFSC_Code} = formData;

    const onFieldChange = e => {
        setFormData({...formData, [e.target.name]: e.target.value});    
    };

    return (
        <Fragment>
            <h1 className="large text-primary">KYC Profile</h1>
            <p className="lead"><i className="fas fa-user"></i> Complete your KYC to get started your transactions</p>
            <form className="form">
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
                        onChange={e => onFieldChange(e)}
                    />
                </div>
                <div className="form-group">
                    <select name="gender" value={gender} onChange={e => onFieldChange(e)}>
                        <option value='0'>* --Select gender--</option>
                        <option value='Male'>Male</option>
                        <option value='Femail'>Femail</option>
                    </select>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="* PAN Card number"
                        name="PANCardNo"
                        value={PANCardNo}
                        onChange={e => onFieldChange(e)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="* Aadhar Card number"
                        name="AadharNo"
                        value={AadharNo}
                        onChange={e => onFieldChange(e)}
                    />
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
                        placeholder="Alternate contact Number"
                        name="alternateContactNumber"
                        minLength="10"
                        value={alternateContactNumber}
                        onChange={e => onFieldChange(e)}
                    />
                </div>
                <div className="form-group">
                    <select name="sourceOfIncome" value={sourceOfIncome} onChange={e => onFieldChange(e)}>
                        <option value='0'>* --Select source of Income--</option>
                        <option value='Employee'>Employee</option>
                        <option value='Femail'>Self-Employed</option>
                    </select>
                </div>
                <div className="form-group">
                    <select name="occupation" value={occupation} onChange={e => onFieldChange(e)}>
                        <option value='0'>* --Select occupation--</option>
                        <option value='Employee'>Employee</option>
                        <option value='Femail'>Self-Employed</option>
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
                        <option value='0'>* --Select account-type--</option>
                        <option value='Savings'>Savings</option>
                        <option value='Current'>Current</option>
                    </select>
                </div>
                <div className="form-group">
                    <select name="accBranch" value={accBranch} onChange={e => onFieldChange(e)}>
                        <option value='0'>* --Select account-branch--</option>
                        <option value='Neeladri'>Neeladri, Bangalore</option>
                        <option value='E-City'>E-City, Bangalore</option>
                    </select>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="* IFSC Code"
                        name="IFSC_Code"
                        value={IFSC_Code}
                        onChange={e => onFieldChange(e)}
                    />
                </div>
                <button
                    type="submit"
                    className='btn btn-primary'
                    disabled
                >
                    Submit
                </button>
            </form>
        </Fragment>
    );
}

KYC.propTypes = {

};

export default KYC;