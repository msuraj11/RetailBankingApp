import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setAdminNavLinks, resetAdminNavLinks } from '../../../actions/authAdmin';

const AdminDashboard = ({setAdminNavLinks, resetAdminNavLinks}) => {
    useEffect(() => {
        setAdminNavLinks();
        return () => {
            resetAdminNavLinks();
        }
    });
    return (
        <h1>Dashboard</h1>
    );
};

export default connect(null, {setAdminNavLinks, resetAdminNavLinks})(AdminDashboard);