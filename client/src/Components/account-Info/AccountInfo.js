import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {isEmpty} from 'lodash';
import Spinner from '../layouts/Spinner';
import { getAccountInfo, getStatement, removeStatement } from '../../actions/accountInfo';
import { setAlert } from '../../actions/alert';
import StatementTable from './StatementTable';

const AccountInfo = ({getAccountInfo, getStatement, accountInfo: {accInfo, loading, statement},
    profile:{profile}, setAlert, removeStatement}) => {  
    useEffect(() => {
        if (!accInfo) {
            getAccountInfo();
            return  () => {
                removeStatement();
            }
        }
    }, [getAccountInfo, accInfo, removeStatement]);


    const [dateItems, setDates] = useState({
        from: moment(profile.date[0].lastUpdated).format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD'),
        isValidDate: true
    });

    const {from, to, isValidDate} = dateItems;

    const onFieldChange = e => {
        console.log(e.target.value);
        setDates({...dateItems, [e.target.name]: e.target.value});
    };

    const onBlurFields = e => {
        const validDate = moment(e.target.value).isValid();
        const validDateRange = validDate && moment(moment(e.target.value).format('YYYY-MM-DD')).isBetween(
            moment(profile.date[0].lastUpdated).format('YYYY-MM-DD'),
            moment().format('YYYY-MM-DD'), undefined, []);
        const validCombination = validDate && moment(from).isSameOrBefore(to);
        console.log(validDate, validDateRange, validCombination);
        if (!validDate) {
            setAlert('Invalid date format', 'danger', 7000);
            removeStatement();
        }
        if (validDate && !validDateRange) {
            setAlert('Please enter relevent date', 'danger', 7000);
            removeStatement();
        }
        if (validDate && !isEmpty(to) && !isEmpty(from) && !validCombination) {
            setAlert('From-date cannot be after To-date', 'danger', 7000);
            removeStatement();
        }
        setDates({
            ...dateItems,
            isValidDate: validDate && validDateRange && validCombination
        });
    };

    const submitDates = () => {
        getStatement(from, to);
    };

    return (loading && (accInfo === null || profile === null) ? <Spinner /> :
        <Fragment>
            <h1 className='large text-primary'>Account Info</h1>
            <div className="profiles">
                <div className="profile bg-light">
                    <img
                        className="round-img"
                        src={profile.user.avatar}
                        alt="profile of user"
                    />
                    <div>
                        <h2>{accInfo.accHolder}</h2>
                        <p>A/C: {accInfo.accountNumber}</p>
                        <p>{accInfo.accountType}</p>
                        <p><strong>{accInfo.accountBalance}{' '}</strong><i className="fas fa-rupee-sign"></i></p>
                    </div>

                    <ul>
                        <li className="text-primary">
                            <i className="fas fa-check"></i> {accInfo.accBranch}
                        </li>
                        <li className="text-primary">
                            <i className="fas fa-check"></i> {accInfo.IFSC_Code}
                        </li>
                    </ul>
                </div>
            </div>
            <div className='statement-dates'>
                <div className='form'>
                    <input
                        type="date"
                        placeholder="* From"
                        name="from"
                        value={from}
                        min={moment(profile.date[0].lastUpdated).format('YYYY-MM-DD')}
                        max={moment().format('YYYY-MM-DD')}
                        onChange={e => onFieldChange(e)}
                        onBlur={e => onBlurFields(e)}
                    />
                </div>
                <div className='form mx'>
                    <input
                        type="date"
                        placeholder="* To"
                        name="to"
                        value={to}
                        min={from || moment(profile.date[0].lastUpdated).format('YYYY-MM-DD')}
                        max={moment().format('YYYY-MM-DD')}
                        onChange={e => onFieldChange(e)}
                        onBlur={e => onBlurFields(e)}
                    />
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => submitDates()}
                    disabled={!isValidDate || isEmpty(from) || isEmpty(to)}
                >
                    Get Statement
                </button>
            </div>
            {statement && isValidDate && <StatementTable data={statement} />}
        </Fragment>
    );
};

const mapStateToProps = state => ({
    accountInfo: state.accountInfo,
    profile: state.profile
});

export default connect(mapStateToProps, {getAccountInfo, setAlert, getStatement, removeStatement})(AccountInfo);
