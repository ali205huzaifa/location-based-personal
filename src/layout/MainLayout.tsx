import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import LayoutWrapper from "../components/common/LayoutWrapper";
import Navbar from "../components/common/Navbar";

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-[#F9FAFB]">
      <Navbar />
      <div className="flex flex-1 overflow-hidden mt-6 ml-16">
        <Sidebar />
        <div className="flex-1 ml-4 overflow-y-auto">
          <LayoutWrapper>
            <Outlet />
          </LayoutWrapper>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
