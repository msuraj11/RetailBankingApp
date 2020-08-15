import React, { Fragment } from 'react';
import moment from 'moment';

const PersonalInfo = ({profile, editInfo, onFieldChange, onBlurAltContField}) => {
    const {isEditEnabled, dateOfBirth, gender, familyDetails: {fatherName, motherName}, spouseName: fieldSouseName,
        dateDiff, spouseName, alternateContactNumber, occupation, sourceOfIncome, company, accountType, accBranch, IFSC_Code,
        fieldAltContNum, isValidAltCont, fieldOccupation, fieldSOI, fieldCompany} = profile;
    return (
        <Fragment>
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
                        <Fragment>
                            <div className='form'>
                                <input
                                    type="text"
                                    placeholder="Spouse"
                                    name="spouseName"
                                    value={fieldSouseName}
                                    onChange={e => onFieldChange(e)}
                                    disabled={dateDiff}
                                />
                            </div>
                            <div className="form py">
                                <input
                                    type="tel"
                                    placeholder="* Alternate contact Number"
                                    name="fieldAltContNum"
                                    minLength="10"
                                    value={fieldAltContNum}
                                    onChange={e => onFieldChange(e)}
                                    onBlur={e => onBlurAltContField(e)}
                                    disabled={dateDiff}
                                />
                                {!isValidAltCont &&
                                    <small className="form-danger">
                                        Mobile number entered is not valid.
                                    </small>
                                }
                            </div>
                        </Fragment> :
                        <Fragment>
                            <p><strong>Spouse: </strong>{spouseName || '--'}</p>
                            <p><strong>Alternate Contact: </strong>{alternateContactNumber}</p>
                        </Fragment>
                    }
                    
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
                    {isEditEnabled ?
                        <Fragment>
                            <div className="form">
                                <select name="fieldOccupation" value={fieldOccupation} disabled={dateDiff} onChange={e => onFieldChange(e)}>
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
                            <div className="form py">
                                <select name="fieldSOI" value={fieldSOI} disabled={dateDiff} onChange={e => onFieldChange(e)}>
                                    <option value=''>* --Select source of Income--</option>
                                    <option value='Salary'>Salary</option>
                                    <option value='Business-income'>Business-income</option>
                                    <option value='Agriculture'>Agriculture</option>
                                    <option value='Investment-income'>Investment-income</option>
                                    <option value='Others'>Others</option>
                                </select>
                            </div>
                            <div className="form">
                                <input
                                    type="text"
                                    placeholder="* Company"
                                    name="fieldCompany"
                                    value={fieldCompany}
                                    onChange={e => onFieldChange(e)}
                                    disabled={dateDiff}
                                />
                            </div>
                        </Fragment> :
                        <Fragment>
                            <p><strong>Occupation: </strong>{occupation}</p>
                            <p><strong>Sourace of Income: </strong>{sourceOfIncome}</p>
                            <p><strong>Working at: </strong>{company}</p>
                        </Fragment>
                    }
                    <p><strong>Account type: </strong>{accountType}</p>
                    <p><strong>Account branch: </strong>{accBranch}</p>
                    <p><strong>IFSC code: </strong>{IFSC_Code}</p>
                </div>
            </div>
        </Fragment>
    );
};

export default PersonalInfo;