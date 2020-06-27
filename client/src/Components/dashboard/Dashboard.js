import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getCurrentProfile } from '../../actions/profile';
import Spinner from '../layouts/Spinner';
import { Link } from 'react-router-dom';
import ShowProfile from './profile/ShowProfile';

const Dashboard = ({getCurrentProfile, auth: {user}, profile: {profile, loading}}) => {
    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile]);

    return loading && profile === null ? <Spinner /> :
        <Fragment>
            <h1 className='large text-primary'>Dashboard</h1>
            <p className='lead'>
                <i className='fas fa-user'></i> Welcome {user && user.name}
            </p>
            {
                profile !== null ?
                    <Fragment>
                        <ShowProfile profile={profile} />
                    </Fragment> :
                    <Fragment>
                        <p>You have not yet done KYC, Please provide details by clicking below</p>
                        <Link to='/kyc' className='btn btn-primary my-1'>Complete KYC</Link>
                    </Fragment>
            }
        </Fragment>;
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
});

export default connect(mapStateToProps, {getCurrentProfile})(Dashboard);