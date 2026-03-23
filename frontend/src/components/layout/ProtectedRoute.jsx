import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../store/authSlice";

const ProtectedRoute = ({ roles, children }) => {
  const user = useAppSelector(selectCurrentUser);
  const initialized = useAppSelector((state) => state.auth.initialized);
  const location = useLocation();

  // Wait for auth state to initialize from localStorage
  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children ?? <Outlet />;
};

export default ProtectedRoute;

