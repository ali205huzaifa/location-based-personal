import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import LayoutWrapper from "../components/common/LayoutWrapper";

const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col ml-64">
        <LayoutWrapper>
          <Outlet />
        </LayoutWrapper>
      </div>
    </div>
  );
};

export default MainLayout;
