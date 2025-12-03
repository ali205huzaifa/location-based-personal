import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "../store";

type ProtectedRouteProps = {
  children: React.ReactElement;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = useSelector((state: RootState) => state.auth.token);

  if (!token || token === "null") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
