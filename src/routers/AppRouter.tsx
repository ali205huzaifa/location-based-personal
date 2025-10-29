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
import CompleteGoogleProfile from "../components/Auth/CompleteGoogleProfile";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<UserVerification />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/auth/google/complete-profile"
          element={<CompleteGoogleProfile />}
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="home" element={<Home />} />
          <Route path="activity" element={<Home />} />
          <Route path="chats" element={<Home />} />
          <Route path="settings" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
