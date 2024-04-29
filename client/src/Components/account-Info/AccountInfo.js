import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {useNavigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import {isEmpty} from 'lodash';
import {Element} from 'react-scroll';
import Spinner from '../layouts/Spinner';
import {getAccountInfo, getStatement, removeStatement as removeStatementAction} from '../../actions/accountInfo';
import {setAlert} from '../../actions/alert';
import StatementTable from './StatementTable';
import ContainerLayout from '../layouts/ContainerLayout';
import {getCurrentProfile} from '../../actions/profile';

const AccountInfo = ({
  isAuthenticated,
  loadingUser,
  dispatch,
  getStatement,
  accountInfo: {accInfo, loading, statement},
  profile: {profile},
  setAlert,
  removeStatement
}) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated && !loadingUser) {
      navigate('/login');
    }
  }, [isAuthenticated, loadingUser, navigate]);

  useEffect(() => {
    if (!profile) {
      dispatch(getCurrentProfile());
    }
    if (!accInfo) {
      dispatch(getAccountInfo());
    }
    return () => {
      dispatch(removeStatementAction());
    };
  }, [dispatch, accInfo, profile]);

  const [dateItems, setDates] = useState({
    from: profile ? moment(profile.date[0].lastUpdated).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD'),
    isValidDate: true
  });

  const {from, to, isValidDate} = dateItems;

  const onFieldChange = (e) => {
    setDates({...dateItems, [e.target.name]: e.target.value});
  };

  const onBlurFields = (e) => {
    const validDate = moment(e.target.value).isValid();
    const validDateRange =
      validDate &&
      moment(moment(e.target.value).format('YYYY-MM-DD')).isBetween(
        moment(profile.date[0].lastUpdated).format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD'),
        undefined,
        []
      );
    const validCombination = validDate && moment(from).isSameOrBefore(to);
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

  return loading && (accInfo === null || profile === null) ? (
    <Spinner />
  ) : (
    <ContainerLayout>
      <h1 className="large text-primary">Account Info</h1>
      <div className="profiles">
        <div className="profile bg-light">
          <img className="round-img" src={profile.user.avatar} alt="profile of user" />
          <div>
            <h2>{accInfo.accHolder}</h2>
            <p>A/C: {accInfo.accountNumber}</p>
            <p>{accInfo.accountType}</p>
            <p>
              <i className="fas fa-rupee-sign"></i> <strong>{accInfo.accountBalance}</strong>
            </p>
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
      <div className="statement-dates">
        <div className="form">
          <input
            type="date"
            placeholder="* From"
            name="from"
            value={from}
            min={moment(profile.date[0].lastUpdated).format('YYYY-MM-DD')}
            max={moment().format('YYYY-MM-DD')}
            onChange={(e) => onFieldChange(e)}
            onBlur={(e) => onBlurFields(e)}
          />
        </div>
        <div className="form mx">
          <input
            type="date"
            placeholder="* To"
            name="to"
            value={to}
            min={from || moment(profile.date[0].lastUpdated).format('YYYY-MM-DD')}
            max={moment().format('YYYY-MM-DD')}
            onChange={(e) => onFieldChange(e)}
            onBlur={(e) => onBlurFields(e)}
          />
        </div>
        <button className="btn btn-primary" onClick={() => submitDates()} disabled={!isValidDate || isEmpty(from) || isEmpty(to)}>
          Get Statement
        </button>
      </div>
      <Element name="table">{statement && isValidDate && <StatementTable data={statement} />}</Element>
    </ContainerLayout>
  );
};

AccountInfo.propTypes = {
  accountInfo: PropTypes.object,
  profile: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  loadingUser: PropTypes.bool,
  dispatch: PropTypes.func,
  setAlert: PropTypes.func,
  getStatement: PropTypes.func,
  removeStatement: PropTypes.func
};

const mapStateToProps = (state) => ({
  accountInfo: state.accountInfo,
  profile: state.profile,
  isAuthenticated: state.auth.isAuthenticated,
  loadingUser: state.auth.loading
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  ...bindActionCreators({setAlert, getStatement, removeStatement: removeStatementAction}, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountInfo);
