import React, { useState } from "react";
import {
  UserOutlined,
  BellOutlined,
  LockOutlined,
  SettingOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

import EditProfile from "./EditProfile";
import NotificationSettings from "./NotificationSettings";
import ChangePassword from "./ChangePassword";
import PrivacySettings from "./PrivacySettings";
import LanguageSettings from "./LanguageSettings";

const ProfileOptions: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Edit Profile");

  const menuItems = [
    { key: "Edit Profile", icon: <UserOutlined />, label: "Edit Profile" },
    { key: "Notifications", icon: <BellOutlined />, label: "Notifications" },
    {
      key: "Change Password",
      icon: <LockOutlined />,
      label: "Change Password",
    },
    {
      key: "Privacy Settings",
      icon: <SettingOutlined />,
      label: "Privacy Settings",
    },
    { key: "Language", icon: <GlobalOutlined />, label: "Language" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Edit Profile":
        return <EditProfile />;
      case "Notifications":
        return <NotificationSettings />;
      case "Change Password":
        return <ChangePassword />;
      case "Privacy Settings":
        return <PrivacySettings />;
      case "Language":
        return <LanguageSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-6 p-2 rounded-xl min-h-[600px]">
      <div className="xl:w-80 md:w-64 border-r border-l border-gray-200 xl:px-4 md:px-1 pt-4">
        <div className="flex flex-col space-y-2">
          {menuItems.map((item) => (
            <div
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all 
                ${
                  activeTab === item.key
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <div className="h-full rounded-xl border-gray-100 shadow-none">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ProfileOptions;
