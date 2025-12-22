import React, { useState } from "react";
import { Avatar } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "../../store";

import HomeIcon from "/icons/home-icon.svg";
import ActivityIcon from "/icons/activity-icon.svg";
import ChatsIcon from "/icons/chats-icon.svg";
import SettingIcon from "/icons/setting-icon.svg";
import AddPostIcon from "/icons/Addpost-icon.svg";
import ContactIcon from "/icons/sidecontact-icon.svg";

import AddPostModal from "../addpost/AddPostModal";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showAddPostModal, setShowAddPostModal] = useState(false);

  const user = useSelector((state: RootState) => state.auth.currentUser);

  const menuItems = [
    { label: "Home", icon: HomeIcon, path: "/home" },
    { label: "My Activity", icon: ActivityIcon, path: "/activity" },
    { label: "Chats", icon: ChatsIcon, path: "/chats" },
    { label: "Contacts", icon: ContactIcon, path: "/contacts" },
    { label: "Profile Settings", icon: SettingIcon, path: "/settings" },
    {
      label: "Add Post",
      icon: AddPostIcon,
      action: () => setShowAddPostModal(true),
    },
  ];

  return (
    <aside className="relative w-[285px] bg-white rounded-xl pt-2 px-2 flex flex-col items-center space-y-4 h-full border border-[#E8E6E6]">
      <div className="flex flex-col items-center space-y-1">
        <Avatar
          size={80}
          src={user?.image}
          alt="Profile"
          className="shadow-sm border border-gray-200"
        />
        <h2 className="text-xl font-medium text-black">{user?.fullName}</h2>
        <p className="text-xs text-gray-500 -mb-4">@{user?.username}</p>
      </div>

      <nav className="mt-8 space-y-1 text-sm w-full cursor-pointer">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          const handleClick = () => {
            if (item.action) {
              item.action();
            } else {
              navigate(item.path!);
            }
          };

          return (
            <div
              key={item.label}
              onClick={handleClick}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl text-base font-normal transition mt-0 ${
                isActive
                  ? "text-[#8869F3] bg-purple-50"
                  : "text-[#000000] hover:bg-[#EFEFEF]"
              }`}
            >
              <img
                src={item.icon}
                alt={item.label}
                width={20}
                height={20}
                className={`transition-all duration-200 ${
                  isActive
                    ? "[filter:brightness(0)_saturate(100%)_invert(57%)_sepia(69%)_saturate(4787%)_hue-rotate(236deg)_brightness(92%)_contrast(92%)]"
                    : "opacity-70"
                }`}
              />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <AddPostModal
        visible={showAddPostModal}
        onClose={() => setShowAddPostModal(false)}
        postsRefetch={""}
        onCloseAll={""}
      />
    </aside>
  );
};

export default Sidebar;
