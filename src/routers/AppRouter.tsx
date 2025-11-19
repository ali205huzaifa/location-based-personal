import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "../components/auths/login";
import ForgotPassword from "../components/auths/ForgotPassword";
import VerifyOtp from "../components/auths/VerifyOtp";
import Signup from "../components/auths/signUp";
import MainLayout from "../layout/MainLayout";
import UserVerification from "../components/auths/UserVerification";
import ProtectedRoute from "./ProtectedRoutes";
import Home from "../components/home/home";
import CompleteGoogleProfile from "../components/auths/CompleteGoogleProfile";
import ProfileOptions from "../components/profileSetting/ProfileOptions";
import MyActivity from "../components/myActivity/MyActivity";
import ChatLayout from "../components/chats/ChatLayout";
import OthersProfile from "../components/othersProfile/othersProfile";
import GoogleSuccess from "../components/auths/GoogleSuccess";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<UserVerification />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/google/success" element={<GoogleSuccess />} />
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
          <Route path="activity" element={<MyActivity />} />
          <Route path="chats" element={<ChatLayout />} />
          <Route path="settings" element={<ProfileOptions />} />
          <Route path="/othersProfile/:username" element={<OthersProfile />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
