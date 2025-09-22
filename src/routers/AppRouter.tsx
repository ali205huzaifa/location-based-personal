import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "../components/Auth/login";
import Dashboard from "../components/dashboard/DashboardView";
import MainLayout from "../layout/MainLayout";
import JobView from "../components/jobs/JobView";
import CandidateView from "../components/candidates/CandidateView";
import UsersView from "../components/manage-users/UsersView";
import InterviewerView from "../components/interviewers/InterviewerView";
import JobDetail from "../components/jobs/JobDetail";
import ProtectedRoute from "./ProtectedRoutes";
import ProfileView from "../components/profile/profileView";
import RolesView from "../components/roles/RolesView";

import LocationView from "../components/locations/locationView";
import CountriesPage from "../components/locations/CountriesPage";
import CitiesPage from "../components/locations/CitiesPage";

import DeptView from "../components/deptSkills/deptView";
import DepartmentsPage from "../components/deptSkills/DepartmentsPage";
import SkillsPage from "../components/deptSkills/SkillsPage";
import SignedNdaList from "../components/signedNDA/signedNdaList";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<MainLayout />}>
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredPermission="view-dashboard">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs"
            element={
              <ProtectedRoute requiredPermission="view-job">
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
              <ProtectedRoute requiredPermission="view-candidates">
                <CandidateView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-users"
            element={
              <ProtectedRoute requiredPermission="view-user">
                <UsersView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interviewers"
            element={
              <ProtectedRoute requiredPermission="view-interviewer">
                <InterviewerView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <ProtectedRoute requiredPermission="view-accessRole">
                <RolesView />
              </ProtectedRoute>
            }
          />

          <Route path="/locations" element={<LocationView />}>
            <Route index element={<Navigate to="countries" replace />} />
            <Route
              path="countries"
              element={
                <ProtectedRoute requiredPermission="view-locations">
                  <CountriesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="cities"
              element={
                <ProtectedRoute requiredPermission="view-locations">
                  <CitiesPage />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="/deptSkills" element={<DeptView />}>
            <Route index element={<Navigate to="departments" replace />} />
            <Route
              path="departments"
              element={
                <ProtectedRoute requiredPermission="view-deptSkills">
                  <DepartmentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="skills"
              element={
                <ProtectedRoute requiredPermission="view-deptSkills">
                  <SkillsPage />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            path="/SignedNDA"
            element={
              <ProtectedRoute requiredPermission="view-signedNDA">
                <SignedNdaList />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
