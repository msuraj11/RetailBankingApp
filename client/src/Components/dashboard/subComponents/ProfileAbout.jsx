import {Fragment} from 'react';
import {isEmpty} from 'lodash';

const getClassString = (boolVal) => `fas fa-${boolVal ? 'times' : 'edit'}`;

const ProfileAbout = ({
  profile,
  editAddress,
  editInfo,
  onFieldChange,
  onBlurFields,
  submitAddress
}) => {
  const {
    isAboutEditEnabled,
    isEditEnabled,
    fieldCurrAddress,
    fieldPermAddress,
    fieldMobileNum,
    isValidMobNumb,
    currentAddress,
    permanentAddress,
    AadharNo,
    PANCardNo,
    dateDiff,
    user: {mobileNumber}
  } = profile;

  const getEditIconJsx = (isAbout = true) => (
    <i
      className={getClassString(isAbout ? isAboutEditEnabled : isEditEnabled)}
      role="button"
      onClick={isAbout ? editAddress : editInfo}
      onKeyDown={isAbout ? editAddress : editInfo}
    ></i>
  );

  return (
    <div className="profile-about bg-light p-2">
      <div className="edit-icon">{getEditIconJsx()}</div>
      <h2 className="text-primary">You live here</h2>
      {isAboutEditEnabled ? (
        <div className="form">
          <textarea
            placeholder="* Current Address"
            name="fieldCurrAddress"
            value={fieldCurrAddress}
            onChange={onFieldChange}
            disabled={dateDiff}
          />
          <button
            className="btn btn-primary m-1"
            onClick={submitAddress}
            disabled={isEmpty(fieldCurrAddress) || dateDiff}
          >
            submit
          </button>
          {dateDiff && (
            <small className="form-danger">You cannot update address again with in 15 days.</small>
          )}
        </div>
      ) : (
        <p className="address">{currentAddress}</p>
      )}
      <div className="line" />
      {permanentAddress && (
        <Fragment>
          <div className="edit-icon">{getEditIconJsx(false)}</div>
          <h2 className="text-primary">Your Home town/City</h2>
          {isEditEnabled ? (
            <div className="form">
              <textarea
                placeholder="* Permanent Address"
                name="fieldPermAddress"
                value={fieldPermAddress}
                onChange={onFieldChange}
                disabled={dateDiff}
              />
              {dateDiff && (
                <small className="form-danger">
                  You cannot update address again with in 15 days.
                </small>
              )}
            </div>
          ) : (
            <p className="address">{permanentAddress}</p>
          )}
          <div className="line" />
        </Fragment>
      )}
      <h2 className="text-primary">KYC Status</h2>
      <div className="skills">
        <div className="p-1">
          <i className="fa fa-check"></i> {AadharNo}
        </div>
        <div className="p-1">
          <i className="fa fa-check"></i> {PANCardNo}
        </div>
        <div className="p-1 skills">
          <i className="fa fa-mobile p-1"></i>
          {isEditEnabled ? (
            <div className="form">
              <input
                type="tel"
                placeholder="Mobile Number"
                name="fieldMobileNum"
                minLength="10"
                value={fieldMobileNum}
                onChange={onFieldChange}
                onBlur={onBlurFields}
                disabled={dateDiff}
              />
              {!isValidMobNumb && (
                <small className="form-danger">Mobile number entered is not valid.</small>
              )}
            </div>
          ) : (
            mobileNumber
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileAbout;
