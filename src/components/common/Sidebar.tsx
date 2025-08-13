"use client";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { clearAuthData } from "../../store/Auth";
import LogoutModal from "./LogoutModal";

const Sidebar = () => {
  const permissions = useSelector((state: any) => state.auth.permissions);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    dispatch(clearAuthData());
    localStorage.removeItem("token");
    navigate("/");
    setShowLogoutModal(false);
  };

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: "/icons/dashboard-icon.svg",
      permission: "view-dashboard",
    },
    {
      label: "Jobs",
      href: "/jobs",
      icon: "/icons/jobs-icon.svg",
      permission: "view-job",
    },
    {
      label: "Candidates",
      href: "/candidates",
      icon: "/icons/candidate-icon.svg",
      permission: "view-candidates",
    },
    {
      label: "Manage Users",
      href: "/manage-users",
      icon: "/icons/manageUser-icon.svg",
      permission: "view-user",
    },
    {
      label: "Interviewers",
      href: "/interviewers",
      icon: "/icons/interviewer-icon.svg",
      permission: "view-interviewer",
    },
    {
      label: "Access Roles",
      href: "/roles",
      icon: "/icons/roles-icon.svg",
      permission: "view-accessRole",
    },
  ];

  return (
    <>
      <aside
        className="w-64 h-screen fixed top-0 left-0 text-white flex flex-col bg-cover bg-center"
        style={{ backgroundImage: 'url("/images/sidebar.svg")' }}
      >
        <div className="p-6 flex items-center gap-2 border-b border-white/20">
          <img
            src="/icons/sidebar-logo.svg"
            alt="Logo"
            width={34.38}
            height={26.05}
          />
          <div className="leading-tight">
            <h1 className="text-[15.26px] font-medium urbanist tracking-wider">
              SOLUTIONS
            </h1>
            <p className="text-[8px] urbanist font-medium text-white/80">
              Job Portal & Managment System
            </p>
          </div>
        </div>

        <div className="flex flex-col flex-grow justify-between">
          <nav className="flex flex-col mt-4 px-4">
            {navItems
              .filter((item) => permissions.includes(item.permission))
              .map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition ${
                    location.pathname === item.href ? "bg-white/20" : ""
                  }`}
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    width={20}
                    height={20}
                  />
                  <h3 className="product font-Regular">{item.label}</h3>
                </Link>
              ))}
          </nav>

          <div className="px-4 mb-4">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition text-white"
            >
              <img
                src="/icons/logout.svg"
                alt="Log out"
                width={29}
                height={29}
              />
              <span className="font-medium">Log out</span>
            </button>
          </div>
        </div>
      </aside>

      {showLogoutModal && (
        <LogoutModal
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      )}
    </>
  );
};

export default Sidebar;
