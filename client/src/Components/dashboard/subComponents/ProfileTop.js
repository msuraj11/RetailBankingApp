import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

const ProfileTop = ({profile}) => {
    const {firstName, lastName, accountNumber, date, user: {avatar, customerId}} = profile;
    const dateObj = date[date.length - 1];
    return (
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
    );
};

export default ProfileTop;