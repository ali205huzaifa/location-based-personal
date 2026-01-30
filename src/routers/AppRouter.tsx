import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "../components/auth/login";
import ForgotPassword from "../components/auth/ForgotPassword";
import VerifyOtp from "../components/auth/VerifyOtp";
import Signup from "../components/auth/signUp";
import MainLayout from "../layout/MainLayout";
import UserVerification from "../components/auth/UserVerification";
import ProtectedRoute from "./ProtectedRoutes";
import Home from "../components/home/home";
import CompleteGoogleProfile from "../components/auth/CompleteGoogleProfile";
import ProfileOptions from "../components/profileSetting/ProfileOptions";
import MyActivity from "../components/myActivity/MyActivity";
import ChatLayout from "../components/chats/ChatLayout";
import GoogleSuccess from "../components/auth/GoogleSuccess";
import UserProfile from "../components/othersProfile/othersProfile";
import ContactsList from "../components/contacts/Contactlist";
import SinglePostView from "../components/home/SinglePostView";

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
        <Route path="/post" element={<SinglePostView />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="activity" element={<MyActivity />} />
          <Route path="chats" element={<ChatLayout />} />
          <Route path="contacts" element={<ContactsList />} />
          <Route path="settings" element={<ProfileOptions />} />
          <Route path="/othersProfile/:userId" element={<UserProfile />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
