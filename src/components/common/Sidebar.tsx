import { Avatar } from "antd";
import {
  HomeOutlined,
  MessageOutlined,
  SettingOutlined,
  PlusOutlined,
  LogoutOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import React from "react";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-72 bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center space-y-6">
      <div className="flex flex-col items-center space-y-2">
        <Avatar
          size={80}
          src="https://i.pravatar.cc/150?img=32"
          className="shadow-sm border border-gray-200"
        />
        <h2 className="text-lg font-semibold text-gray-900">Alex Costa</h2>
        <p className="text-sm text-gray-500">@alexcosta45</p>
      </div>

      <div className="flex items-center w-full bg-gray-50 rounded-xl px-4 py-3 space-x-3">
        <EnvironmentOutlined className="text-lg text-gray-700" />
        <div>
          <p className="text-sm font-medium text-gray-800">San Francisco, CA</p>
          <p className="text-xs text-gray-500">Current Location</p>
        </div>
      </div>

      <nav className="w-full space-y-1">
        <SidebarItem
          icon={<HomeOutlined />}
          label="Home"
          active
        />
        <SidebarItem
          icon={<CalendarOutlined />}
          label="My Activity"
        />
        <SidebarItem
          icon={<MessageOutlined />}
          label="Chats"
        />
        <SidebarItem
          icon={<SettingOutlined />}
          label="Profile Settings"
        />
        <SidebarItem
          icon={<PlusOutlined />}
          label="Add Post"
        />

        <SidebarItem
          icon={<LogoutOutlined />}
          label="Logout"
          danger
        />
      </nav>
    </aside>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  danger?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active = false,
  danger = false,
}) => {
  return (
    <button
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition 
        ${active
          ? "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-600"
          : danger
          ? "text-red-500 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-50"
        }`}
    >
      <span
        className={`text-lg ${
          active ? "text-purple-600" : danger ? "text-red-500" : "text-gray-600"
        }`}
      >
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
};

export default Sidebar;
