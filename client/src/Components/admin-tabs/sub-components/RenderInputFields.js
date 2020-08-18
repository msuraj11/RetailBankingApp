import React from 'react';

const RenderInputFields = ({state, onFieldChange, onBlurFields, submitHandler}) => {
    const {fieldMobileNumber, fieldPermanentAddress, fieldSpouseName, fieldAltContact,
        fieldSOI, fieldOcc, fieldCompany, isValidMobNumb, isValidAltMobNumb} = state;
    return (
        <form className="form">
            <div className="form-group" onSubmit={submitHandler}>
                <input
                    type="tel"
                    placeholder="* Mobile Number"
                    name="fieldMobileNumber"
                    minLength="10"
                    value={fieldMobileNumber}
                    onChange={e => onFieldChange(e)}
                    onBlur={e => onBlurFields(e)}
                />
                {!isValidMobNumb &&
                    <small className="form-danger">
                        Mobile number entered is not valid.
                    </small>
                }
            </div>
            <div className="form-group">
                <textarea
                    placeholder="* Permanent Address"
                    name="fieldPermanentAddress"
                    value={fieldPermanentAddress}
                    onChange={e => onFieldChange(e)}
                />
            </div>
            <div className="form-group">
                <input
                    type="text"
                    placeholder="Spouse"
                    name="fieldSpouseName"
                    value={fieldSpouseName}
                    onChange={e => onFieldChange(e)}
                />
            </div>
            <div className="form-group">
                <input
                    type="tel"
                    placeholder="* Alternate contact Number"
                    name="fieldAltContact"
                    minLength="10"
                    value={fieldAltContact}
                    onChange={e => onFieldChange(e)}
                    onBlur={e => onBlurFields(e)}
                />
                {!isValidAltMobNumb &&
                    <small className="form-danger">
                        Mobile number entered is not valid.
                    </small>
                }
            </div>
            <div className="form-group">
                <select name="fieldSOI" value={fieldSOI} onChange={e => onFieldChange(e)}>
                    <option value=''>* --Select source of Income--</option>
                    <option value='Salary'>Salary</option>
                    <option value='Business-income'>Business-income</option>
                    <option value='Agriculture'>Agriculture</option>
                    <option value='Investment-income'>Investment-income</option>
                    <option value='Others'>Others</option>
                </select>
            </div>
            <div className="form-group">
                <select name="fieldOcc" value={fieldOcc} onChange={e => onFieldChange(e)}>
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
                <input
                    type="text"
                    placeholder="* Company"
                    name="fieldCompany"
                    value={fieldCompany}
                    onChange={e => onFieldChange(e)}
                />
            </div>
        </form>
    );
};

export default RenderInputFields;