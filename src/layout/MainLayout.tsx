import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import LayoutWrapper from "../components/common/LayoutWrapper";

const userRole = "admin";
const userPermissions = [
  "view_dashboard",
  "view_jobs",
  "view_candidates",
  "manage_users",
  "Manage_interviewers",
];

const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role={userRole} permissions={userPermissions} />
      <div className="flex flex-1 flex-col ml-64">
        <LayoutWrapper>
          <Outlet />
        </LayoutWrapper>
      </div>
    </div>
  );
};

export default MainLayout;
