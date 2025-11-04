import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import LayoutWrapper from "../components/common/LayoutWrapper";
import Navbar from "../components/common/Navbar";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
  }, [isSidebarOpen]);

  return (
    <div className="flex flex-col h-screen bg-[#F9FAFB] relative">
      <Navbar />
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden absolute top-3 left-2 z-50 p-2 bg-white shadow-md rounded-lg"
      >
        <MenuOutlined className="text-xl text-gray-700" />
      </button>

      <div className="flex flex-1 overflow-hidden mt-6 xl:ml-16 lg:ml-4 md:ml-2 mb-2">
        <div className="hidden lg:block xl:block h-full">
          <Sidebar />
        </div>

        <div
          className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <CloseOutlined className="text-lg text-gray-600" />
            </button>
          </div>
          <Sidebar />
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className="flex-1 ml-0 lg:ml-4 overflow-y-auto">
          <LayoutWrapper>
            <Outlet />
          </LayoutWrapper>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
