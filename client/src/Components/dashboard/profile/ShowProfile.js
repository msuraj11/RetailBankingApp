import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';

const ShowProfile = ({profile}) => {
    const {firstName, lastName, accountNumber, dateOfBirth, PANCardNo, AadharNo, currentAddress,
        permanentAddress, alternateContactNumber, sourceOfIncome, occupation, company, accountType,
        familyDetails: {fatherName, motherName, spouse}, accBranch, IFSC_Code, gender, date,
        user: {avatar, customerId, mobileNumber}} = profile;
    const dateObj = date[date.length - 1];
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
                <small>{`Last updated: ${moment(dateObj.lastUpdated).format('DD-MM-YYYY HH:MM:SS')} by ${dateObj.updatedBy}`}</small>
            </div>

            <div className="profile-about bg-light p-2">
                <h2 className="text-primary">You live here</h2>
                <p>{currentAddress}</p>
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