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
    <div className="h-screen bg-[#F9FAFB]">
      <div className="hidden md:flex flex-col h-full">
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
            <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
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

      <div className="md:hidden flex items-center justify-center h-full text-center px-6">
        <div>
          <h2 className="text-2xl font-semibold text-[#8869f3]">
            We’re available on mobile!
          </h2>
          <p className="text-gray-500 mt-3">
            Please download our app from Playstore & AppStore to continue.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <a
              href="#"
              className="bg-[#8869f3] text-white px-4 py-2 rounded-lg"
            >
              Google Play Store
            </a>
            <a
              href="#"
              className="bg-[#8869f3] text-white px-4 py-2 rounded-lg"
            >
              Apple App Store
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
