import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import Spinner from '../layouts/Spinner';
import { getAccountInfo } from '../../actions/accountInfo';

const AccountInfo = ({getAccountInfo, accountInfo: {accInfo, loading}, profile:{profile}}) => {  
    useEffect(() => {
        if (!accInfo) {
            getAccountInfo();
        }
    }, [getAccountInfo, accInfo]);


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
        </Fragment>
    );
};

const mapStateToProps = state => ({
    accountInfo: state.accountInfo,
    profile: state.profile
});

export default connect(mapStateToProps, {getAccountInfo})(AccountInfo);
