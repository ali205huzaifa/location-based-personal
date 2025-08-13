import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

type ProtectedRouteProps = {
  children: JSX.Element;
  requiredPermission?: string;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
}) => {
  const token = localStorage.getItem("token");
  const permissions = useSelector((state: any) => state.auth.permissions);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (requiredPermission && !permissions.includes(requiredPermission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
