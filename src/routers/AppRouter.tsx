import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "../components/Auth/login";
import ForgotPassword from "../components/Auth/ForgotPassword";
import VerifyOtp from "../components/Auth/VerifyOtp";
import Signup from "../components/Auth/signUp";
import MainLayout from "../layout/MainLayout";
import UserVerification from "../components/Auth/UserVerification";
import ProtectedRoute from "./ProtectedRoutes";
import Home from "../components/home/home";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<UserVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="home" element={<Home />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
