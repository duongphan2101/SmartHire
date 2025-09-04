import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: string[];
  redirectTo: string;
}

const ProtectedRoute = ({ allowedRoles, redirectTo }: ProtectedRouteProps) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Outlet />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
