import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import {isEmpty} from 'lodash';
import { getLogs } from '../../actions/adminLogs';
import { setAdminNavLinks, resetAdminNavLinks } from '../../actions/authAdmin'
import Spinner from '../layouts/Spinner';

const Logs = ({getLogs, logs, setAdminNavLinks, resetAdminNavLinks, loading}) => {
    useEffect(() => {
        setAdminNavLinks();
        if(isEmpty(logs)) {
            getLogs();
        }
        return () => {
            resetAdminNavLinks();
        }
    }, [getLogs, logs, setAdminNavLinks, resetAdminNavLinks]);
    return (
        <Fragment>
            {logs && Array.isArray(logs) && logs.length > 0 ?
                logs.map(log => (
                        <div className="post bg-white p-1 my-1">
                            <div>
                                <img
                                    className="round-img"
                                    src={log.userDetails.userAvatar}
                                    alt="user-profile"
                                />
                                <h4>{log.userDetails.userName}</h4>
                                <p className="post-date">{log.userDetails.accNumber}</p>
                            </div>
                            <div>
                                <p className="my-1"><strong>Changes :</strong>{log.updatedChanges}</p>
                                <p className="post-date">{log.updatedOn}</p>
                                <div className='user-details'>
                                    <div className="p-1">
                                        <i className={log.userDetails.userBranch === 'Not generated' ? 'fas fa-times' : 'fa fa-check'}></i>
                                        {' '}{log.userDetails.userBranch}
                                    </div>
                                    <div className="p-1">
                                        <i className={log.userDetails.userIFSC === 'Not generated' ? 'fas fa-times' : 'fa fa-check'}></i>
                                        {' '}{log.userDetails.userIFSC}
                                    </div>
                                </div>
                            </div>
                            <div className={`log-type-${log.actionType}`}>
                                <h3>{log.actionType}</h3>
                            </div>
                        </div>
                    )
                ) : (loading ? <Spinner /> : <h1>Looks like you don't have any logs..!!</h1>)
            }
        </Fragment>
    );
};

const mapStateToProps = state => ({
    logs: state.adminLogs.logs,
    loading: state.adminLogs.loading
});

export default connect(mapStateToProps, {getLogs, setAdminNavLinks, resetAdminNavLinks})(Logs);