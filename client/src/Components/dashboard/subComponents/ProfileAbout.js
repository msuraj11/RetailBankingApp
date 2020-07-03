import React, { Fragment } from 'react';
import {isEmpty} from 'lodash';

const ProfileAbout = ({profile, editAddress, editInfo, onFieldChange, onBlurFields, submitAddress}) => {
    const {isAboutEditEnabled, isEditEnabled, fieldCurrAddress, fieldPermAddress, fieldMobileNum,
        isValidMobNumb, currentAddress, permanentAddress, AadharNo, PANCardNo, dateDiff,
        user: {mobileNumber}} = profile;

    return (
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
                            name="fieldCurrAddress"
                            value={fieldCurrAddress}
                            onChange={e => onFieldChange(e)}
                            disabled={dateDiff}
                        />
                        <button
                            className="btn btn-primary m-1"
                            onClick={() => submitAddress()}
                            disabled={isEmpty(fieldCurrAddress) || dateDiff}
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
                                    placeholder="* Permanent Address"
                                    name="fieldPermAddress"
                                    value={fieldPermAddress}
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
                                name="fieldMobileNum"
                                minLength="10"
                                value={fieldMobileNum}
                                onChange={e => onFieldChange(e)}
                                onBlur={e => onBlurFields(e)}
                                disabled={dateDiff}
                            />
                            {!isValidMobNumb &&
                                <small className="form-danger">
                                    Mobile number entered is not valid.
                                </small>
                            }
                        </div> : mobileNumber
                    }
                </div>
            </div>
        </div>
    );
};

export default ProfileAbout;