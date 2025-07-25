import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "../components/Auth/login";
import Dashboard from "../components/dashboard/DashboardView";
import MainLayout from "../layout/MainLayout";
import JobView from "../components/jobs/JobView";
import CandidateView from "../components/candidates/CandidateView";
import UsersView from "../components/manage-users/UsersView";
import InterviewerView from "../components/interviewers/InterviewerView";
import JobDetail from "../components/jobs/JobDetail";
import ProtectedRoute from "./ProtectedRoutes";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <JobView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/:id"
            element={
              <ProtectedRoute>
                <JobDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidates"
            element={
              <ProtectedRoute>
                <CandidateView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-users"
            element={
              <ProtectedRoute>
                <UsersView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interviewers"
            element={
              <ProtectedRoute>
                <InterviewerView />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
