// import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicOnlyRoute = () => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (user.role === 'hr') {
      return <Navigate to="/dashboard" replace />;
    }
    // Mặc định là 'user'
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;