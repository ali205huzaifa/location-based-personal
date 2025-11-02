import React, { useState } from "react";
import { Avatar } from "antd";
import { useNavigate } from "react-router-dom";

import HomeIcon from "/icons/home-icon.svg";
import ActivityIcon from "/icons/activity-icon.svg";
import ChatsIcon from "/icons/chats-icon.svg";
import SettingIcon from "/icons/setting-icon.svg";
import AddPostIcon from "/icons/Addpost-icon.svg";
import LogoutIcon from "/icons/logout-icon.svg";
import LogoutModal from "./LogoutModal";
import AddPostModal from "../addpost/AddPostModal";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("Home");
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleNav = (label: string) => {
    setActive(label);
    switch (label) {
      case "Home":
        navigate("/home");
        break;
      case "My Activity":
        navigate("/activity");
        break;
      case "Chats":
        navigate("/chats");
        break;
      case "Profile Settings":
        navigate("/settings");
        break;
      case "Add Post":
        setShowAddPostModal(true);
        break;
      case "Logout":
        setShowLogoutModal(true);
        break;
      default:
        break;
    }
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    setShowLogoutModal(false);
    navigate("/login");
  };

  return (
    <aside className="relative w-80 bg-white rounded-xl p-6 flex flex-col items-center space-y-4 max-h-[650px]">
      <div className="flex flex-col items-center space-y-2">
        <Avatar
          size={120}
          src="https://i.pravatar.cc/150?img=32"
          className="shadow-sm border border-gray-200"
        />
        <h2 className="text-2xl font-medium text-[#000000]">Alex Costa</h2>
        <p className="text-xs font-normal text-gray-500 -mb-4">@alexcosta45</p>
      </div>

      <div className="flex items-center w-full bg-gray-50 rounded-xl px-4 py-3 space-x-3">
        <img
          src="/icons/location-icon.svg"
          alt="location"
          className="w-5 h-5"
        />
        <div>
          <p className="text-black text-base font-normal">San Francisco, CA</p>
          <p className="text-xs text-gray-500">Current Location</p>
        </div>
      </div>

      <nav className="w-full space-y-1 text-base font-normal">
        <SidebarItem
          icon={HomeIcon}
          label="Home"
          active={active === "Home"}
          onClick={() => handleNav("Home")}
        />
        <SidebarItem
          icon={ActivityIcon}
          label="My Activity"
          active={active === "My Activity"}
          onClick={() => handleNav("My Activity")}
        />
        <SidebarItem
          icon={ChatsIcon}
          label="Chats"
          active={active === "Chats"}
          onClick={() => handleNav("Chats")}
        />
        <SidebarItem
          icon={SettingIcon}
          label="Profile Settings"
          active={active === "Profile Settings"}
          onClick={() => handleNav("Profile Settings")}
        />
        <SidebarItem
          icon={AddPostIcon}
          label="Add Post"
          onClick={() => handleNav("Add Post")}
        />
        <SidebarItem
          icon={LogoutIcon}
          label="Logout"
          danger
          onClick={() => handleNav("Logout")}
        />
      </nav>

      <AddPostModal
        visible={showAddPostModal}
        onClose={() => setShowAddPostModal(false)}
      />
      <LogoutModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
    </aside>
  );
};

interface SidebarItemProps {
  icon: string;
  label: string;
  active?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active = false,
  danger = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition 
        ${
          active
            ? "bg-gradient-to-r from-purple-100 to-purple-50 text-[#8869F3]"
            : danger
            ? "text-red-500 hover:bg-red-50"
            : "text-gray-700 hover:bg-gray-50"
        }`}
    >
      <img
        src={icon}
        alt={label}
        className={`w-5 h-5 ${
          active ? "filter-purple" : danger ? "filter-red" : "opacity-80"
        }`}
      />
      <span>{label}</span>
    </button>
  );
};

export default Sidebar;
