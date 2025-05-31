import { useEffect } from "react";
import { connect } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

function PrivateRoute({
  role,
  userAuth: {isAuthenticated, loading: loadingUser},
  adminAuth: {isAdminAuthenticated, loading: loadingAdmin}
}) {
  const navigate = useNavigate();
  useEffect(() => {
    if (role === 'user') {
      if (!isAuthenticated && !loadingUser) {
        navigate('/login');
      }
    } else {
      if (!isAdminAuthenticated && !loadingAdmin) {
        navigate('/adminLanding');
      }
    }
  }, [role, isAuthenticated, isAdminAuthenticated, loadingUser, loadingAdmin]);

  return <Outlet />;
}

const mapStateToProps = state => ({
  userAuth: state.auth,
  adminAuth: state.authAdmin
});

export default connect(mapStateToProps)(PrivateRoute);