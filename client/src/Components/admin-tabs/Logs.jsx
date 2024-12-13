import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {isEmpty} from 'lodash';
import moment from 'moment';
import {getLogs} from '../../actions/adminLogs';
import {setAdminNavLinks, resetAdminNavLinks} from '../../actions/authAdmin';
import Spinner from '../layouts/Spinner';

const Logs = ({logs, dispatch, loading, isAdminAuthenticated}) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAdminAuthenticated && !loading) {
      navigate('/adminLanding');
    }
  }, [isAdminAuthenticated, loading, navigate]);

  useEffect(() => {
    dispatch(setAdminNavLinks());
    if (isEmpty(logs)) {
      dispatch(getLogs());
    }
    return () => {
      dispatch(resetAdminNavLinks());
    };
  }, [logs, dispatch]);

  let renderContent;
  if (logs && Array.isArray(logs) && logs.length > 0) {
    renderContent = logs.map((log) => (
      <div className="post bg-white p-1 my-1" key={log._id}>
        <div>
          <img className="round-img" src={log.userDetails.userAvatar} alt="user-profile" />
          <h4>{log.userDetails.userName}</h4>
          <p className="post-date">{log.userDetails.accNumber}</p>
        </div>
        <div>
          <p className="my-1">
            <strong>Changes: </strong>
            {log.updatedChanges}
          </p>
          <p className="post-date">Updated on: {moment(log.updatedOn).format('DD-MM-YYYY HH:mm:ss')}</p>
          <div className="user-details">
            <div className="p-1">
              <i className={log.userDetails.userBranch === 'Not generated' ? 'fas fa-times' : 'fa fa-check'}></i> {log.userDetails.userBranch}
            </div>
            <div className="p-1">
              <i className={log.userDetails.userIFSC === 'Not generated' ? 'fas fa-times' : 'fa fa-check'}></i> {log.userDetails.userIFSC}
            </div>
          </div>
        </div>
        <div className={`log-type-${log.actionType}`}>
          <h3>{log.actionType}</h3>
        </div>
      </div>
    ));
  } else if (loading) {
    renderContent = <Spinner />;
  } else {
    renderContent = <h1>Looks like you don't have any logs..!!</h1>;
  }

  return <React.Fragment>{renderContent}</React.Fragment>;
};

const mapStateToProps = (state) => ({
  logs: state.adminLogs.logs,
  loading: state.adminLogs.loading,
  isAdminAuthenticated: state.authAdmin.isAdminAuthenticated
});

export default connect(mapStateToProps)(Logs);
